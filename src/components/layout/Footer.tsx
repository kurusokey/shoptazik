import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1a0e14", borderTop: "1px solid rgba(90,32,64,0.15)" }}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">
              SHOP<span style={{ color: "#D41920" }}>TAZIK</span>
            </h3>
            <p className="mt-2 text-sm" style={{ color: "#9A7080" }}>
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising
              officiel.
            </p>
          </div>

          <div>
            <h4
              className="mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#C07088" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9A7080" }}>
              <li>
                <Link href="/" className="transition hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/artists/fdy-phenomen" className="transition hover:text-white">
                  Fdy Phenomen
                </Link>
              </li>
              <li>
                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="transition"
                  style={{ color: "#D41920" }}
                >
                  Flamboyant
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-white">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#C07088" }}
            >
              Informations
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "#9A7080" }}>
              <li>Livraison en France et DOM-TOM</li>
              <li>Paiement sécurisé par Stripe</li>
              <li>Contact : contact@shoptazik.com</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-8 text-center text-xs"
          style={{ borderTop: "1px solid rgba(90,32,64,0.15)", color: "#5A3040" }}
        >
          &copy; {new Date().getFullYear()} Shoptazik. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
