"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "@/features/mission/store";
import { generateMission, getTemplate } from "@/features/mission/templates";
import { generateDailyTimeline, estimateCompletion } from "@/features/mission/engine";
import { FocusMode } from "@/components/mission/focus-mode";
import { AICoach } from "@/components/mission/ai-coach";
import { MissionCompletion } from "@/components/mission/mission-completion";
import { MissionHistory } from "@/components/mission/mission-history";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MissionState } from "@/features/mission/types";
import {
  Target,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Lightbulb,
  BookOpen,
  ChevronDown,
  Maximize2,
  Timer,
  Zap,
  BarChart3,
  Circle,
  AlertTriangle,
  Sparkles,
  Calendar,
  GitCommit,
  BrainCircuit,
  ListChecks,
} from "lucide-react";

const timeline = generateDailyTimeline();

const missionCategories = [
  "All",
  "Knowledge",
  "Engineering",
  "Architecture",
  "Quality",
  "Career",
  "Growth",
  "Innovation",
];

const missions: {
  id: string;
  name: string;
  category: string;
  type: string;
  priority: string;
  difficulty: string;
  time: string;
  progress: number;
  state: MissionState;
}[] = [
  {
    id: "active",
    name: "Implement Rate-Limiting Middleware",
    category: "Engineering",
    type: "coding",
    priority: "high",
    difficulty: "intermediate",
    time: "4h",
    progress: 15,
    state: "in-progress",
  },
  {
    id: "bst",
    name: "Implement Binary Search Tree",
    category: "Knowledge",
    type: "learning",
    priority: "medium",
    difficulty: "beginner",
    time: "2h",
    progress: 0,
    state: "ready",
  },
  {
    id: "transformer",
    name: "Study Transformer Architecture",
    category: "Knowledge",
    type: "research",
    priority: "high",
    difficulty: "advanced",
    time: "3h",
    progress: 0,
    state: "pending",
  },
];

const stateColors: Record<string, string> = {
  "in-progress": "text-accent-green border-accent-green/20 bg-accent-green/10",
  ready: "text-accent-blue border-accent-blue/20 bg-accent-blue/10",
  pending: "text-muted-foreground border-border bg-elevation-1",
  paused: "text-accent-amber border-accent-amber/20 bg-accent-amber/10",
  completed: "text-accent-green border-accent-green/20 bg-accent-green/10",
  blocked: "text-accent-red border-accent-red/20 bg-accent-red/10",
};

