"use client";

import { useState, useEffect, useCallback } from "react";

// Store global pour qu'un seul titre joue à la fois
let currentlyPlaying: string | null = null;
let stopCallbacks: Map<string, () => void> = new Map();

// Callback global pour notifier le composant NowPlaying
let onTrackChange: ((title: string | null) => void) | null = null;

export function setOnTrackChange(cb: (title: string | null) => void) {
  onTrackChange = cb;
}

function registerPlayer(id: string, stopFn: () => void) {
  stopCallbacks.set(id, stopFn);
}

function unregisterPlayer(id: string) {
  stopCallbacks.delete(id);
}

function stopAllExcept(id: string) {
  stopCallbacks.forEach((stopFn, key) => {
    if (key !== id) stopFn();
  });
  currentlyPlaying = id;
}

// Fonction exportée pour permettre l'arrêt depuis NowPlaying
export function stopCurrentTrack() {
  if (currentlyPlaying) {
    const stopFn = stopCallbacks.get(currentlyPlaying);
    if (stopFn) stopFn();
    currentlyPlaying = null;
    onTrackChange?.(null);
  }
}

interface YouTubePlayerProps {
  videoId: string;
  trackTitle: string;
}

export default function YouTubePlayer({ videoId, trackTitle }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const instanceId = `${videoId}-${trackTitle}`;

  const stop = useCallback(() => {
    setPlaying(false);
    // Note: onTrackChange is called by the new player, not here
  }, []);

  useEffect(() => {
    registerPlayer(instanceId, stop);
    return () => unregisterPlayer(instanceId);
  }, [instanceId, stop]);

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
      currentlyPlaying = null;
      onTrackChange?.(null);
    } else {
      // Stopper tout autre titre en cours
      stopAllExcept(instanceId);
      setPlaying(true);
      onTrackChange?.(trackTitle);
    }
  }, [playing, instanceId, trackTitle]);

  return (
    <>
      <button
        onClick={togglePlay}
        title={playing ? `Arrêter ${trackTitle}` : `Écouter ${trackTitle}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:scale-110"
        style={{
          background: playing
            ? "rgba(212,25,32,0.25)"
            : "rgba(255,255,255,0.1)",
        }}
      >
        {playing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#D41920"
            className="h-4 w-4"
          >
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        ) : (
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

      {playing && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&modestbranding=1&rel=0`}
          allow="autoplay"
          className="fixed -left-[9999px] -top-[9999px] h-0 w-0"
          title={trackTitle}
        />
      )}
    </>
  );
}
