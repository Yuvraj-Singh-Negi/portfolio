"use client";

import { motion } from "framer-motion";
import { education, academicHighlight, timeline } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, easeOutExpo } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface TimelineEntry {
  date: string;
  title: string;
  subtitle: string;
  description: string;
}

const entries: TimelineEntry[] = [
  {
    date: education.year,
    title: education.school,
    subtitle: education.qualification,
    description: education.location,
  },
  {
    date: "2025",
    title: academicHighlight.title,
    subtitle: academicHighlight.category,
    description: academicHighlight.description,
  },
  ...timeline
    .filter((t) => t.type === "journey")
    .map((t) => ({
      date: t.date,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
    })),
];

function TimelineLine({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="absolute left-[11px] top-0 bottom-0 w-px overflow-hidden">
      <motion.div
        className="h-full w-full bg-white/[0.06]"
        initial={{ scaleY: 0, originY: 0 }}
        animate={isVisible ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      />
    </div>
  );
}

function TimelineDot({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute left-0 top-1"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: easeOutExpo }}
    >
      <div className="h-[23px] w-[23px] rounded-full border-2 border-white/[0.12] bg-[#050505] flex items-center justify-center">
        <div className="h-[7px] w-[7px] rounded-full bg-white/[0.15]" />
      </div>
    </motion.div>
  );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className="relative pl-12 pb-16 last:pb-0"
      variants={fadeUp}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ ...easeOutExpo, delay: index * 0.15 }}
    >
      <TimelineDot delay={index * 0.15} />

      <div className="space-y-2">
        <span className="block text-tiny tracking-[0.12em] text-zinc-600 uppercase">
          {entry.date}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
          {entry.title}
        </h3>
        <p className="text-small text-zinc-500">{entry.subtitle}</p>
        <p className="text-small leading-relaxed text-zinc-500 max-w-lg">
          {entry.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Experience() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="experience" className="py-32" aria-label="Experience and education">
      <Container>
        <SectionHeading
          title="Experience"
          subtitle="Education, academic work, and self-driven development."
        />
      </Container>

      <Container>
        <motion.div
          ref={ref}
          className="relative mx-auto max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <TimelineLine isVisible={isVisible} />
          {entries.map((entry, index) => (
            <TimelineCard key={entry.title} entry={entry} index={index} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
