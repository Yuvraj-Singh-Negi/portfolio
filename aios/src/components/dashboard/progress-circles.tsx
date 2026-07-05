"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

interface Skill {
  name: string;
  progress: number;
  color: string;
  weekly: string;
  monthly: string;
}

const skills: Skill[] = [
  { name: "TypeScript", progress: 85, color: "text-accent-blue", weekly: "+2%", monthly: "+8%" },
  { name: "React", progress: 78, color: "text-accent-cyan", weekly: "+1%", monthly: "+5%" },
  {
    name: "System Design",
    progress: 62,
    color: "text-accent-purple",
    weekly: "+4%",
    monthly: "+12%",
  },
  { name: "Rust", progress: 34, color: "text-accent-green", weekly: "+3%", monthly: "+10%" },
  { name: "DevOps", progress: 45, color: "text-accent-amber", weekly: "+1%", monthly: "+4%" },
  { name: "AI/ML", progress: 28, color: "text-accent-purple", weekly: "+5%", monthly: "+15%" },
  { name: "Backend", progress: 71, color: "text-accent-blue", weekly: "+2%", monthly: "+7%" },
  { name: "Cloud", progress: 39, color: "text-accent-cyan", weekly: "+1%", monthly: "+3%" },
];

export function ProgressCircles() {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Skill Progress</h2>
        <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.04 }}
          >
            <GlassCard className="p-3 text-center" hover>
              <div className="relative mx-auto mb-2 flex h-14 w-14 items-center justify-center">
                <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-elevation-3"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 23}
                    initial={{ strokeDashoffset: 2 * Math.PI * 23 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 23 * (1 - skill.progress / 100),
                    }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                    className={skill.color}
                  />
                </svg>
                <span className={`absolute text-sm font-bold ${skill.color}`}>
                  {skill.progress}%
                </span>
              </div>
              <p className="text-xs font-medium truncate">{skill.name}</p>
              <div className="mt-1 flex justify-center gap-2 text-[10px] text-muted-foreground">
                <span className="text-accent-green">{skill.weekly}</span>
                <span>{skill.monthly}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </>
  );
}
