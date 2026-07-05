"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { WeeklyAggregation } from "@/features/analytics/types";

interface WeeklyBarChartProps {
  data: WeeklyAggregation[];
  metric: keyof Pick<WeeklyAggregation, "totalHours" | "commits" | "xpGained" | "focusAvg">;
  label: string;
  color: string;
}

export function WeeklyBarChart({ data, metric, label, color }: WeeklyBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d[metric]), 1);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-xs text-muted-foreground">Weekly</span>
      </div>
      <div className="flex items-end gap-1" style={{ height: 100 }}>
        {data.slice(-12).map((week, i) => {
          const pct = (week[metric] / maxVal) * 100;
          return (
            <motion.div
              key={week.week}
              initial={{ height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn("flex-1 rounded-t transition-all hover:opacity-80", color)}
              title={`${week.week}: ${week[metric]}`}
              style={{ background: `var(--${color.replace("bg-", "")})` }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
        <span>{data.slice(-12)[0]?.week.slice(5) ?? ""}</span>
        <span>{data.slice(-12).at(-1)?.week.slice(5) ?? ""}</span>
      </div>
    </GlassCard>
  );
}
