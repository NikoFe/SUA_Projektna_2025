import requests
from jose import jwt

JWKS_URL = "https://ce6b9a7d2896.ngrok-free.app/.well_known/jwks.json"
ISSUER = "http://localhost:5000"
AUDIENCE = "development"
ALGORITHMS = ["RS256"]

_jwks_cache = None


def get_jwks():
    global _jwks_cache

    if _jwks_cache is None:
        response = requests.get(JWKS_URL)
        if response.status_code != 200:
            raise Exception("JWKS endpoint not reachable")

        _jwks_cache = response.json()

    return _jwks_cache


def verify_token(token):
    jwks = get_jwks()

    header = jwt.get_unverified_header(token)
    key = next(k for k in jwks["keys"] if k["kid"] == header["kid"])

    payload = jwt.decode(
        token,
        key,
        algorithms=ALGORITHMS,
        audience=AUDIENCE,
        issuer=ISSUER,
    )

    return payload

