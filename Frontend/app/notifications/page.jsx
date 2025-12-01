"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function NotificationsPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.notification.get("/notification/all").then(res => setList(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Obvestila</h1>
      <div className="mt-6 space-y-4">
        {list.map((n) => (
          <div key={n.id} className="p-4 bg-white shadow rounded">
            <p className="font-semibold">{n.type}</p>
            <pre className="text-sm mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(n.payload, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
