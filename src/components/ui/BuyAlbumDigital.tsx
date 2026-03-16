"use client";

import { useState } from "react";

interface BuyAlbumDigitalProps {
  title: string;
  artist: string;
  trackCount: number;
  price: number;
  coverUrl?: string;
}

export default function BuyAlbumDigital({ title, artist, trackCount, price, coverUrl }: BuyAlbumDigitalProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracks: [{
            title: `${title} (Album complet)`,
            artist,
            album: title,
            price,
          }],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Paiement non disponible pour le moment.");
      }
    } catch {
      alert("Erreur. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center gap-5 rounded-xl border p-5"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}
    >
      {coverUrl ? (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-white/30">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white">{title} &mdash; Album digital</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/30">
          <span>T&eacute;l&eacute;chargement digital</span>
          <span>&middot; {trackCount} titres</span>
        </div>
        <p className="mt-1 text-sm text-white/30">
          Album complet en t&eacute;l&eacute;chargement apr&egrave;s paiement
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xl font-bold text-white">{(price / 100).toFixed(2).replace(".", ",")} &euro;</span>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="rounded-lg px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          {loading ? "..." : "Acheter"}
        </button>
      </div>
    </div>
  );
}
