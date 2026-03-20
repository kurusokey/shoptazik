"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================
// Player YouTube unique partagé par tous les boutons
// Un seul player, un seul iframe — change de vidéo au clic
// ============================================

let sharedPlayer: YT.Player | null = null;
let sharedPlayerReady = false;
let currentVideoId: string | null = null;
let currentInstanceId: string | null = null;
let stopCallbacks: Map<string, () => void> = new Map();
let onTrackChange: ((title: string | null) => void) | null = null;
let pendingPlay: { videoId: string; instanceId: string; trackTitle: string } | null = null;

// API YouTube — chargée une seule fois
let ytApiLoading = false;

function ensureYTApi() {
  if (ytApiLoading) return;
  if (typeof window === "undefined") return;
  if ((window as unknown as Record<string, unknown>).YT) {
    initSharedPlayer();
    return;
  }
  ytApiLoading = true;
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
  (window as unknown as Record<string, unknown>).onYouTubeIframeAPIReady = () => {
    initSharedPlayer();
  };
}

// Stopper la musique quand l'onglet perd le focus
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && currentInstanceId) {
      stopCurrentTrack();
    }
  });
}

function initSharedPlayer() {
  if (sharedPlayer) return;

  // Créer le container du player
  let container = document.getElementById("yt-shared-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "yt-shared-container";
    container.style.cssText = "position:fixed;bottom:0;right:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;z-index:-1;";
    document.body.appendChild(container);
  }

  const playerDiv = document.createElement("div");
  playerDiv.id = "yt-shared-player";
  container.appendChild(playerDiv);

  sharedPlayer = new YT.Player("yt-shared-player", {
    height: "1",
    width: "1",
    playerVars: {
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
    events: {
      onReady: () => {
        sharedPlayerReady = true;
        if (pendingPlay) {
          playVideo(pendingPlay.videoId, pendingPlay.instanceId, pendingPlay.trackTitle);
          pendingPlay = null;
        }
      },
      onStateChange: (e: YT.PlayerEvent & { data: number }) => {
        if (e.data === 0) {
          // Vidéo terminée — arrêter
          if (currentInstanceId) {
            const stopFn = stopCallbacks.get(currentInstanceId);
            if (stopFn) stopFn();
          }
          currentVideoId = null;
          currentInstanceId = null;
          onTrackChange?.(null);
        }
      },
    },
  });
}

function playVideo(videoId: string, instanceId: string, trackTitle: string) {
  if (!sharedPlayer || !sharedPlayerReady) {
    pendingPlay = { videoId, instanceId, trackTitle };
    return;
  }

  if (currentVideoId === videoId) {
    sharedPlayer.playVideo();
  } else {
    sharedPlayer.loadVideoById(videoId);
    currentVideoId = videoId;
  }
  currentInstanceId = instanceId;
  onTrackChange?.(trackTitle);
}

function pauseVideo() {
  if (sharedPlayer && sharedPlayerReady) {
    try { sharedPlayer.pauseVideo(); } catch {}
  }
  currentVideoId = null;
  currentInstanceId = null;
  onTrackChange?.(null);
}

// Exports pour NowPlaying
export function setOnTrackChange(cb: (title: string | null) => void) {
  onTrackChange = cb;
}

export function stopCurrentTrack() {
  if (currentInstanceId) {
    const stopFn = stopCallbacks.get(currentInstanceId);
    if (stopFn) stopFn();
  }
  pauseVideo();
}

// ============================================
// Composant bouton play/stop
// ============================================

interface YouTubePlayerProps {
  videoId: string;
  trackTitle: string;
}

export default function YouTubePlayer({ videoId, trackTitle }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const instanceId = `${videoId}-${trackTitle}`;

  const stop = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    stopCallbacks.set(instanceId, stop);
    ensureYTApi();
    return () => { stopCallbacks.delete(instanceId); };
  }, [instanceId, stop]);

  const togglePlay = useCallback(() => {
    if (playing) {
      pauseVideo();
      setPlaying(false);
    } else {
      // Stopper tous les autres
      stopCallbacks.forEach((fn, key) => {
        if (key !== instanceId) fn();
      });
      playVideo(videoId, instanceId, trackTitle);
      setPlaying(true);
    }
  }, [playing, instanceId, trackTitle, videoId]);

  return (
    <button
      onClick={togglePlay}
      title={playing ? `Arrêter ${trackTitle}` : `Écouter ${trackTitle}`}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:scale-110"
      style={{
        background: playing ? "rgba(212,25,32,0.25)" : "rgba(255,255,255,0.1)",
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
  );
}

// Types YouTube IFrame API
declare namespace YT {
  class Player {
    constructor(id: string, config: Record<string, unknown>);
    playVideo(): void;
    pauseVideo(): void;
    loadVideoById(videoId: string): void;
    destroy(): void;
  }
  interface PlayerEvent {
    target: Player;
    data?: number;
  }
}
