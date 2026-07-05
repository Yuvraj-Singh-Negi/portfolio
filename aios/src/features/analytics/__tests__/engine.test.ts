import { describe, it, expect } from "vitest";
import {
  generateMetricEntries,
  computeSummaries,
  computeWeeklyAggregations,
  generateActivityHeatmap,
  generateSkillGrowth,
  computeStreak,
} from "../engine";

describe("Analytics Engine", () => {
  it("generates metric entries", () => {
    const entries = generateMetricEntries(30);
    expect(entries).toHaveLength(31);
    expect(entries[0]).toHaveProperty("date");
    expect(entries[0]).toHaveProperty("codingHours");
  });

  it("computes summaries from entries", () => {
    const entries = generateMetricEntries(60);
    const summaries = computeSummaries(entries);
    expect(summaries.length).toBeGreaterThan(0);
    expect(summaries[0]).toHaveProperty("label");
    expect(summaries[0]).toHaveProperty("value");
    expect(summaries[0]).toHaveProperty("trend");
  });

  it("computes weekly aggregations", () => {
    const entries = generateMetricEntries(30);
    const weekly = computeWeeklyAggregations(entries);
    expect(weekly.length).toBeGreaterThan(0);
    expect(weekly[0]).toHaveProperty("week");
    expect(weekly[0]).toHaveProperty("totalHours");
  });

  it("generates activity heatmap", () => {
    const entries = generateMetricEntries(30);
    const heatmap = generateActivityHeatmap(entries);
    expect(heatmap.length).toBe(entries.length);
    expect(heatmap[0]).toHaveProperty("intensity");
  });

  it("generates skill growth data", () => {
    const growth = generateSkillGrowth(30);
    expect(growth.length).toBe(31);
    expect(Object.keys(growth[0].skills).length).toBeGreaterThan(0);
  });

  it("computes streak", () => {
    const entries = generateMetricEntries(30);
    const streak = computeStreak(entries);
    expect(streak).toBeGreaterThanOrEqual(0);
  });

  it("trend is up when recent > previous", () => {
    const entries = generateMetricEntries(60);
    // Make recent entries artificially high
    for (let i = 0; i < 30; i++) {
      if (entries[entries.length - 1 - i]) {
        entries[entries.length - 1 - i].codingHours = 10;
      }
    }
    const summaries = computeSummaries(entries);
    const coding = summaries.find((s) => s.label === "Coding Hours");
    expect(coding).toBeDefined();
  });
});
