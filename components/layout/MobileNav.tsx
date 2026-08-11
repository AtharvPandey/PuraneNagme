"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Radio", icon: RadioIcon },
  { href: "/stations", label: "Stations", icon: StationsIcon },
  { href: "/songs", label: "Songs", icon: SongsIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-[68px] z-30 border-t border-border-hairline bg-bg-surface/95 backdrop-blur-md sm:hidden"
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-around">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                active ? "text-amber" : "text-text-muted"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon active={active} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function RadioIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <path d="M13 12h5M13 16h3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
      <path d="M7 8L9 4h6l2 4" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
    </svg>
  );
}
function StationsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
    </svg>
  );
}
function SongsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18V5l11-2v13" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
    </svg>
  );
}
