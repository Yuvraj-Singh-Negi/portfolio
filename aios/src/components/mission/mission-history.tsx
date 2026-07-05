"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  GitCommit,
  BookOpen,
  Award,
  FolderKanban,
  BrainCircuit,
  Microscope,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  type:
    "project" | "lesson" | "commit" | "achievement" | "skill" | "research" | "failure" | "recovery";
  xp: number;
}

const timeline: TimelineEntry[] = [
  {
    date: "Today",
    title: "Rate Limiter Mission",
    description: "Implemented token bucket algorithm with Redis",
    type: "project",
    xp: 250,
  },
  {
    date: "Yesterday",
    title: "System Design Study",
    description: "Completed distributed consensus module",
    type: "lesson",
    xp: 180,
  },
  {
    date: "2 days ago",
    title: "API Gateway PR Merged",
    description: "Authentication module reviewed and merged",
    type: "commit",
    xp: 120,
  },
  {
    date: "3 days ago",
    title: "Knowledge Graph Updated",
    description: "Added 5 new nodes on distributed systems",
    type: "skill",
    xp: 90,
  },
  {
    date: "4 days ago",
    title: "Debug Marathon",
    description: "Fixed Redis connection pooling issue",
    type: "recovery",
    xp: 150,
  },
  {
    date: "5 days ago",
    title: "Research: Transformers",
    description: "Studied attention mechanism paper",
    type: "research",
    xp: 200,
  },
  {
    date: "1 week ago",
    title: "14-Day Streak",
    description: "Maintained daily learning for 14 days",
    type: "achievement",
    xp: 500,
  },
  {
    date: "1 week ago",
    title: "Build Failed",
    description: "CI pipeline failed on rate limiter tests",
    type: "failure",
    xp: 0,
  },
];

const typeConfig: Record<string, { icon: LucideIcon; color: string }> = {
  project: { icon: FolderKanban, color: "text-accent-blue" },
  lesson: { icon: BookOpen, color: "text-accent-green" },
  commit: { icon: GitCommit, color: "text-accent-purple" },
  achievement: { icon: Award, color: "text-accent-amber" },
  skill: { icon: BrainCircuit, color: "text-accent-cyan" },
  research: { icon: Microscope, color: "text-accent-purple" },
  failure: { icon: AlertTriangle, color: "text-accent-red" },
  recovery: { icon: RotateCcw, color: "text-accent-green" },
};

export function MissionHistory() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">Engineering Timeline</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Your growth, one mission at a time</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-accent-green">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+1,490 XP this week</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-0">
          {timeline.map((entry, i) => {
            const config = typeConfig[entry.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={`${entry.date}-${entry.title}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative flex gap-3 py-2 pl-0"
              >
                <div
                  className={cn(
                    "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-elevation-2",
                    entry.type === "achievement" && "border-accent-amber/30 bg-accent-amber/10",
                    entry.type === "failure" && "border-accent-red/30 bg-accent-red/10",
                    entry.type === "recovery" && "border-accent-green/30 bg-accent-green/10",
                  )}
                >
                  <Icon className={cn("h-3 w-3", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium">{entry.title}</p>
                    {entry.type === "achievement" && (
                      <Badge variant="warning" size="sm">
                        Achievement
                      </Badge>
                    )}
                    {entry.type === "failure" && (
                      <Badge variant="danger" size="sm">
                        Setback
                      </Badge>
                    )}
                    {entry.type === "recovery" && (
                      <Badge variant="success" size="sm">
                        Recovery
                      </Badge>
                    )}
                    {entry.xp > 0 && (
                      <span className="text-[10px] text-accent-green ml-auto">+{entry.xp} XP</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{entry.description}</p>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">{entry.date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
