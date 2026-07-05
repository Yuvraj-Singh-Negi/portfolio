import { create } from "zustand";
import type {
  Project,
  ProjectTask,
  Milestone,
  TaskStatus,
  TaskPriority,
  ProjectHealth,
} from "./types";
import { getProjectStats } from "./types";
import { createTask, createMilestone, updateMilestoneProgress } from "./engine";

interface ProjectStore {
  projects: Project[];
  selectedProjectId: string | null;
  selectProject: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addTask: (
    projectId: string,
    title: string,
    description: string,
    priority?: TaskPriority,
    labels?: string[],
  ) => void;
  moveTask: (projectId: string, taskId: string, newStatus: TaskStatus) => void;
  addMilestone: (projectId: string, title: string, description: string, dueDate: string) => void;
  getFiltered: (health?: ProjectHealth) => Project[];
  getStats: (projectId: string) => ReturnType<typeof getProjectStats>;
}

const sampleTasks: ProjectTask[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Implement WebSocket support",
    description: "Real-time bi-directional communication",
    status: "backlog",
    priority: "medium",
    assignees: 2,
    comments: 3,
    labels: ["backend", "api"],
    order: 0,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Rate limiting middleware",
    description: "Token bucket algorithm with Redis",
    status: "in-progress",
    priority: "high",
    assignees: 1,
    comments: 5,
    labels: ["backend", "security"],
    order: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-3",
    projectId: "proj-1",
    title: "API documentation",
    description: "OpenAPI spec and developer guide",
    status: "review",
    priority: "low",
    assignees: 1,
    comments: 4,
    labels: ["docs"],
    order: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-4",
    projectId: "proj-1",
    title: "Authentication module",
    description: "JWT-based auth with refresh tokens",
    status: "done",
    priority: "high",
    assignees: 2,
    comments: 8,
    labels: ["backend", "auth"],
    order: 3,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-5",
    projectId: "proj-2",
    title: "API gateway rate limiting",
    description: "Token bucket distributed rate limiter",
    status: "in-progress",
    priority: "high",
    assignees: 1,
    comments: 3,
    labels: ["backend"],
    order: 0,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-6",
    projectId: "proj-2",
    title: "Service discovery",
    description: "Consul-based service registry",
    status: "backlog",
    priority: "medium",
    assignees: 2,
    comments: 1,
    labels: ["infrastructure"],
    order: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-7",
    projectId: "proj-2",
    title: "Load testing",
    description: "k6-based performance benchmarks",
    status: "review",
    priority: "low",
    assignees: 1,
    comments: 2,
    labels: ["testing"],
    order: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-8",
    projectId: "proj-3",
    title: "Node embedding algorithm",
    description: "Implement GraphSAGE for node embeddings",
    status: "in-progress",
    priority: "high",
    assignees: 1,
    comments: 4,
    labels: ["ml", "graph"],
    order: 0,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-9",
    projectId: "proj-3",
    title: "Graph visualization",
    description: "Interactive D3.js force-directed graph",
    status: "backlog",
    priority: "medium",
    assignees: 2,
    comments: 2,
    labels: ["frontend", "visualization"],
    order: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-10",
    projectId: "proj-3",
    title: "Similarity search API",
    description: "ANN-based similarity endpoint",
    status: "done",
    priority: "medium",
    assignees: 1,
    comments: 1,
    labels: ["api", "ml"],
    order: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "task-11",
    projectId: "proj-3",
    title: "Benchmark suite",
    description: "Performance benchmarks vs baseline",
    status: "backlog",
    priority: "low",
    assignees: 1,
    comments: 0,
    labels: ["testing"],
    order: 3,
    createdAt: "",
    updatedAt: "",
  },
];

