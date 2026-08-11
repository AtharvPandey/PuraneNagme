import type { Metadata } from "next";
import { StationCard } from "@/components/stations/StationCard";
import { getAllPlaylists, getSongsForPlaylist } from "@/lib/songs";

export const metadata: Metadata = {
  title: "Stations",
  description: "Eight rotations, each tuned to a mood or a time of day.",
};

export default function StationsPage() {
  const stations = getAllPlaylists();
  const timeBased = stations.filter((s) => s.isTimeBased);
  const moodBased = stations.filter((s) => !s.isTimeBased);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="font-display-hindi text-3xl text-text-primary sm:text-4xl">स्टेशन</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Six rotations follow the clock in India. Two more play by mood, any time.
      </p>

      <h2 className="mb-4 mt-10 text-sm font-medium uppercase tracking-wide text-text-muted">
        Time-based rotations
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {timeBased.map((station) => (
          <StationCard
            key={station.slug}
            station={station}
            songCount={getSongsForPlaylist(station.slug).length}
          />
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-sm font-medium uppercase tracking-wide text-text-muted">
        Mood stations
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moodBased.map((station) => (
          <StationCard
            key={station.slug}
            station={station}
            songCount={getSongsForPlaylist(station.slug).length}
          />
        ))}
      </div>
    </div>
  );
}
