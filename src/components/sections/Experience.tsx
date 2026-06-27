"use client";

import { education, academicHighlight, timeline } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const delay = Math.min((index + 1) * 2, 5);
  const ref = useScrollReveal({ delay });

  return (
    <div ref={ref} className={`reveal reveal-delay-${delay} relative pl-10 sm:pl-12 pb-10 md:pb-16 last:pb-0`}>
      <div className="absolute left-0 top-1">
        <div className="h-5 w-5 sm:h-[23px] sm:w-[23px] rounded-full border-2 border-white/[0.12] bg-[#050505] flex items-center justify-center">
          <div className="h-[5px] w-[5px] sm:h-[7px] sm:w-[7px] rounded-full bg-white/[0.15]" />
        </div>
      </div>
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
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-20 md:py-32" aria-label="Experience and education">
      <Container>
        <SectionHeading
          title="Experience"
          subtitle="Education, academic work, and self-driven development."
        />
      </Container>

      <Container>
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/[0.06]" />
          {entries.map((entry, index) => (
            <TimelineCard key={entry.title} entry={entry} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
