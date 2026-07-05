/// AI Cognitive Engine — Main Intelligence Layer

import type {
  AIRequest,
  AIResponse,
  AIMode,
  AIInsight,
  DigitalTwin,
  RoadmapItem,
  AnalyticsTrend,
} from "./types";
import { createProvider } from "./provider";
import {
  createDigitalTwin,
  analyzeTimeAllocation,
  findWeakSkills,
  findStaleKnowledge,
} from "./digital-twin";
import { KnowledgeGraphEngine } from "./knowledge-graph";

export class AICognitiveEngine {
  private twin: DigitalTwin;
  private knowledgeGraph: KnowledgeGraphEngine;
  private insights: AIInsight[] = [];

  constructor(userId: string) {
    this.twin = createDigitalTwin(userId);
    this.knowledgeGraph = new KnowledgeGraphEngine(this.twin.knowledge);
    this.generateInitialInsights();
  }

  getTwin(): DigitalTwin {
    return this.twin;
  }

  getKnowledgeGraph(): KnowledgeGraphEngine {
    return this.knowledgeGraph;
  }

  getInsights(): AIInsight[] {
    return this.insights;
  }

  /// Execute an AI request through the provider abstraction
  async execute(request: AIRequest): Promise<AIResponse> {
    const enrichedPrompt = this.enrichContext(request);
    const provider = createProvider({
      provider: request.mode === "career" ? "mock" : "mock",
      model: "gpt-4o",
      maxTokens: request.maxTokens || 2048,
      temperature: request.temperature || 0.7,
    });

    return provider.execute({ ...request, prompt: enrichedPrompt });
  }

  /// Generate proactive insights based on the digital twin
  generateInitialInsights(): void {
    const weakSkills = findWeakSkills(this.twin);
    const staleKnowledge = findStaleKnowledge(this.twin);
    const timeInsights = analyzeTimeAllocation(this.twin);

    const now = new Date().toISOString();

    if (weakSkills.length > 0) {
      this.insights.push({
        id: "weak-skills",
        type: "suggestion",
        title: "Skills Needing Attention",
        description: `You haven't practiced ${weakSkills
          .slice(0, 3)
          .map((s) => s.name)
          .join(", ")} recently. Consider reviewing these topics.`,
        priority: 7,
        actionLabel: "View skills",
        actionHref: "/learning",
        timestamp: now,
        dismissed: false,
      });
    }

    if (staleKnowledge.length > 0) {
      this.insights.push({
        id: "stale-knowledge",
        type: "warning",
        title: "Knowledge Decay Detected",
        description: `${staleKnowledge.length} knowledge nodes haven't been reviewed in over a week. Spaced repetition recommended.`,
        priority: 6,
        actionLabel: "Review nodes",
        actionHref: "/knowledge",
        timestamp: now,
        dismissed: false,
      });
    }

    timeInsights.forEach((insight, i) => {
      this.insights.push({
        id: `time-${i}`,
        type: "insight",
        title: "Time Allocation Insight",
        description: insight,
        priority: 5,
        timestamp: now,
        dismissed: false,
      });
    });

    // Check for learning velocity trend
    if (this.twin.learningVelocity > 70) {
      this.insights.push({
        id: "velocity-high",
        type: "achievement",
        title: "Strong Learning Velocity",
        description:
          "Your learning velocity is in the top quartile. You're making excellent progress.",
        priority: 8,
        timestamp: now,
        dismissed: false,
      });
    }

    // Check building vs learning ratio
    const { learning, building } = this.twin.timeAllocation;
    if (building > 0 && learning / building > 2) {
      this.insights.push({
        id: "build-more",
        type: "suggestion",
        title: "Time to Build",
        description:
          "You're spending twice as much time learning as building. Start a project to apply your knowledge.",
        priority: 7,
        actionLabel: "Start project",
        actionHref: "/projects",
        timestamp: now,
        dismissed: false,
      });
    }
  }

