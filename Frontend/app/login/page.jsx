"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.login.post("/login", { email, password });

    localStorage.setItem("user_id", res.data.user_id);

    alert("Prijava uspešna");
    window.location.href = "/";
  };

  return (
    <div className="max-w-sm mx-auto mt-14 bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Prijava</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mt-3 rounded"
        type="password"
        placeholder="Geslo"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white p-2 mt-4 rounded"
        onClick={submit}
      >
        Prijava
      </button>
    </div>
  );
}
