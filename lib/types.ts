export interface Song {
  id: number;
  titleHi: string;
  titleEn: string;
  film: string;
  singers: string[];
  musicDirector?: string;
  lyricist?: string;
  year: number;
  youtubeId: string;
  durationSeconds?: number;
  moods: Mood[];
}

export type Mood =
  | "romantic"
  | "melancholic"
  | "upbeat"
  | "ghazal"
  | "wedding"
  | "patriotic"
  | "nightdrive";

export interface Playlist {
  id: number;
  slug: string;
  nameHi: string;
  nameEn: string;
  description: string;
  timeStart: string | null; // "18:00" IST, null if not time-based
  timeEnd: string | null;
  isTimeBased: boolean;
  gradientFrom: string;
  gradientTo: string;
  songIds: number[];
}

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number; // seconds
  duration: number; // seconds
  volume: number; // 0-100
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  activeStationSlug: string | null;
}

export type Decade = "1950s" | "1960s" | "1970s" | "1980s" | "1990s" | "2000s";
