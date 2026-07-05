import { describe, it, expect } from "vitest";
import {
  generateMissionId,
  calculatePriority,
  estimateCompletion,
  canTransition,
  getMissionCategory,
  generateDailyTimeline,
} from "../engine";

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
});
