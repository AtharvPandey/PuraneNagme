"use client";

import { usePlayer } from "@/context/PlayerContext";
import { youtubeThumbnail, cn } from "@/lib/utils";
import { formatDuration } from "@/lib/songs";
import { AnimatePresence, motion } from "framer-motion";

export function BottomPlayer() {
  const { state, currentSong, togglePlay, next, prev, seekTo, setVolume, toggleMute } =
    usePlayer();

  return (
    <AnimatePresence>
      {currentSong && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border-hairline bg-bg-surface/95 backdrop-blur-md"
        >
          {/* Progress bar — top edge of the bar */}
          <div className="relative h-[3px] w-full bg-bg-elevated/60">
            <div
              className="h-full bg-gradient-to-r from-amber to-terracotta transition-[width] duration-500 ease-linear"
              style={{
                width: state.duration
                  ? `${Math.min(100, (state.progress / state.duration) * 100)}%`
                  : "0%",
              }}
            />
            {/* Invisible full-width range for seeking */}
            <input
              type="range"
              aria-label="Seek"
              min={0}
              max={state.duration || 0}
              value={state.progress}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 h-3 w-full -translate-y-1/3 cursor-pointer opacity-0"
            />
          </div>

          <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6">
            {/* Thumbnail */}
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-bg-elevated sm:h-12 sm:w-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={youtubeThumbnail(currentSong.youtubeId)}
                alt=""
                className="h-full w-full object-cover"
              />
              {state.isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-[2px] bg-black/30 pb-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[2.5px] origin-bottom rounded-full bg-amber"
                      style={{
                        height: 10,
                        animation: `eq-bar ${0.7 + i * 0.15}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Song info — truncate + marquee-ish on overflow via simple truncate */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary sm:text-[15px]">
                {currentSong.titleHi}
                <span className="ml-2 font-sans text-text-muted">
                  · {currentSong.titleEn}
                </span>
              </p>
              <p className="truncate text-xs text-text-secondary">
                {currentSong.singers.join(", ")} · {currentSong.film}
              </p>
            </div>

            {/* Time — desktop only */}
            <span className="hidden font-mono text-xs text-text-muted sm:block tabular-nums">
              {formatDuration(state.progress)} / {formatDuration(state.duration)}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <IconButton onClick={prev} label="Previous song">
                <PrevIcon />
              </IconButton>
              <IconButton onClick={togglePlay} label={state.isPlaying ? "Pause" : "Play"} primary>
                {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <IconButton onClick={next} label="Next song">
                <NextIcon />
              </IconButton>
            </div>

            {/* Volume — desktop only */}
            <div className="hidden items-center gap-2 md:flex">
              <IconButton onClick={toggleMute} label={state.isMuted ? "Unmute" : "Mute"}>
                {state.isMuted || state.volume === 0 ? <MuteIcon /> : <VolumeIcon />}
              </IconButton>
              <input
                type="range"
                aria-label="Volume"
                min={0}
                max={100}
                value={state.isMuted ? 0 : state.volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="pnn-volume-slider w-20"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconButton({
  children,
  onClick,
  label,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        primary
          ? "h-9 w-9 bg-gradient-to-br from-amber to-terracotta text-bg-base hover:brightness-110 sm:h-10 sm:w-10"
          : "h-8 w-8 text-text-secondary hover:bg-bg-surface-2 hover:text-amber sm:h-9 sm:w-9"
      )}
    >
      {children}
    </button>
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5v14l9-7-9-7z" />
      <rect x="16" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
function PrevIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 5v14l-9-7 9-7z" />
      <rect x="5.5" y="5" width="2.5" height="14" rx="1" />
    </svg>
  );
}
function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M17.5 8.5a5 5 0 010 7" strokeLinecap="round" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
    </svg>
  );
}
