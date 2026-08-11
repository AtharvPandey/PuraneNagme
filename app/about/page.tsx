import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Purane Nagme, and how the music here is licensed.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6">
      <h1 className="font-display-hindi text-3xl text-text-primary sm:text-4xl">परिचय</h1>
      <p className="mt-1 text-sm text-text-secondary">About Purane Nagme</p>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-text-secondary">
        <p>
          Every household had one — a transistor radio on a shelf, tuned to
          Vividh Bharati, playing the same songs everyone still hums today.
          Purane Nagme is that radio, rebuilt for a phone screen. Tune in and
          it plays the rotation for whatever hour it is in India.
        </p>
        <p>
          The catalogue runs from Lata Mangeshkar and Kishore Kumar in the
          1960s through the cassette-era stars of the 90s — Kumar Sanu, Udit
          Narayan, Alka Yagnik — and keeps growing.
        </p>

        <h2 className="pt-4 text-base font-medium text-text-primary">
          How the music works
        </h2>
        <p>
          Every song plays through YouTube&rsquo;s own embedded player.
          Nothing is hosted on this site — no audio files, no downloads.
          Artists, composers and labels are credited the same as any other
          YouTube view. Song credits are compiled from film soundtrack
          listings and may occasionally be incomplete.
        </p>
        <p>
          If you hold rights to anything featured here and would like it
          removed, write to{" "}
          <a href="mailto:hello@purannenagme.online" className="text-amber hover:underline">
            hello@purannenagme.online
          </a>{" "}
          and it comes down.
        </p>
      </div>
    </div>
  );
}
