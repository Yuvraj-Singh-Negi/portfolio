"use client";

import { TextReveal } from "@/components/ui/TextReveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${className}`}>
      <TextReveal as="h2" className="text-section mb-4 text-zinc-100">
        {title}
      </TextReveal>
      {subtitle && (
        <TextReveal
          as="p"
          className="max-w-md text-body text-zinc-500"
          delay={0.1}
        >
          {subtitle}
        </TextReveal>
      )}
    </div>
  );
}
