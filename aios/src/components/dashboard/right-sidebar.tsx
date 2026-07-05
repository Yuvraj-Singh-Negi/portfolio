"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bot,
  Quote,
  Timer,
  Calendar,
  Bell,
  Wifi,
  HardDrive,
  Zap,
  Cloud,
  MessageSquare,
  Send,
  ChevronRight,
  Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const quote = {
  text: "The best way to predict the future is to build it.",
  author: "Alan Kay",
};

const events = [
  { title: "AI Mentor Session", time: "10:00 AM", day: 15, color: "text-accent-purple" },
  { title: "Project Review", time: "2:00 PM", day: 17, color: "text-accent-blue" },
  { title: "System Design Study", time: "4:00 PM", day: 19, color: "text-accent-green" },
];

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

function SystemHealthItem({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  status: "good" | "warning" | "error";
}) {
  const statusColor = {
    good: "text-accent-green",
    warning: "text-accent-amber",
    error: "text-accent-red",
  };
  return (
    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-elevation-2 transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium">{value}</span>
        <Circle className={cn("h-2 w-2 fill-current", statusColor[status])} />
      </div>
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

      <GlassCard className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <Bot className="mt-0.5 h-4 w-4 text-accent-purple shrink-0" />
          <div>
            <p className="text-xs font-medium text-accent-purple">AI Mentor</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Your rate limiter design is solid. Consider adding a sliding window fallback for burst
              protection.
            </p>
          </div>
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

      <GlassCard className="p-3">
        <div className="flex items-start gap-2">
          <Quote className="mt-0.5 h-4 w-4 text-accent-amber shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </p>
            <p className="text-[10px] text-accent-amber/60 mt-1">— {quote.author}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">Focus Timer</span>
        </div>
        <FocusTimer />
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">Upcoming</span>
          </div>
          <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            View all
          </button>
        </div>
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.title} className="flex items-center gap-2.5">
              <Circle className={cn("h-2 w-2 shrink-0 fill-current", event.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate">{event.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  Day {event.day} · {event.time}
                </p>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold">System Health</span>
        </div>
        <div className="space-y-0.5">
          <SystemHealthItem icon={Wifi} label="API Status" value="Operational" status="good" />
          <SystemHealthItem icon={HardDrive} label="Storage" value="54% used" status="good" />
          <SystemHealthItem icon={Zap} label="AI Tokens" value="2,340 left" status="warning" />
          <SystemHealthItem icon={Cloud} label="Deployment" value="Vercel" status="good" />
        </div>
      </GlassCard>
    </motion.aside>
  );
}
