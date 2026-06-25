"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/ui/TextReveal";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof skills;
  reverse?: boolean;
}) {
  return (
    <div className="relative flex overflow-hidden">
      <motion.div
        className={`flex shrink-0 gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        aria-hidden="true"
      >
        {[...items, ...items].map((skill, i) => (
          <span
            key={`${skill.name}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-zinc-800/50 bg-zinc-900/30 px-4 py-2 text-sm text-zinc-400 backdrop-blur-sm transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            {skill.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Skills() {
  const { ref, isVisible } = useScrollAnimation();
  const mid = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, mid);
  const row2 = skills.slice(mid);

  return (
    <section id="skills" className="py-32" aria-label="Skills">
      <Container>
        <TextReveal
          as="h2"
          className="text-section mb-4 text-zinc-100"
          delay={0.1}
        >
          Technologies
        </TextReveal>
        <TextReveal
          as="p"
          className="mb-16 max-w-md text-zinc-500"
          delay={0.2}
        >
          Tools and technologies I work with daily to build production-grade applications.
        </TextReveal>
      </Container>

      <div ref={ref} className="space-y-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} transition={defaultTransition}>
            <MarqueeRow items={row1} />
          </motion.div>
          <motion.div variants={fadeUp} transition={defaultTransition} className="mt-4">
            <MarqueeRow items={row2} reverse />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
