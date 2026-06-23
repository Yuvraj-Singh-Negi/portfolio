"use client";

import { useEffect } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";

const WORKSPACE_KEY = "opencode-workspace-recovery";

interface SessionData {
  projectId: string | null;
  projectName: string;
  activeTab: string | null;
  openTabs: string[];
  timestamp: number;
}

export function useWorkspaceRecovery() {
  useEffect(() => {
    const stored = sessionStorage.getItem(WORKSPACE_KEY);
    if (stored) {
      try {
        const data: SessionData = JSON.parse(stored);
        const workspace = useWorkspaceStore.getState();
        if (data.projectId && data.projectName) {
          workspace.setProject(data.projectId, data.projectName);
        }
        if (data.openTabs.length > 0) {
          data.openTabs.forEach((tab) => workspace.openTab(tab));
        }
        if (data.activeTab) {
          workspace.setActiveTab(data.activeTab);
        }
      } catch {
        sessionStorage.removeItem(WORKSPACE_KEY);
      }
    }
  }, []);
}

export function saveSessionState() {
  const {
    projectId,
    projectName,
    activeTab,
    openTabs,
  } = useWorkspaceStore.getState();

  const data: SessionData = {
    projectId,
    projectName,
    activeTab,
    openTabs,
    timestamp: Date.now(),
  };

  sessionStorage.setItem(WORKSPACE_KEY, JSON.stringify(data));
}

export function clearSessionState() {
  sessionStorage.removeItem(WORKSPACE_KEY);
}

export function useSessionPersistence() {
  useEffect(() => {
    const interval = setInterval(() => {
      saveSessionState();
    }, 5000);

    window.addEventListener("beforeunload", saveSessionState);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", saveSessionState);
    };
  }, []);
}
