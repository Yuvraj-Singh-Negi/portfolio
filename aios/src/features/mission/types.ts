export type MissionType =
  | "learning"
  | "coding"
  | "research"
  | "debugging"
  | "system-design"
  | "reading"
  | "writing"
  | "architecture"
  | "deployment"
  | "review"
  | "revision"
  | "reflection"
  | "interview-prep"
  | "open-source"
  | "deep-work"
  | "creative-building";

export type MissionState =
  "pending" | "ready" | "in-progress" | "paused" | "blocked" | "review" | "completed" | "archived";

export type MissionPriority = "critical" | "high" | "medium" | "low";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface MissionTemplate {
  name: string;
  objective: string;
  whyItMatters: string;
  estimatedTime: number;
  difficulty: Difficulty;
  expectedOutput: string;
  resources: string[];
  checklist: MissionChecklistItem[];
  successCriteria: string[];
  aiHints: string[];
  reflection: string[];
}

export interface MissionChecklistItem {
  id: string;
  label: string;
  duration: string;
  done: boolean;
  skipped?: boolean;
}

export interface MissionDependency {
  id: string;
  name: string;
  required: boolean;
  met: boolean;
}

export interface Mission {
  id: string;
  type: MissionType;
  template: MissionTemplate;
  state: MissionState;
  priority: MissionPriority;
  progress: number;
  dependencies: MissionDependency[];
  focusScore?: number;
  distractions?: number;
  resourcesUsed?: string[];
  aiAssistance?: string[];
  gitCommits?: number;
  knowledgeGained?: string[];
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  totalPausedTime: number;
  reflection?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTimeline {
  hour: number;
  label: string;
  type:
    | "planning"
    | "deep-work"
    | "coding"
    | "project"
    | "revision"
    | "research"
    | "reflection"
    | "break"
    | "lunch";
  missionId?: string;
}

export interface MissionAnalytics {
  completionTime: number;
  estimatedTime: number;
  difficulty: Difficulty;
  focusScore: number;
  distractions: number;
  resourcesUsed: string[];
  aiAssistance: number;
  gitCommits: number;
  knowledgeGained: string[];
  reflectionQuality: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type:
    | "project"
    | "lesson"
    | "commit"
    | "achievement"
    | "skill"
    | "research"
    | "certificate"
    | "failure"
    | "recovery";
  title: string;
  description: string;
  missionId?: string;
}

export interface NorthStar {
  goal: string;
  weekly: number;
  total: number;
  estimatedWeeks: number;
}
