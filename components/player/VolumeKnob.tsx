"use client";

import { cn } from "@/lib/utils";

interface VolumeKnobProps {
  value: number;
  muted?: boolean;
  onChange: (value: number) => void;
  onToggleMute?: () => void;
  className?: string;
}

/**
 * A range slider dressed up as a radio knob — filled track shows the
 * current level, a round "cap" sits at the thumb position. Deliberately
 * simple (a styled <input type="range">, not a real rotary drag control);
 * the plan notes a full rotary interaction is a later polish pass.
 */
export function VolumeKnob({ value, muted, onChange, onToggleMute, className }: VolumeKnobProps) {
  const level = muted ? 0 : value;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white"
        >
          {muted || value === 0 ? <MuteIcon /> : <VolumeIcon />}
        </button>
      )}
      <div className="relative flex h-5 w-20 items-center">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber to-terracotta transition-[width]"
            style={{ width: `${level}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={level}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Volume"
          className="pnn-volume-knob absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full border border-white/30 bg-gradient-to-br from-amber to-terracotta shadow"
          style={{ left: `${level}%` }}
        />
      </div>
    </div>
  );
}

function VolumeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M17.5 8.5a5 5 0 010 7" strokeLinecap="round" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
    </svg>
  );
}