  /// Generate adaptive roadmap
  generateRoadmap(): RoadmapItem[] {
    const roadmap: RoadmapItem[] = [];
    const weak = findWeakSkills(this.twin);

    if (weak.length > 0) {
      roadmap.push({
        id: "rm-weak",
        type: "topic",
        title: `Strengthen ${weak[0].name}`,
        description: `Review ${weak[0].name} fundamentals and complete practice exercises.`,
        priority: 9,
        estimatedHours: 4,
        prerequisites: weak[0].prerequisites,
        status: "active",
        reason: `${weak[0].name} is identified as a weak area that blocks progress in ${weak[0].children.length > 0 ? weak[0].children.join(", ") : "related topics"}.`,
      });
    }

    const uncompletedKnowledge = this.twin.knowledge.filter((k) => !k.completed);
    if (uncompletedKnowledge.length > 0) {
      roadmap.push({
        id: "rm-knowledge",
        type: "topic",
        title: `Complete ${uncompletedKnowledge[0].label}`,
        description: `Study and complete knowledge node: ${uncompletedKnowledge[0].description}`,
        priority: 7,
        estimatedHours: 3,
        prerequisites: [],
        status: "pending",
        reason: `Completing this knowledge node unlocks connections to ${uncompletedKnowledge[0].connections.join(", ")}.`,
      });
    }

    if (this.twin.careerReadiness.systemDesign < 70) {
      roadmap.push({
        id: "rm-sd",
        type: "architecture",
        title: "System Design Deep Dive",
        description:
          "Study distributed systems patterns: consensus, partitioning, replication, and caching.",
        priority: 8,
        estimatedHours: 10,
        prerequisites: ["dsa", "backend"],
        status: "pending",
        reason:
          "System design is a critical skill for senior engineering roles and architectural decision-making.",
      });
    }

    roadmap.push({
      id: "rm-project",
      type: "project",
      title: `Complete ${this.twin.projects[0]?.name || "Current Project"}`,
      description: `Push the current project across the finish line. Focus on testing, documentation, and deployment.`,
      priority: 9,
      estimatedHours: 8,
      prerequisites: [],
      status: "active",
      reason:
        "Completing projects builds portfolio strength and reinforces learning through application.",
    });

    return roadmap;
  }

  /// Generate career readiness report
  generateCareerReport(): { area: string; score: number; recommendation: string }[] {
    const { careerReadiness } = this.twin;
    return Object.entries(careerReadiness).map(([area, score]) => ({
      area: area.replace(/([A-Z])/g, " $1").trim(),
      score,
      recommendation:
        score < 50
          ? `Focus on improving ${area} — this is below the readiness threshold.`
          : score < 70
            ? `Continue developing ${area} — you're on the right track.`
            : `Your ${area} is strong — consider mentoring others.`,
    }));
  }

  /// Enrich a request with digital twin context
  private enrichContext(request: AIRequest): string {
    const context = [
      `Engineer Context:`,
      `- Current level: ${this.twin.currentWeek}/${this.twin.totalWeeks} weeks toward "${this.twin.northStar}"`,
      `- Learning velocity: ${this.twin.learningVelocity}%`,
      `- Strongest skills: ${this.twin.skills
        .filter((s) => s.strength === "strong" || s.strength === "expert")
        .map((s) => s.name)
        .join(", ")}`,
      `- Areas needing attention: ${this.twin.skills
        .filter((s) => s.strength === "weak")
        .map((s) => s.name)
        .join(", ")}`,
      `- Active projects: ${this.twin.projects.map((p) => p.name).join(", ")}`,
      `- Learning style: ${this.twin.preferredLearningStyle}`,
    ].join("\n");

    return `${context}\n\n---\n\n${request.prompt}`;
  }

  /// Generate a specific insight on demand
  async generateInsight(topic: string): Promise<AIInsight> {
    const request: AIRequest = {
      mode: "analytics",
      action: "analyze",
      context: topic,
      prompt: `Generate an actionable insight about "${topic}" based on the engineer's current state.`,
    };

    const response = await this.execute(request);

    return {
      id: `insight-${Date.now()}`,
      type: "insight",
      title: `AI Insight: ${topic}`,
      description: response.content,
      priority: 6,
      timestamp: new Date().toISOString(),
      dismissed: false,
    };
  }

  /// Analyze projects
  async analyzeProject(projectName: string): Promise<string> {
    const project = this.twin.projects.find((p) => p.name === projectName);
    if (!project) return "Project not found in your workspace.";

    const request: AIRequest = {
      mode: "architect",
      action: "analyze",
      context: projectName,
      prompt: `Review this project:\nTechnologies: ${project.technologies.join(", ")}\nComplexity: ${project.complexity}/10\nHealth: ${project.health}\nDescription: ${project.description}`,
    };

    const response = await this.execute(request);
    return response.content;
  }
}
