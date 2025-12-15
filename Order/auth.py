from __future__ import annotations

import time
from functools import wraps
from typing import Any, Callable, Dict, Optional, Tuple

import jwt
import requests
from flask import request, jsonify, g


DEFAULT_REQUIRED_CLAIMS = ("sub", "exp", "iat")


class JWKSCache:
    def __init__(self, jwks_url: str, ttl_seconds: int = 300, timeout_seconds: int = 2):
        self.jwks_url = jwks_url
        self.ttl_seconds = ttl_seconds
        self.timeout_seconds = timeout_seconds

        self._cached_at: float = 0.0
        self._jwks: Optional[Dict[str, Any]] = None

    def get_jwks(self) -> Dict[str, Any]:
        now = time.time()
        if self._jwks and (now - self._cached_at) < self.ttl_seconds:
            return self._jwks
        print( "$$$$$$$$$$$$$", self.jwks_url)
        resp = requests.get(self.jwks_url, timeout=self.timeout_seconds)
        resp.raise_for_status()
        self._jwks = resp.json()
        self._cached_at = now
        return self._jwks


def _extract_bearer_token() -> Optional[str]:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    return auth.split(" ", 1)[1].strip() or None


def _get_signing_key_from_jwks(token: str, jwks: Dict[str, Any]):
    """
    Select the correct public key from JWKS using the token's 'kid'.
    """
    headers = jwt.get_unverified_header(token)
    kid = headers.get("kid")
    if not kid:
        raise jwt.InvalidTokenError("Missing 'kid' in JWT header")

    keys = jwks.get("keys", [])
    for k in keys:
        if k.get("kid") == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(k)

    raise jwt.InvalidTokenError(f"No matching JWKS key for kid={kid}")


def build_jwt_verifier(
    *,
    issuer: str,
    audience: str,
    jwks_url: str,
    jwks_ttl_seconds: int = 300,
    required_claims: Tuple[str, ...] = DEFAULT_REQUIRED_CLAIMS,
):

    cache = JWKSCache(jwks_url=jwks_url, ttl_seconds=jwks_ttl_seconds)

    def require_jwt(*, optional: bool = False):
        """
        If optional=True, request proceeds even without a token,
        but if a token is present it must be valid.
        """
        def decorator(fn: Callable):
            @wraps(fn)
            def wrapper(*args, **kwargs):
                token = _extract_bearer_token()
                if not token:
                    if optional:
                        g.jwt = None
                        return fn(*args, **kwargs)
                    return jsonify({"error": "Missing Bearer token"}), 401

                try:
                    jwks = cache.get_jwks()
                    public_key = _get_signing_key_from_jwks(token, jwks)

                    claims = jwt.decode(
                        token,
                        public_key,
                        algorithms=["RS256"],  # hardcode expected alg
                        issuer=issuer,
                        audience=audience,
                        options={"require": list(required_claims)},
                    )

                    g.jwt = claims  # make claims available to handlers

                except jwt.ExpiredSignatureError:
                    return jsonify({"error": "Token expired"}), 401
                except requests.RequestException:
                    # couldn't fetch JWKS (auth down / network issue)
                    return jsonify({"error": "JWKS fetch failed"}), 503
                except Exception:
                    return jsonify({"error": "Invalid token"}), 401

                return fn(*args, **kwargs)

            return wrapper
        return decorator

    return require_jwt
