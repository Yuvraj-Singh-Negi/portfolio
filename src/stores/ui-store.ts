import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PanelId = "chat" | "code" | "preview" | "console";

interface UIState {
  sidebarOpen: boolean;
  chatPanelWidth: number;
  activePanel: PanelId;
  showFileExplorer: boolean;
  showMinimap: boolean;
  fontSize: number;

  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  setChatPanelWidth: (w: number) => void;
  setActivePanel: (panel: PanelId) => void;
  toggleFileExplorer: () => void;
  toggleMinimap: () => void;
  setFontSize: (size: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      chatPanelWidth: 30,
      activePanel: "chat",
      showFileExplorer: true,
      showMinimap: false,
      fontSize: 14,

      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setChatPanelWidth: (w) =>
        set({ chatPanelWidth: Math.max(20, Math.min(50, w)) }),

      setActivePanel: (activePanel) => set({ activePanel }),

      toggleFileExplorer: () =>
        set((s) => ({ showFileExplorer: !s.showFileExplorer })),
      toggleMinimap: () =>
        set((s) => ({ showMinimap: !s.showMinimap })),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: "opencode-ui",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        chatPanelWidth: state.chatPanelWidth,
        activePanel: state.activePanel,
        showFileExplorer: state.showFileExplorer,
        showMinimap: state.showMinimap,
        fontSize: state.fontSize,
      }),
    }
  )
);
