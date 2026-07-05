"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, ChevronDown, MessageSquare, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoachMessage {
  role: "coach" | "user";
  text: string;
}

const initialMessages: CoachMessage[] = [
  {
    role: "coach",
    text: "I see you're working on rate limiting. Let me know if you need help with the token bucket algorithm or Redis integration.",
  },
];

const suggestions = [
  "Explain token bucket vs sliding window",
  "How do I connect to Redis?",
  "Review my current implementation",
  "What happens in a distributed scenario?",
  "Debug this error message",
];

export function AICoach() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input.trim() }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "coach", text: "That's a great question. Let me help you think through this..." },
      ]);
    }, 1000);
  };

  return (
    <GlassCard className={cn("transition-all duration-300", expanded ? "flex-1" : "")}>
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center gap-2 p-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-purple/10">
          <Bot className="h-4 w-4 text-accent-purple" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">AI Coach</p>
          <p className="text-xs text-muted-foreground">Ask anything about your mission</p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-3 py-2">
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-xs",
                        msg.role === "coach"
                          ? "bg-elevation-3 text-muted-foreground"
                          : "bg-accent-green/10 text-accent-green",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-border-light transition-colors"
                    onClick={() => setMessages((prev) => [...prev, { role: "user", text: s }])}
                  >
                    <Sparkles className="h-2.5 w-2.5 text-accent-purple" />
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-elevation-1 p-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask the AI Coach..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleSend}
                  className="rounded-md bg-accent-green p-1.5 text-black hover:bg-accent-green-dim transition-colors"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
