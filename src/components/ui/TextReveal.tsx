"use client";

import { motion } from "framer-motion";
import { fadeUp, easeOutExpo } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Tag ref={ref} className={className}>
      <motion.span
        className="inline-block"
        variants={fadeUp}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        transition={{ ...easeOutExpo, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
