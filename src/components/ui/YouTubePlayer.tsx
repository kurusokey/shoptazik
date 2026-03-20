"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

export function stopCurrentTrack() {
  if (currentlyPlaying) {
    const stopFn = stopCallbacks.get(currentlyPlaying);
    if (stopFn) stopFn();
    currentlyPlaying = null;
    onTrackChange?.(null);
  }
}

// Charger l'API YouTube une seule fois
let ytApiLoaded = false;
let ytApiReady = false;
const ytApiCallbacks: (() => void)[] = [];

function loadYTApi() {
  if (ytApiLoaded) return;
  ytApiLoaded = true;

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  (window as unknown as Record<string, unknown>).onYouTubeIframeAPIReady = () => {
    ytApiReady = true;
    ytApiCallbacks.forEach((cb) => cb());
    ytApiCallbacks.length = 0;
  };
}

function whenYTReady(cb: () => void) {
  if (ytApiReady) {
    cb();
  } else {
    ytApiCallbacks.push(cb);
    loadYTApi();
  }
}

interface YouTubePlayerProps {
  videoId: string;
  trackTitle: string;
}

export default function YouTubePlayer({ videoId, trackTitle }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const instanceId = `${videoId}-${trackTitle}`;
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stop = useCallback(() => {
    setPlaying(false);
    if (playerRef.current) {
      try { playerRef.current.pauseVideo(); } catch {}
    }
  }, []);

  useEffect(() => {
    registerPlayer(instanceId, stop);
    return () => unregisterPlayer(instanceId);
  }, [instanceId, stop]);

  // Charger l'API YouTube au premier rendu
  useEffect(() => {
    loadYTApi();
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) {
      if (playerRef.current) {
        try { playerRef.current.pauseVideo(); } catch {}
      }
      setPlaying(false);
      currentlyPlaying = null;
      onTrackChange?.(null);
    } else {
      stopAllExcept(instanceId);

      if (playerRef.current) {
        // Player existe déjà, relancer
        try { playerRef.current.playVideo(); } catch {}
        setPlaying(true);
        onTrackChange?.(trackTitle);
      } else {
        // Créer le player
        whenYTReady(() => {
          if (!containerRef.current) return;

          // Créer un div unique pour ce player
          const div = document.createElement("div");
          div.id = `yt-${videoId}-${Date.now()}`;
          containerRef.current.appendChild(div);

          playerRef.current = new YT.Player(div.id, {
            height: "1",
            width: "1",
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              showinfo: 0,
              modestbranding: 1,
              rel: 0,
              playsinline: 1,
            },
            events: {
              onReady: (event: YT.PlayerEvent) => {
                event.target.playVideo();
              },
            },
          });

          setPlaying(true);
          onTrackChange?.(trackTitle);
        });
      }
    }
  }, [playing, instanceId, trackTitle, videoId]);

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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D41920" className="h-4 w-4">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white/60">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </button>

      {/* Container pour le player YouTube (minuscule mais dans le DOM) */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          bottom: "4px",
          right: "4px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

// Types YouTube IFrame API
declare namespace YT {
  class Player {
    constructor(id: string, config: Record<string, unknown>);
    playVideo(): void;
    pauseVideo(): void;
    destroy(): void;
  }
  interface PlayerEvent {
    target: Player;
  }
}
