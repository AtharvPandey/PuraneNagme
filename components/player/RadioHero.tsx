"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { useCurrentStation } from "@/hooks/useCurrentStation";
import { getAllPlaylists, getSongsForPlaylist, formatDuration } from "@/lib/songs";
import { youtubeThumbnail, cn } from "@/lib/utils";
import Link from "next/link";

export function RadioHero() {
  const player = usePlayer();
  const currentStation = useCurrentStation();
  const [selectedSlug, setSelectedSlug] = useState(currentStation.slug);
  const stations = getAllPlaylists();
  const initialised = useRef(false);

  // Load (but don't autoplay) the current station's queue on first mount
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const songs = getSongsForPlaylist(currentStation.slug);
    if (songs.length > 0) {
      player.playQueue(songs, 0, currentStation.slug, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const song = player.currentSong;
  const activeSlug = player.state.activeStationSlug ?? selectedSlug;
  const activeStation = stations.find((s) => s.slug === activeSlug) ?? currentStation;

  function selectStation(slug: string) {
    setSelectedSlug(slug);
    const songs = getSongsForPlaylist(slug);
    if (songs.length > 0) player.playQueue(songs, 0, slug);
  }

  return (
    <section className="relative mx-auto flex max-w-xl flex-col items-center px-4 pt-10 sm:pt-16">
      {/* Station badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStation.slug}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-border-strong bg-amber/10 px-4 py-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="font-hindi text-xs tracking-wide text-amber">
            {activeStation.nameHi}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-text-muted">
            live
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Vinyl + player card */}
      <div className="relative w-full rounded-[28px] border border-border-hairline bg-gradient-to-b from-bg-surface-2/80 to-bg-surface/90 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-8">
        {/* Inner glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,168,56,0.08), transparent 70%)",
          }}
        />

        {/* Vinyl disc */}
        <div className="relative mx-auto mb-6 flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          {/* Glow behind disc when playing */}
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-2xl transition-opacity duration-700",
              player.state.isPlaying ? "opacity-60" : "opacity-0"
            )}
            style={{ background: "radial-gradient(circle, var(--amber), transparent 70%)" }}
          />
          <motion.div
            animate={player.state.isPlaying ? { rotate: 360 } : {}}
            transition={
              player.state.isPlaying
                ? { repeat: Infinity, duration: 4, ease: "linear" }
                : { duration: 0.3 }
            }
            className="relative h-full w-full rounded-full border-[6px] border-bg-elevated shadow-[0_0_0_1px_rgba(232,168,56,0.15),inset_0_0_30px_rgba(0,0,0,0.5)]"
            style={{
              background:
                "repeating-radial-gradient(circle, #1D140E 0px, #1D140E 2px, #241A12 3px, #1D140E 4px)",
            }}
          >
            {/* Center label with thumbnail */}
            <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-bg-base/80">
              {song ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={youtubeThumbnail(song.youtubeId)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-bg-elevated text-amber/40">
                  <RadioGlyph />
                </div>
              )}
            </div>
            {/* Spindle hole */}
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-base shadow-inner" />
          </motion.div>
        </div>

        {/* Now playing LCD display */}
        <div className="relative mb-6 rounded-xl border border-border-hairline bg-bg-base/60 px-4 py-3 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={song?.id ?? "empty"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {song ? (
                <>
                  <p className="truncate font-hindi text-lg text-amber sm:text-xl">
                    {song.titleHi}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-text-secondary">
                    {song.singers.join(", ")}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-text-muted">
                    {song.film} · {song.year}
                  </p>
                </>
              ) : (
                <p className="py-1 text-sm text-text-muted">Choose a station to begin</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber to-terracotta"
              animate={{
                width: player.state.duration
                  ? `${(player.state.progress / player.state.duration) * 100}%`
                  : "0%",
              }}
              transition={{ ease: "linear", duration: 0.4 }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-text-muted">
            <span>{formatDuration(player.state.progress)}</span>
            <span>{formatDuration(player.state.duration || song?.durationSeconds)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <ControlButton onClick={player.toggleShuffle} active={player.state.shuffle} label="Shuffle">
            <ShuffleIcon />
          </ControlButton>
          <ControlButton onClick={player.prev} label="Previous">
            <PrevIcon />
          </ControlButton>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={player.togglePlay}
            aria-label={player.state.isPlaying ? "Pause" : "Play"}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber to-terracotta text-bg-base shadow-[0_8px_30px_-6px_rgba(232,168,56,0.5)] transition-shadow hover:shadow-[0_8px_40px_-4px_rgba(232,168,56,0.7)] sm:h-[72px] sm:w-[72px]"
          >
            {player.state.isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.button>
          <ControlButton onClick={player.next} label="Next">
            <NextIcon />
          </ControlButton>
          <ControlButton
            onClick={player.cycleRepeat}
            active={player.state.repeat !== "off"}
            label="Repeat"
          >
            <RepeatIcon mode={player.state.repeat} />
          </ControlButton>
        </div>
      </div>

      {/* Station dial — horizontal scroll of pills */}
      <div className="mt-6 flex w-full snap-x gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {stations.map((s) => (
          <button
            key={s.slug}
            onClick={() => selectStation(s.slug)}
            className={cn(
              "flex-shrink-0 snap-start rounded-full border px-4 py-2 font-hindi text-sm transition-all",
              activeSlug === s.slug
                ? "border-amber bg-amber/15 text-amber"
                : "border-border-hairline text-text-secondary hover:border-border-strong hover:text-text-primary"
            )}
          >
            {s.nameHi}
          </button>
        ))}
      </div>
      <Link
        href="/stations"
        className="mt-3 text-xs text-text-muted underline-offset-4 hover:text-amber hover:underline"
      >
        See all stations →
      </Link>
    </section>
  );
}

function ControlButton({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border transition-colors sm:h-11 sm:w-11",
        active
          ? "border-amber bg-amber/15 text-amber"
          : "border-border-hairline text-text-secondary hover:border-border-strong hover:text-text-primary"
      )}
    >
      {children}
    </motion.button>
  );
}

function RadioGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 12h5M13 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5v14l9-7-9-7z" />
      <rect x="16" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 5v14l-9-7 9-7z" />
      <rect x="5.5" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 6h3.5L16 18h4.5M17 15l3.5 3-3.5 3M17 3l3.5 3-3.5 3M3 18h3.5L14 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RepeatIcon({ mode }: { mode: "off" | "all" | "one" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
      {mode === "one" && (
        <text x="12" y="15" fontSize="7" textAnchor="middle" fill="currentColor" stroke="none">1</text>
      )}
    </svg>
  );
}
