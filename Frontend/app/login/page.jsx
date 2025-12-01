"use client";
import { useState } from "react";
import { api } from "../../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.login.post("/login", { email, password });
    localStorage.setItem("user_id", res.data.user_id);
    window.location.href = "/";
  };

  return (
    <div className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Prijava</h1>
      <input className="input" placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />
      <input className="input mt-2" type="password"
        placeholder="Geslo" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={submit}
        className="w-full bg-blue-600 text-white p-2 mt-4 rounded">
        Prijava
      </button>
    </div>
  );
}
