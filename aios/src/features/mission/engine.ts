import type { Mission, MissionType, MissionPriority, DailyTimeline, NorthStar } from "./types";

export const northStar: NorthStar = {
  goal: "Become an Elite AI Engineer",
  weekly: 7,
  total: 24,
  estimatedWeeks: 24,
};

export function generateMissionId(): string {
  return `msn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateDailyTimeline(): DailyTimeline[] {
  return [
    { hour: 8, label: "Morning Planning", type: "planning" },
    { hour: 9, label: "Deep Work Session", type: "deep-work" },
    { hour: 11, label: "Morning Break", type: "break" },
    { hour: 12, label: "Coding Session", type: "coding" },
    { hour: 13, label: "Lunch", type: "lunch" },
    { hour: 14, label: "Project Work", type: "project" },
    { hour: 16, label: "Revision", type: "revision" },
    { hour: 17, label: "Research", type: "research" },
    { hour: 18, label: "Reflection", type: "reflection" },
  ];
}

export function calculatePriority(
  deadlineDays: number,
  dependencyCount: number,
  careerImportance: number,
  projectImportance: number,
): MissionPriority {
  const score =
    deadlineDays * 0.3 + dependencyCount * 0.2 + careerImportance * 0.25 + projectImportance * 0.25;
  if (score >= 8) return "critical";
  if (score >= 6) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export function estimateCompletion(progress: number, elapsedMinutes: number): number {
  if (progress === 0) return 0;
  const rate = progress / elapsedMinutes;
  if (rate <= 0) return 0;
  return Math.round((100 - progress) / rate);
}

const missionCategories: Record<MissionType, string> = {
  learning: "Knowledge",
  coding: "Engineering",
  research: "Knowledge",
  debugging: "Engineering",
  "system-design": "Architecture",
  reading: "Knowledge",
  writing: "Communication",
  architecture: "Architecture",
  deployment: "Engineering",
  review: "Quality",
  revision: "Knowledge",
  reflection: "Growth",
  "interview-prep": "Career",
  "open-source": "Community",
  "deep-work": "Productivity",
  "creative-building": "Innovation",
};

export function getMissionCategory(type: MissionType): string {
  return missionCategories[type] || "General";
}

const typeColors: Record<MissionType, string> = {
  learning: "text-accent-blue",
  coding: "text-accent-green",
  research: "text-accent-purple",
  debugging: "text-accent-red",
  "system-design": "text-accent-amber",
  reading: "text-accent-cyan",
  writing: "text-accent-blue",
  architecture: "text-accent-purple",
  deployment: "text-accent-green",
  review: "text-accent-amber",
  revision: "text-accent-cyan",
  reflection: "text-accent-purple",
  "interview-prep": "text-accent-red",
  "open-source": "text-accent-green",
  "deep-work": "text-accent-blue",
  "creative-building": "text-accent-purple",
};

export function getMissionTypeColor(type: MissionType): string {
  return typeColors[type] || "text-muted-foreground";
}

export function canTransition(from: string, to: string): boolean {
  const transitions: Record<string, string[]> = {
    pending: ["ready", "archived"],
    ready: ["in-progress", "blocked", "archived"],
    "in-progress": ["paused", "blocked", "review", "completed"],
    paused: ["in-progress", "ready"],
    blocked: ["ready", "archived"],
    review: ["completed", "in-progress"],
    completed: ["archived"],
    archived: [],
  };
  return transitions[from]?.includes(to) ?? false;
}
