"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

const data: Record<Period, { label: string; value: number }[]> = {
  daily: [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 90 },
    { label: "Wed", value: 150 },
    { label: "Thu", value: 110 },
    { label: "Fri", value: 80 },
    { label: "Sat", value: 45 },
    { label: "Sun", value: 60 },
  ],
  weekly: [
    { label: "W1", value: 480 },
    { label: "W2", value: 520 },
    { label: "W3", value: 610 },
    { label: "W4", value: 580 },
  ],
  monthly: [
    { label: "Jan", value: 1800 },
    { label: "Feb", value: 2100 },
    { label: "Mar", value: 2400 },
    { label: "Apr", value: 2200 },
    { label: "May", value: 2800 },
    { label: "Jun", value: 3100 },
  ],
};

export function VelocityChart() {
  const [period, setPeriod] = useState<Period>("daily");
  const active = data[period];
  const max = Math.max(...active.map((d) => d.value));

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold">Learning Velocity</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {period === "daily"
              ? "Daily XP earned"
              : period === "weekly"
                ? "Weekly XP earned"
                : "Monthly XP earned"}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-elevation-1 p-0.5">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                period === p
                  ? "bg-accent-green text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-40">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${active.length * 60} 160`}
          preserveAspectRatio="none"
        >
          <motion.path
            d={`M ${active.map((d, i) => `${i * 60 + 30},${160 - (d.value / max) * 140}`).join(" L ")}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-accent-green"
          />
          <motion.path
            d={`M ${active.map((d, i) => `${i * 60 + 30},${160 - (d.value / max) * 140}`).join(" L ")} L ${active.length * 60 - 30},160 L 30,160 Z`}
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,160,0.2)" />
              <stop offset="100%" stopColor="rgba(34,211,160,0)" />
            </linearGradient>
          </defs>

          {active.map((d, i) => (
            <motion.circle
              key={d.label}
              cx={i * 60 + 30}
              cy={160 - (d.value / max) * 140}
              r="4"
              fill="currentColor"
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 4 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="text-accent-green"
            />
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {active.map((d) => (
            <span key={d.label} className="text-[10px] text-muted-foreground">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
