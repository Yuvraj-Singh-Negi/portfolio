import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  connect-src 'self' https://*.neon.tech https://api.github.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`;

const nextConfig: NextConfig = {
  outputFileTracingRoot: undefined,

  httpAgentOptions: {
    keepAlive: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 3600,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: cspHeader.replace(/\s{2,}/g, " ").trim() },
      ],
    },
    {
      source: "/(.*)\\.(jpg|jpeg|png|svg|ico|webp|avif)$",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      source: "/(.*)\\.(js|css)$",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      source: "/_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
};

export default nextConfig;
