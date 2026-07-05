import type { DigitalTwin, SkillNode, KnowledgeNode } from "./types";

export function createDigitalTwin(userId: string): DigitalTwin {
  return {
    userId,
    northStar: "",
    currentWeek: 0,
    totalWeeks: 24,
    skills: [],
    skillCategories: {},
    knowledge: [],
    knowledgeConnections: [],
    projects: [],
    preferredLearningStyle: "mixed",
    learningVelocity: 0,
    retentionScore: 0,
    timeAllocation: { learning: 0, building: 0, research: 0, review: 0, other: 100 },
    totalCommits: 0,
    activeRepos: 0,
    weeklyCommits: [],
    careerReadiness: {
      frontend: 0,
      backend: 0,
      ai: 0,
      ml: 0,
      systemDesign: 0,
      interview: 0,
    },
    favoriteTechnologies: [],
    architecturePatterns: [],
    debuggingAbility: 0,
    testingCoverage: 0,
  };
}

export function analyzeTimeAllocation(_twin: DigitalTwin): string[] {
  void _twin;
  return [];
}

export function findWeakSkills(_twin: DigitalTwin, _threshold = 40): SkillNode[] {
  void _twin;
  void _threshold;
  return [];
}

export function findStaleKnowledge(_twin: DigitalTwin, _daysThreshold = 7): KnowledgeNode[] {
  void _twin;
  void _daysThreshold;
  return [];
}
