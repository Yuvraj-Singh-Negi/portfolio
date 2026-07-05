"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIPanel } from "@/components/ai/ai-panel";
import { AICognitiveEngine } from "@/lib/ai/engine";
import { cn } from "@/lib/utils";
import { useAIStore } from "@/features/ai/store";
import { CodeReview } from "@/components/ai/code-review";
import { ArchitectureReview } from "@/components/ai/architecture-review";
import { ResearchAssistant } from "@/components/ai/research-assistant";
import type { AIMode } from "@/lib/ai/types";
import type { ChatTab } from "@/features/ai/types";
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  BrainCircuit,
  Code2,
  Target,
  GraduationCap,
  MessageSquare,
  Shield,
  Microscope,
  User,
  Plus,
  Trash2,
} from "lucide-react";

const suggestions = [
  "Explain the transformer architecture from first principles",
  "Review my system design for the API gateway",
  "Help me understand Rust's borrow checker",
  "What should I learn next based on my progress?",
];

const quickModes: { mode: AIMode; icon: typeof GraduationCap; label: string; color: string }[] = [
  { mode: "mentor", icon: GraduationCap, label: "Mentor", color: "text-accent-purple" },
  { mode: "architect", icon: BrainCircuit, label: "Architect", color: "text-accent-blue" },
  { mode: "pair-programmer", icon: Code2, label: "Pair", color: "text-accent-green" },
  { mode: "career", icon: Target, label: "Career", color: "text-accent-amber" },
];

const tabs: { id: ChatTab; label: string; icon: typeof MessageSquare; color: string }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare, color: "text-accent-purple" },
  { id: "code-review", label: "Code Review", icon: Code2, color: "text-accent-green" },
  { id: "architecture", label: "Architecture", icon: Shield, color: "text-accent-blue" },
  { id: "research", label: "Research", icon: Microscope, color: "text-accent-amber" },
];

export default function MentorPage() {
  const {
    activeTab,
    setActiveTab,
    sessions,
    activeSessionId,
    createSession,
    selectSession,
    deleteSession,
    addMessage,
  } = useAIStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeQuickMode, setActiveQuickMode] = useState<AIMode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const engine = useMemo(() => new AICognitiveEngine("user-1"), []);

  const activeSession = useAIStore((st) => st.sessions.find((s) => s.id === st.activeSessionId));
  const currentMessages = activeSession?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createSession(activeQuickMode || "mentor");
    }

    setInput("");
    const mode = activeQuickMode || "mentor";
    addMessage(sessionId, "user", message, mode);
    setLoading(true);

    try {
      const result = await engine.execute({
        mode,
        action: "explain",
        context: message,
        prompt: message,
      });
      addMessage(sessionId, "assistant", result.content, mode);
    } catch {
      addMessage(sessionId, "assistant", "I encountered an error. Please try again.", mode);
    } finally {
      setLoading(false);
    }
  };

  const modeSessions = activeSessionId
    ? sessions.filter((s) => s.mode === (activeQuickMode || "mentor"))
    : [];

  return (
    <div className="flex h-full gap-5 p-6">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0 mb-4 space-y-3">
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

          <div className="flex items-center gap-1 rounded-lg border border-border bg-elevation-1 p-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors flex-1 justify-center",
                    activeTab === tab.id
                      ? "bg-elevation-3 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {currentMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-purple/10 mb-4">
                    <Bot className="h-8 w-8 text-accent-purple" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    I&apos;m your AI Cognitive Engine — I understand your skills, projects,
                    knowledge, and goals.
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {quickModes.map((qm) => {
                      const Icon = qm.icon;
                      return (
                        <button
                          key={qm.mode}
                          onClick={() =>
                            setActiveQuickMode(activeQuickMode === qm.mode ? null : qm.mode)
                          }
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

              {currentMessages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
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
                      {[0, 150, 300].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-purple"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
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
          </>
        )}

        {activeTab === "code-review" && <CodeReview engine={engine} />}

        {activeTab === "architecture" && <ArchitectureReview engine={engine} />}

        {activeTab === "research" && <ResearchAssistant engine={engine} />}
      </div>

      <div className="w-[340px] shrink-0 flex flex-col gap-3">
        {activeTab === "chat" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Conversations
              </h3>
              <button
                onClick={() => {
                  createSession(activeQuickMode || "mentor");
                }}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {modeSessions.length === 0 && (
                <p className="text-[10px] text-muted-foreground text-center py-2">
                  No conversations yet
                </p>
              )}
              {modeSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => selectSession(s.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-colors group",
                    activeSessionId === s.id
                      ? "bg-elevation-3 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-elevation-2",
                  )}
                >
                  <span className="truncate flex-1">{s.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:text-accent-red transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <AIPanel engine={engine} />
      </div>
    </div>
  );
}
