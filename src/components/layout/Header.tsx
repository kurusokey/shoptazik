"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: "rgba(216,204,190,0.92)",
        borderBottom: "1px solid rgba(26,26,26,0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: "#1A1A1A" }}>
          SHOP<span style={{ color: "#3A5A8A" }}>TAZIK</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm transition hover:text-black"
            style={{ color: "#6A5A4A" }}
          >
            Accueil
          </Link>
          <Link
            href="/artists/fdy-phenomen"
            className="text-sm transition hover:text-black"
            style={{ color: "#6A5A4A" }}
          >
            Artistes
          </Link>
          <Link
            href="/artists/fdy-phenomen/chanteur-de-rap"
            className="text-sm font-semibold transition hover:opacity-80"
            style={{ color: "#3A5A8A" }}
          >
            Chanteur de Rap
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition hover:bg-black/5"
          style={{
            color: "#3A3A3A",
            background: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(26,26,26,0.08)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          Panier
          {totalItems() > 0 && (
            <span
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{
                background: "#3A5A8A",
                boxShadow: "0 2px 8px rgba(58,90,138,0.4)",
              }}
            >
              {totalItems()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
