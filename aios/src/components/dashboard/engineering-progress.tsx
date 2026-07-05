"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, FolderKanban, TrendingUp, type LucideIcon } from "lucide-react";

interface SkillCard {
  name: string;
  progress: number;
  hours: number;
  projects: number;
  lastActivity: string;
  recommendation: string;
  color: string;
  icon: LucideIcon;
}

const skills: SkillCard[] = [];

export function EngineeringProgress() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = skills.find((s) => s.name === selected);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold">Engineering Progress</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {Math.round(skills.reduce((a, s) => a + s.progress, 0) / skills.length)}% average ·{" "}
            {skills.reduce((a, s) => a + s.hours, 0)} total hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {skills.map((skill, i) => {
          const Icon = skill.icon;
          const isSelected = selected === skill.name;
          return (
            <motion.button
              key={skill.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              onClick={() => setSelected(isSelected ? null : skill.name)}
              className="text-left"
            >
              <GlassCard
                className={cn("p-3 transition-all", isSelected && "ring-1 ring-accent-green/30")}
                hover
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                    <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-elevation-3"
                      />
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 20}
                        initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 20 * (1 - skill.progress / 100),
                        }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.03 }}
                        className={skill.color}
                      />
                    </svg>
                    <span className={cn("absolute text-sm font-bold", skill.color)}>
                      {skill.progress}%
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{skill.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {skill.hours}h
                      </span>
                      <span className="flex items-center gap-0.5">
                        <FolderKanban className="h-3 w-3" />
                        {skill.projects}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform",
                      isSelected && "rotate-90",
                    )}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Last: {skill.lastActivity}</span>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Badge variant="ai" size="sm">
                            AI
                          </Badge>
                          <span className="text-muted-foreground">{skill.recommendation}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                          <span>
                            This week: <span className="text-accent-green">+2%</span>
                          </span>
                          <span>
                            This month: <span className="text-accent-green">+8%</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
