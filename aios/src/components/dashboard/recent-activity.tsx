"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { GitCommit, BookOpen, MessageSquare, Code2, type LucideIcon } from "lucide-react";

interface Activity {
  icon: LucideIcon;
  label: string;
  description: string;
  time: string;
  badge?: { label: string; variant: "success" | "knowledge" | "ai" | "warning" };
}

const activities: Activity[] = [
  {
    icon: GitCommit,
    label: "GitHub Push",
    description: "aios-core: 3 commits pushed to main",
    time: "12 min ago",
    badge: { label: "Completed", variant: "success" },
  },
  {
    icon: BookOpen,
    label: "Module Completed",
    description: "System Design: Distributed Systems",
    time: "1 hour ago",
    badge: { label: "+250 XP", variant: "knowledge" },
  },
  {
    icon: MessageSquare,
    label: "AI Mentor Session",
    description: "Discussed Rust ownership model",
    time: "2 hours ago",
    badge: { label: "AI", variant: "ai" },
  },
  {
    icon: Code2,
    label: "Project Update",
    description: "API Gateway: Rate limiting implemented",
    time: "3 hours ago",
    badge: { label: "In Review", variant: "warning" },
  },
];

const listItem = {
  hidden: { opacity: 0, x: -12 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.3 },
  }),
};

export function RecentActivity() {
  return (
    <GlassCard className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Recent Activity</h2>
        <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-2">
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={i}
              custom={i}
              variants={listItem}
              initial="hidden"
              animate="show"
              className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-elevation-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-elevation-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{activity.label}</p>
                  {activity.badge && (
                    <Badge variant={activity.badge.variant} size="sm">
                      {activity.badge.label}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{activity.time}</span>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
