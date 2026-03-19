"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

function SuccessContent() {
  const clearCart = useCartStore((s) => s.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderType = searchParams.get("type") || "physical";

  const isDigital = orderType === "digital" || orderType === "mixed";
  const isPhysical = orderType === "physical" || orderType === "mixed";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:py-20" style={{ background: "#1A1610" }}>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "rgba(200,160,80,0.1)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#C8A050" className="h-10 w-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white md:text-3xl">Commande confirmée !</h1>
      <p className="mt-4 text-white/40">
        Merci pour ta commande ! Un reçu Stripe t&apos;a été envoyé par e-mail.
      </p>

      {/* Bloc pour les commandes physiques (t-shirt, vinyle, etc.) */}
      {isPhysical && (
        <div className="mt-8 rounded-xl border p-6" style={{ borderColor: "rgba(200,160,80,0.1)", background: "rgba(200,160,80,0.04)" }}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(200,160,80,0.1)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#C8A050" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m0 0h13.5m-13.5 0V3.375c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v10.875" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-white">Livraison</h2>
          <p className="mt-2 text-sm text-white/40">
            Ta commande sera préparée et expédiée sous 3 à 5 jours ouvrés.
            Tu recevras un e-mail avec le suivi de livraison.
          </p>
        </div>
      )}

      {/* Bloc pour les achats digitaux (albums, titres) */}
      {isDigital && (
        <div className="mt-8 rounded-xl border p-6" style={{ borderColor: "rgba(200,160,80,0.1)", background: "rgba(200,160,80,0.04)" }}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(200,160,80,0.1)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#C8A050" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-white">Téléchargement digital</h2>
          <p className="mt-2 text-sm text-white/40">
            Tu recevras le lien de téléchargement par e-mail dans les prochaines minutes.
          </p>
        </div>
      )}

      {sessionId && (
        <p className="mt-6 text-xs text-white/20">
          Réf. commande : {sessionId.slice(0, 20)}...
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-xl px-6 py-3 font-bold text-black transition hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #C8A050, #A08030)" }}
        >
          Retour à la boutique
        </Link>
        <Link
          href="/artists/fdy-phenomen"
          className="rounded-xl border px-6 py-3 font-semibold text-white/60 transition hover:text-white"
          style={{ borderColor: "rgba(200,160,80,0.15)" }}
        >
          Voir la discographie
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
