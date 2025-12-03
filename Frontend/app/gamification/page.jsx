"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function GamificationPage() {
  const [data, setData] = useState(null);
  const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    api.gamification.get(`/gamification/${user_id}`).then(res => setData(res.data));
  }, []);

  if (!data) return <p>Nalaganje...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h1 className="text-3xl font-bold">Napredek</h1>

      <p className="mt-4">Level: <b>{data.level}</b></p>
      <p className="mt-1">XP: {data.xp}</p>
    </div>
  );
}
