import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/layout/JsonLd";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yuvrajsinghnegi.dev"),
  title: "Yuvraj Singh Negi — Full-Stack Developer",
  description:
    "Full-Stack Developer specializing in frontend engineering and product design. Building modern web experiences with React, Next.js, and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${outfit.variable} ${playfair.variable} ${geistMono.variable} font-serif antialiased bg-[#050505] text-zinc-100`}
      >
        <SkipLink />
        <div className="noise-overlay fixed inset-0 z-[9999]" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
