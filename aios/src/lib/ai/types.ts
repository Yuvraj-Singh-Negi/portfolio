/// AI Cognitive Engine — Core Types

export type AIMode =
  | "architect"
  | "mentor"
  | "pair-programmer"
  | "career"
  | "research"
  | "analytics"
  | "planner"
  | "coach";

export type AIProvider = "openai" | "anthropic" | "gemini" | "openrouter" | "mock";

export type AIAction =
  "explain" | "review" | "generate" | "suggest" | "analyze" | "question" | "recommend";

export interface AIRequest {
  mode: AIMode;
  action: AIAction;
  context: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usedTokens: number;
  provider: AIProvider;
  latency: number;
  suggestions?: string[];
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

/// Engineering Digital Twin

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  progress: number;
  hoursInvested: number;
  lastPracticed: string;
  strength: "weak" | "developing" | "competent" | "strong" | "expert";
  prerequisites: string[];
  children: string[];
}

export interface ProjectNode {
  id: string;
  name: string;
  description: string;
  repository?: string;
  technologies: string[];
  complexity: number;
  health: "good" | "warning" | "critical";
  lastCommit: string;
  deployment?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "concept" | "pattern" | "framework" | "language" | "tool";
  description: string;
  connections: string[];
  resources: number;
  completed: boolean;
  proficiency: number;
  lastReviewed: string;
}

export interface DigitalTwin {
  userId: string;
  northStar: string;
  currentWeek: number;
  totalWeeks: number;

  // Skill graph
  skills: SkillNode[];
  skillCategories: Record<string, SkillNode[]>;

  // Knowledge graph
  knowledge: KnowledgeNode[];
  knowledgeConnections: [string, string][];

  // Projects
  projects: ProjectNode[];

  // Learning
  preferredLearningStyle: "reading" | "video" | "hands-on" | "mixed";
  learningVelocity: number;
  retentionScore: number;

  // Time allocation
  timeAllocation: {
    learning: number;
    building: number;
    research: number;
    review: number;
    other: number;
  };

  // Git activity
  totalCommits: number;
  activeRepos: number;
  weeklyCommits: number[];

  // Career
  careerReadiness: {
    frontend: number;
    backend: number;
    ai: number;
    ml: number;
    systemDesign: number;
    interview: number;
  };

  // Preferences
  favoriteTechnologies: string[];
  architecturePatterns: string[];
  debuggingAbility: number;
  testingCoverage: number;
}

/// Memory

export interface MemoryEntry {
  id: string;
  category:
    | "engineering"
    | "projects"
    | "architecture"
    | "research"
    | "learning"
    | "career"
    | "reflection"
    | "goals"
    | "preferences"
    | "failures"
    | "achievements";
  title: string;
  content: string;
  timestamp: string;
  importance: number;
  tags: string[];
  relatedIds: string[];
}

/// Roadmap

export interface RoadmapItem {
  id: string;
  type: "topic" | "project" | "paper" | "architecture" | "interview" | "revision";
  title: string;
  description: string;
  priority: number;
  estimatedHours: number;
  prerequisites: string[];
  status: "pending" | "active" | "completed";
  reason: string;
}

/// Analytics

export interface AnalyticsEntry {
  date: string;
  learningHours: number;
  codingHours: number;
  projectsCompleted: number;
  deployments: number;
  commits: number;
  prsMerged: number;
  researchPapers: number;
  booksCompleted: number;
  coursesCompleted: number;
  bugsFixed: number;
  algorithmsSolved: number;
  architectureReviews: number;
  codeReviews: number;
  testCoverage: number;
  aiUsage: number;
  xpEarned: number;
}

export interface AnalyticsTrend {
  metric: string;
  daily: number[];
  weekly: number[];
  monthly: number[];
  change: number;
  direction: "up" | "down" | "stable";
}

/// AI Insight

export interface AIInsight {
  id: string;
  type: "alert" | "suggestion" | "achievement" | "warning" | "insight";
  title: string;
  description: string;
  priority: number;
  actionLabel?: string;
  actionHref?: string;
  timestamp: string;
  dismissed: boolean;
}

const defaultConfig: AIProviderConfig = {
  provider: "mock",
  model: "gpt-4o",
  maxTokens: 2048,
  temperature: 0.7,
};

export { defaultConfig };
