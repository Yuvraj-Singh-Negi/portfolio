"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "@/features/mission/store";
import { Button } from "@/components/ui/button";
import { X, Minimize2, Timer, BookOpen, Terminal, MessageSquare } from "lucide-react";

interface FocusModeProps {
  open: boolean;
  onClose: () => void;
  missionName?: string;
}

export function FocusMode({ open, onClose, missionName }: FocusModeProps) {
  const { focusSession, startFocusSession, stopFocusSession, tickFocusTimer, currentMission } =
    useMissionStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (focusSession.active) {
      intervalRef.current = setInterval(tickFocusTimer, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [focusSession.active, tickFocusTimer]);

  const minutes = Math.floor(focusSession.remaining / 60);
  const seconds = focusSession.remaining % 60;
  const progress = 1 - focusSession.remaining / focusSession.duration;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">FOCUS MODE</span>
                {missionName && (
                  <span className="text-sm text-muted-foreground/60">· {missionName}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <svg className="h-48 w-48 -rotate-90" viewBox="0 0 192 192">
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-white/10"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="84"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 84}
                      animate={{ strokeDashoffset: 2 * Math.PI * 84 * progress }}
                      transition={{ duration: 0.5 }}
                      className="text-accent-green"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <motion.span
                      className="block text-5xl font-bold tracking-tight text-white"
                      key={`${minutes}-${seconds}`}
                      initial={{ opacity: 0.6, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                    </motion.span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {focusSession.type === "focus" ? "Focus Session" : "Break"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!focusSession.active ? (
                    <Button size="lg" onClick={() => startFocusSession("focus")}>
                      <Timer className="h-4 w-4" />
                      Start Focus
                    </Button>
                  ) : (
                    <Button size="lg" variant="secondary" onClick={stopFocusSession}>
                      Stop Session
                    </Button>
                  )}
                  <Button size="lg" variant="ghost" onClick={() => startFocusSession("break")}>
                    Start Break
                  </Button>
                </div>
              </div>

              <div className="w-72 border-l border-border/30 p-5 space-y-4">
                <div className="space-y-3">
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                    <BookOpen className="h-4 w-4" />
                    Notes
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                    <Terminal className="h-4 w-4" />
                    Terminal
                  </button>
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    AI Coach
                  </button>
                </div>

                <div className="border-t border-border/30 pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Current Task</p>
                  <p className="text-sm">
                    {currentMission?.template.checklist.find((i) => !i.done)?.label ||
                      "All tasks completed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
