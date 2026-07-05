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

const tasks: Task[] = [
  {
    label: "Complete rate limiter implementation",
    duration: "90 min",
    done: false,
    priority: "high",
  },
  {
    label: "Review PR #42: API caching layer",
    duration: "30 min",
    done: false,
    priority: "medium",
  },
  { label: "Study distributed consensus algorithms", duration: "45 min", done: true },
  {
    label: "Update knowledge graph with Rust notes",
    duration: "20 min",
    done: false,
    priority: "low",
  },
  { label: "Write reflection on today's learning", duration: "10 min", done: false },
];

export function TodayTasks() {
  const completed = tasks.filter((t) => t.done).length;
  const totalTime = tasks.reduce((acc, t) => {
    const min = parseInt(t.duration);
    return acc + (isNaN(min) ? 0 : min);
  }, 0);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Today&apos;s Tasks</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{totalTime} min</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>
            {completed}/{tasks.length} done
          </span>
        </div>
      </div>
      <div className="space-y-1">
        {tasks.map((task, i) => (
          <motion.div
            key={task.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
          >
            <label
              className={`flex items-center gap-2.5 rounded-lg p-2.5 transition-colors hover:bg-elevation-2 cursor-pointer ${
                task.done ? "opacity-50" : ""
              }`}
            >
              <input
                type="checkbox"
                defaultChecked={task.done}
                className="h-4 w-4 rounded border-border bg-elevation-3 text-accent-green focus:ring-accent-green/30 focus:ring-offset-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    task.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {task.label}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {task.priority === "high" && (
                  <Badge variant="danger" size="sm">
                    High
                  </Badge>
                )}
                {task.priority === "medium" && (
                  <Badge variant="warning" size="sm">
                    Med
                  </Badge>
                )}
                {task.priority === "low" && (
                  <Badge variant="default" size="sm">
                    Low
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground">{task.duration}</span>
              </div>
            </label>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-3 h-1.5 origin-left rounded-full bg-elevation-3 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-accent-green transition-all"
          style={{ width: `${(completed / tasks.length) * 100}%` }}
        />
      </motion.div>
    </GlassCard>
  );
}
