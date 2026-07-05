"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KnowledgeNodeGlowProps {
  active?: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function KnowledgeNodeGlow({
  active = true,
  color = "text-accent-green",
  size = "md",
}: KnowledgeNodeGlowProps) {
  const dimensions = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const pulseSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  if (!active) {
    return <div className={cn("rounded-full bg-elevation-3", dimensions[size])} />;
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={cn("absolute rounded-full border", color, pulseSizes[size])}
        style={{ borderColor: "currentColor", opacity: 0.15 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.05, 0.15],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div
        className={cn(
          "relative rounded-full",
          color === "text-accent-green" && "bg-accent-green",
          color === "text-accent-purple" && "bg-accent-purple",
          color === "text-accent-blue" && "bg-accent-blue",
          color === "text-accent-amber" && "bg-accent-amber",
          color === "text-accent-cyan" && "bg-accent-cyan",
          dimensions[size],
        )}
        style={{
          boxShadow: `0 0 8px currentColor, 0 0 16px currentColor`,
          color: "inherit",
        }}
      />
    </div>
  );
}
