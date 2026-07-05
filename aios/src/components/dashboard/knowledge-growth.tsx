"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { BrainCircuit, Plus, Bookmark } from "lucide-react";

const nodes: { label: string; connections: number; color: string; active: boolean }[] = [];

export function KnowledgeGrowth() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold">Knowledge Growth</h2>
          <p className="text-xs text-muted-foreground mt-0.5">0 nodes · 0 connections</p>
        </div>
      </div>

      <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
        No knowledge nodes yet. Start learning to build your graph.
      </div>
    </GlassCard>
  );
}
