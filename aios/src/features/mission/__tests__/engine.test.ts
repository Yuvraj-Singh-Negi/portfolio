import { describe, it, expect } from "vitest";
import {
  generateMissionId,
  calculatePriority,
  estimateCompletion,
  canTransition,
  getMissionCategory,
  generateDailyTimeline,
  generateTaskBreakdown,
  calculateAdaptiveDifficulty,
  calculateRewards,
  getStreakLabel,
} from "../engine";
import type {
  MissionType,
  MissionState,
  MissionPriority,
  MissionAnalytics,
  Difficulty,
} from "../types";

describe("Mission Engine", () => {
  describe("generateMissionId", () => {
    it("generates a unique ID with msn- prefix", () => {
      const id = generateMissionId();
      expect(id).toMatch(/^msn-/);
    });

    it("generates unique IDs", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateMissionId()));
      expect(ids.size).toBe(100);
    });
  });

  describe("calculatePriority", () => {
    it("returns critical for high scores", () => {
      expect(calculatePriority(10, 10, 10, 10)).toBe("critical");
    });

    it("returns low for low scores", () => {
      expect(calculatePriority(1, 1, 1, 1)).toBe("low");
    });

    it("returns medium for mid-range scores", () => {
      expect(calculatePriority(5, 5, 4, 4)).toBe("medium");
    });
  });

  describe("estimateCompletion", () => {
    it("returns 0 for zero progress", () => {
      expect(estimateCompletion(0, 60)).toBe(0);
    });

    it("estimates based on progress rate", () => {
      const estimate = estimateCompletion(25, 30);
      expect(estimate).toBeGreaterThan(0);
    });
  });

  describe("canTransition", () => {
    it("allows valid transitions", () => {
      expect(canTransition("pending", "ready")).toBe(true);
      expect(canTransition("ready", "in-progress")).toBe(true);
      expect(canTransition("in-progress", "completed")).toBe(true);
    });

    it("blocks invalid transitions", () => {
      expect(canTransition("pending", "completed")).toBe(false);
      expect(canTransition("completed", "in-progress")).toBe(false);
    });

    it("handles archived state", () => {
      expect(canTransition("archived", "ready")).toBe(false);
    });
  });

  describe("getMissionCategory", () => {
    it("returns correct categories", () => {
      expect(getMissionCategory("learning")).toBe("Knowledge");
      expect(getMissionCategory("coding")).toBe("Engineering");
      expect(getMissionCategory("system-design")).toBe("Architecture");
    });
  });

  describe("generateDailyTimeline", () => {
    it("returns 9 time slots", () => {
      const timeline = generateDailyTimeline();
      expect(timeline).toHaveLength(9);
    });

    it("starts at 08:00", () => {
      const timeline = generateDailyTimeline();
      expect(timeline[0].hour).toBe(8);
    });

    it("includes all required session types", () => {
      const timeline = generateDailyTimeline();
      const types = timeline.map((t) => t.type);
      expect(types).toContain("deep-work");
      expect(types).toContain("coding");
      expect(types).toContain("reflection");
    });
  });

  describe("generateTaskBreakdown", () => {
    it("returns tasks for a given mission type", () => {
      const tasks = generateTaskBreakdown("coding");
      expect(tasks).toHaveLength(4);
      expect(tasks[0]).toHaveProperty("id");
      expect(tasks[0]).toHaveProperty("label");
      expect(tasks[0]).toHaveProperty("duration");
      expect(tasks[0].done).toBe(false);
    });

    it("returns default tasks for unknown type", () => {
      const tasks = generateTaskBreakdown("learning" as MissionType);
      expect(tasks).toHaveLength(4);
    });
  });

  describe("calculateAdaptiveDifficulty", () => {
    it("returns beginner with no history", () => {
      const result = calculateAdaptiveDifficulty([], "coding");
      expect(result.recommended).toBe("beginner");
    });

    it("recommends expert for high performers", () => {
      const analytics: MissionAnalytics[] = [
        {
          completionTime: 20,
          estimatedTime: 40,
          difficulty: "advanced",
          focusScore: 90,
          distractions: 0,
          resourcesUsed: [],
          aiAssistance: 0,
          gitCommits: 0,
          knowledgeGained: [],
          reflectionQuality: 8,
        },
      ];
      const result = calculateAdaptiveDifficulty(analytics, "coding");
      expect(result.recommended).toBe("expert");
    });

    it("returns a reason string", () => {
      const result = calculateAdaptiveDifficulty([], "coding");
      expect(result.reason).toBeTruthy();
    });
  });

  describe("calculateRewards", () => {
    const baseMission = {
      id: "test",
      type: "coding" as MissionType,
      state: "completed" as MissionState,
      priority: "high" as MissionPriority,
      progress: 100,
      dependencies: [],
      totalPausedTime: 0,
      category: "Engineering",
      createdAt: "",
      updatedAt: "",
      template: {
        name: "Test",
        objective: "",
        whyItMatters: "",
        estimatedTime: 30,
        difficulty: "intermediate" as Difficulty,
        expectedOutput: "",
        resources: [],
        checklist: [],
        successCriteria: [],
        aiHints: [],
        reflection: [],
      },
    };
    const analytics: MissionAnalytics = {
      completionTime: 25,
      estimatedTime: 30,
      difficulty: "intermediate",
      focusScore: 85,
      distractions: 0,
      resourcesUsed: [],
      aiAssistance: 0,
      gitCommits: 0,
      knowledgeGained: [],
      reflectionQuality: 7,
    };

    it("calculates base XP", () => {
      const rewards = calculateRewards(baseMission, analytics, 0);
      expect(rewards.xp).toBeGreaterThan(100);
    });

    it("adds streak bonus", () => {
      const rewards = calculateRewards(baseMission, analytics, 5);
      expect(rewards.streakBonus).toBe(50);
    });

    it("awards badges for streaks", () => {
      const rewards = calculateRewards(baseMission, analytics, 7);
      expect(rewards.badges).toContain("weekly-warrior");
    });
  });

  describe("getStreakLabel", () => {
    it("returns start message for 0", () => {
      expect(getStreakLabel(0)).toBe("Start a streak");
    });

    it("returns day count for low streaks", () => {
      expect(getStreakLabel(3)).toContain("3");
    });

    it("returns legendary for 30+", () => {
      expect(getStreakLabel(30)).toContain("legendary");
    });
  });
});
