import { create } from "zustand";

export type DeploymentStatusType =
  | "PENDING"
  | "BUILDING"
  | "READY"
  | "FAILED"
  | "CANCELED";

export interface DeploymentData {
  id: string;
  projectId: string;
  provider: string;
  url: string | null;
  status: DeploymentStatusType;
  logs: string[];
  error: string | null;
  createdAt: string;
}

interface DeploymentState {
  deployments: DeploymentData[];
  activeDeploymentId: string | null;
  isDeploying: boolean;
  logs: string[];

  setDeployments: (deps: DeploymentData[]) => void;
  addDeployment: (dep: DeploymentData) => void;
  updateDeployment: (id: string, data: Partial<DeploymentData>) => void;
  setActiveDeployment: (id: string | null) => void;
  setIsDeploying: (v: boolean) => void;
  appendLog: (line: string) => void;
  clearLogs: () => void;
}

export const useDeploymentStore = create<DeploymentState>()((set) => ({
  deployments: [],
  activeDeploymentId: null,
  isDeploying: false,
  logs: [],

  setDeployments: (deployments) => set({ deployments }),

  addDeployment: (dep) =>
    set((s) => ({ deployments: [dep, ...s.deployments] })),

  updateDeployment: (id, data) =>
    set((s) => ({
      deployments: s.deployments.map((d) =>
        d.id === id ? { ...d, ...data } : d
      ),
    })),

  setActiveDeployment: (activeDeploymentId) => set({ activeDeploymentId }),
  setIsDeploying: (isDeploying) => set({ isDeploying }),

  appendLog: (line) => set((s) => ({ logs: [...s.logs, line] })),

  clearLogs: () => set({ logs: [] }),
}));
