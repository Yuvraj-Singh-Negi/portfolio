"use client";

import { motion } from "framer-motion";
import { timeline, education, academicHighlight } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/ui/TextReveal";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function TimelineDot() {
  return (
    <div className="absolute -left-[9px] top-1 h-[18px] w-[18px] rounded-full border-2 border-zinc-700 bg-[#050505]" />
  );
}

function TimelineItem({
  title,
  subtitle,
  date,
  description,
  isLast,
}: {
  title: string;
  subtitle: string;
  date: string;
  description: string;
  isLast?: boolean;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className="relative pl-10"
      variants={fadeUp}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={defaultTransition}
    >
      {!isLast && (
        <div className="absolute left-[3px] top-4 bottom-0 w-px bg-zinc-800" />
      )}
      <TimelineDot />
      <span className="mb-1 block text-xs tracking-widest text-zinc-600 uppercase">
        {date}
      </span>
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      <p className="mb-2 text-sm text-zinc-500">{subtitle}</p>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </motion.div>
  );
}

export function Experience() {
  const { ref, isVisible } = useScrollAnimation();

  const allItems = [
    {
      title: education.school,
      subtitle: education.qualification,
      date: education.year,
      description: `${education.location}. ${education.qualification} program with focus on Science stream.`,
    },
    {
      title: academicHighlight.title,
      subtitle: academicHighlight.description.split(".")[0] ?? "",
      date: "2025",
      description: academicHighlight.description,
    },
    ...timeline
      .filter((t) => t.type === "journey")
      .map((t) => ({
        title: t.title,
        subtitle: t.subtitle,
        date: t.date,
        description: t.description,
      })),
  ];

  return (
    <section id="experience" className="py-32" aria-label="Experience">
      <Container>
        <TextReveal
          as="h2"
          className="text-section mb-4 text-zinc-100"
          delay={0.1}
        >
          Experience
        </TextReveal>
        <TextReveal
          as="p"
          className="mb-16 max-w-md text-zinc-500"
          delay={0.2}
        >
          Education, academic work, and self-driven development.
        </TextReveal>
      </Container>

      <Container>
        <motion.div
          ref={ref}
          className="mx-auto max-w-2xl space-y-12"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {allItems.map((item, index) => (
            <TimelineItem
              key={item.title}
              {...item}
              isLast={index === allItems.length - 1}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
