import songsData from "@/data/songs.json";
import playlistsData from "@/data/playlists.json";
import type { Song, Playlist, Decade } from "./types";

// NOTE: This module is the single seam between the app and its data source.
// Today it reads local JSON. When you're ready to move to Supabase, only
// the bodies of these functions change — every component that calls them
// (getAllSongs, getPlaylistBySlug, etc.) stays exactly the same.

const songs = songsData as Song[];
const playlists = playlistsData as Playlist[];

export function getAllSongs(): Song[] {
  return songs;
}

export function getSongById(id: number): Song | undefined {
  return songs.find((s) => s.id === id);
}

export function getAllPlaylists(): Playlist[] {
  return [...playlists].sort((a, b) => a.id - b.id);
}

export function getPlaylistBySlug(slug: string): Playlist | undefined {
  return playlists.find((p) => p.slug === slug);
}

export function getSongsForPlaylist(slug: string): Song[] {
  const playlist = getPlaylistBySlug(slug);
  if (!playlist) return [];
  return playlist.songIds
    .map((id) => getSongById(id))
    .filter((s): s is Song => Boolean(s));
}

export function getDecade(year: number): Decade {
  const d = Math.floor(year / 10) * 10;
  return `${d}s` as Decade;
}

export function getAllDecades(): Decade[] {
  const set = new Set(songs.map((s) => getDecade(s.year)));
  return Array.from(set).sort();
}

export function getAllSingers(): string[] {
  const set = new Set(songs.flatMap((s) => s.singers));
  return Array.from(set).sort();
}

export function searchSongs(query: string): Song[] {
  const q = query.trim().toLowerCase();
  if (!q) return songs;
  return songs.filter(
    (s) =>
      s.titleEn.toLowerCase().includes(q) ||
      s.titleHi.includes(q) ||
      s.film.toLowerCase().includes(q) ||
      s.singers.some((singer) => singer.toLowerCase().includes(q))
  );
}

export function filterSongs(opts: {
  query?: string;
  decade?: Decade;
  singer?: string;
}): Song[] {
  let result = opts.query ? searchSongs(opts.query) : songs;
  if (opts.decade) {
    result = result.filter((s) => getDecade(s.year) === opts.decade);
  }
  if (opts.singer) {
    result = result.filter((s) => s.singers.includes(opts.singer!));
  }
  return result;
}

/**
 * Returns the station that should be playing right now, based on IST hour.
 * Falls back to the first time-based station if nothing matches (shouldn't happen
 * since the 6 time-based stations should cover a full 24h cycle).
 */
export function getCurrentStation(date: Date = new Date()): Playlist {
  const istHour = getISTHour(date);
  const timeBased = playlists.filter((p) => p.isTimeBased);

  for (const p of timeBased) {
    if (!p.timeStart || !p.timeEnd) continue;
    const start = parseInt(p.timeStart.split(":")[0], 10);
    const end = parseInt(p.timeEnd.split(":")[0], 10);
    if (start < end) {
      if (istHour >= start && istHour < end) return p;
    } else {
      // wraps past midnight (e.g. highway-raat: 00:00-05:00 is fine, but
      // handle any 22:00-05:00 style windows too)
      if (istHour >= start || istHour < end) return p;
    }
  }
  return timeBased[0];
}

function getISTHour(date: Date): number {
  // IST = UTC+5:30
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const istMs = utcMs + 5.5 * 60 * 60000;
  return new Date(istMs).getHours();
}

export function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
