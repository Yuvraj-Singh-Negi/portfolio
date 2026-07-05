import { describe, it, expect } from "vitest";
import { roadmaps, getRoadmapById, getMilestonesForSkill } from "../roadmaps";
import {
  skillTree,
  getSkillById,
  getSkillCategory,
  getUnlockedSkills,
  getSkillPath,
  getOverallSkillProgress,
} from "../skill-tree";
import { createCard, scheduleReview, getDueCards, getCardStats, revisionDecks } from "../revision";
import { resources, getResourcesByTopic, getResourceCount } from "../resources";

describe("Roadmaps", () => {
  it("has predefined roadmaps", () => {
    expect(roadmaps.length).toBeGreaterThanOrEqual(3);
  });

  it("each roadmap has milestones", () => {
    for (const r of roadmaps) {
      expect(r.milestones.length).toBeGreaterThan(0);
    }
  });

  it("getRoadmapById returns correct roadmap", () => {
    const r = getRoadmapById("ai-engineer");
    expect(r).toBeDefined();
    expect(r!.title).toBe("AI Engineer");
  });

  it("getRoadmapById returns undefined for unknown", () => {
    expect(getRoadmapById("unknown")).toBeUndefined();
  });

  it("getMilestonesForSkill finds milestones", () => {
    const ms = getMilestonesForSkill("ml-fundamentals");
    expect(ms.length).toBeGreaterThan(0);
  });
});

describe("Skill Tree", () => {
  it("has skill categories", () => {
    expect(skillTree.length).toBeGreaterThan(0);
  });

  it("each category has skills", () => {
    for (const c of skillTree) {
      expect(c.skills.length).toBeGreaterThan(0);
    }
  });

  it("getSkillById returns correct skill", () => {
    const s = getSkillById("typescript");
    expect(s).toBeDefined();
    expect(s!.label).toBe("TypeScript");
  });

  it("getSkillCategory returns correct category", () => {
    const c = getSkillCategory("programming");
    expect(c).toBeDefined();
    expect(c!.label).toBe("Programming");
  });

  it("getUnlockedSkills returns skills with met prerequisites", () => {
    const known = new Set(["typescript"]);
    const unlocked = getUnlockedSkills(known);
    expect(unlocked.some((s) => s.id === "go")).toBe(true);
  });

  it("getSkillPath resolves dependency chain", () => {
    const path = getSkillPath("distributed-systems");
    expect(path.length).toBeGreaterThanOrEqual(1);
    expect(path[0].id).toBe("api-design");
  });

  it("getOverallSkillProgress returns a percentage", () => {
    const p = getOverallSkillProgress();
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(100);
  });
});

describe("Revision (SM-2)", () => {
  it("creates a card with defaults", () => {
    const card = createCard("c1", "topic", "Q?", "A!", ["tag"]);
    expect(card.ease).toBe(2.5);
    expect(card.interval).toBe(0);
    expect(card.repetitions).toBe(0);
  });

  it("schedules review with good quality", () => {
    const card = createCard("c1", "topic", "Q?", "A!", ["tag"]);
    const reviewed = scheduleReview(card, 4);
    expect(reviewed.interval).toBe(1);
    expect(reviewed.repetitions).toBe(1);
    expect(reviewed.lastReviewed).toBeDefined();
  });

  it("resets on poor quality", () => {
    const card = createCard("c1", "topic", "Q?", "A!", ["tag"]);
    const reviewed = scheduleReview(card, 2);
    expect(reviewed.interval).toBe(1);
    expect(reviewed.repetitions).toBe(0);
  });

  it("increases interval on consecutive good reviews", () => {
    let card = createCard("c1", "topic", "Q?", "A!", ["tag"]);
    card = scheduleReview(card, 4);
    expect(card.interval).toBe(1);
    card = scheduleReview(card, 4);
    expect(card.interval).toBe(6);
    card = scheduleReview(card, 4);
    expect(card.interval).toBeGreaterThanOrEqual(6);
  });

  it("getDueCards returns cards past due", () => {
    const due: ReturnType<typeof createCard>[] = [
      createCard("c1", "t", "Q?", "A!", []),
      { ...createCard("c2", "t", "Q?", "A!", []), nextReview: Date.now() + 99999999 },
    ];
    due[0].nextReview = 0;
    const result = getDueCards(due);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c1");
  });

  it("getCardStats returns statistics", () => {
    const stats = getCardStats(revisionDecks["system-design"] ?? []);
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.avgEase).toBeGreaterThan(1);
  });

  it("has revision decks", () => {
    expect(Object.keys(revisionDecks).length).toBeGreaterThanOrEqual(3);
  });
});

describe("Resources", () => {
  it("has a curated resource catalog", () => {
    expect(getResourceCount()).toBeGreaterThanOrEqual(40);
  });

  it("getResourcesByTopic returns matching resources", () => {
    const results = getResourcesByTopic("rust");
    expect(results.length).toBeGreaterThan(0);
  });
});
