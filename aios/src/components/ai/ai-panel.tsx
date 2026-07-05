"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { AICognitiveEngine } from "@/lib/ai/engine";
import { cn } from "@/lib/utils";
import type { AIMode, AIAction } from "@/lib/ai/types";
import {
  Bot,
  Lightbulb,
  BrainCircuit,
  Code2,
  Target,
  Microscope,
  BarChart3,
  Calendar,
  GraduationCap,
  X,
  Sparkles,
  AlertTriangle,
  Award,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MODE_ICONS: Record<AIMode, LucideIcon> = {
  architect: BrainCircuit,
  mentor: GraduationCap,
  "pair-programmer": Code2,
  career: Target,
  research: Microscope,
  analytics: BarChart3,
  planner: Calendar,
  coach: Lightbulb,
};

const MODE_LABELS: Record<AIMode, string> = {
  architect: "Architect",
  mentor: "Mentor",
  "pair-programmer": "Pair Programmer",
  career: "Career",
  research: "Research",
  analytics: "Analytics",
  planner: "Planner",
  coach: "Coach",
};

const MODE_DESCRIPTIONS: Record<AIMode, string> = {
  architect: "Review architecture, detect bottlenecks, suggest abstractions",
  mentor: "Question assumptions, challenge decisions, teach first principles",
  "pair-programmer": "Explain, reason, compare alternatives, generate code",
  career: "Estimate readiness, recommend improvements, identify gaps",
  research: "Discover papers, books, resources matching your journey",
  analytics: "Track trends, analyze velocity, measure growth",
  planner: "Generate daily, weekly, and monthly missions",
  coach: "Observe progress, detect frustration, adjust difficulty",
};

interface AIPanelProps {
  engine: AICognitiveEngine;
  onClose?: () => void;
}

export function AIPanel({ engine, onClose }: AIPanelProps) {
  const [activeMode, setActiveMode] = useState<AIMode>("coach");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const insights = engine.getInsights();
  const twin = engine.getTwin();
  const careerReport = engine.generateCareerReport();
  const roadmap = engine.generateRoadmap();

  const handleAction = useCallback(
    async (action: string) => {
      setLoading(true);
      setResponse("");

      try {
        const result = await engine.execute({
          mode: activeMode,
          action: action as AIAction,
          context: activeMode,
          prompt: `I'm working on ${activeMode} tasks. Give me specific, actionable advice based on my current state.`,
        });
        setResponse(result.content);
      } catch {
        setResponse("Unable to process request. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [engine, activeMode],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <GlassCard className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-purple/10">
              <Bot className="h-4 w-4 text-accent-purple" />
            </div>
            <span className="text-sm font-semibold">AI Cognitive Engine</span>
            <Badge variant="ai" size="sm">
              v1.0
            </Badge>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-1 border-b border-border p-2 overflow-x-auto">
          {(Object.keys(MODE_LABELS) as AIMode[]).map((mode) => {
            const Icon = MODE_ICONS[mode];
            const isActive = activeMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-accent-purple/10 text-accent-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-elevation-2",
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive && "text-accent-purple")} />
                {MODE_LABELS[mode]}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="rounded-lg border border-accent-purple/20 bg-accent-purple/5 p-2.5">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-accent-purple">
                {MODE_LABELS[activeMode]} Mode:{" "}
              </span>
              {MODE_DESCRIPTIONS[activeMode]}
            </p>
          </div>

          {activeMode === "coach" && (
            <>
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Active Insights ({insights.length})
                </p>
                {insights.slice(0, 4).map((insight) => {
                  const Icon =
                    insight.type === "achievement"
                      ? Award
                      : insight.type === "warning"
                        ? AlertTriangle
                        : insight.type === "alert"
                          ? Info
                          : Sparkles;
                  const colorMap = {
                    achievement: "text-accent-green",
                    warning: "text-accent-amber",
                    alert: "text-accent-red",
                    suggestion: "text-accent-blue",
                    insight: "text-accent-purple",
                  };
                  return (
                    <div
                      key={insight.id}
                      className="flex items-start gap-2 rounded-lg p-2 hover:bg-elevation-2 transition-colors"
                    >
                      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", colorMap[insight.type])} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{insight.title}</p>
                        <p className="text-[11px] text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Time Allocation
                </p>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                  {[
                    { pct: twin.timeAllocation.learning, color: "bg-accent-blue" },
                    { pct: twin.timeAllocation.building, color: "bg-accent-green" },
                    { pct: twin.timeAllocation.research, color: "bg-accent-purple" },
                    { pct: twin.timeAllocation.review, color: "bg-accent-amber" },
                    { pct: twin.timeAllocation.other, color: "bg-muted-foreground" },
                  ].map((seg, i) => (
                    <div key={i} className={seg.color} style={{ width: `${seg.pct}%` }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
                    Learn {twin.timeAllocation.learning}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    Build {twin.timeAllocation.building}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
                    Research {twin.timeAllocation.research}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
                    Review {twin.timeAllocation.review}%
                  </span>
                </div>
              </div>
            </>
          )}

          {activeMode === "career" && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Career Readiness
              </p>
              {careerReport.map((report) => (
                <div key={report.area} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{report.area}</span>
                    <span
                      className={cn(
                        "font-mono",
                        report.score >= 70
                          ? "text-accent-green"
                          : report.score >= 50
                            ? "text-accent-amber"
                            : "text-accent-red",
                      )}
                    >
                      {report.score}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-elevation-3">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        report.score >= 70
                          ? "bg-accent-green"
                          : report.score >= 50
                            ? "bg-accent-amber"
                            : "bg-accent-red",
                      )}
                      style={{ width: `${report.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{report.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {activeMode === "planner" && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Generated Roadmap
              </p>
              {roadmap.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border p-2.5",
                    item.status === "active"
                      ? "border-accent-green/20 bg-accent-green/5"
                      : "border-border bg-elevation-1",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        item.status === "active" ? "bg-accent-green" : "bg-muted-foreground/40",
                      )}
                    />
                    <p className="text-xs font-medium">{item.title}</p>
                    <Badge variant="default" size="sm">
                      {item.estimatedHours}h
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.description}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    <span className="text-accent-purple">Why:</span> {item.reason}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeMode === "architect" && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Project Analysis
              </p>
              {twin.projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleAction(`analyze ${project.name}`)}
                  className="w-full text-left rounded-lg border border-border p-2.5 hover:border-accent-purple/20 hover:bg-accent-purple/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium">{project.name}</p>
                    <Badge
                      variant={
                        project.health === "good"
                          ? "success"
                          : project.health === "warning"
                            ? "warning"
                            : "danger"
                      }
                      size="sm"
                    >
                      {project.health}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {project.technologies.join(" · ")}
                  </p>
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex gap-1">
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-purple"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-purple"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-purple"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {response && !loading && (
            <div className="rounded-lg border border-accent-purple/20 bg-accent-purple/5 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            {(activeMode === "coach" || activeMode === "mentor") && (
              <>
                <button
                  onClick={() => handleAction("explain")}
                  className="flex-1 rounded-lg border border-border p-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
                >
                  Explain
                </button>
                <button
                  onClick={() => handleAction("suggest")}
                  className="flex-1 rounded-lg border border-border p-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
                >
                  Suggest
                </button>
                <button
                  onClick={() => handleAction("review")}
                  className="flex-1 rounded-lg border border-border p-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
                >
                  Review
                </button>
              </>
            )}
            {(activeMode === "analytics" || activeMode === "research") && (
              <button
                onClick={() => handleAction("analyze")}
                className="w-full rounded-lg border border-border p-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
              >
                Generate Analysis
              </button>
            )}
            {activeMode === "planner" && (
              <button
                onClick={() => handleAction("generate")}
                className="w-full rounded-lg border border-border p-2 text-[10px] text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
              >
                Generate Plan
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
