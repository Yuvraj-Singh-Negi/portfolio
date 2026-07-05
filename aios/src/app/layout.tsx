import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono } from "@/lib/utils/fonts";
import { Providers } from "@/lib/utils/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "AIOS – AI Engineering Operating System",
    template: "%s – AIOS",
  },
  description:
    "An intelligent operating system for engineers combining learning, project management, AI mentoring, and knowledge management.",
  metadataBase: new URL("https://aios.dev"),
  keywords: [
    "AI",
    "engineering",
    "learning",
    "project management",
    "knowledge graph",
    "developer tools",
  ],
  authors: [{ name: "AIOS" }],
  creator: "AIOS",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AIOS",
    title: "AIOS – AI Engineering Operating System",
    description:
      "An intelligent operating system for engineers combining learning, project management, AI mentoring, and knowledge management.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIOS – AI Engineering Operating System",
    description: "An intelligent operating system for engineers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} h-screen overflow-hidden bg-background font-sans text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
