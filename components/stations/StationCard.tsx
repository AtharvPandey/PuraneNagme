"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Playlist } from "@/lib/types";

export function StationCard({ station, songCount }: { station: Playlist; songCount: number }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link
        href={`/stations/${station.slug}`}
        className="group block overflow-hidden rounded-2xl border border-border-hairline bg-bg-surface transition-colors hover:border-border-strong"
      >
        <div
          className="relative flex h-28 items-end p-4"
          style={{
            background: `linear-gradient(135deg, ${station.gradientFrom}, ${station.gradientTo})`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, transparent 0px, transparent 18px, rgba(0,0,0,0.08) 18px, rgba(0,0,0,0.08) 19px)",
            }}
          />
          {station.isTimeBased && station.timeStart && (
            <span className="absolute right-3 top-3 rounded-full bg-black/25 px-2.5 py-1 font-mono text-[10px] text-white/90 backdrop-blur-sm">
              {station.timeStart}–{station.timeEnd} IST
            </span>
          )}
          <p className="relative font-display-hindi text-2xl text-white drop-shadow-sm">
            {station.nameHi}
          </p>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-text-primary">{station.nameEn}</p>
          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{station.description}</p>
          <p className="mt-2 text-[11px] text-text-muted">{songCount} songs</p>
        </div>
      </Link>
    </motion.div>
  );
}
