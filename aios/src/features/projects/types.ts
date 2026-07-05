export type ProjectHealth = "good" | "warning" | "critical";
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";
export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type MilestoneStatus = "pending" | "active" | "completed";

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: number;
  comments: number;
  labels: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  tasks: string[];
  progress: number;
  createdAt: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  environment: "production" | "staging" | "preview";
  status: "success" | "failed" | "pending" | "building";
  commitSha: string;
  commitMessage: string;
  url?: string;
  deployedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository?: string;
  deployment?: string;
  technologies: string[];
  complexity: number;
  health: ProjectHealth;
  progress: number;
  branch: string;
  stars: number;
  openIssues: number;
  lastCommit: string;
  tasks: ProjectTask[];
  milestones: Milestone[];
  deployments: Deployment[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectColumn {
  id: TaskStatus;
  title: string;
  tasks: ProjectTask[];
  color: string;
}

export const TASK_STATUSES: TaskStatus[] = ["backlog", "in-progress", "review", "done"];

export const COLUMNS: ProjectColumn[] = [
  { id: "backlog", title: "Backlog", tasks: [], color: "text-muted-foreground" },
  { id: "in-progress", title: "In Progress", tasks: [], color: "text-accent-blue" },
  { id: "review", title: "In Review", tasks: [], color: "text-accent-amber" },
  { id: "done", title: "Completed", tasks: [], color: "text-accent-green" },
];

export function getProjectStats(project: Project) {
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
}
