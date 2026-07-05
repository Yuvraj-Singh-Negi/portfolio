"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { roadmaps, type Roadmap, type Milestone } from "@/features/learning/roadmaps";
import { getOverallSkillProgress } from "@/features/learning/skill-tree";
import {
  BrainCircuit,
  Server,
  Code2,
  Brain,
  Container,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  BookOpen,
} from "lucide-react";

const iconMap: Record<string, typeof BrainCircuit> = {
  BrainCircuit,
  Server,
  Code2,
  Brain,
  Container,
};

function MilestoneNode({
  milestone,
  index,
  total,
  roadmapColor,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  roadmapColor: string;
}) {
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative flex gap-4"
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-current",
            `text-${roadmapColor}`,
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
        </div>
        {!isLast && (
          <div
            className="mt-1 w-px flex-1 bg-gradient-to-b from-current to-transparent"
            style={{ color: `var(--${roadmapColor})`, opacity: 0.3 }}
          />
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">{milestone.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{milestone.description}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 ml-3">
            <Clock className="h-3 w-3" />
            {milestone.estimatedDays}d
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {milestone.skills.map((skill) => (
            <Badge key={skill} variant="default" size="sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function RoadmapPage() {
  const [selected, setSelected] = useState<string>(roadmaps[0].id);
  const active = roadmaps.find((r) => r.id === selected) ?? roadmaps[0];
  const Icon = iconMap[active.icon] ?? BrainCircuit;
  const overallProgress = getOverallSkillProgress();

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Roadmaps</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Structured learning paths · {overallProgress}% overall skill progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {roadmaps.map((roadmap) => {
            const Icon = iconMap[roadmap.icon] ?? BrainCircuit;
            return (
              <button
                key={roadmap.id}
                onClick={() => setSelected(roadmap.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                  selected === roadmap.id
                    ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                    : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {roadmap.title}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  `bg-${active.color}/10`,
                )}
              >
                <Icon className={cn("h-5 w-5", `text-${active.color}`)} />
              </div>
              <div>
                <h2 className="text-lg font-bold">{active.title}</h2>
                <p className="text-sm text-muted-foreground">{active.description}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                {active.totalDays} days · {active.milestones.length} milestones
              </div>
            </div>

            <div className="relative pl-1">
              {active.milestones.map((milestone, i) => (
                <MilestoneNode
                  key={milestone.id}
                  milestone={milestone}
                  index={i}
                  total={active.milestones.length}
                  roadmapColor={active.color}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="hidden w-80 shrink-0 border-l border-border p-5 space-y-4 lg:block overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Selected Roadmap
        </h3>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                `bg-${active.color}/10`,
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", `text-${active.color}`)} />
            </div>
            <div>
              <p className="text-sm font-semibold">{active.title}</p>
              <p className="text-xs text-muted-foreground">{active.milestones.length} milestones</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {active.milestones.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-lg p-2 text-xs hover:bg-elevation-2 transition-colors"
              >
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    `border-${active.color}/30`,
                  )}
                >
                  <span className={cn("text-[9px] font-bold", `text-${active.color}`)}>
                    {i + 1}
                  </span>
                </div>
                <span className="truncate">{m.title}</span>
                <span className="ml-auto text-muted-foreground">{m.estimatedDays}d</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-accent-blue" />
            <h4 className="text-xs font-semibold">Resources needed</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {active.milestones.reduce((s, m) => s + m.resources.length, 0)} curated resources across
            all milestones
          </p>
        </GlassCard>
      </aside>
    </div>
  );
}
