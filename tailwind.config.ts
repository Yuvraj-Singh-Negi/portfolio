import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#050505",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        "display": ["clamp(2.5rem, 6vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "700" }],
        "hero": ["clamp(3rem, 8vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "700" }],
        "section": ["clamp(2rem, 4vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "subtitle": ["clamp(1.125rem, 1.5vw, 1.5rem)", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "small": ["0.875rem", { lineHeight: "1.5" }],
        "xs": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "tiny": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.06em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "50": "12.5rem",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "fade-in": "fadeIn 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "marquee": "marquee 40s linear infinite",
        "marquee-reverse": "marqueeReverse 40s linear infinite",
        "orb-1": "orb1 12s ease-in-out infinite",
        "orb-2": "orb2 15s ease-in-out infinite",
        "orb-3": "orb3 10s ease-in-out infinite",
        "cursor-blink": "cursorBlink 1s step-end infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        orb1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.9)" },
        },
        orb2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-50px, -30px) scale(1.05)" },
          "66%": { transform: "translate(30px, 50px) scale(0.95)" },
        },
        orb3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, 40px) scale(1.08)" },
          "66%": { transform: "translate(-40px, -20px) scale(0.92)" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
