"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: "rgba(58,30,44,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white/90">
          SHOP<span style={{ color: "#C07088" }}>TAZIK</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-white/40 transition hover:text-white/80"
          >
            Accueil
          </Link>
          <Link
            href="/artists/fdy-phenomen"
            className="text-sm text-white/40 transition hover:text-white/80"
          >
            Artistes
          </Link>
          <Link
            href="/artists/fdy-phenomen/flamboyant"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Flamboyant
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
          style={{
            background: "rgba(90,48,69,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
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
                background: "linear-gradient(135deg, #8B3050, #5A2040)",
                boxShadow: "0 2px 10px rgba(90,32,64,0.5)",
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
