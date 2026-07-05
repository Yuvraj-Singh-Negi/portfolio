"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Code2,
  Container,
  Database,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  name: string;
  description: string;
  repo: string;
  branch: string;
  progress: number;
  health: "good" | "warning" | "critical";
  priority: "high" | "medium" | "low";
  issues: number;
  lastCommit: string;
  stack: string[];
  deployUrl?: string;
}

const projects: Project[] = [
  {
    name: "AIOS Core",
    description: "Engineering operating system platform — the central hub",
    repo: "github.com/user/aios-core",
    branch: "main",
    progress: 45,
    health: "good",
    priority: "high",
    issues: 3,
    lastCommit: "2h ago",
    stack: ["TypeScript", "React", "Next.js", "PostgreSQL"],
  },
  {
    name: "API Gateway",
    description: "Rate limiting, auth, and routing service for microservices",
    repo: "github.com/user/api-gateway",
    branch: "feat/rate-limit",
    progress: 78,
    health: "good",
    priority: "high",
    issues: 5,
    lastCommit: "1h ago",
    stack: ["Go", "Redis", "Docker", "gRPC"],
  },
  {
    name: "Knowledge Graph",
    description: "Vector search and semantic knowledge mapping engine",
    repo: "github.com/user/knowledge-graph",
    branch: "develop",
    progress: 32,
    health: "warning",
    priority: "medium",
    issues: 8,
    lastCommit: "1d ago",
    stack: ["Python", "Neo4j", "FastAPI", "Docker"],
  },
];

const healthIcon = {
  good: CheckCircle2,
  warning: AlertCircle,
  critical: AlertCircle,
};

const healthColor = {
  good: "text-accent-green",
  warning: "text-accent-amber",
  critical: "text-accent-red",
};

const priorityColor = {
  high: "danger",
  medium: "warning",
  low: "default",
} as const;

const stackIcons: Record<string, LucideIcon> = {
  TypeScript: Code2,
  "Next.js": Server,
  PostgreSQL: Database,
  Docker: Container,
  Go: Code2,
  Redis: Server,
  Python: Code2,
};

export function CurrentProjects() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Current Projects</h2>
        <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {projects.map((project, i) => {
          const HealthIcon = healthIcon[project.health];
          return (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <GlassCard
                className="p-4 transition-all hover:shadow-glow-green cursor-pointer"
                hover
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold">{project.name}</h3>
                      <Badge
                        variant={
                          priorityColor[project.priority] as "danger" | "warning" | "default"
                        }
                        size="sm"
                      >
                        {project.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </div>
                  <HealthIcon className={cn("h-5 w-5 shrink-0", healthColor[project.health])} />
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {project.branch}
                    </span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-elevation-3">
                    <motion.div
                      className="h-full rounded-full bg-accent-green"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {project.issues} open issues
                  </span>
                  <span>Last commit: {project.lastCommit}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  {project.stack.map((tech) => {
                    const StackIcon = stackIcons[tech] || Code2;
                    return (
                      <Badge key={tech} variant="default" size="sm">
                        <StackIcon className="mr-1 h-2.5 w-2.5" />
                        {tech}
                      </Badge>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1">
                    <GitBranch className="h-3.5 w-3.5" />
                    Repository
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
