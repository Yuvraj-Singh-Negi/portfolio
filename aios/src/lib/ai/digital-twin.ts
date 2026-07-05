import type { DigitalTwin, SkillNode, KnowledgeNode } from "./types";

const defaultSkills: SkillNode[] = [
  {
    id: "py",
    name: "Python",
    category: "programming",
    level: 72,
    progress: 72,
    hoursInvested: 240,
    lastPracticed: "2h ago",
    strength: "competent",
    prerequisites: [],
    children: ["ml", "dl"],
  },
  {
    id: "ts",
    name: "TypeScript",
    category: "programming",
    level: 85,
    progress: 85,
    hoursInvested: 320,
    lastPracticed: "1h ago",
    strength: "strong",
    prerequisites: [],
    children: ["react", "backend"],
  },
  {
    id: "react",
    name: "React",
    category: "frontend",
    level: 78,
    progress: 78,
    hoursInvested: 290,
    lastPracticed: "1d ago",
    strength: "competent",
    prerequisites: ["ts"],
    children: [],
  },
  {
    id: "backend",
    name: "Backend Engineering",
    category: "backend",
    level: 71,
    progress: 71,
    hoursInvested: 320,
    lastPracticed: "Today",
    strength: "competent",
    prerequisites: ["ts"],
    children: ["system-design"],
  },
  {
    id: "math",
    name: "Mathematics",
    category: "foundations",
    level: 58,
    progress: 58,
    hoursInvested: 180,
    lastPracticed: "1d ago",
    strength: "developing",
    prerequisites: [],
    children: ["ml"],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    category: "foundations",
    level: 65,
    progress: 65,
    hoursInvested: 200,
    lastPracticed: "3d ago",
    strength: "competent",
    prerequisites: [],
    children: ["system-design"],
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "ai",
    level: 28,
    progress: 28,
    hoursInvested: 60,
    lastPracticed: "1w ago",
    strength: "weak",
    prerequisites: ["py", "math"],
    children: ["dl"],
  },
  {
    id: "dl",
    name: "Deep Learning",
    category: "ai",
    level: 22,
    progress: 22,
    hoursInvested: 45,
    lastPracticed: "2w ago",
    strength: "weak",
    prerequisites: ["ml"],
    children: ["transformers"],
  },
  {
    id: "system-design",
    name: "System Design",
    category: "architecture",
    level: 55,
    progress: 55,
    hoursInvested: 165,
    lastPracticed: "4d ago",
    strength: "developing",
    prerequisites: ["dsa", "backend"],
    children: [],
  },
];

const defaultKnowledge: KnowledgeNode[] = [
  {
    id: "rust-ownership",
    label: "Rust Ownership",
    type: "concept",
    description: "Memory management through ownership, borrowing, and lifetimes",
    connections: ["memory-safety", "concurrency"],
    resources: 5,
    completed: true,
    proficiency: 70,
    lastReviewed: "1w ago",
  },
  {
    id: "distributed-consensus",
    label: "Distributed Consensus",
    type: "pattern",
    description: "Algorithms for agreement in distributed systems",
    connections: ["raft", "system-design"],
    resources: 8,
    completed: true,
    proficiency: 60,
    lastReviewed: "3d ago",
  },
  {
    id: "transformer-arch",
    label: "Transformer Architecture",
    type: "concept",
    description: "Self-attention based neural network architecture",
    connections: ["attention", "llm"],
    resources: 6,
    completed: false,
    proficiency: 25,
    lastReviewed: "1w ago",
  },
  {
    id: "raft",
    label: "Raft Consensus",
    type: "concept",
    description: "Understandable consensus algorithm",
    connections: ["distributed-consensus"],
    resources: 4,
    completed: true,
    proficiency: 55,
    lastReviewed: "5d ago",
  },
  {
    id: "system-design",
    label: "System Design",
    type: "concept",
    description: "Architecture and design of large-scale systems",
    connections: ["distributed-consensus", "event-sourcing"],
    resources: 12,
    completed: true,
    proficiency: 65,
    lastReviewed: "2d ago",
  },
  {
    id: "event-sourcing",
    label: "Event Sourcing",
    type: "pattern",
    description: "Storing state as a sequence of events",
    connections: ["cqrs", "system-design"],
    resources: 4,
    completed: false,
    proficiency: 30,
    lastReviewed: "1w ago",
  },
];

