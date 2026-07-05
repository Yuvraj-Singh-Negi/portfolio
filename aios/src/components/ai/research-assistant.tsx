"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AICognitiveEngine } from "@/lib/ai/engine";
import { resources, getResourcesByTopic } from "@/features/learning/resources";
import {
  Microscope,
  ExternalLink,
  BookOpen,
  FileText,
  GraduationCap,
  Clock,
  Sparkles,
} from "lucide-react";

interface ResearchAssistantProps {
  engine: AICognitiveEngine;
}

export function ResearchAssistant({ engine }: ResearchAssistantProps) {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"quick" | "moderate" | "deep">("moderate");
  const [result, setResult] = useState<{
    aiResponse: string;
    matchedResources: typeof resources;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResearch = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1000));

    const matched = getResourcesByTopic(topic.toLowerCase());
    const aiResponse = `Here's what I found about "${topic}":\n\n${
      matched.length > 0
        ? `Found ${matched.length} relevant resources in your library. ${matched
            .slice(0, 3)
            .map((r) => `"${r.title}" by ${r.author}`)
            .join(", ")}`
        : "No direct library matches found. I recommend starting with foundational tutorials and official documentation."
    }`;

    setResult({ aiResponse, matchedResources: matched });
    setLoading(false);
  }, [topic, depth]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {(["quick", "moderate", "deep"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  depth === d
                    ? "border-accent-purple/30 bg-accent-purple/10 text-accent-purple"
                    : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
                )}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-elevation-1 p-2">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              placeholder="Research a topic (e.g., 'distributed consensus', 'Rust async')..."
              className="flex-1 bg-transparent px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
            />
            <Button size="sm" onClick={handleResearch} disabled={loading || !topic.trim()}>
              {loading ? "Searching..." : "Research"}
            </Button>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <GlassCard className="p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-accent-purple mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {result.aiResponse}
                </p>
              </div>
            </GlassCard>

            {result.matchedResources.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Library Resources
                </h3>
                <div className="space-y-2">
                  {result.matchedResources.map((r) => (
                    <GlassCard key={r.id} className="p-3" hover>
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-accent-blue mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium truncate">{r.title}</span>
                            <Badge size="sm" variant="knowledge">
                              {r.type}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {r.author} · {r.difficulty} · {r.duration}
                          </p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!result && (
          <div className="text-center py-8">
            <Microscope className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Search across your library and the web</p>
          </div>
        )}
      </div>
    </div>
  );
}
