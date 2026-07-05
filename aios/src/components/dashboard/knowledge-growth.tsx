"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { BrainCircuit, Plus, Bookmark } from "lucide-react";

const nodes = [
  { label: "Rust Ownership", connections: 12, color: "text-accent-green", active: true },
  { label: "Distributed Consensus", connections: 8, color: "text-accent-purple", active: true },
  { label: "Reactive Streams", connections: 6, color: "text-accent-cyan", active: false },
  { label: "Zero Trust", connections: 9, color: "text-accent-blue", active: true },
];

export function KnowledgeGrowth() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold">Knowledge Growth</h2>
          <p className="text-xs text-muted-foreground mt-0.5">47 nodes · 156 connections</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-accent-green">
          <Plus className="h-3 w-3" />
          <span>+3 this week</span>
        </div>
      </div>

      <div className="relative mb-4 flex h-32 items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border border-accent-purple/20" />
          <div className="absolute h-16 w-16 rounded-full border border-accent-purple/10" />
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {nodes.map((node, i) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: node.active ? 1 : 0.4, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
              className={`flex items-center gap-2 rounded-lg border ${
                node.active
                  ? "border-accent-green/20 bg-accent-green/5"
                  : "border-border bg-elevation-1"
              } px-2.5 py-1.5 cursor-pointer hover:border-accent-green/40 transition-colors`}
            >
              <Bookmark className={`h-3 w-3 ${node.color}`} />
              <span className="text-xs font-medium truncate">{node.label}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{node.connections}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="rounded-lg bg-elevation-1 p-2.5 border border-card-border"
        whileHover={{ borderColor: "rgba(168,85,247,0.2)" }}
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-accent-purple" />
          <p className="text-xs text-muted-foreground">
            <span className="text-accent-purple">AI Suggestion:</span> Your knowledge of distributed
            systems is growing. Consider connecting &ldquo;Raft Consensus&rdquo; to your existing
            nodes.
          </p>
        </div>
      </motion.div>
    </GlassCard>
  );
}
