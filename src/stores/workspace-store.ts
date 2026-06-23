import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FileNode } from "@/types/vfs";
import { buildFileTree } from "@/types/vfs";

interface WorkspaceState {
  projectId: string | null;
  projectName: string;
  vfs: Record<string, string>;
  openTabs: string[];
  activeTab: string | null;
  unsavedChanges: string[];
  lastSaved: number | null;

  setProject: (id: string, name: string) => void;
  setProjectName: (name: string) => void;
  setVFS: (vfs: Record<string, string>) => void;
  updateFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  addFile: (path: string, content?: string) => void;

  openTab: (path: string) => void;
  closeTab: (path: string) => void;
  setActiveTab: (path: string | null) => void;
  reorderTabs: (tabs: string[]) => void;

  markSaved: () => void;
  markUnsaved: (path: string) => void;
  clearUnsaved: (path: string) => void;

  getFileTree: () => FileNode[];
  getFileContent: (path: string) => string | undefined;
  hasUnsavedChanges: () => boolean;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      projectId: null,
      projectName: "",
      vfs: {},
      openTabs: [],
      activeTab: null,
      unsavedChanges: [],
      lastSaved: null,

      setProject: (projectId, projectName) => set({ projectId, projectName }),

      setProjectName: (projectName) => set({ projectName }),

      setVFS: (vfs) => {
        const tabs = Object.keys(vfs);
        const active = tabs[0] ?? null;
        set({ vfs, openTabs: tabs, activeTab: active, unsavedChanges: [] });
      },

      updateFile: (path, content) => {
        const current = get().vfs[path];
        set((s) => ({
          vfs: { ...s.vfs, [path]: content },
          unsavedChanges:
            current !== content
              ? s.unsavedChanges.includes(path)
                ? s.unsavedChanges
                : [...s.unsavedChanges, path]
              : s.unsavedChanges,
        }));
      },

      deleteFile: (path) => {
        set((s) => {
          const { [path]: _, ...rest } = s.vfs;
          return {
            vfs: rest,
            openTabs: s.openTabs.filter((t) => t !== path),
            activeTab:
              s.activeTab === path
                ? (s.openTabs.filter((t) => t !== path)[0] ?? null)
                : s.activeTab,
            unsavedChanges: s.unsavedChanges.filter((u) => u !== path),
          };
        });
      },

      renameFile: (oldPath, newPath) => {
        const content = get().vfs[oldPath];
        if (content === undefined) return;
        set((s) => {
          const { [oldPath]: _, ...rest } = s.vfs;
          return {
            vfs: { ...rest, [newPath]: content },
            openTabs: s.openTabs.map((t) =>
              t === oldPath ? newPath : t
            ),
            activeTab: s.activeTab === oldPath ? newPath : s.activeTab,
            unsavedChanges: s.unsavedChanges.map((u) =>
              u === oldPath ? newPath : u
            ),
          };
        });
      },

      addFile: (path, content = "") => {
        set((s) => ({ vfs: { ...s.vfs, [path]: content } }));
      },

      openTab: (path) => {
        set((s) => ({
          openTabs: s.openTabs.includes(path)
            ? s.openTabs
            : [...s.openTabs, path],
          activeTab: path,
        }));
      },

      closeTab: (path) => {
        set((s) => {
          const idx = s.openTabs.indexOf(path);
          const newTabs = s.openTabs.filter((t) => t !== path);
          return {
            openTabs: newTabs,
            activeTab:
              s.activeTab === path
                ? (newTabs[Math.min(idx, newTabs.length - 1)] ?? null)
                : s.activeTab,
          };
        });
      },

      setActiveTab: (activeTab) => set({ activeTab }),

      reorderTabs: (openTabs) => set({ openTabs }),

      markSaved: () =>
        set({ unsavedChanges: [], lastSaved: Date.now() }),

      markUnsaved: (path) =>
        set((s) => ({
          unsavedChanges: s.unsavedChanges.includes(path)
            ? s.unsavedChanges
            : [...s.unsavedChanges, path],
        })),

      clearUnsaved: (path) =>
        set((s) => ({
          unsavedChanges: s.unsavedChanges.filter((u) => u !== path),
        })),

      getFileTree: () => buildFileTree(get().vfs),

      getFileContent: (path) => get().vfs[path],

      hasUnsavedChanges: () => get().unsavedChanges.length > 0,

      reset: () =>
        set({
          projectId: null,
          projectName: "",
          vfs: {},
          openTabs: [],
          activeTab: null,
          unsavedChanges: [],
          lastSaved: null,
        }),
    }),
    {
      name: "opencode-workspace",
      partialize: (state) => ({
        projectId: state.projectId,
        projectName: state.projectName,
        vfs: state.vfs,
        openTabs: state.openTabs,
        activeTab: state.activeTab,
        lastSaved: state.lastSaved,
      }),
    }
  )
);
