# पुराने नग़मे — Purane Nagme

An always-on radio playing evergreen Hindi film songs, tuned to the hour.
Built with Next.js 14, TypeScript, Tailwind CSS v4, and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The player streams through YouTube's IFrame
API, so you need an internet connection for playback to actually work
(the UI renders fine offline, but songs won't play).

## What's implemented (Phase 1)

- Full player engine (`context/PlayerContext.tsx`) — queue, play/pause,
  shuffle, repeat, volume — wired to a hidden YouTube IFrame player
  (`hooks/useYouTubePlayer.ts`)
- Radio hero with a spinning vinyl visualization, LCD-style now-playing
  display, and a station dial (`components/player/RadioHero.tsx`)
- Persistent bottom player bar that survives page navigation
- Auto-selects the time-appropriate station based on IST hour
  (`lib/songs.ts` → `getCurrentStation`)
- `/songs` — searchable, filterable (by decade + singer) song browser
- `/stations` and `/stations/[slug]` — all 8 rotations, statically generated
- SEO: sitemap.xml, robots.txt, Open Graph image, full metadata
- PWA: manifest.json + icon set (installable on mobile home screens)
- 10 real, verified songs seeded (see "Scaling the catalogue" below)

## Project structure

```
app/                  Routes (App Router)
components/
  player/              RadioHero, BottomPlayer
  songs/               SongBrowser, SongRow
  stations/            StationCard
  layout/              Navbar, MobileNav, AmbientBackground
context/PlayerContext.tsx   Global player state
hooks/                 useYouTubePlayer, useCurrentStation
lib/
  types.ts             Shared TypeScript types
  songs.ts             Data access layer — THE swap point for Supabase later
  utils.ts             cn(), youtubeThumbnail()
data/
  songs.json           Song catalogue (seed: 10 songs)
  playlists.json       8 stations/rotations
```

## IMPORTANT — about the song data

I seeded `data/songs.json` with **27 real songs with verified YouTube video
IDs**, spanning 1949-2003 across 18 different singers (Lata Mangeshkar,
Mohammed Rafi, Kishore Kumar, Mukesh, Asha Bhosle, Kumar Sanu, Udit Narayan,
Alka Yagnik, Sonu Nigam, K.K., and more). Every station now carries 4-5
real songs instead of 2-4.

I did **not** fabricate YouTube IDs for the remaining ~270 songs you want —
a wrong or made-up video ID is worse than no song at all, since it breaks
playback silently. Scaling the catalogue further is a content task, and
there are two ways to do it:

**Option A - I do it with you, in batches.** Give me a list of song
titles (or let me pick), and I'll search and verify real YouTube IDs in
groups of ~10-15 per message, the same way I built this seed set.

**Option B - you supply a spreadsheet.** Fill in a CSV with columns
`titleHi, titleEn, film, singers, musicDirector, lyricist, year,
youtubeId, moods` - one row per song - and I'll write a script that
converts it straight into `songs.json` (or seeds Supabase directly, once
that's wired up).

Either way, the app itself needs zero code changes to support more
songs - `data/songs.json` is the only file that grows.

## Moving to Supabase (Phase 7+ from the roadmap)

`lib/songs.ts` is deliberately the *only* file that touches the data
source. Every component calls `getAllSongs()`, `getSongsForPlaylist()`,
etc. - none of them know or care whether that data comes from a JSON
file or a database. When you're ready:

1. Create a Supabase project, run the schema from the original plan
   document (`songs`, `playlists`, `playlist_songs` tables)
2. Rewrite the function bodies in `lib/songs.ts` to query Supabase
   instead of reading the JSON files
3. Nothing else in the app changes

## Deploying

1. Push this repo to GitHub
2. Import it in Vercel (vercel.com/new)
3. Add your domain `purannenagme.online` under Project -> Domains
4. Point your domain's nameservers/DNS records at Vercel (they'll show
   you the exact records to add)
5. Done - SSL is automatic, and every push to `main` redeploys

## Notes on the build environment

While building this, Google Fonts fetches failed intermittently in the
sandboxed dev environment used to build it (no issue on Vercel - it has
full internet access). If you ever see a `next/font` error while
developing locally behind a restrictive proxy, that's why.

## What's next (not yet built)

- User accounts, favorites, play history (needs Supabase + Auth)
- Live listener count
- Google AdSense / Razorpay premium tier
- Admin panel for adding songs without editing JSON by hand
- Expanding past 10 seed songs to the full 300
