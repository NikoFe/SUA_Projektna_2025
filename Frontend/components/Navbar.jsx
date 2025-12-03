"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-4xl mx-auto flex gap-6">
        <Link href="/">Domov</Link>
        <Link href="/menu">Meni</Link>
        <Link href="/order">Naročilo</Link>
        <Link href="/payment">Plačilo</Link>
        <Link href="/notifications">Obvestila</Link>
        <Link href="/gamification">Napredek</Link>
        <Link href="/shipping">Dostave</Link>
        <Link href="/login" className="ml-auto text-blue-600 font-bold">
          Prijava
        </Link>
      </div>
    </nav>
  );
}
