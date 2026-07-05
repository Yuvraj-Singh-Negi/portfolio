"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/features/projects/store";
import { MilestoneTracker } from "@/components/projects/milestone-tracker";
import { TASK_STATUSES } from "@/features/projects/types";
import {
  FolderKanban,
  ChevronLeft,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Users,
  MessageSquare,
  Star,
  GitCommit,
  Globe,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const project = useProjectStore((s) => s.projects.find((p) => p.id === id));

  const stats = useMemo(() => {
    if (!project) return null;
    const total = project.tasks.length;
    const done = project.tasks.filter((t) => t.status === "done").length;
    const inProgress = project.tasks.filter((t) => t.status === "in-progress").length;
    const review = project.tasks.filter((t) => t.status === "review").length;
    const backlog = project.tasks.filter((t) => t.status === "backlog").length;
    return {
      total,
      done,
      inProgress,
      review,
      backlog,
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [project]);

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Project not found</p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3"
            onClick={() => router.push("/projects")}
          >
            Back to projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/projects")}
          className="rounded-lg p-1.5 hover:bg-elevation-2 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            project.health === "good"
              ? "bg-accent-green/10"
              : project.health === "warning"
                ? "bg-accent-amber/10"
                : "bg-accent-red/10",
          )}
        >
          <FolderKanban
            className={cn(
              "h-5 w-5",
              project.health === "good"
                ? "text-accent-green"
                : project.health === "warning"
                  ? "text-accent-amber"
                  : "text-accent-red",
            )}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{project.name}</h1>
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                project.health === "good"
                  ? "bg-accent-green"
                  : project.health === "warning"
                    ? "bg-accent-amber"
                    : "bg-accent-red",
              )}
            />
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary">
            <ExternalLink className="h-3.5 w-3.5" />
            Repository
          </Button>
          <Button size="sm" variant="secondary">
            <Globe className="h-3.5 w-3.5" />
            Deployments
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((t) => (
          <Badge key={t} variant="default" size="sm">
            {t}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Progress", value: `${stats?.progress ?? 0}%`, color: "text-accent-green" },
          { label: "Total Tasks", value: `${stats?.total ?? 0}`, color: "text-accent-blue" },
          { label: "In Progress", value: `${stats?.inProgress ?? 0}`, color: "text-accent-amber" },
          { label: "Completed", value: `${stats?.done ?? 0}`, color: "text-accent-green" },
          { label: "Stars", value: `${project.stars}`, color: "text-accent-amber" },
        ].map((s) => (
          <GlassCard key={s.label} className="p-3 text-center">
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Tasks by Status</h2>
          <div className="space-y-2">
            {TASK_STATUSES.map((status) => {
              const tasks = project.tasks.filter((t) => t.status === status);
              const label =
                status === "in-progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1);
              return (
                <GlassCard key={status} className="p-3" hover>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">{tasks.length}</span>
                  </div>
                  {tasks.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {tasks.slice(0, 3).map((t) => (
                        <div key={t.id} className="flex items-center gap-2 text-xs">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0",
                              t.priority === "urgent"
                                ? "bg-accent-red"
                                : t.priority === "high"
                                  ? "bg-accent-amber"
                                  : "bg-muted-foreground",
                            )}
                          />
                          <span className="truncate">{t.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Milestones</h2>
          <MilestoneTracker milestones={project.milestones} />

          {project.deployments.length > 0 && (
            <>
              <h2 className="text-sm font-semibold mt-4">Recent Deployments</h2>
              <div className="space-y-2">
                {project.deployments.map((dep) => (
                  <GlassCard key={dep.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full",
                          dep.status === "success"
                            ? "bg-accent-green/10"
                            : dep.status === "failed"
                              ? "bg-accent-red/10"
                              : "bg-accent-amber/10",
                        )}
                      >
                        {dep.status === "success" ? (
                          <CheckCircle2 className="h-3 w-3 text-accent-green" />
                        ) : dep.status === "failed" ? (
                          <AlertCircle className="h-3 w-3 text-accent-red" />
                        ) : (
                          <Clock className="h-3 w-3 text-accent-amber" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium capitalize">{dep.environment}</span>
                          <Badge
                            size="sm"
                            variant={
                              dep.status === "success"
                                ? "success"
                                : dep.status === "failed"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {dep.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {dep.commitMessage}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{dep.deployedAt}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
