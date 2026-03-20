"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookies-accepted";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already accepted
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Show after 2 seconds delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="mx-auto flex max-w-3xl flex-col items-center gap-2.5 rounded-xl border px-4 py-3 backdrop-blur-md sm:flex-row sm:gap-4 sm:px-5 sm:py-4"
        style={{
          background: "rgba(26,22,16,0.95)",
          borderColor: "rgba(200,160,80,0.15)",
          boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
          pointerEvents: "auto",
        }}
      >
        <p className="flex-1 text-center text-xs text-white/60 sm:text-left sm:text-sm">
          Ce site utilise des cookies analytiques pour am&eacute;liorer votre
          exp&eacute;rience.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/confidentialite"
            className="text-xs font-medium transition hover:opacity-70"
            style={{ color: "#C8A050" }}
          >
            En savoir plus
          </Link>
          <button
            onClick={handleAccept}
            className="rounded-lg px-4 py-2 text-xs font-bold transition hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #C8A050, #A08030)",
              color: "#1A1610",
            }}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
