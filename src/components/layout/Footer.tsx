"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPageTheme } from "@/lib/page-theme";
import Newsletter from "@/components/ui/Newsletter";

export default function Footer() {
  const pathname = usePathname();
  const t = getPageTheme(pathname);

  return (
    <footer style={{ background: t.footerBg, borderTop: t.footerBorder }}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-4 md:gap-8">
          <div>
            <h3 className="text-lg font-bold text-white/90">
              SHOP<span style={{ color: t.logo }}>TAZIK</span>
            </h3>
            <p className="mt-2 text-sm" style={{ color: t.footerText }}>
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising officiel.
            </p>
            <a
              href="https://fdy.art"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm transition hover:opacity-80"
              style={{ color: t.logo }}
            >
              Site officiel de l&apos;artiste &rarr; fdy.art
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
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
              Informations l&eacute;gales
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: t.footerText }}>
              <li>
                <Link href="/cgv" className="transition hover:text-white/70">Conditions G&eacute;n&eacute;rales de Vente</Link>
              </li>
              <li>
                <Link href="/confidentialite" className="transition hover:text-white/70">Confidentialit&eacute;</Link>
              </li>
              <li>
                <Link href="/a-propos" className="transition hover:text-white/70">&Agrave; propos</Link>
              </li>
              <li className="pt-1 text-xs" style={{ color: t.footerText }}>
                Contact : contact@shoptazik.com
              </li>
            </ul>
          </div>

          <div>
            <Newsletter />
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
