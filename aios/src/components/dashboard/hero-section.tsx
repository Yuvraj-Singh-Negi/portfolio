"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useMissionStore } from "@/features/mission/store";
import { Target, Sparkles } from "lucide-react";

export function HeroSection() {
  const missions = useMissionStore((s) => s.missions);
  const activeMission = missions.find((m) => m.state === "in-progress");

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
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Good Morning, Engineer</h1>
                <p className="mt-1.5 text-base text-muted-foreground">
                  {activeMission
                    ? activeMission.template.name
                    : "Ready for your next engineering challenge?"}
                </p>
              </div>
              {activeMission && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-accent-green" />
                    {activeMission.template.objective}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent-purple" />
                    {activeMission.template.difficulty} · {activeMission.category}
                  </span>
                </div>
              )}
            </div>

            {activeMission && (
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-elevation-3"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 34 * (1 - activeMission.progress / 100),
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-accent-green"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-accent-green">
                  {activeMission.progress}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeMission ? (
              <>
                <Button size="lg">Resume Mission</Button>
                <Button size="lg" variant="secondary">
                  View Missions
                </Button>
              </>
            ) : (
              <>
                <Button size="lg">Start Your First Mission</Button>
                <Button size="lg" variant="secondary">
                  Explore Dashboard
                </Button>
              </>
            )}
            {!activeMission && (
              <div className="ml-auto rounded-lg border border-border bg-elevation-1 p-3">
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent-green">Tip:</span> Create a mission to start tracking
                  your engineering growth.
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
