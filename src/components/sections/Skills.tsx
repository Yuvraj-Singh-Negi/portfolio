"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useIsClient } from "@/hooks/useIsClient";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: typeof skills;
  reverse?: boolean;
}) {
  return (
    <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]">
      <div
        className={`flex shrink-0 gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        aria-hidden="true"
      >
        {[...items, ...items, ...items].map((skill, i) => (
          <span
            key={`${skill.name}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-small text-zinc-500 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-zinc-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] cursor-default select-none"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const isClient = useIsClient();
  const { ref, isVisible } = useScrollAnimation();
  const mid = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, mid);
  const row2 = skills.slice(mid);

  return (
    <section id="skills" className="py-32" aria-label="Technologies and tools">
      <Container>
        <SectionHeading
          title="Technologies"
          subtitle="Tools and frameworks I use to build production-grade applications."
        />
      </Container>

      <div ref={ref}>
        {isClient ? (
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <MarqueeRow items={row1} />
            <MarqueeRow items={row2} reverse />
          </motion.div>
        ) : (
          <div className="space-y-3">
            <MarqueeRow items={row1} />
            <MarqueeRow items={row2} reverse />
          </div>
        )}
      </div>
    </section>
  );
}
