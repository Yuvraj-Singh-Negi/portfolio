"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/features/projects/store";
import { MilestoneTracker } from "@/components/projects/milestone-tracker";
import {
  TASK_STATUSES,
  COLUMNS,
  type ProjectTask,
  type TaskStatus,
} from "@/features/projects/types";
import Link from "next/link";
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
  Search,
  ExternalLink,
  BarChart3,
} from "lucide-react";

const priorityIcon = {
  urgent: AlertCircle,
  high: AlertCircle,
  medium: Circle,
  low: Circle,
};

const priorityColor = {
  urgent: "text-accent-red",
  high: "text-accent-red",
  medium: "text-accent-amber",
  low: "text-muted-foreground",
};

function TaskCard({ task }: { task: ProjectTask }) {
  const moveTask = useProjectStore((s) => s.moveTask);
  const PriorityIcon = priorityIcon[task.priority];

  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    backlog: "in-progress",
    "in-progress": "review",
    review: "done",
    done: null,
  };
  const next = nextStatus[task.status];

  return (
    <GlassCard className="p-3 cursor-pointer group" hover>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <PriorityIcon className={cn("h-3.5 w-3.5", priorityColor[task.priority])} />
          <span className="text-xs font-medium">{task.title}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {task.labels.map((label) => (
          <Badge key={label} variant="default" size="sm">
            {label}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
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
        {next && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveTask(task.projectId, task.id, next);
            }}
            className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-elevation-2 transition-all"
            title={`Move to ${next}`}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export default function ProjectsPage() {
  const projects = useProjectStore((s) => s.projects);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const selectProject = useProjectStore((s) => s.selectProject);

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const columns = COLUMNS.map((col) => ({
    ...col,
    tasks: (activeProject?.tasks ?? []).filter((t) => t.status === col.id),
  }));

  const stats = [
    {
      label: "Active Projects",
      value: projects.filter((p) => p.health === "good").length.toString(),
      color: "text-accent-blue",
    },
    {
      label: "Needs Attention",
      value: projects
        .filter((p) => p.health === "warning" || p.health === "critical")
        .length.toString(),
      color: "text-accent-amber",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.progress === 100).length.toString(),
      color: "text-accent-green",
    },
    {
      label: "Total Tasks",
      value: projects.reduce((s, p) => s + p.tasks.length, 0).toString(),
      color: "text-accent-purple",
    },
  ];

  return (
    <div className="flex h-full">
      <div
        className={cn(
          "flex flex-col flex-1 overflow-y-auto",
          selectedProjectId && "border-r border-border",
        )}
      >
        <div className="shrink-0 p-6 pb-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Projects</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {projects.length} projects · {projects.reduce((s, p) => s + p.tasks.length, 0)}{" "}
                tasks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-elevation-1 px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  placeholder="Search projects..."
                  className="w-32 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-card-border bg-card p-3">
                <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProject(p.id === selectedProjectId ? null : p.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                  selectedProjectId === p.id
                    ? "border-accent-green/30 bg-accent-green/10 text-accent-green"
                    : "border-border bg-elevation-1 text-muted-foreground hover:text-foreground",
                )}
              >
                <FolderKanban className="h-3.5 w-3.5" />
                {p.name}
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    p.health === "good"
                      ? "bg-accent-green"
                      : p.health === "warning"
                        ? "bg-accent-amber"
                        : "bg-accent-red",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-6 pt-4">
          <div className="flex gap-4 h-full" style={{ minWidth: activeProject ? 600 : 900 }}>
            {(activeProject ? columns : COLUMNS.map((col) => ({ ...col, tasks: [] }))).map(
              (column) => (
                <div key={column.id} className="flex w-72 flex-col shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-semibold", column.color)}>
                        {column.title}
                      </span>
                      <span className="rounded-md bg-elevation-3 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {column.tasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 overflow-y-auto flex-1">
                    {column.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    <button className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground hover:text-foreground hover:border-border-light transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                      Add task
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0"
          >
            <div className="w-[380px] h-full overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      activeProject.health === "good"
                        ? "bg-accent-green/10"
                        : activeProject.health === "warning"
                          ? "bg-accent-amber/10"
                          : "bg-accent-red/10",
                    )}
                  >
                    <FolderKanban
                      className={cn(
                        "h-4.5 w-4.5",
                        activeProject.health === "good"
                          ? "text-accent-green"
                          : activeProject.health === "warning"
                            ? "text-accent-amber"
                            : "text-accent-red",
                      )}
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{activeProject.name}</h2>
                    <p className="text-xs text-muted-foreground">{activeProject.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeProject.technologies.map((t) => (
                  <Badge key={t} variant="default" size="sm">
                    {t}
                  </Badge>
                ))}
              </div>

              <Link
                href={`/projects/${activeProject.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-elevation-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-border-light transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
                  View full project details
                </span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-card-border bg-elevation-1 p-2.5 text-center">
                  <p className="text-sm font-bold">{activeProject.progress}%</p>
                  <p className="text-[10px] text-muted-foreground">Progress</p>
                </div>
                <div className="rounded-lg border border-card-border bg-elevation-1 p-2.5 text-center">
                  <p className="text-sm font-bold">{activeProject.stars}</p>
                  <p className="text-[10px] text-muted-foreground">Stars</p>
                </div>
                <div className="rounded-lg border border-card-border bg-elevation-1 p-2.5 text-center">
                  <p className="text-sm font-bold text-accent-red">{activeProject.openIssues}</p>
                  <p className="text-[10px] text-muted-foreground">Open Issues</p>
                </div>
                <div className="rounded-lg border border-card-border bg-elevation-1 p-2.5 text-center">
                  <p className="text-sm font-bold">{activeProject.tasks.length}</p>
                  <p className="text-[10px] text-muted-foreground">Tasks</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Milestones
                </h3>
                <MilestoneTracker milestones={activeProject.milestones} />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Repository
                </h3>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-elevation-1 px-3 py-2 text-xs">
                  <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{activeProject.branch}</span>
                  <span className="text-muted-foreground ml-auto">{activeProject.lastCommit}</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
