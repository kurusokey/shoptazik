"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { getPageTheme } from "@/lib/page-theme";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems);
  const pathname = usePathname();
  const t = getPageTheme(pathname);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{ background: t.headerBg, borderBottom: t.headerBorder }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white/90">
          SHOP<span style={{ color: t.logo }}>TAZIK</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" ref={menuRef}>
          <Link href="/" className="text-sm transition hover:text-white" style={{ color: t.linkColor }}>
            Accueil
          </Link>

          {/* Menu Artistes */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "artistes" ? null : "artistes")}
              className="flex items-center gap-1 text-sm transition hover:text-white"
              style={{ color: t.linkColor }}
            >
              Artistes
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            {openMenu === "artistes" && (
              <div
                className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-lg py-1 shadow-xl"
                style={{ background: t.headerBg, border: t.headerBorder }}
              >
                <Link
                  href="/artists/fdy-phenomen"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-2 text-sm transition hover:bg-white/10"
                  style={{ color: t.linkColor }}
                >
                  Fdy Phenomen
                </Link>
              </div>
            )}
          </div>

          {/* Menu Produits */}
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "produits" ? null : "produits")}
              className="flex items-center gap-1 text-sm transition hover:text-white"
              style={{ color: t.linkColor }}
            >
              Produits
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            {openMenu === "produits" && (
              <div
                className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-lg py-1 shadow-xl"
                style={{ background: t.headerBg, border: t.headerBorder }}
              >
                <Link href="/artists/fdy-phenomen/chanteur-de-rap" onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
                  Vinyle
                </Link>
                <Link href="/artists/fdy-phenomen/chanteur-de-rap" onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
                  CD
                </Link>
                <Link href="/artists/fdy-phenomen/chanteur-de-rap" onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
                  Merchandising
                </Link>
              </div>
            )}
          </div>

          {/* Recherche */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-40 rounded-lg px-3 py-1.5 text-sm text-white outline-none placeholder:text-white/30"
                style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${t.accentColor}33` }}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-white/30 hover:text-white/60">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 text-sm transition hover:text-white"
              style={{ color: t.linkColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              Recherche
            </button>
          )}
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/80 transition hover:brightness-110"
          style={{ background: t.cartBg, border: t.cartBorder }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          Panier
          {totalItems() > 0 && (
            <span
              className="absolute -right-2 -top-2 flex h-6 w-6 animate-pulse items-center justify-center rounded-full text-xs font-bold"
              style={{ background: t.badgeBg, color: t.badgeText, boxShadow: `0 2px 10px ${t.accentColor}66` }}
            >
              {totalItems()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
