"use client";

import { usePlayer } from "@/context/PlayerContext";
import { youtubeThumbnail, cn } from "@/lib/utils";
import { formatDuration } from "@/lib/songs";
import type { Song } from "@/lib/types";

export function SongRow({
  song,
  index,
  queue,
  stationSlug,
}: {
  song: Song;
  index: number;
  queue: Song[];
  stationSlug?: string | null;
}) {
  const { currentSong, state, playQueue, togglePlay } = usePlayer();
  const isActive = currentSong?.id === song.id;
  const isPlayingThis = isActive && state.isPlaying;

  function handleClick() {
    if (isActive) {
      togglePlay();
    } else {
      const idx = queue.findIndex((s) => s.id === song.id);
      playQueue(queue, idx === -1 ? 0 : idx, stationSlug ?? null);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        isActive ? "bg-amber/10" : "hover:bg-bg-surface-2"
      )}
    >
      <span className="w-6 flex-shrink-0 text-right font-mono text-xs text-text-muted">
        {isPlayingThis ? (
          <span className="inline-flex items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-amber"
                style={{
                  height: 9,
                  animation: `eq-bar ${0.7 + i * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </span>
        ) : (
          String(index + 1).padStart(3, "0")
        )}
      </span>

      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-bg-elevated">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={youtubeThumbnail(song.youtubeId)} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            isActive ? "text-amber" : "text-text-primary"
          )}
        >
          {song.titleHi}{" "}
          <span className="font-sans font-normal text-text-muted">· {song.titleEn}</span>
        </p>
        <p className="truncate text-xs text-text-secondary">
          {song.singers.join(", ")} · {song.film}
        </p>
      </div>

      <span className="hidden flex-shrink-0 font-mono text-xs text-text-muted sm:block">
        {song.year}
      </span>
      <span className="hidden w-10 flex-shrink-0 text-right font-mono text-xs text-text-muted sm:block">
        {formatDuration(song.durationSeconds)}
      </span>
    </button>
  );
}
