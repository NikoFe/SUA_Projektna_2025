"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function OrderPage() {
  const [menu, setMenu] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");

  const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    api.menu.get("/menu").then(res => setMenu(res.data));
  }, []);

  const submitOrder = async () => {
    const res = await api.order.post("/order", {
      user_id,
      item_id: selected,
      quantity: qty,
      address
    });

    alert("Naročilo oddano! Preusmerjam na plačilo...");
    window.location.href = "/payment?order_id=" + res.data.order_id;
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Oddaj naročilo</h1>

      <select className="input" onChange={(e) => setSelected(e.target.value)}>
        <option>Izberi jed:</option>
        {menu.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} — {m.price} €
          </option>
        ))}
      </select>

      <input className="input mt-4" type="number" min="1"
        value={qty} onChange={(e) => setQty(e.target.value)} />

      <input className="input mt-4" placeholder="Naslov za dostavo"
        onChange={(e) => setAddress(e.target.value)} />

      <button onClick={submitOrder}
        className="mt-6 w-full bg-blue-600 text-white p-2 rounded">
        Nadaljuj na plačilo
      </button>
    </div>
  );
}
