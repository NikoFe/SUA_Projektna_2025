"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function OrderPage() {
  const [menu, setMenu] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");

  const user_id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    api.menu.get("/menu").then((res) => setMenu(res.data));
  }, []);

  const submitOrder = async () => {
    const res = await api.order.post("/order", {
      user_id,
      item_id: selected,
      quantity: qty,
      address,
    });

    alert("Naročilo ustvarjeno — preusmerjam na plačilo…");
    window.location.href = "/payment?order_id=" + res.data.order_id;
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Naročilo</h1>

      <select className="w-full border p-2 rounded"
        onChange={(e) => setSelected(e.target.value)}
      >
        <option>Izberi jed</option>
        {menu.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="w-full border p-2 mt-3 rounded"
        value={qty}
        min="1"
        onChange={(e) => setQty(e.target.value)}
      />

      <input
        className="w-full border p-2 mt-3 rounded"
        placeholder="Naslov dostave"
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white p-2 mt-5 rounded"
        onClick={submitOrder}
      >
        Nadaljuj na plačilo
      </button>
    </div>
  );
}
