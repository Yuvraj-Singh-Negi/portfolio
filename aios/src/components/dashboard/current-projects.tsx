"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/features/projects/store";
import { ExternalLink, GitBranch, AlertCircle, CheckCircle2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function CurrentProjects() {
  const projects = useProjectStore((s) => s.projects);

  if (projects.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Current Projects</h2>
        </div>
        <GlassCard className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first project to start tracking engineering work.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Current Projects</h2>
        <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {projects.slice(0, 3).map((project, i) => {
          const HealthIcon = healthIcon[project.health || "good"];
          return (
            <motion.div
              key={project.id}
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
                      <Badge variant="default" size="sm">
                        {project.complexity}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </div>
                  <HealthIcon
                    className={cn("h-5 w-5 shrink-0", healthColor[project.health || "good"])}
                  />
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {project.branch || "main"}
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
                    {project.openIssues || 0} open issues
                  </span>
                  <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="default" size="sm">
                      <Code2 className="mr-1 h-2.5 w-2.5" />
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </Button>
                  {project.repository && (
                    <Button size="sm" variant="ghost" className="flex-1">
                      <GitBranch className="h-3.5 w-3.5" />
                      Repository
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
