"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "green" | "purple" | "blue" | "none";
  hover?: boolean;
  children?: ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, glow = "none", hover = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "rounded-xl border border-card-border bg-card",
          glow === "green" && "shadow-glow-green",
          glow === "purple" && "shadow-glow-purple",
          glow === "blue" && "shadow-glow-blue",
          hover && "transition-all duration-200 hover:border-border-light hover:bg-card-hover",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
export type { GlassCardProps };
