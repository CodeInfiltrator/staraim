import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://staraim.app"),
  title: {
    default: "Staraim — Know what's above.",
    template: "%s · Staraim",
  },
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  description:
    "Points your Apple Watch at the sky and Staraim names the object. A live sky map, a real star catalogue and a watch app that uses the IMU to read the heavens.",
  keywords: [
    "astronomy app",
    "Apple Watch",
    "sky map",
    "star identification",
    "IMU",
    "point and identify",
    "constellations",
    "Star Walk alternative",
  ],
  openGraph: {
    title: "Staraim — Know what's above.",
    description:
      "Point at the sky. The Watch reveals only what matters.",
    type: "website",
    siteName: "Staraim",
  },
  twitter: {
    card: "summary_large_image",
    title: "Staraim — Know what's above.",
    description: "Point at the sky. The Watch reveals only what matters.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-void text-mist antialiased">{children}</body>
    </html>
  );
}
