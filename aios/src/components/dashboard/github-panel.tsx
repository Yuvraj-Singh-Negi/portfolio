"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { GitCommit, GitPullRequest, GitBranch, Star, Activity, Circle } from "lucide-react";

const contributions = [
  { day: "Mon", count: 3 },
  { day: "Tue", count: 5 },
  { day: "Wed", count: 2 },
  { day: "Thu", count: 7 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 1 },
  { day: "Sun", count: 0 },
];

const repos = [
  { name: "aios-core", stars: 12, prs: 2, ci: "passing" },
  { name: "api-gateway", stars: 8, prs: 1, ci: "passing" },
  { name: "knowledge-graph", stars: 5, prs: 0, ci: "pending" },
];

const commits = [
  { message: "feat: implement token bucket rate limiter", repo: "api-gateway", time: "1h ago" },
  { message: "fix: correct Redis connection pooling", repo: "aios-core", time: "3h ago" },
  { message: "docs: update API documentation", repo: "aios-core", time: "5h ago" },
];

export function GitHubPanel() {
  const maxCount = Math.max(...contributions.map((c) => c.count));

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">GitHub Activity</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            25
          </span>
          <span className="flex items-center gap-1">
            <GitPullRequest className="h-3 w-3" />3
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-4 h-10">
        {contributions.map((c) => (
          <div key={c.day} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(c.count / maxCount) * 100}%` }}
              transition={{ duration: 0.3 }}
              className={`w-full rounded-sm ${c.count > 0 ? "bg-accent-green/60" : "bg-elevation-3"}`}
              style={{ minHeight: c.count > 0 ? 4 : 0 }}
            />
            <span className="text-[9px] text-muted-foreground">{c.day.slice(0, 2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 mb-3">
        {commits.map((commit, i) => (
          <motion.div
            key={commit.message}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-elevation-2 transition-colors"
          >
            <GitCommit className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate">{commit.message}</p>
              <p className="text-[10px] text-muted-foreground">{commit.repo}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">{commit.time}</span>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border pt-3">
        <h3 className="text-xs font-semibold mb-2">Repositories</h3>
        <div className="space-y-1.5">
          {repos.map((repo) => (
            <div
              key={repo.name}
              className="flex items-center justify-between rounded-lg p-1.5 hover:bg-elevation-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <GitBranch className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{repo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Star className="h-2.5 w-2.5" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <GitPullRequest className="h-2.5 w-2.5" />
                  {repo.prs}
                </span>
                <Circle
                  className={`h-2 w-2 ${repo.ci === "passing" ? "text-accent-green" : "text-accent-amber"} fill-current`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
