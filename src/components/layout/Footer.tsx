"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPageTheme } from "@/lib/page-theme";

export default function Footer() {
  const pathname = usePathname();
  const t = getPageTheme(pathname);

  return (
    <footer style={{ background: t.footerBg, borderTop: t.footerBorder }}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white/90">
              SHOP<span style={{ color: t.logo }}>TAZIK</span>
            </h3>
            <p className="mt-2 text-sm" style={{ color: t.footerText }}>
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising officiel.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: t.footerText }}>
              <li>
                <Link href="/" className="transition hover:text-white/70">Accueil</Link>
              </li>
              <li>
                <Link href="/artists/fdy-phenomen" className="transition hover:text-white/70">Fdy Phenomen</Link>
              </li>
              <li>
                <Link href={t.accentHref} className="transition hover:opacity-80" style={{ color: t.accentColor }}>
                  {t.accentName}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-white/70">Panier</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
              Informations
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: t.footerText }}>
              <li>Livraison en France et DOM-TOM</li>
              <li>Paiement sécurisé par Stripe</li>
              <li>Contact : contact@shoptazik.com</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-8 text-center text-xs text-white/15"
          style={{ borderTop: `1px solid ${t.footerMuted}` }}
        >
          &copy; {new Date().getFullYear()} Shoptazik. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
