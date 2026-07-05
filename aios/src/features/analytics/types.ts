export interface MetricEntry {
  date: string;
  learningHours: number;
  codingHours: number;
  commits: number;
  prsMerged: number;
  xpEarned: number;
  tasksCompleted: number;
  aiInteractions: number;
  focusScore: number;
}

export interface MetricSummary {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  color: string;
}

export interface SkillGrowthPoint {
  date: string;
  skills: Record<string, number>;
}

export interface WeeklyAggregation {
  week: string;
  totalHours: number;
  commits: number;
  xpGained: number;
  focusAvg: number;
}

export interface ActivityBucket {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}
