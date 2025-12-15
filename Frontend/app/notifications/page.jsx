"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:6006/notification/all")
      .then((res) => {
        console.log("NOTIFICATIONS:", res.data); // 👈 debug
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Obvestila</h1>

      {notifications.length === 0 && (
        <p>Ni obvestil.</p>
      )}

      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="border rounded p-4 bg-gray-50"
          >
            <p>
              <strong>Tip:</strong> {n.type}
            </p>
            <p>
              <strong>Naročilo:</strong> {n.order_id}
            </p>
            <p>
              <strong>Uporabnik:</strong> {n.user_id}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
