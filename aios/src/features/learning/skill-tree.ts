export interface SkillTreeNode {
  id: string;
  label: string;
  category: string;
  level: number;
  color: string;
  prerequisites: string[];
  unlockedBy: string[];
  progress: number;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: SkillTreeNode[];
}

export const skillTree: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    skills: [
      {
        id: "typescript",
        label: "TypeScript",
        category: "programming",
        level: 1,
        color: "accent-blue",
        prerequisites: [],
        unlockedBy: [],
        progress: 85,
      },
      {
        id: "python",
        label: "Python",
        category: "programming",
        level: 1,
        color: "accent-blue",
        prerequisites: [],
        unlockedBy: [],
        progress: 70,
      },
      {
        id: "go",
        label: "Go",
        category: "programming",
        level: 2,
        color: "accent-cyan",
        prerequisites: ["typescript"],
        unlockedBy: ["typescript"],
        progress: 40,
      },
      {
        id: "rust",
        label: "Rust",
        category: "programming",
        level: 2,
        color: "accent-green",
        prerequisites: ["typescript"],
        unlockedBy: ["typescript"],
        progress: 34,
      },
      {
        id: "functional-programming",
        label: "Functional Programming",
        category: "programming",
        level: 3,
        color: "accent-purple",
        prerequisites: ["typescript"],
        unlockedBy: ["typescript"],
        progress: 55,
      },
    ],
  },
  {
    id: "web",
    label: "Web Development",
    skills: [
      {
        id: "react",
        label: "React",
        category: "web",
        level: 1,
        color: "accent-cyan",
        prerequisites: [],
        unlockedBy: [],
        progress: 78,
      },
      {
        id: "nextjs",
        label: "Next.js",
        category: "web",
        level: 2,
        color: "accent-cyan",
        prerequisites: ["react"],
        unlockedBy: ["react"],
        progress: 65,
      },
      {
        id: "css-animation",
        label: "CSS & Animation",
        category: "web",
        level: 1,
        color: "accent-cyan",
        prerequisites: [],
        unlockedBy: [],
        progress: 70,
      },
      {
        id: "web-apis",
        label: "Web APIs",
        category: "web",
        level: 2,
        color: "accent-cyan",
        prerequisites: ["react"],
        unlockedBy: ["react"],
        progress: 60,
      },
      {
        id: "web-performance",
        label: "Web Performance",
        category: "web",
        level: 3,
        color: "accent-cyan",
        prerequisites: ["nextjs", "web-apis"],
        unlockedBy: ["nextjs", "web-apis"],
        progress: 40,
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      {
        id: "api-design",
        label: "API Design",
        category: "backend",
        level: 1,
        color: "accent-blue",
        prerequisites: [],
        unlockedBy: [],
        progress: 75,
      },
      {
        id: "databases",
        label: "Databases",
        category: "backend",
        level: 1,
        color: "accent-blue",
        prerequisites: [],
        unlockedBy: [],
        progress: 68,
      },
      {
        id: "microservices",
        label: "Microservices",
        category: "backend",
        level: 2,
        color: "accent-blue",
        prerequisites: ["api-design"],
        unlockedBy: ["api-design"],
        progress: 50,
      },
      {
        id: "distributed-systems",
        label: "Distributed Systems",
        category: "backend",
        level: 3,
        color: "accent-purple",
        prerequisites: ["microservices", "databases"],
        unlockedBy: ["microservices", "databases"],
        progress: 30,
      },
      {
        id: "message-queues",
        label: "Message Queues",
        category: "backend",
        level: 2,
        color: "accent-blue",
        prerequisites: ["api-design"],
        unlockedBy: ["api-design"],
        progress: 45,
      },
    ],
  },
  {
    id: "ai-ml",
    label: "AI & ML",
    skills: [
      {
        id: "ml-fundamentals",
        label: "ML Fundamentals",
        category: "ai-ml",
        level: 1,
        color: "accent-purple",
        prerequisites: [],
        unlockedBy: [],
        progress: 40,
      },
      {
        id: "deep-learning",
        label: "Deep Learning",
        category: "ai-ml",
        level: 2,
        color: "accent-purple",
        prerequisites: ["ml-fundamentals"],
        unlockedBy: ["ml-fundamentals"],
        progress: 25,
      },
      {
        id: "transformers",
        label: "Transformers",
        category: "ai-ml",
        level: 3,
        color: "accent-purple",
        prerequisites: ["deep-learning"],
        unlockedBy: ["deep-learning"],
        progress: 18,
      },
      {
        id: "llm-engineering",
        label: "LLM Engineering",
        category: "ai-ml",
        level: 3,
        color: "accent-green",
        prerequisites: ["transformers"],
        unlockedBy: ["transformers"],
        progress: 15,
      },
      {
        id: "ai-agents",
        label: "AI Agents",
        category: "ai-ml",
        level: 4,
        color: "accent-cyan",
        prerequisites: ["llm-engineering"],
        unlockedBy: ["llm-engineering"],
        progress: 10,
      },
      {
        id: "mlops",
        label: "MLOps",
        category: "ai-ml",
        level: 3,
        color: "accent-blue",
        prerequisites: ["ml-fundamentals"],
        unlockedBy: ["ml-fundamentals"],
        progress: 12,
      },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    skills: [
      {
        id: "docker",
        label: "Docker",
        category: "infrastructure",
        level: 1,
        color: "accent-amber",
        prerequisites: [],
        unlockedBy: [],
        progress: 80,
      },
      {
        id: "kubernetes",
        label: "Kubernetes",
        category: "infrastructure",
        level: 2,
        color: "accent-amber",
        prerequisites: ["docker"],
        unlockedBy: ["docker"],
        progress: 25,
      },
      {
        id: "terraform",
        label: "Terraform",
        category: "infrastructure",
        level: 2,
        color: "accent-amber",
        prerequisites: [],
        unlockedBy: [],
        progress: 30,
      },
      {
        id: "cicd",
        label: "CI/CD",
        category: "infrastructure",
        level: 1,
        color: "accent-amber",
        prerequisites: [],
        unlockedBy: [],
        progress: 60,
      },
      {
        id: "observability",
        label: "Observability",
        category: "infrastructure",
        level: 2,
        color: "accent-amber",
        prerequisites: ["kubernetes"],
        unlockedBy: ["kubernetes"],
        progress: 25,
      },
      {
        id: "platform-engineering",
        label: "Platform Engineering",
        category: "infrastructure",
        level: 3,
        color: "accent-amber",
        prerequisites: ["kubernetes", "terraform", "observability"],
        unlockedBy: ["kubernetes", "terraform", "observability"],
        progress: 5,
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    skills: [
      {
        id: "web-security",
        label: "Web Security",
        category: "security",
        level: 1,
        color: "accent-red",
        prerequisites: [],
        unlockedBy: [],
        progress: 40,
      },
      {
        id: "auth-authz",
        label: "Auth & Authorization",
        category: "security",
        level: 2,
        color: "accent-red",
        prerequisites: ["web-security"],
        unlockedBy: ["web-security"],
        progress: 35,
      },
      {
        id: "cryptography",
        label: "Cryptography",
        category: "security",
        level: 2,
        color: "accent-red",
        prerequisites: [],
        unlockedBy: [],
        progress: 20,
      },
      {
        id: "network-security",
        label: "Network Security",
        category: "security",
        level: 2,
        color: "accent-red",
        prerequisites: ["web-security"],
        unlockedBy: ["web-security"],
        progress: 25,
      },
      {
        id: "supply-chain",
        label: "Supply Chain Security",
        category: "security",
        level: 3,
        color: "accent-red",
        prerequisites: ["auth-authz", "network-security"],
        unlockedBy: ["auth-authz", "network-security"],
        progress: 10,
      },
    ],
  },
];

export function getSkillById(id: string): SkillTreeNode | undefined {
  for (const category of skillTree) {
    const found = category.skills.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getSkillCategory(id: string): SkillCategory | undefined {
  return skillTree.find((c) => c.id === id);
}

export function getUnlockedSkills(skillIds: Set<string>): SkillTreeNode[] {
  const unlocked: SkillTreeNode[] = [];
  for (const category of skillTree) {
    for (const skill of category.skills) {
      const canUnlock =
        skill.prerequisites.length === 0 || skill.prerequisites.every((p) => skillIds.has(p));
      if (canUnlock && !skillIds.has(skill.id)) {
        unlocked.push(skill);
      }
    }
  }
  return unlocked;
}

export function getSkillPath(targetId: string): SkillTreeNode[] {
  const path: SkillTreeNode[] = [];
  const visited = new Set<string>();
  const queue = [targetId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const skill = getSkillById(currentId);
    if (!skill) continue;

    path.unshift(skill);
    for (const prereqId of skill.prerequisites) {
      queue.push(prereqId);
    }
  }

  return path;
}

export function getOverallSkillProgress(): number {
  let total = 0;
  let count = 0;
  for (const category of skillTree) {
    for (const skill of category.skills) {
      total += skill.progress;
      count++;
    }
  }
  return count > 0 ? Math.round(total / count) : 0;
}
