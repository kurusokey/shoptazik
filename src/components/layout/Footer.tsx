import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#D0C4B5", borderTop: "1px solid rgba(26,26,26,0.08)" }}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>
              SHOP<span style={{ color: "#3A5A8A" }}>TAZIK</span>
            </h3>
            <p className="mt-2 text-sm" style={{ color: "#6A5A4A" }}>
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising
              officiel.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: "#3A3A3A" }}>
              Navigation
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "#6A5A4A" }}>
              <li>
                <Link href="/" className="transition hover:text-black">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/artists/fdy-phenomen" className="transition hover:text-black">
                  Fdy Phenomen
                </Link>
              </li>
              <li>
                <Link
                  href="/artists/fdy-phenomen/chanteur-de-rap"
                  className="transition hover:opacity-80"
                  style={{ color: "#3A5A8A" }}
                >
                  Chanteur de Rap
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-black">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: "#3A3A3A" }}>
              Informations
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "#6A5A4A" }}>
              <li>Livraison en France et DOM-TOM</li>
              <li>Paiement sécurisé par Stripe</li>
              <li>Contact : contact@shoptazik.com</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-8 text-center text-xs"
          style={{ borderTop: "1px solid rgba(26,26,26,0.08)", color: "#8A7A6A" }}
        >
          &copy; {new Date().getFullYear()} Shoptazik. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
