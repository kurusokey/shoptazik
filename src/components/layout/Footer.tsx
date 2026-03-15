import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#DC143C]/10 bg-[#0a0608]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">
              SHOP<span className="bg-gradient-to-r from-[#DC143C] to-[#8B2252] bg-clip-text text-transparent">TAZIK</span>
            </h3>
            <p className="mt-2 text-sm text-[#a07070]">
              La boutique du rap francophone. Vinyles, CD, K7 et merchandising
              officiel.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#d4a0a0]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#a07070]">
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
                <Link
                  href="/artists/fdy-phenomen/flamboyant"
                  className="transition hover:text-[#DC143C]"
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
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#d4a0a0]">
              Informations
            </h4>
            <ul className="space-y-2 text-sm text-[#a07070]">
              <li>Livraison en France et DOM-TOM</li>
              <li>Paiement sécurisé par Stripe</li>
              <li>Contact : contact@shoptazik.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[#DC143C]/10 pt-8 text-center text-xs text-[#703040]">
          &copy; {new Date().getFullYear()} Shoptazik. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
