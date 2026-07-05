"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bot, Timer, Bell, Send } from "lucide-react";

function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          setRunning(false);
          setMode(mode === "focus" ? "break" : "focus");
          setMinutes(mode === "focus" ? 5 : 25);
          return;
        }
        setMinutes((m) => m - 1);
        setSeconds(59);
      } else {
        setSeconds((s) => s - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [running, minutes, seconds, mode]);

  const totalSeconds = mode === "focus" ? 25 * 60 : 5 * 60;
  const remaining = minutes * 60 + seconds;
  const progress = 1 - remaining / totalSeconds;

  return (
    <div className="text-center">
      <div className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-elevation-3"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 27}
            animate={{ strokeDashoffset: 2 * Math.PI * 27 * progress }}
            transition={{ duration: 1 }}
            className={mode === "focus" ? "text-accent-green" : "text-accent-amber"}
          />
        </svg>
        <span className="absolute text-xs font-mono font-bold">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <button
        onClick={() => setRunning(!running)}
        className={cn(
          "rounded-full px-3 py-1 text-[10px] font-medium transition-colors",
          running
            ? "bg-accent-red/10 text-accent-red"
            : "bg-accent-green/10 text-accent-green hover:bg-accent-green/20",
        )}
      >
        {running ? "Stop" : "Start Focus"}
      </button>
      <button
        onClick={() => {
          setMode(mode === "focus" ? "break" : "focus");
          setMinutes(mode === "focus" ? 5 : 25);
          setSeconds(0);
        }}
        className="ml-1 rounded-full px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        {mode === "focus" ? "Break" : "Focus"}
      </button>
    </div>
  );
}

export function RightSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-[300px] shrink-0 space-y-3 overflow-y-auto"
    >
      <div className="flex items-center gap-2 px-1 mb-2">
        <Bot className="h-4 w-4 text-accent-purple" />
        <span className="text-xs font-semibold">Intelligence</span>
        <Badge variant="ai" size="sm">
          AI Active
        </Badge>
      </div>

      <GlassCard className="p-4 text-center">
        <Bot className="mx-auto h-6 w-6 text-accent-purple mb-2" />
        <p className="text-xs text-muted-foreground">
          Ask the AI Mentor in the chat panel for personalized guidance.
        </p>
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Focus Timer</span>
        </div>
        <FocusTimer />
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Quick Ask</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-elevation-1 p-1.5">
          <input
            type="text"
            placeholder="Ask anything..."
            className="flex-1 bg-transparent px-1.5 py-1 text-xs outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-md bg-accent-green p-1 text-black hover:bg-accent-green-dim transition-colors">
            <Send className="h-3 w-3" />
          </button>
        </div>
      </GlassCard>
    </motion.aside>
  );
}
