import type { Metadata } from "next";
import { siteConfig } from "@/data/portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Yuvraj Singh Negi",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "Yuvraj Singh Negi", url: siteConfig.url }],
  creator: "Yuvraj Singh Negi",
  publisher: "Yuvraj Singh Negi",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: "Yuvraj Singh Negi",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Yuvraj Singh Negi — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@yuvraj001q",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
