"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIPanel } from "@/components/ai/ai-panel";
import { AICognitiveEngine } from "@/lib/ai/engine";
import { cn } from "@/lib/utils";
import type { AIMode } from "@/lib/ai/types";
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  BrainCircuit,
  Code2,
  Target,
  GraduationCap,
  ArrowRight,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const suggestions = [
  "Explain the transformer architecture from first principles",
  "Review my system design for the API gateway",
  "Help me understand Rust's borrow checker",
  "What should I learn next based on my progress?",
  "Analyze my current project architecture",
  "Prepare me for a senior engineering interview",
];

const quickModes: { mode: AIMode; icon: LucideIcon; label: string; color: string }[] = [
  { mode: "mentor", icon: GraduationCap, label: "Mentor", color: "text-accent-purple" },
  { mode: "architect", icon: BrainCircuit, label: "Architect", color: "text-accent-blue" },
  { mode: "pair-programmer", icon: Code2, label: "Pair", color: "text-accent-green" },
  { mode: "career", icon: Target, label: "Career", color: "text-accent-amber" },
];

export default function MentorPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeQuickMode, setActiveQuickMode] = useState<AIMode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const engine = useMemo(() => new AICognitiveEngine("user-1"), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const result = await engine.execute({
        mode: activeQuickMode || "mentor",
        action: "explain",
        context: message,
        prompt: message,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: result.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-5 p-6">
      <div className="flex-1 flex flex-col min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">AI Mentor</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your Engineering Operating Intelligence
              </p>
            </div>
            <Badge variant="ai" size="md" className="gap-1.5">
              <Bot className="h-3 w-3" />
              Cognitive Engine v1.0
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {quickModes.map((qm) => {
              const Icon = qm.icon;
              return (
                <button
                  key={qm.mode}
                  onClick={() => setActiveQuickMode(activeQuickMode === qm.mode ? null : qm.mode)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    activeQuickMode === qm.mode
                      ? "border-accent-purple/30 bg-accent-purple/10 text-accent-purple"
                      : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", qm.color)} />
                  {qm.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-purple/10 mb-4">
                <Bot className="h-8 w-8 text-accent-purple" />
              </div>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                I&apos;m your AI Cognitive Engine — I understand your skills, projects, knowledge,
                and goals. Ask me anything about engineering, architecture, or your growth.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-left text-xs text-muted-foreground hover:text-foreground hover:border-border-light hover:bg-elevation-2 transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-accent-purple shrink-0" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-3",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10">
                  <Bot className="h-4 w-4 text-accent-purple" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-xl px-4 py-3",
                  msg.role === "assistant"
                    ? "border border-border bg-elevation-1 text-foreground"
                    : "bg-accent-green/10 text-accent-green",
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-green/10">
                  <User className="h-4 w-4 text-accent-green" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple/10">
                <Bot className="h-4 w-4 text-accent-purple" />
              </div>
              <div className="rounded-xl border border-border bg-elevation-1 px-4 py-3">
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
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 flex items-center gap-2 rounded-xl border border-border bg-elevation-1 p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              activeQuickMode
                ? `Ask the ${quickModes.find((q) => q.mode === activeQuickMode)?.label} mode...`
                : "Ask your AI Mentor anything..."
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            size="icon-sm"
            variant="primary"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="w-[340px] shrink-0">
        <AIPanel engine={engine} />
      </div>
    </div>
  );
}
