import type {
  Project,
  ProjectTask,
  Milestone,
  MilestoneStatus,
  TaskStatus,
  TaskPriority,
} from "./types";

let taskCounter = 0;
let milestoneCounter = 0;

export function generateTaskId(): string {
  taskCounter++;
  return `task-${Date.now()}-${taskCounter}`;
}

export function generateMilestoneId(): string {
  milestoneCounter++;
  return `ms-${Date.now()}-${milestoneCounter}`;
}

export function createTask(
  projectId: string,
  title: string,
  description: string,
  priority: TaskPriority = "medium",
  labels: string[] = [],
): ProjectTask {
  const now = new Date().toISOString();
  return {
    id: generateTaskId(),
    projectId,
    title,
    description,
    status: "backlog",
    priority,
    assignees: 0,
    comments: 0,
    labels,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function createMilestone(
  projectId: string,
  title: string,
  description: string,
  dueDate: string,
  taskIds: string[] = [],
): Milestone {
  return {
    id: generateMilestoneId(),
    projectId,
    title,
    description,
    dueDate,
    status: "pending",
    tasks: taskIds,
    progress: 0,
    createdAt: new Date().toISOString(),
  };
}

export function updateMilestoneProgress(
  milestone: Milestone,
  projectTasks: ProjectTask[],
): Milestone {
  const milestoneTasks = projectTasks.filter((t) => milestone.tasks.includes(t.id));
  const done = milestoneTasks.filter((t) => t.status === "done").length;
  const progress = milestoneTasks.length > 0 ? Math.round((done / milestoneTasks.length) * 100) : 0;
  return { ...milestone, progress };
}

export function getOverdueMilestones(project: Project): Milestone[] {
  const now = new Date();
  return project.milestones.filter((m) => m.status !== "completed" && new Date(m.dueDate) < now);
}

export function canTransitionTask(task: ProjectTask, newStatus: TaskStatus): boolean {
  const flow: Record<TaskStatus, TaskStatus[]> = {
    backlog: ["in-progress"],
    "in-progress": ["review", "backlog"],
    review: ["done", "in-progress"],
    done: ["review"],
  };
  return flow[task.status]?.includes(newStatus) ?? false;
}

export function getTaskPriorityScore(priority: TaskPriority): number {
  const scores: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
  return scores[priority] ?? 0;
}

export function sortTasksByPriority(tasks: ProjectTask[]): ProjectTask[] {
  return [...tasks].sort(
    (a, b) => getTaskPriorityScore(b.priority) - getTaskPriorityScore(a.priority),
  );
}

export function getRecommendedMilestones(
  technologies: string[],
): { title: string; description: string; dueDays: number }[] {
  const common: Record<string, { title: string; description: string; dueDays: number }[]> = {
    typescript: [
      {
        title: "TypeScript Setup",
        description: "Configure tsconfig, ESLint, Prettier",
        dueDays: 1,
      },
    ],
    react: [
      {
        title: "Component Library",
        description: "Set up core UI components and theming",
        dueDays: 3,
      },
    ],
    docker: [
      {
        title: "Containerization",
        description: "Dockerfile, docker-compose, multi-stage builds",
        dueDays: 2,
      },
    ],
    postgresql: [
      {
        title: "Database Schema",
        description: "Design and migrate the database schema",
        dueDays: 3,
      },
    ],
  };

  const results: { title: string; description: string; dueDays: number }[] = [
    {
      title: "Project Setup",
      description: "Initialize project structure, CI/CD, and docs",
      dueDays: 2,
    },
    { title: "Core Feature", description: "Implement the primary business logic", dueDays: 7 },
    { title: "Testing", description: "Unit tests, integration tests, E2E tests", dueDays: 4 },
    { title: "Deployment", description: "Production deployment and monitoring", dueDays: 3 },
  ];

  for (const tech of technologies) {
    const suggestions = common[tech.toLowerCase()];
    if (suggestions) {
      results.push(...suggestions);
    }
  }

  return results;
}
