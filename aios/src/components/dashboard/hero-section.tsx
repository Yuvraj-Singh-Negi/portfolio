"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Target, Calendar, TrendingUp, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="relative h-[320px] overflow-hidden rounded-[32px] p-8" glow="green">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-green/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent-cyan/8 blur-[60px]" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 items-center gap-1.5 rounded-full bg-accent-green/10 px-3 text-xs font-medium text-accent-green">
                  <Sparkles className="h-3 w-3" />
                  Week 7 of 24
                </span>
                <Badge variant="success" size="sm">
                  On Track
                </Badge>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Good Morning, Engineer</h1>
                <p className="mt-1.5 text-base text-muted-foreground">
                  Become an Elite AI Engineer
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-accent-green" />
                  Current Focus: Linear Algebra &amp; Transformer Mathematics
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-accent-purple" />
                  Estimated completion: 17 weeks
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 112 112">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-elevation-3"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 48}
                    initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 48 * 0.42 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-accent-green"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * 0.65 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    className="text-accent-purple/60"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-lg font-bold text-accent-green">58%</span>
                  <span className="text-[10px] text-muted-foreground">Complete</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3 text-accent-green" />
                +4% this week
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="lg">
              <Play className="h-4 w-4" />
              Quick Resume
            </Button>
            <Button size="lg" variant="secondary">
              View roadmap
            </Button>
            <div className="ml-auto rounded-lg border border-border bg-elevation-1 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="text-accent-green">AI Recommendation:</span> Focus on transformer
                attention mechanisms — it aligns with your current project and has the highest skill
                impact.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
