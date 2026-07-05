"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, FolderKanban, BrainCircuit, Flame, TrendingUp, type LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: string;
}

const stats: Stat[] = [
  {
    label: "Total XP",
    value: "12,450",
    change: "+320 today",
    icon: Zap,
    color: "text-accent-green",
  },
  {
    label: "Active Projects",
    value: "4",
    change: "2 in review",
    icon: FolderKanban,
    color: "text-accent-blue",
  },
  {
    label: "Knowledge Nodes",
    value: "47",
    change: "+3 this week",
    icon: BrainCircuit,
    color: "text-accent-purple",
  },
  {
    label: "Current Streak",
    value: "14 days",
    change: "Best: 21 days",
    icon: Flame,
    color: "text-accent-amber",
  },
  {
    label: "Completion Rate",
    value: "87%",
    change: "+5% vs last week",
    icon: TrendingUp,
    color: "text-accent-cyan",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function StatsGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-5 gap-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="group rounded-xl border border-card-border bg-card p-4 transition-all duration-200 hover:border-border-light hover:bg-card-hover"
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "bg-current/10",
                )}
                style={{ backgroundColor: "currentColor", opacity: 0.1 }}
              >
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
            {stat.change && <p className="mt-1 text-[11px] text-muted-foreground">{stat.change}</p>}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
