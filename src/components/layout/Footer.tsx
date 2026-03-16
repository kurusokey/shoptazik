import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#141210", borderTop: "1px solid rgba(200,160,80,0.1)" }}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white/90">
              SHOP<span style={{ color: "#C8A050" }}>TAZIK</span>
            </h3>
            <p className="mt-2 text-sm text-white/30">
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising officiel.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/30">
              <li><Link href="/" className="transition hover:text-white/60">Accueil</Link></li>
              <li><Link href="/artists/fdy-phenomen" className="transition hover:text-white/60">Fdy Phenomen</Link></li>
              <li><Link href="/artists/fdy-phenomen/chanteur-de-rap" className="transition hover:opacity-80" style={{ color: "#C8A050" }}>Chanteur de Rap</Link></li>
              <li><Link href="/cart" className="transition hover:text-white/60">Panier</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">Informations</h4>
            <ul className="space-y-2 text-sm text-white/30">
              <li>Livraison en France et DOM-TOM</li>
              <li>Paiement sécurisé par Stripe</li>
              <li>Contact : contact@shoptazik.com</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-xs text-white/15" style={{ borderTop: "1px solid rgba(200,160,80,0.08)" }}>
          &copy; {new Date().getFullYear()} Shoptazik. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
