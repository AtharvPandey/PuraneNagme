"use client";

import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { SongRow } from "@/components/songs/SongRow";
import type { Playlist, Song } from "@/lib/types";

export function StationDetailClient({ station, songs }: { station: Playlist; songs: Song[] }) {
  const { playQueue } = usePlayer();

  return (
    <div>
      <div
        className="relative flex h-40 items-end sm:h-52"
        style={{ background: `linear-gradient(135deg, ${station.gradientFrom}, ${station.gradientTo})` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0px, transparent 18px, rgba(0,0,0,0.08) 18px, rgba(0,0,0,0.08) 19px)",
          }}
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
          <Link href="/stations" className="text-xs text-white/70 hover:text-white">
            ← All stations
          </Link>
          <h1 className="mt-2 font-display-hindi text-3xl text-white drop-shadow sm:text-4xl">
            {station.nameHi}
          </h1>
          <p className="mt-1 text-sm text-white/85">{station.nameEn}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-text-secondary">{station.description}</p>
        {station.isTimeBased && (
          <p className="mt-1 font-mono text-xs text-text-muted">
            {station.timeStart}–{station.timeEnd} IST
          </p>
        )}

        <button
          onClick={() => playQueue(songs, 0, station.slug)}
          disabled={songs.length === 0}
          className="mt-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber to-terracotta px-6 py-2.5 text-sm font-medium text-bg-base transition-shadow hover:shadow-lg disabled:opacity-40"
        >
          <PlayIcon /> Play all
        </button>

        <div className="mt-8 space-y-0.5">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} queue={songs} stationSlug={station.slug} />
          ))}
          {songs.length === 0 && (
            <p className="py-12 text-center text-sm text-text-muted">
              Songs for this station are being added.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}
