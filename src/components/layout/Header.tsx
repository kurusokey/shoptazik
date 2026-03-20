"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { getPageTheme } from "@/lib/page-theme";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const pathname = usePathname();
  const t = getPageTheme(pathname);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [homeUrl, setHomeUrl] = useState("/");
  const [hydrated, setHydrated] = useState(false);

  // Zustand persist hydration guard: badge only renders after client hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Détecter le site d'origine et adapter le lien Accueil
  useEffect(() => {
    const stored = sessionStorage.getItem("boutique-origin");
    if (stored) {
      setHomeUrl(stored);
      return;
    }
    const ref = document.referrer;
    if (ref.includes("la-mug.com") && !ref.includes("boutique.la-mug.com")) {
      sessionStorage.setItem("boutique-origin", "https://la-mug.com");
      setHomeUrl("https://la-mug.com");
    } else if (ref.includes("fdy.art")) {
      sessionStorage.setItem("boutique-origin", "https://fdy.art");
      setHomeUrl("https://fdy.art");
    }
  }, []);
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

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setMobileOpen(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{ background: t.headerBg, borderBottom: t.headerBorder }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight text-white/90 md:text-xl">
          LA MUG<span style={{ color: t.logo }}> BOUTIK&apos;</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-5 md:flex" ref={menuRef}>
          <a href={homeUrl} className="text-sm transition hover:text-white" style={{ color: t.linkColor }}>
            Accueil
          </a>

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
              <div className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-lg py-1 shadow-xl" style={{ background: t.headerBg, border: t.headerBorder }}>
                <Link href="/artists/fdy-phenomen" onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
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
              <div className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-lg py-1 shadow-xl" style={{ background: t.headerBg, border: t.headerBorder }}>
                <Link href="/artists/fdy-phenomen/chanteur-de-rap" onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
                  Vinyle
                </Link>
                <Link href="/artists/fdy-phenomen/chanteur-de-rap" onClick={() => setOpenMenu(null)} className="block px-4 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
                  CD
                </Link>
                {/* Digital masqué pour le moment */}
                <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: t.accentColor, opacity: 0.5 }}>
                    Merchandising
                  </span>
                  <Link href="/products/tshirt-monde-nouvo" onClick={() => setOpenMenu(null)} className="block px-6 py-2 text-sm transition hover:bg-white/10" style={{ color: t.linkColor }}>
                    T-Shirt
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/ateliers" className="text-sm transition hover:text-white" style={{ color: t.linkColor }}>
            Ateliers
          </Link>

          <Link href="/family-and-friends" className="text-sm transition hover:text-white" style={{ color: t.linkColor }}>
            Family &amp; Friends
          </Link>

          {/* Recherche desktop */}
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
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-1.5 text-sm transition hover:text-white" style={{ color: t.linkColor }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </nav>

        {/* Boutons mobile : panier + burger */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white/80 transition hover:brightness-110 md:px-4 md:py-2"
            style={{ background: t.cartBg, border: t.cartBorder }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="hidden sm:inline">Panier</span>
            {hydrated && cartCount > 0 && (
              <span
                className="absolute -right-2.5 -top-2.5 flex h-6 w-6 animate-bounce items-center justify-center rounded-full text-[11px] font-black"
                style={{ background: "#FACC15", color: "#000000", boxShadow: "0 2px 12px rgba(250,204,21,0.6)" }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Burger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
            style={{ color: t.linkColor }}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {mobileOpen && (
        <div className="border-t px-4 pb-4 pt-2 md:hidden" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* Recherche mobile */}
          <form onSubmit={handleSearch} className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
              style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${t.accentColor}33` }}
            />
          </form>

          <a href={homeUrl} className="block py-2.5 text-sm" style={{ color: t.linkColor }}>Accueil</a>

          <p className="mt-2 text-xs font-semibold uppercase tracking-wider" style={{ color: t.accentColor, opacity: 0.5 }}>Artistes</p>
          <Link href="/artists/fdy-phenomen" className="block py-2.5 pl-3 text-sm" style={{ color: t.linkColor }}>Fdy Phenomen</Link>

          <Link href="/ateliers" className="block py-2.5 text-sm" style={{ color: t.linkColor }}>Ateliers</Link>
          <Link href="/family-and-friends" className="block py-2.5 text-sm" style={{ color: t.linkColor }}>Family &amp; Friends</Link>

          <p className="mt-2 text-xs font-semibold uppercase tracking-wider" style={{ color: t.accentColor, opacity: 0.5 }}>Produits</p>
          <Link href="/artists/fdy-phenomen/chanteur-de-rap" className="block py-2.5 pl-3 text-sm" style={{ color: t.linkColor }}>Vinyle</Link>
          <Link href="/artists/fdy-phenomen/chanteur-de-rap" className="block py-2.5 pl-3 text-sm" style={{ color: t.linkColor }}>CD</Link>
          {/* Digital masqué pour le moment */}

          <p className="mt-2 text-xs font-semibold uppercase tracking-wider" style={{ color: t.accentColor, opacity: 0.5 }}>Merchandising</p>
          <Link href="/products/tshirt-monde-nouvo" className="block py-2.5 pl-3 text-sm" style={{ color: t.linkColor }}>T-Shirt</Link>
        </div>
      )}
    </header>
  );
}
