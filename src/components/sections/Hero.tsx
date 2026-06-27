"use client";

import { personalInfo } from "@/data/portfolio";
import { AnimatedOrbs } from "@/components/sections/AnimatedOrbs";

export function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden" aria-label="Hero introduction">
      <AnimatedOrbs />

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex min-h-dvh flex-col items-center gap-8 pt-24 pb-16 lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <p className="animate-hero-location font-display text-tiny tracking-[0.15em] text-zinc-600 uppercase">
              {personalInfo.location}
            </p>

            <h1 className="animate-hero-heading font-display text-hero text-zinc-100 max-w-[6ch]">
              {personalInfo.name}
            </h1>

            <p className="animate-hero-title font-serif text-subtitle text-gradient-white max-w-lg">
              {personalInfo.title}
            </p>

            <p className="animate-hero-description max-w-md text-body text-zinc-500 leading-relaxed">
              Frontend-focused developer building production-grade web experiences.
              I architect interfaces that balance performance, accessibility, and
              visual clarity.
            </p>

            <div className="animate-hero-ctas flex flex-wrap gap-4 pt-2">
              <a
                href="#work"
                onClick={(e) => handleScroll(e, "#work")}
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-100 px-7 text-small font-medium text-zinc-900 transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]"
              >
                View Projects
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-7 text-small text-zinc-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="animate-hero-visual order-1 flex items-center justify-center lg:order-2">
            <div className="relative flex h-[200px] w-[200px] items-center justify-center sm:h-[280px] sm:w-[280px] lg:h-[520px] lg:w-[520px]">
              <div className="absolute h-[170px] w-[170px] rounded-full border border-white/[0.06] sm:h-[240px] sm:w-[240px] lg:h-[460px] lg:w-[460px]" />
              <div className="absolute h-[140px] w-[140px] rounded-full border border-white/[0.04] sm:h-[200px] sm:w-[200px] lg:h-[380px] lg:w-[380px]" />
              <div className="animate-hero-ring absolute h-[100px] w-[100px] overflow-hidden rounded-full border border-white/[0.08] sm:h-[150px] sm:w-[150px] lg:h-[300px] lg:w-[300px]" style={{ animationDelay: "1s" }}>
                <img
                  src="/profile.png"
                  alt={personalInfo.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
