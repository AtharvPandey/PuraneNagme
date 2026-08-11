import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPlaylists, getPlaylistBySlug, getSongsForPlaylist } from "@/lib/songs";
import { StationDetailClient } from "./StationDetailClient";

export function generateStaticParams() {
  return getAllPlaylists().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const station = getPlaylistBySlug(slug);
  if (!station) return {};
  return {
    title: station.nameEn,
    description: station.description,
  };
}

export default async function StationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const station = getPlaylistBySlug(slug);
  if (!station) notFound();
  const songs = getSongsForPlaylist(slug);

  return <StationDetailClient station={station} songs={songs} />;
}
