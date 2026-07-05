"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";

interface Task {
  label: string;
  duration: string;
  done: boolean;
  priority?: "high" | "medium" | "low";
}

const tasks: Task[] = [];

export function TodayTasks() {
  const completed = tasks.filter((t) => t.done).length;

  return (
    <GlassCard className="p-4">
      <h2 className="text-sm font-semibold mb-3">Today&apos;s Tasks</h2>
      <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
        No tasks yet. Start a mission to get going.
      </div>
    </GlassCard>
  );
}
