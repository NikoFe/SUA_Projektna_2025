"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function ShippingPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.shipping.get("/shipping").then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dostave</h1>

      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Naročilo #{o.order_id}</h3>
            <p>Naslov: {o.address}</p>
            <p>Status: {o.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