export default function MissionPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [focusOpen, setFocusOpen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [expandedMission, setExpandedMission] = useState<string | null>("active");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    currentMission,
    setCurrentMission,
    transitionState,
    updateProgress,
    toggleChecklistItem,
    addMission,
    addTimelineEvent,
  } = useMissionStore();

  useEffect(() => {
    if (!currentMission) {
      const mission = generateMission("coding", "rate-limiter");
      mission.state = "in-progress";
      mission.progress = 15;
      mission.template.checklist[0].done = true;
      setCurrentMission(mission);
    }
  }, [currentMission, setCurrentMission]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 60000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const filtered =
    selectedCategory === "All" ? missions : missions.filter((m) => m.category === selectedCategory);

  const handleComplete = () => {
    if (currentMission) {
      transitionState("completed");
      updateProgress(100);
      addTimelineEvent({
        id: `event-${Date.now()}`,
        date: "Today",
        type: "project",
        title: currentMission.template.name,
        description: "Mission completed successfully",
        missionId: currentMission.id,
      });
    }
    setTimerRunning(false);
    setShowCompletion(true);
  };

  return (
    <>
      <div className="flex h-full gap-5 p-6">
        <div className="flex-1 min-w-0 space-y-5 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Today&apos;s Mission</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  One primary mission. Everything else supports it.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="md" className="gap-1.5">
                  <Zap className="h-3 w-3" />
                  Week 7 · Day 3
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto">
              {missionCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                    selectedCategory === cat
                      ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                      : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {currentMission && (
                <GlassCard glow="green" className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="success" size="sm">
                            Primary Mission
                          </Badge>
                          <Badge variant="default" size="sm">
                            {currentMission.template.difficulty}
                          </Badge>
                          <Badge variant="danger" size="sm">
                            High Priority
                          </Badge>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" />~{currentMission.template.estimatedTime}{" "}
                            min
                          </span>
                          <Badge variant="knowledge" size="sm">
                            {currentMission.category}
                          </Badge>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
                            <Target className="h-3 w-3 text-accent-green" />
                            North Star: Become an Elite AI Engineer
                          </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight mb-2">
                          {currentMission.template.name}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                          {currentMission.template.objective}
                        </p>
                        <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-3">
                          <p className="text-xs font-medium text-accent-green mb-0.5">
                            Why it matters
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {currentMission.template.whyItMatters}
                          </p>
                        </div>
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
                            animate={{
                              strokeDashoffset:
                                2 * Math.PI * 34 * (1 - currentMission.progress / 100),
                            }}
                            transition={{ duration: 0.8 }}
                            className="text-accent-green"
                          />
                        </svg>
                        <span className="absolute text-lg font-bold text-accent-green">
                          {currentMission.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => {
                          transitionState("in-progress");
                          setTimerRunning(true);
                        }}
                      >
                        <Play className="h-3.5 w-3.5" />
                        {currentMission.state === "in-progress" ? "Continue" : "Start Mission"}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          transitionState("paused");
                          setTimerRunning(false);
                        }}
                      >
                        <Pause className="h-3.5 w-3.5" />
                        Pause
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setFocusOpen(true)}>
                        <Maximize2 className="h-3.5 w-3.5" />
                        Focus Mode
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleComplete}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete
                      </Button>
                      <div className="flex items-center gap-1.5 ml-auto text-xs text-muted-foreground">
                        <Timer className="h-3.5 w-3.5" />
                        <span>
                          {Math.floor(elapsed / 60)}h {elapsed % 60}m elapsed
                        </span>
                        {currentMission.progress > 0 && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span className="text-accent-green">
                              ETA: {estimateCompletion(currentMission.progress, elapsed)} min
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {currentMission.template.checklist.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <label
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg p-2.5 transition-colors hover:bg-elevation-2 cursor-pointer",
                              item.done && "opacity-50",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => toggleChecklistItem(item.id)}
                              className="h-4 w-4 rounded border-border bg-elevation-3 text-accent-green focus:ring-accent-green/30"
                            />
                            <span
                              className={cn(
                                "flex-1 text-sm",
                                item.done && "text-muted-foreground line-through",
                              )}
                            >
                              {item.label}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {item.duration}
                            </span>
                          </label>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="flex-1 truncate">
                        Resources: {currentMission.template.resources.join(", ")}
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 rounded-full bg-elevation-3">
                      <motion.div
                        className="h-full rounded-full bg-accent-green"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentMission.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </GlassCard>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    All Missions
                  </h3>
                  <Button size="sm" variant="ghost">
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate
                  </Button>
                </div>
                {filtered.map((mission, i) => {
                  const isExpanded = expandedMission === mission.id;
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlassCard
                        className={cn(
                          "transition-all cursor-pointer",
                          mission.id === "active" && "ring-1 ring-accent-green/20",
                        )}
                        hover
                        onClick={() => setExpandedMission(isExpanded ? null : mission.id)}
                      >
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                stateColors[mission.state],
                              )}
                            >
                              {mission.state === "completed" ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : mission.state === "in-progress" ? (
                                <Play className="h-4 w-4" />
                              ) : mission.state === "blocked" ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{mission.name}</p>
                                <Badge
                                  variant={
                                    mission.priority === "high"
                                      ? "danger"
                                      : mission.priority === "medium"
                                        ? "warning"
                                        : "default"
                                  }
                                  size="sm"
                                >
                                  {mission.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                                <span>{mission.category}</span>
                                <span>·</span>
                                <span>{mission.difficulty}</span>
                                <span>·</span>
                                <span>{mission.time}</span>
                                <span>·</span>
                                <span
                                  className={cn(
                                    "capitalize",
                                    mission.state === "in-progress" && "text-accent-green",
                                    mission.state === "ready" && "text-accent-blue",
                                    mission.state === "blocked" && "text-accent-red",
                                  )}
                                >
                                  {mission.state}
                                </span>
                              </div>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                isExpanded && "rotate-180",
                              )}
                            />
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-[340px] shrink-0 space-y-3 overflow-y-auto">
          <GlassCard className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Daily Timeline</span>
            </div>
            <div className="space-y-1">
              {timeline.map((slot) => (
                <div
                  key={slot.hour}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors",
                    slot.type === "deep-work" ? "bg-accent-green/10" : "hover:bg-elevation-2",
                  )}
                >
                  <span className="w-8 font-mono text-[11px] text-muted-foreground">
                    {slot.hour.toString().padStart(2, "0")}:00
                  </span>
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      slot.type === "deep-work"
                        ? "bg-accent-green"
                        : slot.type === "coding"
                          ? "bg-accent-blue"
                          : slot.type === "break" || slot.type === "lunch"
                            ? "bg-accent-amber"
                            : "bg-muted-foreground/40",
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1",
                      slot.type === "deep-work" && "text-accent-green font-medium",
                    )}
                  >
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          <AICoach />

          <MissionHistory />
        </div>
      </div>

      <FocusMode
        open={focusOpen}
        onClose={() => setFocusOpen(false)}
        missionName={currentMission?.template.name}
      />

      <AnimatePresence>
        {showCompletion && currentMission && (
          <MissionCompletion
            data={{
              missionName: currentMission.template.name,
              timeSpent: elapsed,
              focusScore: 85,
              gitCommits: 2,
              knowledgeGained: ["Rate Limiting", "Token Bucket", "Redis Patterns"],
              xpEarned: 250,
            }}
            onClose={() => setShowCompletion(false)}
            onReflect={(reflection) => {
              if (currentMission) {
                addMission({ ...currentMission, reflection });
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
