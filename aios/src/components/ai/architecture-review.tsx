"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AICognitiveEngine } from "@/lib/ai/engine";
import {
  BrainCircuit,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Server,
  Database,
  Shield,
  Zap,
} from "lucide-react";

interface ArchitectureReviewProps {
  engine: AICognitiveEngine;
}

interface ReviewDimension {
  label: string;
  icon: typeof BrainCircuit;
  score: number;
  details: string[];
  color: string;
}

function simulateArchReview(description: string, technologies: string[]): ReviewDimension[] {
  const hasDB = technologies.some((t) =>
    ["postgresql", "mongodb", "redis", "mysql", "neon"].includes(t.toLowerCase()),
  );
  const hasAPI = technologies.some((t) => ["graphql", "rest", "grpc"].includes(t.toLowerCase()));
  const hasSecurity = technologies.some((t) =>
    ["auth", "oauth", "jwt", "security"].includes(t.toLowerCase()),
  );

  return [
    {
      label: "Scalability",
      icon: Server,
      score: description.length > 20 ? 75 : 50,
      details: [
        description.length > 50
          ? "Well-described system boundaries"
          : "Add more detail about system boundaries",
        hasAPI
          ? "API layer supports horizontal scaling"
          : "Consider adding API gateway for scaling",
      ],
      color: "text-accent-blue",
    },
    {
      label: "Data Architecture",
      icon: Database,
      score: hasDB ? 80 : 40,
      details: [
        hasDB ? "Database choice aligns with workload" : "No database technology specified",
        hasDB
          ? "Consider read replicas for query-heavy workloads"
          : "Evaluate PostgreSQL for general purpose",
      ],
      color: "text-accent-green",
    },
    {
      label: "Security",
      icon: Shield,
      score: hasSecurity ? 70 : 35,
      details: [
        hasSecurity ? "Auth mechanism identified" : "No security considerations mentioned",
        "Apply defense-in-depth principle at every layer",
      ],
      color: "text-accent-red",
    },
    {
      label: "Performance",
      icon: Zap,
      score: 65,
      details: [
        "Consider caching strategy (CDN, Redis, application-level)",
        "Add query optimization and indexing strategy",
        "Evaluate async processing for non-critical paths",
      ],
      color: "text-accent-amber",
    },
  ];
}

export function ArchitectureReview({ engine }: ArchitectureReviewProps) {
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [patterns, setPatterns] = useState("");
  const [result, setResult] = useState<ReviewDimension[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = useCallback(async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1000));
    const techs = technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setResult(simulateArchReview(description, techs));
    setLoading(false);
  }, [description, technologies, patterns]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your system architecture..."
            className="w-full h-28 rounded-xl border border-border bg-elevation-1 p-3 text-xs outline-none resize-none placeholder:text-muted-foreground focus:border-accent-purple/30 transition-colors"
          />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">
                Technologies (comma-separated)
              </p>
              <input
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="PostgreSQL, Redis, Kafka..."
                className="w-full rounded-lg border border-border bg-elevation-1 px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Patterns (comma-separated)</p>
              <input
                value={patterns}
                onChange={(e) => setPatterns(e.target.value)}
                placeholder="CQRS, Event Sourcing, Saga..."
                className="w-full rounded-lg border border-border bg-elevation-1 px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleReview} disabled={loading || !description.trim()} className="w-full">
          {loading ? "Analyzing Architecture..." : "Review Architecture"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="h-4 w-4 text-accent-purple" />
                <span className="text-sm font-semibold">Architecture Analysis</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {result.map((dim) => (
                  <div key={dim.label} className="text-center">
                    <dim.icon className={cn("h-4 w-4 mx-auto mb-1", dim.color)} />
                    <p
                      className={cn(
                        "text-sm font-bold",
                        dim.score >= 70
                          ? "text-accent-green"
                          : dim.score >= 50
                            ? "text-accent-amber"
                            : "text-accent-red",
                      )}
                    >
                      {dim.score}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">{dim.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {result.map((dim, i) => (
              <GlassCard key={dim.label} className="p-3" hover>
                <div className="flex items-center gap-2 mb-2">
                  <dim.icon className={cn("h-4 w-4", dim.color)} />
                  <span className="text-xs font-semibold">{dim.label}</span>
                  <span
                    className={cn(
                      "text-xs font-bold ml-auto",
                      dim.score >= 70 ? "text-accent-green" : "text-accent-amber",
                    )}
                  >
                    {dim.score}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-elevation-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      dim.score >= 70 ? "bg-accent-green" : "bg-accent-amber",
                    )}
                  />
                </div>
                <div className="space-y-1">
                  {dim.details.map((d, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-1.5 text-[10px] text-muted-foreground"
                    >
                      {d.startsWith("Consider") ||
                      d.startsWith("Add") ||
                      d.startsWith("Evaluate") ? (
                        <Lightbulb className="h-3 w-3 text-accent-amber mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 text-accent-green mt-0.5 shrink-0" />
                      )}
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
