"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BrainCircuit, Bookmark, ZoomIn, ZoomOut, Plus } from "lucide-react";

const nodes = [
  {
    id: "rust-ownership",
    label: "Rust Ownership",
    x: 30,
    y: 50,
    color: "text-accent-green",
    connections: ["system-design", "memory-safety"],
  },
  {
    id: "distributed-consensus",
    label: "Consensus",
    x: 65,
    y: 35,
    color: "text-accent-purple",
    connections: ["system-design", "raft"],
  },
  {
    id: "system-design",
    label: "System Design",
    x: 50,
    y: 55,
    color: "text-accent-amber",
    connections: [],
  },
  {
    id: "reactive-streams",
    label: "Reactive",
    x: 20,
    y: 75,
    color: "text-accent-cyan",
    connections: ["system-design"],
  },
  {
    id: "memory-safety",
    label: "Memory Safety",
    x: 80,
    y: 70,
    color: "text-accent-blue",
    connections: ["system-design"],
  },
];

export function KnowledgePreview() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Knowledge Graph</h2>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative h-48 rounded-lg bg-elevation-1 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
          <svg className="absolute inset-0 h-full w-full">
            {nodes.map((node) =>
              node.connections.map((connId) => {
                const target = nodes.find((n) => n.id === connId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${connId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border-light"
                  />
                );
              }),
            )}
          </svg>

          {nodes.map((node) => (
            <motion.button
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.15 }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition-all",
                activeNode === node.id
                  ? `${node.color} border-current bg-background shadow-glow-green z-10`
                  : "border-border bg-elevation-2 text-muted-foreground hover:text-foreground",
              )}
            >
              <Bookmark className={cn("h-2.5 w-2.5", node.color)} />
              {node.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {nodes.length} nodes · {nodes.reduce((a, n) => a + n.connections.length, 0)} edges
        </span>
        <button className="flex items-center gap-1 text-[10px] text-accent-green hover:text-accent-green-dim transition-colors">
          <Plus className="h-3 w-3" />
          View full graph
        </button>
      </div>
    </GlassCard>
  );
}
