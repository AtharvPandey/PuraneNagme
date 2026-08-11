"use client";

import { useState } from "react";
import { getAllDecades, getAllSingers, filterSongs } from "@/lib/songs";
import { SongRow } from "./SongRow";
import { cn } from "@/lib/utils";
import type { Decade } from "@/lib/types";

export function SongBrowser() {
  const [query, setQuery] = useState("");
  const [decade, setDecade] = useState<Decade | undefined>();
  const [singer, setSinger] = useState<string | undefined>();

  const decades = getAllDecades();
  const singers = getAllSingers();

  const results = filterSongs({ query, decade, singer });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search by title, singer, or film…"
          className="w-full rounded-full border border-border-hairline bg-bg-surface py-3 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-border-strong"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill active={!decade} onClick={() => setDecade(undefined)}>
          All decades
        </FilterPill>
        {decades.map((d) => (
          <FilterPill key={d} active={decade === d} onClick={() => setDecade(d)}>
            {d}
          </FilterPill>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterPill active={!singer} onClick={() => setSinger(undefined)}>
          All singers
        </FilterPill>
        {singers.map((s) => (
          <FilterPill key={s} active={singer === s} onClick={() => setSinger(s)}>
            {s}
          </FilterPill>
        ))}
      </div>

      {/* Results */}
      <p className="mb-2 text-xs text-text-muted">{results.length} songs</p>
      <div className="space-y-0.5">
        {results.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} queue={results} />
        ))}
        {results.length === 0 && (
          <p className="py-12 text-center text-sm text-text-muted">
            No songs match your search.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active
          ? "border-amber bg-amber/15 text-amber"
          : "border-border-hairline text-text-secondary hover:border-border-strong hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
