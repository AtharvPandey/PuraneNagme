"use client";

import { useEffect, useState } from "react";
import { getCurrentStation } from "@/lib/songs";
import type { Playlist } from "@/lib/types";

export function useCurrentStation(): Playlist {
  const [station, setStation] = useState<Playlist>(() => getCurrentStation());

  useEffect(() => {
    const interval = setInterval(() => {
      setStation(getCurrentStation());
    }, 60_000); // re-check every minute
    return () => clearInterval(interval);
  }, []);

  return station;
}
