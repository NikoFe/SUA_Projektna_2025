"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function NotificationsPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.notification.get("/notification/all").then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Obvestila</h1>

      <div className="space-y-4">
        {list.map((n) => (
          <div key={n.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-bold">{n.type}</h3>
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
              {JSON.stringify(n.payload, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
