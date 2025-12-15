"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    api.notification
      .get("/notification/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Seja je potekla. Prosimo prijavite se ponovno.");
        } else {
          toast.error("Napaka pri pridobivanju obvestil.");
        }
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Obvestila</h1>

      {notifications.length === 0 && <p>Ni obvestil.</p>}

      <ul className="space-y-3">
        {notifications.map((n) => (
          <li key={n.id} className="border rounded p-4">
            <p><b>Tip:</b> {n.type}</p>
            <p><b>Naročilo:</b> {n.order_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

