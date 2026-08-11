"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import type { Song, PlayerState, RepeatMode } from "@/lib/types";

type Action =
  | {
      type: "SET_QUEUE";
      songs: Song[];
      startIndex?: number;
      stationSlug?: string | null;
      autoplay?: boolean;
    }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "SET_BUFFERING"; value: boolean }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_INDEX"; index: number }
  | { type: "SET_PROGRESS"; seconds: number }
  | { type: "SET_DURATION"; seconds: number }
  | { type: "SET_VOLUME"; value: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "CYCLE_REPEAT" };

const initialState: PlayerState = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  isBuffering: false,
  progress: 0,
  duration: 0,
  volume: 70,
  isMuted: false,
  shuffle: false,
  repeat: "off",
  activeStationSlug: null,
};

function nextRepeatMode(mode: RepeatMode): RepeatMode {
  if (mode === "off") return "all";
  if (mode === "all") return "one";
  return "off";
}

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "SET_QUEUE":
      return {
        ...state,
        queue: action.songs,
        currentIndex: action.startIndex ?? 0,
        activeStationSlug: action.stationSlug ?? null,
        progress: 0,
        isPlaying: action.autoplay ?? true,
      };
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "SET_BUFFERING":
      return { ...state, isBuffering: action.value };
    case "NEXT": {
      if (state.queue.length === 0) return state;
      if (state.shuffle) {
        let idx = Math.floor(Math.random() * state.queue.length);
        if (state.queue.length > 1 && idx === state.currentIndex) {
          idx = (idx + 1) % state.queue.length;
        }
        return { ...state, currentIndex: idx, progress: 0, isPlaying: true };
      }
      const atEnd = state.currentIndex >= state.queue.length - 1;
      if (atEnd && state.repeat === "off") return { ...state, isPlaying: false };
      const nextIndex = atEnd ? 0 : state.currentIndex + 1;
      return { ...state, currentIndex: nextIndex, progress: 0, isPlaying: true };
    }
    case "PREV": {
      if (state.queue.length === 0) return state;
      const prevIndex =
        state.currentIndex <= 0 ? state.queue.length - 1 : state.currentIndex - 1;
      return { ...state, currentIndex: prevIndex, progress: 0, isPlaying: true };
    }
    case "SET_INDEX":
      return { ...state, currentIndex: action.index, progress: 0, isPlaying: true };
    case "SET_PROGRESS":
      return { ...state, progress: action.seconds };
    case "SET_DURATION":
      return { ...state, duration: action.seconds };
    case "SET_VOLUME":
      return { ...state, volume: action.value, isMuted: false };
    case "TOGGLE_MUTE":
      return { ...state, isMuted: !state.isMuted };
    case "TOGGLE_SHUFFLE":
      return { ...state, shuffle: !state.shuffle };
    case "CYCLE_REPEAT":
      return { ...state, repeat: nextRepeatMode(state.repeat) };
    default:
      return state;
  }
}

interface PlayerContextValue {
  state: PlayerState;
  currentSong: Song | null;
  playQueue: (
    songs: Song[],
    startIndex?: number,
    stationSlug?: string | null,
    autoplay?: boolean
  ) => void;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const YT_CONTAINER_ID = "pnn-youtube-engine";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const currentSong = state.queue[state.currentIndex] ?? null;
  const currentSongRef = useRef(currentSong);
  useEffect(() => {
    currentSongRef.current = currentSong;
  });

  const handleEndRef = useRef<() => void>(() => {});
  const handleReadyRef = useRef<() => void>(() => {});

  const yt = useYouTubePlayer(YT_CONTAINER_ID, {
    onReady: () => handleReadyRef.current(),
    onEnd: () => handleEndRef.current(),
  });

  useEffect(() => {
    handleReadyRef.current = () => {
      yt.setVolume(stateRef.current.volume);
    };
  }, [yt]);

  useEffect(() => {
    handleEndRef.current = () => {
      if (stateRef.current.repeat === "one") {
        yt.seekTo(0);
        yt.play();
        return;
      }
      dispatch({ type: "NEXT" });
    };
  }, [yt]);

  // Load new video whenever the current song changes
  const lastLoadedId = useRef<number | null>(null);
  useEffect(() => {
    if (!currentSong) return;
    if (lastLoadedId.current === currentSong.id) return;
    lastLoadedId.current = currentSong.id;
    dispatch({ type: "SET_BUFFERING", value: true });
    const tryLoad = () => {
      if (yt.isReady()) {
        yt.loadVideo(currentSong.youtubeId);
        dispatch({ type: "SET_BUFFERING", value: false });
      } else {
        setTimeout(tryLoad, 150);
      }
    };
    tryLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  // Play/pause sync
  useEffect(() => {
    if (!currentSong) return;
    if (state.isPlaying) yt.play();
    else yt.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPlaying, currentSong?.id]);

  // Volume/mute sync
  useEffect(() => {
    yt.setVolume(state.isMuted ? 0 : state.volume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.volume, state.isMuted]);

  // Progress polling
  useEffect(() => {
    progressInterval.current = setInterval(() => {
      if (!stateRef.current.isPlaying) return;
      const t = yt.getCurrentTime();
      const d = yt.getDuration();
      if (d > 0) dispatch({ type: "SET_DURATION", seconds: d });
      dispatch({ type: "SET_PROGRESS", seconds: t });
    }, 500);
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playQueue = useCallback(
    (songs: Song[], startIndex = 0, stationSlug: string | null = null, autoplay = true) => {
      lastLoadedId.current = null;
      dispatch({ type: "SET_QUEUE", songs, startIndex, stationSlug, autoplay });
    },
    []
  );

  const playSong = useCallback(
    (song: Song, queue?: Song[]) => {
      const q = queue ?? [song];
      const idx = q.findIndex((s) => s.id === song.id);
      playQueue(q, idx === -1 ? 0 : idx);
    },
    [playQueue]
  );

  const togglePlay = useCallback(() => {
    if (!currentSongRef.current) return;
    dispatch({ type: stateRef.current.isPlaying ? "PAUSE" : "PLAY" });
  }, []);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);
  const seekTo = useCallback(
    (seconds: number) => {
      yt.seekTo(seconds);
      dispatch({ type: "SET_PROGRESS", seconds });
    },
    [yt]
  );
  const setVolume = useCallback((v: number) => dispatch({ type: "SET_VOLUME", value: v }), []);
  const toggleMute = useCallback(() => dispatch({ type: "TOGGLE_MUTE" }), []);
  const toggleShuffle = useCallback(() => dispatch({ type: "TOGGLE_SHUFFLE" }), []);
  const cycleRepeat = useCallback(() => dispatch({ type: "CYCLE_REPEAT" }), []);

  return (
    <PlayerContext.Provider
      value={{
        state,
        currentSong,
        playQueue,
        playSong,
        togglePlay,
        next,
        prev,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
      }}
    >
      {children}
      <div id={YT_CONTAINER_ID} style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", bottom: 0, left: 0 }} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
