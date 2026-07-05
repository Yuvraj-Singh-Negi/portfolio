import type {
  Mission,
  MissionType,
  MissionPriority,
  MissionAnalytics,
  Difficulty,
  DailyTimeline,
  NorthStar,
} from "./types";

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

// Task Generator — decomposes a mission type into sub-tasks
const taskTemplates: Record<MissionType, { label: string; duration: string }[]> = {
  learning: [
    { label: "Read core documentation", duration: "25m" },
    { label: "Take structured notes", duration: "15m" },
    { label: "Build a minimal example", duration: "30m" },
    { label: "Explain concept in own words", duration: "10m" },
  ],
  coding: [
    { label: "Set up project structure", duration: "10m" },
    { label: "Implement core logic", duration: "40m" },
    { label: "Write tests", duration: "20m" },
    { label: "Run and debug", duration: "15m" },
  ],
  research: [
    { label: "Search and gather sources", duration: "20m" },
    { label: "Skim and tag relevant papers", duration: "25m" },
    { label: "Deep read selected sources", duration: "30m" },
    { label: "Synthesize findings", duration: "15m" },
  ],
  debugging: [
    { label: "Reproduce the bug", duration: "10m" },
    { label: "Isolate root cause", duration: "25m" },
    { label: "Implement fix", duration: "20m" },
    { label: "Verify and add regression test", duration: "15m" },
  ],
  "system-design": [
    { label: "Define requirements", duration: "15m" },
    { label: "Sketch high-level architecture", duration: "25m" },
    { label: "Deep dive into components", duration: "30m" },
    { label: "Identify trade-offs", duration: "15m" },
  ],
  reading: [
    { label: "Set reading goals", duration: "5m" },
    { label: "Active reading session", duration: "30m" },
    { label: "Annotate key passages", duration: "15m" },
    { label: "Summarize key takeaways", duration: "10m" },
  ],
  writing: [
    { label: "Outline structure", duration: "10m" },
    { label: "Write first draft", duration: "30m" },
    { label: "Review and edit", duration: "15m" },
    { label: "Polish final version", duration: "10m" },
  ],
  architecture: [
    { label: "Review existing architecture", duration: "15m" },
    { label: "Identify improvement areas", duration: "20m" },
    { label: "Design new architecture", duration: "30m" },
    { label: "Document decisions (ADRs)", duration: "15m" },
  ],
  deployment: [
    { label: "Prepare deployment artifacts", duration: "15m" },
    { label: "Set up CI/CD pipeline", duration: "25m" },
    { label: "Run staging verification", duration: "15m" },
    { label: "Deploy to production", duration: "10m" },
  ],
  review: [
    { label: "Review code changes", duration: "20m" },
    { label: "Run through checklist", duration: "15m" },
    { label: "Provide structured feedback", duration: "15m" },
    { label: "Approve or request changes", duration: "10m" },
  ],
  revision: [
    { label: "Identify weak areas", duration: "10m" },
    { label: "Review previous notes", duration: "20m" },
    { label: "Practice problems", duration: "30m" },
    { label: "Self-assess understanding", duration: "10m" },
  ],
  reflection: [
    { label: "Review what was accomplished", duration: "10m" },
    { label: "Identify what went well", duration: "10m" },
    { label: "Identify what could improve", duration: "10m" },
    { label: "Set next steps", duration: "10m" },
  ],
  "interview-prep": [
    { label: "Review topic areas", duration: "15m" },
    { label: "Solve practice problem", duration: "30m" },
    { label: "Mock interview run", duration: "20m" },
    { label: "Review and iterate", duration: "15m" },
  ],
  "open-source": [
    { label: "Understand issue context", duration: "15m" },
    { label: "Set up local development", duration: "15m" },
    { label: "Implement changes", duration: "30m" },
    { label: "Submit PR with description", duration: "15m" },
  ],
  "deep-work": [
    { label: "Define focus objective", duration: "5m" },
    { label: "Deep work block 1", duration: "50m" },
    { label: "Short break", duration: "10m" },
    { label: "Deep work block 2", duration: "50m" },
  ],
  "creative-building": [
    { label: "Brainstorm ideas", duration: "15m" },
    { label: "Prototype core feature", duration: "35m" },
    { label: "Iterate on feedback", duration: "20m" },
    { label: "Polish and ship", duration: "15m" },
  ],
};

