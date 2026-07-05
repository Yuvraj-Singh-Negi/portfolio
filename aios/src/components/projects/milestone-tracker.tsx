"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/features/projects/types";
import { CheckCircle2, Clock, Circle, AlertTriangle } from "lucide-react";

interface MilestoneTrackerProps {
  milestones: Milestone[];
}

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-accent-green", bg: "bg-accent-green/10" },
  active: { icon: Clock, color: "text-accent-blue", bg: "bg-accent-blue/10" },
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-elevation-3" },
};

export function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
  const overdue = milestones.filter(
    (m) => m.status !== "completed" && new Date(m.dueDate) < new Date(),
  );

  return (
    <div className="space-y-2">
      {milestones.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">No milestones yet</p>
      )}
      {milestones.map((ms, i) => {
        const config = statusConfig[ms.status];
        const Icon = config.icon;
        const isOverdue = ms.status !== "completed" && new Date(ms.dueDate) < new Date();
        return (
          <motion.div
            key={ms.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className={cn("p-3", isOverdue && "border-accent-red/20")}>
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    config.bg,
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{ms.title}</span>
                    <Badge
                      size="sm"
                      variant={
                        ms.status === "completed"
                          ? "success"
                          : ms.status === "active"
                            ? "knowledge"
                            : "default"
                      }
                    >
                      {ms.status}
                    </Badge>
                    {isOverdue && (
                      <Badge size="sm" variant="danger">
                        <AlertTriangle className="h-3 w-3 mr-0.5" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{ms.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span>Due: {new Date(ms.dueDate).toLocaleDateString()}</span>
                    <span>{ms.tasks.length} tasks</span>
                    <span className="font-medium">{ms.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-elevation-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ms.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "h-full rounded-full",
                        ms.status === "completed" ? "bg-accent-green" : "bg-accent-blue",
                      )}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
