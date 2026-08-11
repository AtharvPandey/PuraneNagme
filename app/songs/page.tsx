import type { Metadata } from "next";
import { SongBrowser } from "@/components/songs/SongBrowser";
import { getAllSongs } from "@/lib/songs";

export const metadata: Metadata = {
  title: "All songs",
  description: "Every song in the Purane Nagme library — search by title, singer, film, or decade.",
};

export default function SongsPage() {
  const total = getAllSongs().length;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
      <h1 className="font-display-hindi text-3xl text-text-primary sm:text-4xl">सारे गाने</h1>
      <p className="mt-2 text-sm text-text-secondary">
        {total} songs in the library, from the 1950s to the 2000s.
      </p>
      <div className="mt-8">
        <SongBrowser />
      </div>
    </div>
  );
}
