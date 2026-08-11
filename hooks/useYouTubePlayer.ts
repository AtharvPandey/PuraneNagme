"use client";

import { useEffect, useRef, useCallback } from "react";

// Minimal shape of the YT Player API we actually use — avoids pulling in
// the full @types/youtube package for a handful of methods.
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (v: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface UseYouTubePlayerOptions {
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onEnd?: () => void;
}

// Minimal typed shape of the global YT namespace we actually touch.
interface YTNamespace {
  Player: new (
    elementId: string,
    config: {
      height: string;
      width: string;
      playerVars: Record<string, number>;
      events: {
        onReady: () => void;
        onStateChange: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * Manages a single hidden YouTube IFrame player instance for audio playback.
 * The visual player element is 1x1px and visually hidden — we build our own
 * UI entirely and just use YouTube as the audio engine, same approach used
 * by every "YouTube as radio backend" site.
 */
export function useYouTubePlayer(containerId: string, opts: UseYouTubePlayerOptions = {}) {
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const optsRef = useRef(opts);

  useEffect(() => {
    optsRef.current = opts;
  });

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled) return;
      playerRef.current = new window.YT.Player(containerId, {
        height: "0",
        width: "0",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            optsRef.current.onReady?.();
          },
          onStateChange: (e: { data: number }) => {
            optsRef.current.onStateChange?.(e.data);
            // 0 = ended
            if (e.data === 0) optsRef.current.onEnd?.();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const loadVideo = useCallback((youtubeId: string) => {
    playerRef.current?.loadVideoById(youtubeId);
  }, []);
  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);
  const setVolume = useCallback((v: number) => {
    playerRef.current?.setVolume(v);
  }, []);
  const setMuted = useCallback((muted: boolean) => {
    if (muted) playerRef.current?.mute();
    else playerRef.current?.unMute();
  }, []);
  const getCurrentTime = useCallback(() => playerRef.current?.getCurrentTime() ?? 0, []);
  const getDuration = useCallback(() => playerRef.current?.getDuration() ?? 0, []);
  const isReady = useCallback(() => readyRef.current, []);

  return { play, pause, loadVideo, seekTo, setVolume, setMuted, getCurrentTime, getDuration, isReady };
}
