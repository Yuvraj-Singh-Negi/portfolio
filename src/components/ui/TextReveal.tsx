"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TextRevealProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  delay?: number;
  className?: string;
}

export function TextReveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: TextRevealProps) {
  const ref = useScrollReveal({ delay });

  return (
    <Tag ref={ref} className={`reveal ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
