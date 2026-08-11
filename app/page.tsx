import { RadioHero } from "@/components/player/RadioHero";
import { StationCard } from "@/components/stations/StationCard";
import { getAllPlaylists, getSongsForPlaylist, getAllSongs } from "@/lib/songs";
import Link from "next/link";

export default function HomePage() {
  const stations = getAllPlaylists();
  const totalSongs = getAllSongs().length;

  return (
    <div>
      <RadioHero />

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display-hindi text-2xl text-text-primary sm:text-3xl">
              सारे स्टेशन
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {stations.length} rotations · {totalSongs} songs and growing
            </p>
          </div>
          <Link href="/stations" className="hidden text-sm text-amber hover:underline sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stations.map((station) => (
            <StationCard
              key={station.slug}
              station={station}
              songCount={getSongsForPlaylist(station.slug).length}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 pb-8 sm:px-6">
        <div className="rounded-2xl border border-border-hairline bg-bg-surface/60 p-6 text-center sm:p-10">
          <p className="font-display-hindi text-xl text-amber sm:text-2xl">
            300 गाने, हर मूड के लिए
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            Every song plays through YouTube&rsquo;s own player — nothing hosted here,
            every artist paid the same as any other view.
          </p>
          <Link
            href="/songs"
            className="mt-5 inline-block rounded-full border border-border-strong bg-amber/10 px-6 py-2.5 text-sm font-medium text-amber transition-colors hover:bg-amber/20"
          >
            Browse all songs
          </Link>
        </div>
      </section>
    </div>
  );
}
