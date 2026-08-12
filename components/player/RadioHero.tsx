"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { useCurrentStation } from "@/hooks/useCurrentStation";
import { getAllPlaylists, getSongsForPlaylist, formatDuration } from "@/lib/songs";
import { youtubeThumbnail, cn } from "@/lib/utils";
import { SceneBackground } from "@/components/layout/SceneBackground";
import { TuningDial } from "@/components/player/TuningDial";
import { VolumeKnob } from "@/components/player/VolumeKnob";

const TAGLINE = "कुछ गाने कभी पुराने नहीं होते";

export function RadioHero() {
  const player = usePlayer();
  const currentStation = useCurrentStation();
  const [selectedSlug, setSelectedSlug] = useState(currentStation.slug);
  const [ambience, setAmbience] = useState(true);
  const stations = getAllPlaylists();
  const initialised = useRef(false);

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
  const activeIndex = Math.max(0, stations.findIndex((s) => s.slug === activeSlug));
  const activeStation = stations[activeIndex] ?? currentStation;

  function selectStation(slug: string) {
    setSelectedSlug(slug);
    const songs = getSongsForPlaylist(slug);
    if (songs.length > 0) player.playQueue(songs, 0, slug);
  }

  function goToOffset(offset: number) {
    const nextIndex = (activeIndex + offset + stations.length) % stations.length;
    selectStation(stations[nextIndex].slug);
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "calc(100svh - 64px)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStation.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <SceneBackground
            accentFrom={activeStation.gradientFrom}
            accentTo={activeStation.gradientTo}
            paused={!ambience}
          />
        </motion.div>
      </AnimatePresence>

      {/* Station tabs — top right, film-poster style */}
      <TuningDial
        stations={stations}
        activeSlug={activeSlug}
        onSelect={selectStation}
        className="absolute right-4 top-5 z-10 sm:right-8 sm:top-7"
      />

      {/* Bottom content stack — headline, player card, navigator — all in one
          flex column so heights compose naturally instead of colliding via
          hand-tuned pixel offsets. Bottom padding clears the fixed mobile
          nav + persistent bottom player. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-4 pb-[168px] sm:gap-5 sm:px-10 sm:pb-28">
        {/* Eyebrow + headline block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStation.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg"
          >
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-amber/90">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
              </span>
              {song ? `A memory from ${song.year}` : "Tune in"}
            </p>
            <h1 className="mt-3 font-display-hindi text-4xl leading-tight text-white drop-shadow-lg sm:text-6xl">
              {activeStation.nameHi}
            </h1>
            <p className="font-hindi mt-2 text-sm text-white/70 sm:text-base">{TAGLINE}</p>
            <p className="mt-2 hidden max-w-md text-xs text-white/60 sm:block sm:text-sm">
              {activeStation.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Floating player card + ambience toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="rounded-2xl border border-white/10 bg-black/45 p-3 shadow-2xl backdrop-blur-md sm:w-[380px]">
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/50">
            <LiveDot />
            {activeStation.nameEn} radio
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-bg-elevated">
              {song ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={youtubeThumbnail(song.youtubeId)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-amber/40">
                  <DiscIcon />
                </div>
              )}
              {player.state.isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-[2px] bg-black/30 pb-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[2.5px] origin-bottom rounded-full bg-amber"
                      style={{
                        height: 9,
                        animation: `eq-bar ${0.7 + i * 0.15}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {song ? song.titleHi : "Choose a memory"}
              </p>
              <p className="truncate text-xs text-white/55">
                {song ? `${song.singers.join(", ")} · ${song.film}` : "Pick a station to begin"}
              </p>
            </div>

            <button
              onClick={player.togglePlay}
              aria-label={player.state.isPlaying ? "Pause" : "Play"}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber to-terracotta text-bg-base shadow-lg"
            >
              {player.state.isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber to-terracotta transition-[width] duration-500"
                style={{
                  width: player.state.duration
                    ? `${(player.state.progress / player.state.duration) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-white/40">
              <span>{formatDuration(player.state.progress)}</span>
              <span>{formatDuration(player.state.duration || song?.durationSeconds)}</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2">
            <div className="flex items-center gap-1">
              <MiniButton onClick={player.prev} label="Previous song">
                <PrevIcon />
              </MiniButton>
              <MiniButton onClick={player.next} label="Next song">
                <NextIcon />
              </MiniButton>
              <MiniButton onClick={player.toggleShuffle} label="Shuffle" active={player.state.shuffle}>
                <ShuffleIcon />
              </MiniButton>
            </div>
            <VolumeKnob
              value={player.state.volume}
              muted={player.state.isMuted}
              onChange={player.setVolume}
              onToggleMute={player.toggleMute}
              className="hidden sm:flex"
            />
            {song && (
              <a
                href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-white/45 underline-offset-2 hover:text-amber hover:underline"
              >
                Watch on YouTube ↗
              </a>
            )}
          </div>
        </div>

          {/* Ambience toggle */}
          <button
            onClick={() => setAmbience((v) => !v)}
            className="flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[11px] text-white/70 backdrop-blur-md transition-colors hover:text-white sm:self-auto"
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", ambience ? "bg-success" : "bg-white/30")} />
            Ambience {ambience ? "on" : "off"}
          </button>
        </div>

        {/* Memory navigator */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <button
            onClick={() => goToOffset(-1)}
            className="flex items-center gap-1.5 text-[11px] text-white/55 transition-colors hover:text-amber sm:text-xs"
          >
            <ChevronLeft />
            <span className="hidden sm:inline">Previous memory</span>
          </button>
          <div className="flex items-center gap-1.5">
            {stations.map((s, i) => (
              <button
                key={s.slug}
                onClick={() => selectStation(s.slug)}
                aria-label={`Go to ${s.nameEn}`}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === activeIndex ? "w-5 bg-amber" : "w-1 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => goToOffset(1)}
            className="flex items-center gap-1.5 text-[11px] text-white/55 transition-colors hover:text-amber sm:text-xs"
          >
            <span className="hidden sm:inline">Next memory</span>
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
    </span>
  );
}

function MiniButton({
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
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
        active ? "bg-amber/20 text-amber" : "text-white/60 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function DiscIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5v14l9-7-9-7z" />
      <rect x="16" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 5v14l-9-7 9-7z" />
      <rect x="5.5" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
function ShuffleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 6h3.5L16 18h4.5M17 15l3.5 3-3.5 3M17 3l3.5 3-3.5 3M3 18h3.5L14 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
