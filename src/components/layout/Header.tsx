"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          SHOP<span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">TAZIK</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Accueil
          </Link>
          <Link
            href="/artists/fdy-phenomen"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Artistes
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white transition hover:bg-zinc-700"
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
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold text-black">
              {totalItems()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
