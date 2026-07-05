"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, GitCommit, GitPullRequest, Star, Eye, GitFork } from "lucide-react";

const repos = [
  { name: "aios-core", stars: 12, forks: 3, prs: 2, branch: "main", updated: "2h ago" },
  { name: "api-gateway", stars: 8, forks: 1, prs: 1, branch: "feat/rate-limit", updated: "1d ago" },
  { name: "knowledge-graph", stars: 5, forks: 0, prs: 0, branch: "develop", updated: "3d ago" },
];

const commits = [
  {
    message: "feat: implement token bucket rate limiter",
    repo: "api-gateway",
    hash: "a1b2c3d",
    time: "1h ago",
  },
  {
    message: "fix: correct Redis connection pooling",
    repo: "aios-core",
    hash: "e4f5g6h",
    time: "3h ago",
  },
  { message: "docs: update API documentation", repo: "aios-core", hash: "i7j8k9l", time: "5h ago" },
];

export default function GitHubPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">GitHub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your engineering activity, synchronized
          </p>
        </div>
        <Button size="sm" variant="secondary">
          <GitBranch className="h-3.5 w-3.5" />
          Sync repos
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {repos.map((repo) => (
          <GlassCard key={repo.name} className="p-4" hover>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{repo.name}</span>
              </div>
              <Badge variant="default" size="sm">
                {repo.branch}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {repo.forks}
              </span>
              <span className="flex items-center gap-1">
                <GitPullRequest className="h-3 w-3" />
                {repo.prs}
              </span>
              <span className="ml-auto">{repo.updated}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-muted-foreground" />
          Recent Commits
        </h3>
        <div className="space-y-2">
          {commits.map((commit) => (
            <div
              key={commit.hash}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-elevation-2 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-elevation-3">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {commit.hash.slice(0, 6)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{commit.message}</p>
                <p className="text-xs text-muted-foreground">{commit.repo}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{commit.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
