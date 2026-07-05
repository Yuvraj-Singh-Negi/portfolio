"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  progress: number;
  color: string;
}

const skills: Skill[] = [
  { name: "TypeScript", progress: 85, color: "bg-accent-blue" },
  { name: "React", progress: 78, color: "bg-accent-cyan" },
  { name: "System Design", progress: 62, color: "bg-accent-purple" },
  { name: "Rust", progress: 34, color: "bg-accent-green" },
  { name: "DevOps", progress: 45, color: "bg-accent-amber" },
];

export function SkillProgress() {
  return (
    <GlassCard className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Skill Progress</h2>
        <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          View skills
        </button>
      </div>
      <div className="space-y-3.5">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium">{skill.name}</span>
              <span className="text-[11px] text-muted-foreground">{skill.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-elevation-3">
              <motion.div
                className={cn("h-full rounded-full", skill.color)}
                initial={{ width: 0 }}
                animate={{ width: `${skill.progress}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.08, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
