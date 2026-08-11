import type { Metadata } from "next";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { BottomPlayer } from "@/components/player/BottomPlayer";

export const metadata: Metadata = { title: "test", icons: { icon: "/favicon.ico" } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="grain flex min-h-full flex-col antialiased">
        <PlayerProvider>
          <AmbientBackground />
          <Navbar />
          <main className="flex-1 pb-32 sm:pb-24">{children}</main>
          <MobileNav />
          <BottomPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
