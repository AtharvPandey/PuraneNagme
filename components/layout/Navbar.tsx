import Link from "next/link";

const links = [
  { href: "/stations", label: "Stations", labelHi: "स्टेशन" },
  { href: "/songs", label: "Songs", labelHi: "गाने" },
  { href: "/about", label: "About", labelHi: "परिचय" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-hairline bg-bg-base/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <LogoMark />
          <div className="flex flex-col leading-none">
            <span className="font-display-hindi text-lg text-amber transition-colors group-hover:text-text-primary">
              पुराने नग़मे
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
              purane nagme
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-surface-2 hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="15" stroke="var(--amber)" strokeWidth="1.2" opacity="0.4" />
      <circle cx="16" cy="16" r="9" fill="var(--bg-elevated)" stroke="var(--amber)" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.5" fill="var(--amber)" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="var(--amber)" strokeWidth="0.5" opacity="0.5" strokeDasharray="1.5 3" />
    </svg>
  );
}
