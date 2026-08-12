import type { Metadata, Viewport } from "next";
import { Yatra_One, Noto_Sans_Devanagari, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";
import { BackgroundGlow } from "@/components/layout/BackgroundGlow";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { BottomPlayer } from "@/components/player/BottomPlayer";

const yatra = Yatra_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-yatra",
  display: "swap",
});
const notoHindi = Noto_Sans_Devanagari({
  weight: ["400", "500", "600"],
  subsets: ["devanagari"],
  variable: "--font-noto-hindi",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://purannenagme.online"),
  title: {
    default: "पुराने नग़मे — Purane Nagme | Old Bollywood Radio",
    template: "%s · पुराने नग़मे",
  },
  description:
    "An always-on radio playing 300+ evergreen Hindi film songs from the 1950s to the 2000s — Lata, Rafi, Kishore, Kumar Sanu and the golden era of Bollywood, tuned to the hour.",
  keywords: [
    "purane gaane",
    "old hindi songs",
    "old bollywood songs",
    "hindi radio",
    "purane nagme",
    "sadabahar geet",
  ],
  openGraph: {
    title: "पुराने नग़मे — Purane Nagme",
    description: "300+ evergreen Hindi film songs, playing round the clock.",
    url: "https://purannenagme.online",
    siteName: "Purane Nagme",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "पुराने नग़मे — Purane Nagme",
    description: "300+ evergreen Hindi film songs, playing round the clock.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Purane Nagme",
  },
};

export const viewport: Viewport = {
  themeColor: "#120B08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${yatra.variable} ${notoHindi.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="grain flex min-h-full flex-col antialiased">
        <PlayerProvider>
          <BackgroundGlow />
          <Navbar />
          <main className="flex-1 pb-32 sm:pb-24">{children}</main>
          <MobileNav />
          <BottomPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
