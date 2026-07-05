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

const activities: Activity[] = [];

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
      </div>
      <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
        No activity yet. Start working to see your progress.
      </div>
    </GlassCard>
  );
}
