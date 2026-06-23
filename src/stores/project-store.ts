import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

interface ProjectState {
  projects: ProjectData[];
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;

  setProjects: (projects: ProjectData[]) => void;
  setCurrentProject: (id: string | null) => void;
  addProject: (project: ProjectData) => void;
  updateProject: (id: string, data: Partial<ProjectData>) => void;
  removeProject: (id: string) => void;
  setLoading: (v: boolean) => void;
  setError: (err: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      currentProjectId: null,
      isLoading: false,
      error: null,

      setProjects: (projects) => set({ projects }),
      setCurrentProject: (currentProjectId) => set({ currentProjectId }),

      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),

      updateProject: (id, data) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      removeProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          currentProjectId:
            s.currentProjectId === id ? null : s.currentProjectId,
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "opencode-projects",
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId,
      }),
    }
  )
);
