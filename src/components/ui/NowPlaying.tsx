"use client";

import { useState, useEffect } from "react";
import { setOnTrackChange, stopCurrentTrack } from "./YouTubePlayer";

export default function NowPlaying() {
  const [trackTitle, setTrackTitle] = useState<string | null>(null);

  useEffect(() => {
    setOnTrackChange((title) => {
      setTrackTitle(title);
    });

    return () => {
      setOnTrackChange(() => {});
    };
  }, []);

  if (!trackTitle) return null;

  return (
    <div
      className="fixed bottom-14 left-0 right-0 z-40 px-4"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="mx-auto flex max-w-xl items-center gap-3 rounded-xl border px-4 py-2.5 backdrop-blur-md"
        style={{
          background: "rgba(26,22,16,0.95)",
          borderColor: "rgba(200,160,80,0.2)",
          boxShadow: "0 -2px 20px rgba(0,0,0,0.3)",
          pointerEvents: "auto",
        }}
      >
        {/* Animated playing indicator */}
        <span
          className="shrink-0 text-sm"
          style={{ color: "#C8A050" }}
        >
          &#9654;
        </span>

        <p className="flex-1 truncate text-xs text-white/60">
          <span className="font-semibold text-white/80">
            En cours de lecture :
          </span>{" "}
          {trackTitle}
        </p>

        <button
          onClick={stopCurrentTrack}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition hover:scale-110"
          style={{ background: "rgba(212,25,32,0.2)" }}
          title="Arr&ecirc;ter la lecture"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#D41920"
            className="h-3.5 w-3.5"
          >
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
