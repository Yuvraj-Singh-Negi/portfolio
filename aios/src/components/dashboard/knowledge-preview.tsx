"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BrainCircuit, Bookmark, ZoomIn, ZoomOut, Plus } from "lucide-react";

export function KnowledgePreview() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Knowledge Graph</h2>
      </div>

      <div className="flex h-48 items-center justify-center rounded-lg bg-elevation-1 text-xs text-muted-foreground">
        No knowledge graph yet. Add nodes to see connections.
      </div>
    </GlassCard>
  );
}