export function generateTaskBreakdown(
  type: MissionType,
): { id: string; label: string; duration: string; done: boolean }[] {
  const tasks = taskTemplates[type] ?? taskTemplates.learning;
  return tasks.map((t, i) => ({
    id: `task-${Date.now()}-${i}`,
    ...t,
    done: false,
  }));
}

// Adaptive Difficulty
export interface DifficultyAdjustment {
  recommended: Difficulty;
  reason: string;
}

export function calculateAdaptiveDifficulty(
  pastAnalytics: MissionAnalytics[],
  _missionType: MissionType,
): DifficultyAdjustment {
  if (pastAnalytics.length === 0) {
    return { recommended: "beginner", reason: "No prior data — starting at beginner level" };
  }

  const recent = pastAnalytics.slice(-5);
  const avgFocus = recent.reduce((s, a) => s + a.focusScore, 0) / recent.length;
  const avgCompletionTime = recent.reduce((s, a) => s + a.completionTime, 0) / recent.length;
  const avgEstimate = recent.reduce((s, a) => s + a.estimatedTime, 0) / recent.length;

  const efficiency = avgEstimate > 0 ? avgCompletionTime / avgEstimate : 1;

  if (avgFocus >= 80 && efficiency <= 0.8) {
    return {
      recommended: "expert",
      reason: "High focus and faster than estimated — advancing difficulty",
    };
  }
  if (avgFocus >= 70 && efficiency <= 1) {
    return { recommended: "advanced", reason: "Good focus and on-pace — try advanced" };
  }
  if (avgFocus >= 50 || efficiency <= 1.2) {
    return {
      recommended: "intermediate",
      reason: "Moderate performance — intermediate is appropriate",
    };
  }
  return { recommended: "beginner", reason: "Building foundation — staying at beginner level" };
}

// Rewards System
export interface Rewards {
  xp: number;
  streakBonus: number;
  badges: string[];
  totalXp: number;
}

const XP_BASE = 100;
const XP_DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 1.5,
  advanced: 2,
  expert: 3,
};

export function calculateRewards(
  mission: Mission,
  analytics: MissionAnalytics,
  currentStreak: number,
): Rewards {
  const baseXp = XP_BASE * (XP_DIFFICULTY_MULTIPLIER[mission.template.difficulty] ?? 1);
  const focusBonus = Math.round(baseXp * (analytics.focusScore / 100) * 0.5);
  const timeBonus =
    analytics.completionTime <= analytics.estimatedTime ? Math.round(baseXp * 0.25) : 0;
  const streakBonus = Math.min(currentStreak, 30) * 10;

  const xp = baseXp + focusBonus + timeBonus;
  const badges: string[] = [];

  if (currentStreak >= 7) badges.push("weekly-warrior");
  if (currentStreak >= 30) badges.push("iron-will");
  if (analytics.focusScore >= 90) badges.push("laser-focus");
  if (analytics.completionTime <= analytics.estimatedTime * 0.5) badges.push("speed-runner");

  return { xp, streakBonus, totalXp: xp + streakBonus, badges };
}

export function getStreakLabel(streak: number): string {
  if (streak === 0) return "Start a streak";
  if (streak < 3) return `${streak} day${streak > 1 ? "s" : ""}`;
  if (streak < 7) return `${streak} days — building momentum`;
  if (streak < 14) return `${streak} days — on fire 🔥`;
  if (streak < 30) return `${streak} days — unstoppable`;
  return `${streak} days — legendary`;
}
