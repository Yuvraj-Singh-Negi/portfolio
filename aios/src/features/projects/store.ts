import { create } from "zustand";
import type { Project, TaskStatus, TaskPriority, ProjectHealth } from "./types";
import { getProjectStats } from "./types";
import { createTask, createMilestone } from "./engine";

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

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
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
