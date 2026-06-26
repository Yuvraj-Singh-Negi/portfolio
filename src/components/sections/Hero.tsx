"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { AnimatedOrbs } from "@/components/sections/AnimatedOrbs";
import {
  fadeUp,
  fadeIn,
  scaleIn,
  staggerSlow,
  easeOutExpo,
  slow,
} from "@/lib/animations";

function SplitText({
  text,
  delay = 0,
  className = "",
  as: Tag = "h1",
}: {
  text: string;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              ...easeOutExpo,
              delay: delay + i * 0.08,
            }}
            custom={i}
          >
            {word}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative flex min-h-dvh items-center overflow-hidden"
      aria-label="Hero introduction"
    >
      <AnimatedOrbs />

      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid min-h-dvh items-center gap-12 pt-24 pb-16 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            className="flex flex-col gap-6"
            variants={staggerSlow}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              className="text-tiny tracking-[0.15em] text-zinc-600 uppercase"
              variants={fadeIn}
              transition={{ ...easeOutExpo, delay: 0.1 }}
            >
              {personalInfo.location}
            </motion.p>

            <SplitText
              text={personalInfo.name}
              delay={0.3}
              className="text-hero text-zinc-100"
              as="h1"
            />

            <motion.p
              className="text-subtitle text-gradient-white max-w-lg"
              variants={fadeIn}
              transition={{ ...easeOutExpo, delay: 0.7 }}
            >
              {personalInfo.title}
            </motion.p>

            <motion.p
              className="max-w-md text-body text-zinc-500 leading-relaxed"
              variants={fadeUp}
              transition={{ ...easeOutExpo, delay: 0.9 }}
            >
              Frontend-focused developer building production-grade web experiences.
              I architect interfaces that balance performance, accessibility, and
              visual clarity.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              variants={fadeUp}
              transition={{ ...easeOutExpo, delay: 1.1 }}
            >
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
            </motion.div>
          </motion.div>

          {/* Visual — profile image with ring */}
          <motion.div
            className="hidden items-center justify-center lg:flex"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ ...slow, delay: 0.6 }}
          >
            <div className="relative flex h-[420px] w-[420px] items-center justify-center">
              <div className="absolute h-[360px] w-[360px] rounded-full border border-white/[0.06]" />
              <div className="absolute h-[280px] w-[280px] rounded-full border border-white/[0.04]" />
              <motion.div
                className="absolute h-[200px] w-[200px] overflow-hidden rounded-full border border-white/[0.08]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...easeOutExpo, delay: 1, duration: 1 }}
              >
                <img
                  src="/profile.png"
                  alt={personalInfo.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-zinc-700" />
        </motion.div>
      </motion.div>
    </section>
  );
}
