"use client";

import { useState, useRef, useCallback } from "react";

interface YouTubePlayerProps {
  videoId: string;
  trackTitle: string;
}

export default function YouTubePlayer({ videoId, trackTitle }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = useCallback(() => {
    if (playing) {
      // Stop : on détruit l'iframe
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  }, [playing]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePlay}
        title={playing ? `Arrêter ${trackTitle}` : `Écouter ${trackTitle}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:scale-110"
        style={{
          background: playing
            ? "rgba(212,25,32,0.2)"
            : "rgba(255,255,255,0.1)",
        }}
      >
        {playing ? (
          // Bouton Stop
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#D41920"
            className="h-4 w-4"
          >
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        ) : (
          // Bouton Play
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-white/60"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </button>

      {/* Iframe YouTube cachée pour l'audio */}
      {playing && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&modestbranding=1&rel=0`}
          allow="autoplay"
          className="fixed -left-[9999px] -top-[9999px] h-0 w-0"
          title={trackTitle}
        />
      )}
    </div>
  );
}
