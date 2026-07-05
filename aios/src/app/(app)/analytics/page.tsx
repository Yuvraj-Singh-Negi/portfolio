"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { SkillGrowthChart } from "@/components/analytics/skill-growth-chart";
import { WeeklyBarChart } from "@/components/analytics/weekly-bar-chart";
import {
  generateMetricEntries,
  computeSummaries,
  computeWeeklyAggregations,
  generateActivityHeatmap,
  generateSkillGrowth,
  computeStreak,
} from "@/features/analytics/engine";
import { BarChart3, TrendingUp, Clock, Activity, Flame, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [days] = useState(90);

  const { entries, summaries, weekly, heatmap, skillGrowth, streak } = useMemo(() => {
    const e = generateMetricEntries(days);
    return {
      entries: e,
      summaries: computeSummaries(e),
      weekly: computeWeeklyAggregations(e),
      heatmap: generateActivityHeatmap(e),
      skillGrowth: generateSkillGrowth(days),
      streak: computeStreak(e),
    };
  }, [days]);

  return (
    <div className="overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Engineering productivity metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="knowledge" size="md" className="gap-1.5">
            <Flame className="h-3 w-3" />
            {streak}-day streak
          </Badge>
          <Badge variant="success" size="md" className="gap-1.5">
            <Zap className="h-3 w-3" />
            {entries.reduce((s, e) => s + e.xpEarned, 0)} XP
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {summaries.slice(0, 4).map((stat, i) => {
          const Icon = [Clock, Activity, TrendingUp, Zap][i];
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
                  {stat.change} vs last month
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {summaries.slice(4).map((stat, i) => {
          const Icon = [Award, BarChart3, TrendingUp, Clock][i];
          return (
            <GlassCard key={stat.label} className="p-3 text-center">
              <Icon className={cn("h-4 w-4 mx-auto mb-1", stat.color)} />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ActivityChart data={heatmap} title="90-Day Activity Heatmap" />
        <SkillGrowthChart data={skillGrowth} title="Skill Growth (90 days)" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <WeeklyBarChart
          data={weekly}
          metric="totalHours"
          label="Weekly Hours"
          color="bg-accent-blue"
        />
        <WeeklyBarChart
          data={weekly}
          metric="commits"
          label="Weekly Commits"
          color="bg-accent-green"
        />
        <WeeklyBarChart
          data={weekly}
          metric="xpGained"
          label="Weekly XP"
          color="bg-accent-purple"
        />
        <WeeklyBarChart
          data={weekly}
          metric="focusAvg"
          label="Weekly Focus"
          color="bg-accent-amber"
        />
      </div>
    </div>
  );
}
