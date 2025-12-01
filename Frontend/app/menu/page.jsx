"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    api.menu.get("/menu").then(res => setMenu(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Meni</h1>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {menu.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow rounded">
            <h2 className="font-bold">{item.name}</h2>
            <p>{item.description}</p>
            <p className="font-semibold mt-2">{item.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
