"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FOCUS_OPTIONS,
  LANGUAGE_OPTIONS,
  type CodeReviewRequest,
  type CodeReviewResult,
} from "@/features/ai/types";
import { AICognitiveEngine } from "@/lib/ai/engine";
import { Code2, AlertTriangle, CheckCircle2, Info, ArrowRight } from "lucide-react";

interface CodeReviewProps {
  engine: AICognitiveEngine;
}

function simulateReview(request: CodeReviewRequest): CodeReviewResult {
  const lines = request.code.split("\n").length;
  const hasIssues = request.code.length > 0;
  const issues: CodeReviewResult["issues"] = [];
  let score = 85;

  if (hasIssues) {
    issues.push({
      line: 1,
      severity: "info",
      message: `File is ${lines} lines long`,
      suggestion: "Consider breaking into smaller modules if > 200 lines",
    });
    score -= 0;
  }

  if (request.code.includes("any") && request.language === "TypeScript") {
    issues.push({
      line: undefined,
      severity: "warning",
      message: "Use of `any` suppresses type checking",
      suggestion: "Replace with `unknown` or a proper type",
    });
    score -= 10;
  }

  if (request.code.includes("TODO") || request.code.includes("FIXME")) {
    issues.push({
      line: undefined,
      severity: "info",
      message: "Code contains TODO/FIXME comments",
      suggestion: "Address before merging to main",
    });
    score -= 5;
  }

  if (request.code.includes("console.log")) {
    issues.push({
      line: undefined,
      severity: "warning",
      message: "console.log left in code",
      suggestion: "Replace with proper logging framework",
    });
    score -= 5;
  }

  const summary = `Reviewed ${lines} lines of ${request.language} code. Found ${issues.length} issue${issues.length !== 1 ? "s" : ""}. Overall quality: ${score >= 80 ? "good" : score >= 60 ? "acceptable" : "needs improvement"}.`;

  return { issues, summary, score: Math.max(0, score) };
}

export function CodeReview({ engine }: CodeReviewProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [focus, setFocus] = useState<CodeReviewRequest["focus"]>("all");
  const [result, setResult] = useState<CodeReviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = useCallback(async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    // Use mock analysis for now; real provider integration later
    await new Promise((r) => setTimeout(r, 800));
    setResult(simulateReview({ code, language, focus }));
    setLoading(false);
  }, [code, language, focus]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-border bg-elevation-1 px-3 py-1.5 text-xs outline-none text-muted-foreground"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            {FOCUS_OPTIONS.map((fo) => (
              <button
                key={fo.value}
                onClick={() => setFocus(fo.value)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                  focus === fo.value
                    ? "border-accent-purple/30 bg-accent-purple/10 text-accent-purple"
                    : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
                )}
              >
                {fo.label}
              </button>
            ))}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here for AI review..."
            className="w-full h-48 rounded-xl border border-border bg-elevation-1 p-4 text-xs font-mono outline-none resize-none placeholder:text-muted-foreground focus:border-accent-purple/30 transition-colors"
            spellCheck={false}
          />
        </div>

        <Button onClick={handleReview} disabled={loading || !code.trim()} className="w-full">
          {loading ? "Analyzing..." : "Review Code"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <GlassCard className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "text-lg font-bold",
                    result.score >= 80
                      ? "text-accent-green"
                      : result.score >= 60
                        ? "text-accent-amber"
                        : "text-accent-red",
                  )}
                >
                  {result.score}/100
                </span>
                <Badge
                  variant={
                    result.score >= 80 ? "success" : result.score >= 60 ? "warning" : "danger"
                  }
                  size="sm"
                >
                  {result.score >= 80 ? "Good" : result.score >= 60 ? "Fair" : "Needs Work"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{result.summary}</p>
            </GlassCard>

            {result.issues.map((issue, i) => (
              <GlassCard key={i} className="p-3" hover>
                <div className="flex items-start gap-2">
                  {issue.severity === "error" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-accent-red mt-0.5 shrink-0" />
                  ) : issue.severity === "warning" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-accent-amber mt-0.5 shrink-0" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-accent-blue mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge
                        size="sm"
                        variant={
                          issue.severity === "error"
                            ? "danger"
                            : issue.severity === "warning"
                              ? "warning"
                              : "knowledge"
                        }
                      >
                        {issue.severity}
                      </Badge>
                      {issue.line && (
                        <span className="text-[10px] text-muted-foreground">Line {issue.line}</span>
                      )}
                    </div>
                    <p className="text-xs">{issue.message}</p>
                    {issue.suggestion && (
                      <div className="flex items-start gap-1 mt-1 text-[10px] text-accent-green">
                        <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{issue.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