const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "AIOS Core",
    description: "AI Engineering Operating System",
    repository: "github.com/user/aios",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
    complexity: 8,
    health: "good",
    progress: 60,
    branch: "main",
    stars: 24,
    openIssues: 5,
    lastCommit: "2026-07-04",
    tasks: sampleTasks.filter((t) => t.projectId === "proj-1"),
    milestones: [
      {
        id: "ms-1",
        projectId: "proj-1",
        title: "Foundation",
        description: "Core platform",
        dueDate: "2026-08-01",
        status: "active",
        tasks: ["task-1", "task-2", "task-3"],
        progress: 33,
        createdAt: "",
      },
      {
        id: "ms-2",
        projectId: "proj-1",
        title: "Launch",
        description: "Production release",
        dueDate: "2026-09-15",
        status: "pending",
        tasks: ["task-4"],
        progress: 100,
        createdAt: "",
      },
    ],
    deployments: [
      {
        id: "dep-1",
        projectId: "proj-1",
        environment: "production",
        status: "success",
        commitSha: "a1b2c3d",
        commitMessage: "Release v0.1.0",
        deployedAt: "2026-07-01",
      },
    ],
    createdAt: "2026-06-01",
    updatedAt: "2026-07-04",
  },
  {
    id: "proj-2",
    name: "API Gateway",
    description: "Distributed API gateway with rate limiting",
    repository: "github.com/user/gateway",
    technologies: ["Go", "Redis", "gRPC", "Docker"],
    complexity: 6,
    health: "warning",
    progress: 35,
    branch: "develop",
    stars: 12,
    openIssues: 8,
    lastCommit: "2026-07-03",
    tasks: sampleTasks.filter((t) => t.projectId === "proj-2"),
    milestones: [
      {
        id: "ms-3",
        projectId: "proj-2",
        title: "Core Routing",
        description: "Request routing logic",
        dueDate: "2026-07-20",
        status: "active",
        tasks: ["task-5", "task-6"],
        progress: 50,
        createdAt: "",
      },
      {
        id: "ms-4",
        projectId: "proj-2",
        title: "Hardening",
        description: "Security and perf",
        dueDate: "2026-08-10",
        status: "pending",
        tasks: ["task-7"],
        progress: 0,
        createdAt: "",
      },
    ],
    deployments: [],
    createdAt: "2026-05-15",
    updatedAt: "2026-07-03",
  },
  {
    id: "proj-3",
    name: "Knowledge Graph",
    description: "ML-powered knowledge graph engine",
    repository: "github.com/user/knowledge-graph",
    technologies: ["Python", "PyTorch", "Neo4j", "React"],
    complexity: 7,
    health: "good",
    progress: 45,
    branch: "main",
    stars: 18,
    openIssues: 3,
    lastCommit: "2026-07-05",
    tasks: sampleTasks.filter((t) => t.projectId === "proj-3"),
    milestones: [
      {
        id: "ms-5",
        projectId: "proj-3",
        title: "ML Pipeline",
        description: "Training and inference",
        dueDate: "2026-08-01",
        status: "active",
        tasks: ["task-8", "task-10"],
        progress: 50,
        createdAt: "",
      },
      {
        id: "ms-6",
        projectId: "proj-3",
        title: "Frontend",
        description: "Visualization and UI",
        dueDate: "2026-08-20",
        status: "pending",
        tasks: ["task-9"],
        progress: 0,
        createdAt: "",
      },
      {
        id: "ms-7",
        projectId: "proj-3",
        title: "Benchmarking",
        description: "Performance evaluation",
        dueDate: "2026-09-01",
        status: "pending",
        tasks: ["task-11"],
        progress: 0,
        createdAt: "",
      },
    ],
    deployments: [
      {
        id: "dep-2",
        projectId: "proj-3",
        environment: "staging",
        status: "building",
        commitSha: "e4f5g6h",
        commitMessage: "Add similarity search",
        deployedAt: "2026-07-05",
      },
    ],
    createdAt: "2026-04-20",
    updatedAt: "2026-07-05",
  },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: sampleProjects,
  selectedProjectId: null,

  selectProject: (id) => set({ selectedProjectId: id }),

  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  addTask: (projectId, title, description, priority = "medium", labels = []) => {
    const task = createTask(projectId, title, description, priority, labels);
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p,
      ),
    }));
  },

  moveTask: (projectId, taskId, newStatus) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
                  : t,
              ),
            }
          : p,
      ),
    })),

  addMilestone: (projectId, title, description, dueDate) => {
    const ms = createMilestone(projectId, title, description, dueDate);
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, milestones: [...p.milestones, ms] } : p,
      ),
    }));
  },

  getFiltered: (health) => {
    const { projects } = get();
    return health ? projects.filter((p) => p.health === health) : projects;
  },

  getStats: (projectId) => {
    const project = get().projects.find((p) => p.id === projectId);
    return project
      ? getProjectStats(project)
      : { total: 0, done: 0, inProgress: 0, review: 0, backlog: 0, progress: 0 };
  },
}));
