"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { LineChart } from "@/components/ui/line-chart";
import type { SkillGrowthPoint } from "@/features/analytics/types";
import { useState } from "react";

interface SkillGrowthChartProps {
  data: SkillGrowthPoint[];
  title?: string;
}

const SKILL_COLORS: Record<string, string> = {
  TypeScript: "var(--accent-blue)",
  React: "var(--accent-cyan)",
  Rust: "var(--accent-green)",
  "System Design": "var(--accent-purple)",
  ML: "var(--accent-amber)",
  DevOps: "var(--accent-red)",
};

export function SkillGrowthChart({ data, title = "Skill Growth" }: SkillGrowthChartProps) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(["TypeScript", "React"]),
  );

  const allSkills = data.length > 0 ? Object.keys(data[0].skills) : [];
  const series = allSkills
    .filter((s) => selectedSkills.has(s))
    .map((skill) => ({
      label: skill,
      data: data.map((d) => d.skills[skill]),
      color: SKILL_COLORS[skill] ?? "var(--accent-blue)",
    }));

  const labels = data.map((d) => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const sampleInterval = Math.max(1, Math.floor(data.length / 30));
  const sampledLabels = labels.filter((_, i) => i % sampleInterval === 0);
  const sampledData = labels.map((_, i) => i).filter((_, i) => i % sampleInterval === 0);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => {
                const next = new Set(selectedSkills);
                if (next.has(skill)) next.delete(skill);
                else next.add(skill);
                setSelectedSkills(next);
              }}
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                selectedSkills.has(skill)
                  ? "bg-elevation-3 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        {series.length > 0 && <LineChart series={series} labels={labels} height={180} />}
        {series.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Select skills to view growth</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
