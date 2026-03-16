"use client";

import { useState } from "react";

interface BuyTrackButtonProps {
  title: string;
  artist: string;
  album: string;
  price: number; // en centimes (ex: 129 = 1,29€)
}

export default function BuyTrackButton({ title, artist, album, price }: BuyTrackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracks: [{ title, artist, album, price }],
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
    <button
      onClick={handleBuy}
      disabled={loading}
      className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition hover:brightness-110 disabled:opacity-50"
      style={{
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      title={`Acheter "${title}" — ${(price / 100).toFixed(2)} €`}
    >
      {loading ? "..." : `${(price / 100).toFixed(2)} €`}
    </button>
  );
}
