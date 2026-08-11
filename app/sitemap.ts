import { MetadataRoute } from "next";
import { getAllPlaylists } from "@/lib/songs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://purannenagme.online";
  const stationRoutes = getAllPlaylists().map((p) => ({
    url: `${base}/stations/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/stations`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/songs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...stationRoutes,
  ];
}
