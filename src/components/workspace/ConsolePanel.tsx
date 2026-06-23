"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogEntry {
  text: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "success";
}

interface ConsolePanelProps {
  logs?: LogEntry[];
  className?: string;
}

function parseANSI(text: string): Array<{ text: string; color?: string }> {
  const segments: Array<{ text: string; color?: string }> = [];
  const ansiRegex = /\x1b\[(\d+)(?:;(\d+))*m/g;
  let lastIndex = 0;
  let currentColor: string | undefined;

  const colorMap: Record<string, string> = {
    "30": "text-zinc-500",
    "31": "text-red-400",
    "32": "text-emerald-400",
    "33": "text-amber-400",
    "34": "text-blue-400",
    "35": "text-purple-400",
    "36": "text-cyan-400",
    "37": "text-zinc-200",
    "90": "text-zinc-600",
    "91": "text-red-300",
    "92": "text-emerald-300",
    "93": "text-amber-300",
    "94": "text-blue-300",
    "95": "text-purple-300",
    "96": "text-cyan-300",
  };

  let match: RegExpExecArray | null;
  while ((match = ansiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        color: currentColor,
      });
    }
    const code = match[1];
    if (code) {
      if (code === "0") {
        currentColor = undefined;
      } else {
        currentColor = colorMap[code];
      }
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), color: currentColor });
  }

  return segments;
}

export function ConsolePanel({
  logs = [],
  className,
}: ConsolePanelProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 50);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#050505] font-mono text-xs",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
        <span className="text-[11px] font-medium text-zinc-500">Console</span>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              autoScroll ? "bg-emerald-500" : "bg-zinc-600"
            )}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3"
      >
        {logs.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-zinc-700">No output yet</p>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {logs.map((log, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                log.level === "error" && "bg-red-950/20",
                log.level === "warn" && "bg-amber-950/20",
                log.level === "success" && "bg-emerald-950/20"
              )}
            >
              <span className="shrink-0 text-zinc-700">
                {log.timestamp.toISOString().slice(11, 23)}
              </span>
              <span
                className={cn(
                  log.level === "error" && "text-red-400",
                  log.level === "warn" && "text-amber-400",
                  log.level === "success" && "text-emerald-400",
                  log.level === "info" && "text-zinc-400"
                )}
              >
                {parseANSI(log.text).map((seg, j) => (
                  <span key={j} className={seg.color}>
                    {seg.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">$</span>
          <span className="text-zinc-600">ready</span>
        </div>
      </div>
    </div>
  );
}
