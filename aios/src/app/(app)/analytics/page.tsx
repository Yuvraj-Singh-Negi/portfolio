"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useMissionStore } from "@/features/mission/store";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Activity,
  Flame,
  Zap,
  Award,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const analytics = useMissionStore((s) => s.analytics);

  if (analytics.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevation-2">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No analytics yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Complete missions and track your engineering activity to see your analytics here. Start
            a mission or log your daily activity to begin building your engineering profile.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <GlassCard className="p-3">
              <Flame className="h-4 w-4 text-accent-amber mb-1" />
              <p className="text-xs font-medium">Build Streaks</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Maintain daily coding habits
              </p>
            </GlassCard>
            <GlassCard className="p-3">
              <TrendingUp className="h-4 w-4 text-accent-green mb-1" />
              <p className="text-xs font-medium">Track Growth</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Monitor skill progression</p>
            </GlassCard>
            <GlassCard className="p-3">
              <Clock className="h-4 w-4 text-accent-blue mb-1" />
              <p className="text-xs font-medium">Time Tracking</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Log learning and coding hours
              </p>
            </GlassCard>
            <GlassCard className="p-3">
              <Award className="h-4 w-4 text-accent-purple mb-1" />
              <p className="text-xs font-medium">Achievements</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Unlock XP and milestones</p>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  const totalFocus = analytics.reduce((s, a) => s + a.focusScore, 0);
  const avgFocus = Math.round(totalFocus / analytics.length);
  const totalCommits = analytics.reduce((s, a) => s + a.gitCommits, 0);
  const totalAssists = analytics.reduce((s, a) => s + a.aiAssistance, 0);
  const totalTime = analytics.reduce((s, a) => s + a.completionTime, 0);

  const summaries: {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "stable";
    color: string;
    icon: typeof Award;
  }[] = [
    {
      label: "Missions Done",
      value: `${analytics.length}`,
      change: "+0",
      trend: "stable",
      color: "text-accent-green",
      icon: Award,
    },
    {
      label: "Avg Focus",
      value: `${avgFocus}%`,
      change: "+0",
      trend: "stable",
      color: "text-accent-blue",
      icon: BrainCircuit,
    },
    {
      label: "Total Commits",
      value: `${totalCommits}`,
      change: "+0",
      trend: "stable",
      color: "text-accent-amber",
      icon: Activity,
    },
    {
      label: "AI Assists",
      value: `${totalAssists}`,
      change: "+0",
      trend: "stable",
      color: "text-accent-purple",
      icon: Zap,
    },
    {
      label: "Total Time",
      value: `${Math.round(totalTime / 60)}h`,
      change: "+0",
      trend: "stable",
      color: "text-accent-cyan",
      icon: Clock,
    },
    {
      label: "Focus Score",
      value: `${avgFocus}%`,
      change: "+0",
      trend: "stable",
      color: "text-accent-green",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mission analytics and engineering metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="knowledge" size="md" className="gap-1.5">
            <Flame className="h-3 w-3" />
            {analytics.length} entries
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {summaries.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn("h-4 w-4", stat.color)} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    stat.trend === "up"
                      ? "text-accent-green"
                      : stat.trend === "down"
                        ? "text-accent-red"
                        : "text-muted-foreground",
                  )}
                >
                  {stat.change}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Recent Entries</h3>
        <div className="space-y-2">
          {analytics
            .slice(-10)
            .reverse()
            .map((entry, i) => (
              <GlassCard key={i} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">
                    Focus: {entry.focusScore}% · Commits: {entry.gitCommits} · AI:{" "}
                    {entry.aiAssistance}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Difficulty: {entry.difficulty} · Est: {entry.estimatedTime}m · Actual:{" "}
                    {entry.completionTime}m
                  </p>
                </div>
                <Badge
                  variant={
                    entry.difficulty === "expert"
                      ? "danger"
                      : entry.difficulty === "advanced"
                        ? "warning"
                        : "default"
                  }
                  size="sm"
                >
                  {entry.difficulty}
                </Badge>
              </GlassCard>
            ))}
        </div>
      </div>
    </div>
  );
}
