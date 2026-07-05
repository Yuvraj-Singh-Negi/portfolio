"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { ActivityBucket } from "@/features/analytics/types";

interface ActivityChartProps {
  data: ActivityBucket[];
  title?: string;
}

const intensityColors = [
  "bg-elevation-3",
  "bg-accent-green/30",
  "bg-accent-green/50",
  "bg-accent-green/70",
  "bg-accent-green",
];

export function ActivityChart({ data, title = "Activity" }: ActivityChartProps) {
  const weeks: ActivityBucket[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span>Less</span>
          {intensityColors.map((c, i) => (
            <div key={i} className={cn("h-3 w-3 rounded", c)} />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1" style={{ minWidth: Math.max(weeks.length * 14, 200) }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <motion.div
                  key={`${wi}-${di}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wi * 7 + di) * 0.002 }}
                  className={cn("h-3 w-3 rounded", intensityColors[day.intensity])}
                  title={`${day.date}: ${day.count} activities`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
