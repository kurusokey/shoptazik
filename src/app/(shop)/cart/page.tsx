"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, categoryLabel } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();

      if (data.url) {
        // Stripe Checkout : redirection vers la page de paiement
        window.location.href = data.url;
        return;
      }

      // Fallback simulation (pas de clé Stripe configurée)
      clearCart();
      setCheckoutDone(true);
    } catch {
      alert("Erreur lors du paiement. Réessaie.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (checkoutDone) {
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
        <h1 className="text-3xl font-bold text-white">Commande confirmée</h1>
        <p className="mt-4 text-zinc-400">
          Merci pour ta commande ! Tu recevras un e-mail de confirmation sous
          peu.
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

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Ton panier est vide</h1>
        <p className="mt-2 text-zinc-400">
          Explore notre catalogue et ajoute des produits.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          Continuer les achats
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Panier</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Articles */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.variant?.id}`}
              className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              {/* Image produit */}
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {categoryLabel(item.product.category)}
                    {item.variant && ` — ${item.variant.label}`}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.variant?.id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.variant?.id
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white">
                      {formatPrice(
                        (item.product.price +
                          (item.variant?.price_modifier ?? 0)) *
                          item.quantity
                      )}
                    </span>
                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.variant?.id)
                      }
                      className="text-zinc-500 transition hover:text-red-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-bold text-white">Résumé</h2>

          <div className="mt-4 space-y-2 border-b border-zinc-800 pb-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.variant?.id}`}
                className="flex justify-between text-sm text-zinc-400"
              >
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>
                  {formatPrice(
                    (item.product.price +
                      (item.variant?.price_modifier ?? 0)) *
                      item.quantity
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Livraison</span>
              <span>Calculée à la prochaine étape</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="mt-6 w-full rounded-lg bg-amber-400 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {checkoutLoading ? "Traitement en cours..." : "Commander"}
          </button>

          <p className="mt-3 text-center text-xs text-zinc-500">
            Paiement sécurisé par Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
