"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function GamificationPage() {
  const [data, setData] = useState(null);
  const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    api.gamification.get(`/gamification/${user_id}`)
      .then(res => setData(res.data));
  }, []);

  if (!data) return <p>Nalaganje...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">Tvoj napredek</h1>
      <p className="mt-4">Level: <b>{data.level}</b></p>
      <p>XP: {data.xp}</p>

      <div className="mt-6 h-3 bg-gray-200 rounded">
        <div className="h-full bg-blue-600 rounded"
          style={{ width: `${data.xp % 100}%` }}>
        </div>
      </div>
    </div>
  );
}
