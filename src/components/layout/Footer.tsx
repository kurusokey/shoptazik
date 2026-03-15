import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">
              SHOP<span className="text-amber-400">TAZIK</span>
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising
              officiel.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/artists/fdy-phenomen"
                  className="transition hover:text-white"
                >
                  Fdy Phenomen
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
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Informations
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Livraison en France et DOM-TOM</li>
              <li>Paiement sécurisé par Stripe</li>
              <li>Contact : contact@shoptazik.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-8 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Shoptazik. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
