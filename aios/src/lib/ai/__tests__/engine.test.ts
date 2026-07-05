import { describe, it, expect } from "vitest";
import { AICognitiveEngine } from "@/lib/ai/engine";
import type { AIMode, AIAction } from "@/lib/ai/types";

describe("AICognitiveEngine", () => {
  it("creates an engine with a digital twin", () => {
    const engine = new AICognitiveEngine("user-1");
    const twin = engine.getTwin();
    expect(twin.userId).toBe("user-1");
    expect(twin.skills.length).toBeGreaterThan(0);
  });

  it("generates initial insights", () => {
    const engine = new AICognitiveEngine("user-1");
    const insights = engine.getInsights();
    expect(insights.length).toBeGreaterThan(0);
  });

  it("has a knowledge graph", () => {
    const engine = new AICognitiveEngine("user-1");
    const kg = engine.getKnowledgeGraph();
    expect(kg.getAllNodes().length).toBeGreaterThan(0);
  });

  it("generates a roadmap", () => {
    const engine = new AICognitiveEngine("user-1");
    const roadmap = engine.generateRoadmap();
    expect(roadmap.length).toBeGreaterThan(0);
    expect(roadmap[0]).toHaveProperty("title");
    expect(roadmap[0]).toHaveProperty("estimatedHours");
  });

  it("generates a career report", () => {
    const engine = new AICognitiveEngine("user-1");
    const report = engine.generateCareerReport();
    expect(report.length).toBeGreaterThan(0);
    expect(report[0]).toHaveProperty("area");
    expect(report[0]).toHaveProperty("score");
  });

  it("executes a mock request", async () => {
    const engine = new AICognitiveEngine("user-1");
    const result = await engine.execute({
      mode: "mentor",
      action: "explain",
      context: "testing",
      prompt: "Explain testing",
    });
    expect(result.content).toBeTruthy();
    expect(result.provider).toBe("mock");
  });

  it("analyzes a project", async () => {
    const engine = new AICognitiveEngine("user-1");
    const result = await engine.analyzeProject("AIOS Core");
    expect(result).toBeTruthy();
  });

  it("returns not found for unknown project", async () => {
    const engine = new AICognitiveEngine("user-1");
    const result = await engine.analyzeProject("Unknown");
    expect(result).toContain("not found");
  });

  it("generates an insight on demand", async () => {
    const engine = new AICognitiveEngine("user-1");
    const insight = await engine.generateInsight("TypeScript");
    expect(insight.title).toContain("TypeScript");
    expect(insight.description).toBeTruthy();
  });
});
