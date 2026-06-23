export type {
  FileNode,
  VFSEntry,
  VFSSnapshot,
  WorkspaceState,
} from "./vfs";
export { detectLanguage, buildFileTree } from "./vfs";

export interface AIProviderFileResult {
  files: Array<{
    path: string;
    content: string;
  }>;
}

export interface GenerationStreamEvent {
  type: "text" | "file" | "error" | "done";
  content?: string;
  file?: {
    path: string;
    content: string;
  };
  error?: string;
}

export type Tier = "FREE" | "PRO" | "ENTERPRISE";

export interface TierLimits {
  projects: number;
  generations: number;
  tokensPerMonth: number;
  members: number;
  deployments: boolean;
  customDomains: boolean;
  teamAccess: boolean;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  FREE: {
    projects: 3,
    generations: 50,
    tokensPerMonth: 100000,
    members: 1,
    deployments: false,
    customDomains: false,
    teamAccess: false,
  },
  PRO: {
    projects: 20,
    generations: 500,
    tokensPerMonth: 1000000,
    members: 5,
    deployments: true,
    customDomains: true,
    teamAccess: false,
  },
  ENTERPRISE: {
    projects: 100,
    generations: 5000,
    tokensPerMonth: 10000000,
    members: 50,
    deployments: true,
    customDomains: true,
    teamAccess: true,
  },
};
