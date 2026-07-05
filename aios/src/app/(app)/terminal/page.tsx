"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: number;
  type: "system" | "command" | "output" | "error" | "info" | "success";
  text: string;
  timestamp: string;
}

const bootLogs: LogEntry[] = [
  {
    id: 0,
    type: "system",
    text: "AIOS Terminal v0.1 — Engineering Command Interface",
    timestamp: "",
  },
  { id: 1, type: "system", text: "Kernel: AI Cognitive Engine v1.0 loaded", timestamp: "" },
  { id: 2, type: "info", text: "Session started: Engineer (level 7)", timestamp: "" },
  { id: 3, type: "success", text: "Connected to: AIOS Core", timestamp: "" },
  { id: 4, type: "info", text: "Type 'help' for available commands", timestamp: "" },
];

const helpText = `Available Commands:
  help              Show this help message
  status            Display system status
  missions          List active missions
  projects          Show project overview
  skills            Display skill graph summary
  knowledge         Show knowledge graph stats
  clear             Clear terminal
  theme matrix      Switch to Matrix Mode
  theme default     Return to default theme
  exit              Close terminal session`;

const commands: Record<string, () => string> = {
  help: () => helpText,
  status: () => `System Status:
  AI Engine: Online
  Knowledge Graph: 47 nodes · 156 connections
  GitHub: 3 repos · 342 commits
  Storage: 54% used
  AI Tokens: 2,340 remaining
  Uptime: 7d 14h 32m`,

  missions: () => `Active Missions:
  [IN PROGRESS] Implement Rate-Limiting Middleware (65%)
  [READY]      Implement Binary Search Tree
  [PENDING]    Study Transformer Architecture`,

  projects: () => `Projects Overview:
  AIOS Core        — 45% — Health: Good
  API Gateway      — 78% — Health: Good
  Knowledge Graph  — 32% — Health: Warning`,

  skills: () => `Skill Graph Summary:
  TypeScript       — 85% — Strong
  React            — 78% — Competent
  Backend          — 71% — Competent
  DSA              — 65% — Competent
  System Design    — 55% — Developing
  Math             — 58% — Developing
  Cloud            — 39% — Weak
  ML               — 28% — Weak
  Deep Learning    — 22% — Weak`,

  knowledge: () => `Knowledge Graph:
  Total Nodes: 47
  Connections: 156
  Completed: 32
  In Progress: 15
  Last Updated: 2h ago
  Weakest Area: AI/ML (28% proficiency)`,

  "theme matrix": () => "Theme switched to Matrix Mode. Emerald system engaged.",
  "theme default": () => "Theme switched to Default Dark mode.",
  exit: () => "Session terminated. Type anything to restart.",
};

const typeColors: Record<string, string> = {
  system: "text-accent-cyan",
  command: "text-accent-green",
  output: "text-foreground",
  error: "text-accent-red",
  info: "text-muted-foreground",
  success: "text-accent-green",
};

export default function TerminalPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [streaming, setStreaming] = useState(false);
  const [bootPhase, setBootPhase] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootPhase(false), 300);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!bootPhase) {
      inputRef.current?.focus();
    }
  }, [bootPhase]);

  const streamOutput = useCallback((text: string) => {
    setStreaming(true);
    const chars = text.split("");
    let i = 0;
    const outputId = Date.now();
    setLogs((prev) => [
      ...prev,
      { id: outputId, type: "output", text: "", timestamp: new Date().toLocaleTimeString() },
    ]);

    const interval = setInterval(() => {
      if (i < chars.length) {
        setLogs((prev) =>
          prev.map((log) => (log.id === outputId ? { ...log, text: log.text + chars[i] } : log)),
        );
        i++;
      } else {
        clearInterval(interval);
        setStreaming(false);
      }
    }, 8);

    return () => clearInterval(interval);
  }, []);

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      if (!trimmed) return;

      setLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "command",
          text: `$ ${cmd}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);

      if (trimmed === "clear") {
        setLogs([]);
        return;
      }

      const handler = commands[trimmed];
      if (handler) {
        const output = handler();
        streamOutput(output);
      } else {
        setLogs((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "error",
            text: `Command not found: ${trimmed}. Type 'help' for available commands.`,
            timestamp: "",
          },
        ]);
      }
    },
    [streamOutput],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(newIndex === history.length ? "" : history[newIndex]);
      }
    }
  };

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Terminal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Engineering command interface</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-accent-green/20 bg-accent-green/5 px-2.5 py-1 text-[11px] font-medium text-accent-green">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green shadow-[0_0_6px_rgba(34,211,160,0.5)]" />
            Connected
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-black font-mono text-sm">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-red/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-accent-amber/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-accent-green/60" />
          <span className="ml-2 text-xs text-muted-foreground">aios-terminal — bash</span>
        </div>

        <div className="h-full overflow-y-auto p-4" onClick={() => inputRef.current?.focus()}>
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("mb-1 leading-relaxed", typeColors[log.type])}
              >
                {log.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {!bootPhase && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-accent-green">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground"
                placeholder={streaming ? "" : "Type a command..."}
                disabled={streaming}
              />
              {streaming && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-4 w-2 bg-accent-green"
                />
              )}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>↑↓ History</span>
        <span>Tab Complete</span>
        <span>Ctrl+L Clear</span>
        <span className="ml-auto">{history.length} commands executed</span>
      </div>
    </div>
  );
}
