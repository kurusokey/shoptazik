"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30 text-green-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white">Commande confirmée !</h1>
      <p className="mt-4 text-zinc-400">
        Merci pour ta commande ! Tu recevras un e-mail de confirmation avec les
        détails de livraison sous peu.
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Un reçu Stripe t&apos;a été envoyé par e-mail.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
