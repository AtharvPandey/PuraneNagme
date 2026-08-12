export function BackgroundGlow() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-bg-base"
    >
      {/* Base radial warmth from center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,168,56,0.10), transparent 60%)",
        }}
      />
      {/* Floating amber glow — top left */}
      <div
        className="absolute rounded-full blur-[100px] animate-ember-drift-1"
        style={{
          width: 420,
          height: 420,
          top: "-10%",
          left: "-10%",
          background: "rgba(232,168,56,0.14)",
        }}
      />
      {/* Floating terracotta glow — bottom right */}
      <div
        className="absolute rounded-full blur-[110px] animate-ember-drift-2"
        style={{
          width: 480,
          height: 480,
          bottom: "-15%",
          right: "-10%",
          background: "rgba(199,91,57,0.12)",
        }}
      />
      {/* Center subtle glow */}
      <div
        className="absolute rounded-full blur-[130px] animate-ember-pulse"
        style={{
          width: 600,
          height: 400,
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(232,168,56,0.06)",
        }}
      />
      {/* Vignette to keep edges dark and content readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(18,11,8,0.6) 100%)",
        }}
      />
      {/* Floating dust motes */}
      <div className="absolute inset-0">
        {DUST_POSITIONS.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber animate-dust-float"
            style={{
              width: d.size,
              height: d.size,
              left: `${d.x}%`,
              top: `${d.y}%`,
              opacity: d.opacity,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const DUST_POSITIONS = [
  { x: 10, y: 20, size: 3, opacity: 0.3, delay: 0, duration: 9 },
  { x: 25, y: 60, size: 2, opacity: 0.2, delay: 1.5, duration: 11 },
  { x: 40, y: 15, size: 2.5, opacity: 0.25, delay: 3, duration: 8 },
  { x: 60, y: 70, size: 3, opacity: 0.3, delay: 0.5, duration: 10 },
  { x: 75, y: 30, size: 2, opacity: 0.2, delay: 2, duration: 12 },
  { x: 85, y: 55, size: 2.5, opacity: 0.25, delay: 4, duration: 9 },
  { x: 15, y: 80, size: 2, opacity: 0.2, delay: 2.5, duration: 10 },
  { x: 50, y: 45, size: 3, opacity: 0.28, delay: 1, duration: 11 },
];
