"use client";
import { useSearchParams } from "next/navigation";
import { api } from "../../lib/api";

export default function PaymentPage() {
  const params = useSearchParams();
  const order_id = params.get("order_id");
  const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const pay = async () => {
    await api.payment.post("/pay", {
      order_id,
      user_id,
      amount: 1  
    });

    alert("Plačilo uspelo!");
    window.location.href = "/notifications";
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Plačilo naročila</h1>
      <p className="mt-2">Order ID: {order_id}</p>

      <button onClick={pay}
        className="mt-6 w-full p-2 bg-green-600 text-white rounded">
        Plačaj
      </button>
    </div>
  );
}
