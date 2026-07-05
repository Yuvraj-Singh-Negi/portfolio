"use client";

import { GlassCard } from "@/components/ui/glass-card";
import type { MissionAnalytics } from "@/features/mission/types";

interface MissionAnalyticsViewProps {
  analytics: MissionAnalytics[];
}

export function MissionAnalyticsView({ analytics }: MissionAnalyticsViewProps) {
  if (analytics.length === 0) {
    return (
      <GlassCard className="p-4">
        <p className="text-sm text-muted-foreground text-center">No missions completed yet</p>
      </GlassCard>
    );
  }

  const completed = analytics.length;
  const avgFocus = Math.round(analytics.reduce((s, a) => s + a.focusScore, 0) / completed);
  const totalTime = analytics.reduce((s, a) => s + a.completionTime, 0);
  const onTime = analytics.filter((a) => a.completionTime <= a.estimatedTime).length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-3 text-center">
          <p className="text-2xl font-bold text-accent-green">{completed}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-2xl font-bold text-accent-blue">{avgFocus}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">Avg. Focus</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-2xl font-bold text-accent-amber">
            {Math.round(totalTime / completed)}m
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Avg. Time</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-2xl font-bold text-accent-cyan">
            {onTime}/{completed}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">On Time</p>
        </GlassCard>
      </div>

      <GlassCard className="p-3">
        <p className="text-xs text-muted-foreground mb-2">Recent Focus Scores</p>
        <div className="flex items-end gap-1" style={{ height: 40 }}>
          {analytics.slice(-7).map((a, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all"
              style={{
                height: `${(a.focusScore / 100) * 100}%`,
                background:
                  a.focusScore >= 80
                    ? "var(--accent-green)"
                    : a.focusScore >= 50
                      ? "var(--accent-amber)"
                      : "var(--accent-red)",
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