export function createDigitalTwin(userId: string): DigitalTwin {
  return {
    userId,
    northStar: "Become an Elite AI Engineer",
    currentWeek: 7,
    totalWeeks: 24,

    skills: defaultSkills,
    skillCategories: defaultSkills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
      },
      {} as Record<string, SkillNode[]>,
    ),

    knowledge: defaultKnowledge,
    knowledgeConnections: defaultKnowledge.flatMap((n) =>
      n.connections.map((c) => [n.id, c] as [string, string]),
    ),

    projects: [
      {
        id: "aios-core",
        name: "AIOS Core",
        description: "Engineering operating system platform",
        repository: "github.com/user/aios-core",
        technologies: ["TypeScript", "React", "Next.js", "PostgreSQL"],
        complexity: 8,
        health: "good",
        lastCommit: "2h ago",
      },
      {
        id: "api-gateway",
        name: "API Gateway",
        description: "Rate limiting, auth, and routing service",
        repository: "github.com/user/api-gateway",
        technologies: ["Go", "Redis", "Docker", "gRPC"],
        complexity: 6,
        health: "good",
        lastCommit: "1h ago",
      },
      {
        id: "knowledge-graph",
        name: "Knowledge Graph",
        description: "Vector search and semantic mapping",
        repository: "github.com/user/knowledge-graph",
        technologies: ["Python", "Neo4j", "FastAPI"],
        complexity: 7,
        health: "warning",
        lastCommit: "1d ago",
      },
    ],

    preferredLearningStyle: "mixed",
    learningVelocity: 85,
    retentionScore: 72,

    timeAllocation: {
      learning: 40,
      building: 30,
      research: 15,
      review: 10,
      other: 5,
    },

    totalCommits: 342,
    activeRepos: 5,
    weeklyCommits: [12, 8, 15, 10, 18, 14, 9],

    careerReadiness: {
      frontend: 78,
      backend: 71,
      ai: 28,
      ml: 22,
      systemDesign: 55,
      interview: 60,
    },

    favoriteTechnologies: ["TypeScript", "React", "Node.js", "Go", "PostgreSQL"],
    architecturePatterns: ["Microservices", "Event-Driven", "CQRS", "Clean Architecture"],
    debuggingAbility: 75,
    testingCoverage: 68,
  };
}

export function analyzeTimeAllocation(twin: DigitalTwin): string[] {
  const { learning, building } = twin.timeAllocation;
  const insights: string[] = [];

  if (building < 25) {
    insights.push(
      "You have spent 80% of your time learning and only 20% building. Consider starting a project to apply your knowledge.",
    );
  }
  if (learning > 50) {
    insights.push("Your learning ratio is high. Try to balance with more hands-on building.");
  }
  if (building > learning) {
    insights.push("Great balance! You're building more than learning — this accelerates growth.");
  }

  return insights;
}

export function findWeakSkills(twin: DigitalTwin, threshold = 40): SkillNode[] {
  return twin.skills.filter((s) => s.level < threshold);
}

export function findStaleKnowledge(twin: DigitalTwin, daysThreshold = 7): KnowledgeNode[] {
  const now = Date.now();
  return twin.knowledge.filter((k) => {
    const age = k.lastReviewed.match(/(\d+)/);
    if (!age) return false;
    const days = parseInt(age[1]);
    const unit = k.lastReviewed.includes("w") ? 7 : 1;
    return days * unit > daysThreshold;
  });
}
