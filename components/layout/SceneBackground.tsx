"use client";

import { cn } from "@/lib/utils";

interface SceneBackgroundProps {
  accentFrom: string;
  accentTo: string;
  className?: string;
  paused?: boolean;
}

/**
 * A full-bleed illustrated scene — dusk skyline, a glowing shopfront, a
 * swaying tree, birds drifting past, and floating light. Built entirely in
 * SVG/CSS (no raster assets) so it ships instantly and themes per station.
 * Designed as a drop-in replacement point: swap the <svg> body for a real
 * illustrated/AI-generated background image later without touching the
 * layout code around it.
 */
export function SceneBackground({ accentFrom, accentTo, className, paused }: SceneBackgroundProps) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={paused ? ({ ["--scene-play-state" as string]: "paused" } as React.CSSProperties) : undefined}
      aria-hidden
    >
      <div className={cn("scene-kenburns absolute inset-0", paused && "scene-paused")}>
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A0F0A" />
              <stop offset="45%" stopColor="#2B1E16" />
              <stop offset="100%" stopColor={accentTo} stopOpacity="0.35" />
            </linearGradient>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentFrom} stopOpacity="0.9" />
              <stop offset="100%" stopColor={accentFrom} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sign-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentFrom} stopOpacity="0.9" />
              <stop offset="100%" stopColor={accentTo} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="1600" height="900" fill="url(#sky)" />

          {/* Sun / moon glow low on horizon */}
          <circle cx="1180" cy="480" r="140" fill="url(#sun-glow)" opacity="0.5" />

          {/* Distant skyline silhouette */}
          <g fill="#120B08" opacity="0.55">
            <rect x="0" y="520" width="90" height="180" />
            <rect x="95" y="480" width="60" height="220" />
            <path d="M160 560 h70 v140 h-70 z M175 560 a20 20 0 0 1 40 0 z" />
            <rect x="250" y="500" width="50" height="200" />
            <rect x="310" y="540" width="110" height="160" />
            <rect x="1300" y="500" width="70" height="200" />
            <path d="M1380 580 h60 v120 h-60 z M1392 580 a18 18 0 0 1 36 0 z" />
            <rect x="1450" y="460" width="80" height="240" />
            <rect x="1540" y="520" width="60" height="180" />
          </g>

          {/* Birds */}
          <g className="scene-birds" opacity="0.5" stroke="#F5EDE4" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M300 220 q10 -12 20 0 q10 -12 20 0" />
            <path d="M360 260 q8 -10 16 0 q8 -10 16 0" />
            <path d="M420 210 q9 -11 18 0 q9 -11 18 0" />
          </g>
          <g className="scene-birds-2" opacity="0.35" stroke="#F5EDE4" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M900 180 q8 -10 16 0 q8 -10 16 0" />
            <path d="M950 210 q7 -9 14 0 q7 -9 14 0" />
          </g>

          {/* Foreground shop silhouette, center-right */}
          <g transform="translate(880,540)">
            {/* Shop body */}
            <rect x="0" y="0" width="420" height="280" fill="#120B08" />
            {/* Roof / awning */}
            <path d="M-30 0 L450 0 L420 -40 L0 -40 Z" fill="#0D0704" />
            {/* Doorway glow */}
            <rect x="150" y="60" width="140" height="220" rx="6" fill="url(#sign-glow)" opacity="0.22" />
            <rect x="150" y="60" width="140" height="220" rx="6" fill="none" stroke={accentFrom} strokeOpacity="0.3" strokeWidth="2" />
            {/* Sign board */}
            <rect x="40" y="-38" width="220" height="34" rx="4" fill="url(#sign-glow)" className="scene-sign-glow" />
            {/* Hanging bulbs */}
            <g className="scene-bulbs">
              {Array.from({ length: 9 }).map((_, i) => (
                <circle key={i} cx={20 + i * 47} cy={8} r="4" fill={accentFrom} />
              ))}
            </g>
          </g>

          {/* Tree silhouette, left */}
          <g className="scene-tree" transform="translate(120,900)" fill="#120B08">
            <rect x="-10" y="-260" width="20" height="260" />
            <ellipse cx="0" cy="-300" rx="110" ry="80" />
            <ellipse cx="-70" cy="-260" rx="60" ry="45" />
            <ellipse cx="75" cy="-270" rx="65" ry="48" />
          </g>

          {/* Ground */}
          <rect x="0" y="820" width="1600" height="80" fill="#0D0704" />

          {/* Vignette for text legibility */}
          <rect width="1600" height="900" fill="url(#vignette)" />
          <defs>
            <radialGradient id="vignette" cx="30%" cy="75%" r="75%">
              <stop offset="0%" stopColor="#120B08" stopOpacity="0" />
              <stop offset="60%" stopColor="#120B08" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#120B08" stopOpacity="0.75" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Floating dust / light motes */}
      <div className="absolute inset-0">
        {DUST.map((d, i) => (
          <span
            key={i}
            className="scene-dust absolute rounded-full"
            style={{
              width: d.size,
              height: d.size,
              left: `${d.x}%`,
              top: `${d.y}%`,
              background: accentFrom,
              opacity: d.opacity,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom scrim so overlaid text always reads clearly regardless of scene colors */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent" />
    </div>
  );
}

const DUST = [
  { x: 15, y: 30, size: 3, opacity: 0.35, delay: 0, duration: 10 },
  { x: 35, y: 55, size: 2, opacity: 0.25, delay: 1.5, duration: 12 },
  { x: 55, y: 25, size: 2.5, opacity: 0.3, delay: 3, duration: 9 },
  { x: 70, y: 60, size: 2, opacity: 0.22, delay: 2, duration: 13 },
  { x: 85, y: 35, size: 3, opacity: 0.3, delay: 4, duration: 11 },
  { x: 25, y: 70, size: 2, opacity: 0.2, delay: 2.5, duration: 10 },
];
