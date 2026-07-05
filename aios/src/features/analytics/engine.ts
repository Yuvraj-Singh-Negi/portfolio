import type {
  MetricEntry,
  WeeklyAggregation,
  ActivityBucket,
  SkillGrowthPoint,
  MetricSummary,
} from "./types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMetricEntries(days: number = 90): MetricEntry[] {
  const entries: MetricEntry[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    entries.push({
      date: date.toISOString().slice(0, 10),
      learningHours: randomInt(0, 4),
      codingHours: randomInt(0, 6),
      commits: randomInt(0, 8),
      prsMerged: randomInt(0, 2),
      xpEarned: randomInt(0, 300),
      tasksCompleted: randomInt(0, 3),
      aiInteractions: randomInt(0, 10),
      focusScore: randomInt(40, 98),
    });
  }
  return entries;
}

export function computeSummaries(entries: MetricEntry[]): MetricSummary[] {
  const recent = entries.slice(-30);
  const previous = entries.slice(-60, -30);

  const sum = (arr: MetricEntry[], key: keyof MetricEntry): number =>
    arr.reduce((s, e) => s + (typeof e[key] === "number" ? (e[key] as number) : 0), 0);

  const avg = (arr: MetricEntry[], key: keyof MetricEntry): number =>
    arr.length > 0 ? Math.round(sum(arr, key) / arr.length) : 0;

  const computeSummary = (
    label: string,
    key: keyof MetricEntry,
    format: "hours" | "number" | "percent",
    color: string,
  ): MetricSummary => {
    const recentVal =
      format === "hours"
        ? Math.round(sum(recent, key) / 60)
        : format === "percent"
          ? avg(recent, key)
          : sum(recent, key);
    const prevVal =
      format === "hours"
        ? Math.round(sum(previous, key) / 60)
        : format === "percent"
          ? avg(previous, key)
          : sum(previous, key);
    const change = recentVal - prevVal;
    const prefix = change > 0 ? "+" : "";
    return {
      label,
      value:
        format === "hours"
          ? `${recentVal}h`
          : format === "percent"
            ? `${recentVal}%`
            : `${recentVal}`,
      change: `${prefix}${change}`,
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
      color,
    };
  };

  return [
    computeSummary("Coding Hours", "codingHours", "hours", "text-accent-green"),
    computeSummary("Commits", "commits", "number", "text-accent-blue"),
    computeSummary("PRs Merged", "prsMerged", "number", "text-accent-purple"),
    computeSummary("XP Earned", "xpEarned", "number", "text-accent-amber"),
    computeSummary("Tasks Completed", "tasksCompleted", "number", "text-accent-cyan"),
    computeSummary("Focus Score", "focusScore", "percent", "text-accent-green"),
    computeSummary("AI Interactions", "aiInteractions", "number", "text-accent-purple"),
    computeSummary("Learning Hours", "learningHours", "hours", "text-accent-blue"),
  ];
}

export function computeWeeklyAggregations(entries: MetricEntry[]): WeeklyAggregation[] {
  const weeks: Record<string, MetricEntry[]> = {};
  for (const entry of entries) {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!weeks[key]) weeks[key] = [];
    weeks[key].push(entry);
  }

  return Object.entries(weeks).map(([week, days]) => ({
    week,
    totalHours: days.reduce((s, d) => s + d.codingHours + d.learningHours, 0),
    commits: days.reduce((s, d) => s + d.commits, 0),
    xpGained: days.reduce((s, d) => s + d.xpEarned, 0),
    focusAvg: Math.round(days.reduce((s, d) => s + d.focusScore, 0) / days.length),
  }));
}

export function generateActivityHeatmap(entries: MetricEntry[]): ActivityBucket[] {
  return entries.map((e) => {
    const count = e.commits + e.tasksCompleted + e.prsMerged;
    const intensity: ActivityBucket["intensity"] =
      count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4;
    return { date: e.date, count, intensity };
  });
}

export function generateSkillGrowth(days: number = 90): SkillGrowthPoint[] {
  const skills = ["TypeScript", "React", "Rust", "System Design", "ML", "DevOps"];
  const points: SkillGrowthPoint[] = [];
  const now = new Date();
  const base: Record<string, number> = {
    TypeScript: 40,
    React: 35,
    Rust: 10,
    "System Design": 20,
    ML: 5,
    DevOps: 15,
  };

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const point: SkillGrowthPoint = { date: date.toISOString().slice(0, 10), skills: {} };
    for (const skill of skills) {
      const growth = (days - i) / days;
      const noise = Math.random() * 6 - 3;
      point.skills[skill] = Math.min(100, Math.round(base[skill] + growth * 40 + noise));
    }
    points.push(point);
  }
  return points;
}

export function computeStreak(entries: MetricEntry[]): number {
  let streak = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].codingHours > 0 || entries[i].learningHours > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
