"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, GitCommit, Award, Zap, BookOpen } from "lucide-react";

const notifications = [
  {
    id: "1",
    icon: GitCommit,
    title: "Mission completed",
    description: "Rate Limiter design pattern",
    time: "2m ago",
    color: "text-accent-green",
  },
  {
    id: "2",
    icon: Award,
    title: "Achievement unlocked",
    description: "7-day streak — 840 XP",
    time: "1h ago",
    color: "text-accent-amber",
  },
  {
    id: "3",
    icon: Zap,
    title: "Skill leveled up",
    description: "TypeScript: Lv. 5 → Lv. 6",
    time: "3h ago",
    color: "text-accent-blue",
  },
  {
    id: "4",
    icon: BookOpen,
    title: "New resource available",
    description: "System Design Interview vol.2",
    time: "5h ago",
    color: "text-accent-purple",
  },
];

export function Notifications() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-elevation-2"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-green shadow-[0_0_6px_rgba(34,211,160,0.5)]" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold">Notifications</span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-elevation-1"
                  >
                    <div className={`mt-0.5 ${n.color}`}>
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border p-3 text-center">
                <button className="text-xs font-medium text-accent-green hover:underline">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
