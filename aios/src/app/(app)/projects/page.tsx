"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  FolderKanban,
  GitBranch,
  Users,
  Clock,
  AlertCircle,
  MoreHorizontal,
  MessageSquare,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignees: number;
  comments: number;
  labels: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

const columns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    color: "text-muted-foreground",
    tasks: [
      {
        id: "1",
        title: "Implement WebSocket support",
        description: "Real-time bi-directional communication for live updates",
        priority: "medium",
        assignees: 2,
        comments: 3,
        labels: ["backend", "api"],
      },
      {
        id: "2",
        title: "Add unit test coverage",
        description: "Achieve 90% coverage on core modules",
        priority: "high",
        assignees: 1,
        comments: 1,
        labels: ["testing"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "text-accent-blue",
    tasks: [
      {
        id: "3",
        title: "Rate limiting middleware",
        description: "Token bucket algorithm with Redis backend",
        priority: "high",
        assignees: 1,
        comments: 5,
        labels: ["backend", "security"],
      },
      {
        id: "4",
        title: "Knowledge graph visualization",
        description: "Interactive SVG-based graph with D3",
        priority: "medium",
        assignees: 2,
        comments: 2,
        labels: ["frontend", "visualization"],
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    color: "text-accent-amber",
    tasks: [
      {
        id: "5",
        title: "API documentation",
        description: "OpenAPI spec and developer guide",
        priority: "low",
        assignees: 1,
        comments: 4,
        labels: ["docs"],
      },
    ],
  },
  {
    id: "done",
    title: "Completed",
    color: "text-accent-green",
    tasks: [
      {
        id: "6",
        title: "Authentication module",
        description: "JWT-based auth with refresh tokens",
        priority: "high",
        assignees: 2,
        comments: 8,
        labels: ["backend", "auth"],
      },
      {
        id: "7",
        title: "Database schema design",
        description: "Neon PostgreSQL with Drizzle ORM",
        priority: "high",
        assignees: 1,
        comments: 3,
        labels: ["database"],
      },
    ],
  },
];

const priorityIcon = {
  high: AlertCircle,
  medium: Circle,
  low: Circle,
};

const priorityColor = {
  high: "text-accent-red",
  medium: "text-accent-amber",
  low: "text-muted-foreground",
};

export default function ProjectsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 p-6 pb-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your engineering projects and tasks
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New project
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Active Projects", value: "3", color: "text-accent-blue" },
            { label: "In Review", value: "2", color: "text-accent-amber" },
            { label: "Completed", value: "7", color: "text-accent-green" },
            { label: "Total Tasks", value: "24", color: "text-accent-purple" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-card-border bg-card p-3">
              <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6 pt-4">
        <div className="flex gap-4 h-full" style={{ minWidth: 900 }}>
          {columns.map((column) => (
            <div key={column.id} className="flex w-72 flex-col shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-semibold", column.color)}>{column.title}</span>
                  <span className="rounded-md bg-elevation-3 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-elevation-2 transition-colors">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1">
                {column.tasks.map((task) => {
                  const PriorityIcon = priorityIcon[task.priority];
                  return (
                    <GlassCard key={task.id} className="p-3 cursor-pointer" hover>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <PriorityIcon
                            className={cn("h-3.5 w-3.5", priorityColor[task.priority])}
                          />
                          <span className="text-xs font-medium">{task.title}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {task.labels.map((label) => (
                          <Badge key={label} variant="default" size="sm">
                            {label}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {task.assignees}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {task.comments}
                        </span>
                      </div>
                    </GlassCard>
                  );
                })}

                <button className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground hover:text-foreground hover:border-border-light transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
