"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio";
import { fadeUp, staggerContainer, defaultTransition, slowTransition } from "@/lib/animations";
import { AnimatedOrbs } from "@/components/sections/AnimatedOrbs";

export function Hero() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden" aria-label="Hero">
      <AnimatedOrbs />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col gap-8 pt-24">
            <motion.div variants={fadeUp} transition={defaultTransition}>
              <p className="mb-2 text-sm font-medium tracking-widest text-zinc-500 uppercase">
                {personalInfo.location}
              </p>
              <h1 className="text-hero text-zinc-100">
                {personalInfo.name.split(" ")[0]}
                <br />
                {personalInfo.name.split(" ").slice(1).join(" ")}
              </h1>
            </motion.div>

            <motion.p
              className="max-w-md text-lg leading-relaxed text-zinc-400"
              variants={fadeUp}
              transition={{ ...defaultTransition, delay: 0.15 }}
            >
              Full-Stack Developer focused on frontend engineering, product design, and building production-grade web experiences with modern technologies.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeUp}
              transition={{ ...defaultTransition, delay: 0.3 }}
            >
              <a
                href="#projects"
                onClick={(e) => handleScroll(e, "#projects")}
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-200"
              >
                View Projects
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-800 px-6 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                Contact Me
              </a>
            </motion.div>
          </div>

          <motion.div
            className="hidden justify-end lg:flex"
            variants={fadeUp}
            transition={{ ...slowTransition, delay: 0.4 }}
          >
            <div className="relative h-80 w-80">
              <div className="absolute inset-0 rounded-full border border-zinc-800/50" />
              <div className="absolute inset-4 rounded-full border border-zinc-800/30" />
              <div className="absolute inset-8 rounded-full border border-zinc-800/20" />
              <div className="absolute inset-12 rounded-full border border-zinc-800/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold tracking-tighter text-zinc-800">
                  YS
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
