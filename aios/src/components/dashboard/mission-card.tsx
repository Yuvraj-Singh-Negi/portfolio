"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  CheckCircle2,
  Lightbulb,
  Clock,
  Target,
  BookOpen,
  ChevronDown,
  Zap,
  Circle,
} from "lucide-react";

const checklist = [
  { id: 1, label: "Research token bucket algorithm", duration: "20 min", done: true },
  { id: 2, label: "Set up Redis connection module", duration: "30 min", done: false },
  { id: 3, label: "Implement rate limiter class", duration: "45 min", done: false },
  { id: 4, label: "Create middleware function", duration: "30 min", done: false },
  { id: 5, label: "Write unit tests", duration: "40 min", done: false },
  { id: 6, label: "Integration test with API gateway", duration: "35 min", done: false },
];

const dependencies = ["Redis must be running locally", "API Gateway branch: feat/rate-limit"];

export function MissionCard() {
  const [expanded, setExpanded] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const completed = checklist.filter((t) => t.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <GlassCard className="overflow-hidden" glow="green">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" size="sm">
                  Active Mission
                </Badge>
                <Badge variant="default" size="sm">
                  Intermediate
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  ~4 hours
                </span>
                <Badge variant="danger" size="sm">
                  High Priority
                </Badge>
                <Badge variant="knowledge" size="sm">
                  Backend
                </Badge>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Implement Rate-Limiting Middleware
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-xl">
                Design and implement a token bucket rate limiter with Redis backend for the API
                Gateway project. This is a critical infrastructure component that will protect our
                services from abuse.
              </p>
            </div>
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-elevation-3"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 34 * (1 - completed / checklist.length),
                  }}
                  transition={{ duration: 0.8 }}
                  className="text-accent-green"
                />
              </svg>
              <span className="absolute text-lg font-bold text-accent-green">
                {Math.round((completed / checklist.length) * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button size="sm">
              <Play className="h-3.5 w-3.5" />
              {completed === 0 ? "Start Mission" : "Continue"}
            </Button>
            <Button size="sm" variant="secondary">
              <Pause className="h-3.5 w-3.5" />
              Pause
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAI(!showAI)}>
              <Lightbulb className="h-3.5 w-3.5" />
              AI Explanation
            </Button>
          </div>

          <AnimatePresence>
            {showAI && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-4 rounded-lg border border-accent-purple/20 bg-accent-purple/5 p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 text-accent-purple shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-accent-purple mb-1">AI Analysis</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        A token bucket algorithm allows bursty traffic while maintaining an average
                        rate limit. Consider implementing a sliding window log as an alternative —
                        it provides more accurate rate limiting for bursty traffic patterns. The
                        Redis-backed approach scales horizontally but adds ~2ms latency per request.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            {checklist.slice(0, expanded ? checklist.length : 3).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.id * 0.04 }}
              >
                <label
                  className={`flex items-center gap-2.5 rounded-lg p-2.5 transition-colors hover:bg-elevation-2 cursor-pointer ${
                    item.done ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    defaultChecked={item.done}
                    className="h-4 w-4 rounded border-border bg-elevation-3 text-accent-green focus:ring-accent-green/30"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      item.done ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{item.duration}</span>
                </label>
              </motion.div>
            ))}
          </div>

          {checklist.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
              {expanded ? "Show less" : `Show ${checklist.length - 3} more items`}
            </button>
          )}

          {dependencies.length > 0 && (
            <div className="mt-3 rounded-lg border border-accent-amber/20 bg-accent-amber/5 p-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Circle className="h-3 w-3 text-accent-amber" />
                <span className="text-xs font-medium text-accent-amber">Dependencies</span>
              </div>
              {dependencies.map((dep) => (
                <p key={dep} className="text-xs text-muted-foreground pl-5">
                  {dep}
                </p>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Resources: Token Bucket Algorithm, Redis Rate Limiting Guide, Express Middleware Docs
            </span>
          </div>

          <div className="mt-2 h-1.5 rounded-full bg-elevation-3">
            <motion.div
              className="h-full rounded-full bg-accent-green"
              initial={{ width: 0 }}
              animate={{ width: `${(completed / checklist.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
