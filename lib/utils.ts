import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function youtubeThumbnail(youtubeId: string, quality: "default" | "hq" | "mq" = "hq") {
  const map = { default: "default", hq: "hqdefault", mq: "mqdefault" };
  return `https://i.ytimg.com/vi/${youtubeId}/${map[quality]}.jpg`;
}
