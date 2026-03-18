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
          {/* Colonne 1 : Marque + écosystème */}
          <div>
            <h3 className="text-lg font-bold text-white/90">
              LA MUG<span style={{ color: t.logo }}> BOUTIK&apos;</span>
            </h3>
            <p className="mt-2 text-sm" style={{ color: t.footerText }}>
              La boutique de la culture urbaine. Vinyles, CD, merchandising et ateliers.
            </p>

            {/* Écosystème La M.U.G */}
            <div className="mt-4 space-y-2">
              <a
                href="https://la-mug.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition hover:text-white/70"
                style={{ color: t.footerText }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
                </svg>
                la-mug.com
              </a>
              <a
                href="https://fdy.art"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition hover:text-white/70"
                style={{ color: t.footerText }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
                </svg>
                fdy.art
              </a>
              <a
                href="https://boutique.la-mug.com"
                className="flex items-center gap-2 text-sm transition hover:text-white/70"
                style={{ color: t.logo }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
                  <path fillRule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z" clipRule="evenodd" />
                </svg>
                boutique.la-mug.com
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
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

            <h4 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-white/50">
              Informations l&eacute;gales
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: t.footerText }}>
              <li>
                <Link href="/cgv" className="transition hover:text-white/70">CGV</Link>
              </li>
              <li>
                <Link href="/confidentialite" className="transition hover:text-white/70">Confidentialit&eacute;</Link>
              </li>
              <li>
                <Link href="/a-propos" className="transition hover:text-white/70">&Agrave; propos</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
              Contact
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: t.footerText }}>
              <li>contact@la-mug.com</li>
              <li>Livraison France et DOM-TOM</li>
              <li>Paiement s&eacute;curis&eacute; par Stripe</li>
            </ul>
          </div>

          {/* Colonne 4 : Newsletter */}
          <div>
            <Newsletter />
          </div>
        </div>

        {/* Mention La M.U.G + copyright */}
        <div
          className="mt-8 flex flex-col items-center gap-2 pt-8 text-center text-xs text-white/20"
          style={{ borderTop: `1px solid ${t.footerMuted}` }}
        >
          <span className="font-medium uppercase tracking-widest" style={{ color: t.footerText }}>
            Un projet &mdash; La M.U.G
          </span>
          <span>
            &copy; {new Date().getFullYear()} La Mug Boutik&apos;. Tous droits r&eacute;serv&eacute;s.
          </span>
        </div>
      </div>
    </footer>
  );
}
