"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    api.menu.get("/menu").then((res) => setMenu(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meni</h1>

      <div className="grid grid-cols-2 gap-5">
        {menu.map((item) => (
          <div key={item.id} className="bg-white p-4 shadow rounded">
            <h2 className="font-bold">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="mt-2 font-semibold">{item.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
