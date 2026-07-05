"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { GitBranch } from "lucide-react";

export function GitHubPanel() {
  return (
    <GlassCard className="p-4">
      <h2 className="text-sm font-semibold mb-3">GitHub Activity</h2>
      <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
        Connect GitHub to see your activity
      </div>
    </GlassCard>
  );
}
