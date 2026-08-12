"use client";

import { cn } from "@/lib/utils";
import type { Playlist } from "@/lib/types";

interface TuningDialProps {
  stations: Playlist[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  className?: string;
}

/**
 * Horizontal scroll/swipe station switcher — the "dial" for tuning between
 * rotations. Film-poster tab styling: small caps, underline on the active
 * station. Works with touch swipe on mobile and click on desktop.
 */
export function TuningDial({ stations, activeSlug, onSelect, className }: TuningDialProps) {
  return (
    <nav
      aria-label="Stations"
      className={cn("flex gap-4 overflow-x-auto sm:gap-6", className)}
      style={{ scrollbarWidth: "none" }}
    >
      {stations.map((s) => (
        <button
          key={s.slug}
          onClick={() => onSelect(s.slug)}
          aria-current={activeSlug === s.slug ? "true" : undefined}
          className={cn(
            "flex-shrink-0 whitespace-nowrap border-b pb-1 text-[10px] uppercase tracking-[0.18em] transition-colors sm:text-[11px]",
            activeSlug === s.slug
              ? "border-amber text-amber"
              : "border-transparent text-white/55 hover:text-white/85"
          )}
        >
          {s.nameEn}
        </button>
      ))}
    </nav>
  );
}
