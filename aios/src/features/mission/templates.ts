import type { Mission, MissionType, MissionTemplate } from "./types";
import { generateMissionId, getMissionCategory } from "./engine";

const templateLibrary: Record<string, MissionTemplate> = {
  "rate-limiter": {
    name: "Implement Rate-Limiting Middleware",
    objective:
      "Design and implement a token bucket rate limiter with Redis backend for the API Gateway project.",
    whyItMatters:
      "Rate limiting is a critical infrastructure component that protects services from abuse and ensures fair resource allocation across all API consumers.",
    estimatedTime: 240,
    difficulty: "intermediate",
    expectedOutput: "Working rate limiter middleware with tests, integrated into API Gateway",
    resources: [
      "Token Bucket Algorithm Guide",
      "Redis Rate Limiting Patterns",
      "Express Middleware Documentation",
      "Reference Repository: github.com/example/rate-limiter",
    ],
    checklist: [
      { id: "rl-1", label: "Research token bucket algorithm", duration: "20 min", done: false },
      { id: "rl-2", label: "Set up Redis connection module", duration: "30 min", done: false },
      { id: "rl-3", label: "Implement rate limiter class", duration: "45 min", done: false },
      { id: "rl-4", label: "Create middleware function", duration: "30 min", done: false },
      { id: "rl-5", label: "Write unit tests", duration: "40 min", done: false },
      { id: "rl-6", label: "Integration test with API gateway", duration: "35 min", done: false },
    ],
    successCriteria: [
      "All unit tests pass with >90% coverage",
      "Rate limiter correctly enforces configurable limits",
      "Redis backend scales horizontally",
      "Integration tests pass with API Gateway",
    ],
    aiHints: [
      "Consider using a sliding window log as an alternative — it provides more accurate rate limiting for bursty traffic.",
      "The Redis-backed approach adds ~2ms latency per request. Measure and document this.",
      "Think about how your rate limiter handles distributed scenarios with multiple API Gateway instances.",
    ],
    reflection: [
      "What did you learn about token bucket algorithms?",
      "How would you handle rate limiting in a multi-region deployment?",
      "What edge cases did you discover during testing?",
    ],
  },
  "bst-implement": {
    name: "Implement Binary Search Tree",
    objective:
      "Build a complete binary search tree implementation with insert, delete, search, and traversal operations.",
    whyItMatters:
      "BSTs are foundational for understanding more complex data structures and algorithms including graph algorithms, database indexing, and balanced trees.",
    estimatedTime: 120,
    difficulty: "beginner",
    expectedOutput: "Working BST with tests, pushed to GitHub, knowledge graph updated",
    resources: ["FreeCodeCamp BST Guide", "Algorithm Visualizer", "Reference Implementation"],
    checklist: [
      { id: "bst-1", label: "Study BST concept and properties", duration: "15 min", done: false },
      { id: "bst-2", label: "Visualize algorithm behavior", duration: "10 min", done: false },
      { id: "bst-3", label: "Implement Node class", duration: "15 min", done: false },
      { id: "bst-4", label: "Implement insert method", duration: "15 min", done: false },
      { id: "bst-5", label: "Implement search method", duration: "10 min", done: false },
      { id: "bst-6", label: "Implement delete method", duration: "20 min", done: false },
      {
        id: "bst-7",
        label: "Implement traversals (in-order, pre, post)",
        duration: "15 min",
        done: false,
      },
      { id: "bst-8", label: "Write tests", duration: "15 min", done: false },
      { id: "bst-9", label: "Push to GitHub", duration: "10 min", done: false },
      {
        id: "bst-10",
        label: "Write notes and update knowledge graph",
        duration: "10 min",
        done: false,
      },
    ],
    successCriteria: [
      "All CRUD operations work correctly",
      "All traversal methods produce correct orderings",
      "Edge cases handled (empty tree, single node, duplicates)",
      "Tests pass with >80% coverage",
    ],
    aiHints: [
      "Remember that BST deletion has three cases: leaf, one child, two children.",
      "For the two-child case, you can use either the inorder predecessor or successor.",
      "Consider implementing a recursive approach first, then optimize iteratively.",
    ],
    reflection: [
      "What was the most challenging part of the implementation?",
      "How would you balance an unbalanced BST?",
      "What real-world applications use BSTs?",
    ],
  },
  "transformer-study": {
    name: "Study Transformer Architecture",
    objective:
      "Understand the transformer architecture including self-attention, multi-head attention, positional encoding, and feed-forward networks.",
    whyItMatters:
      "Transformers are the foundation of modern AI — understanding them is essential for working with LLMs, vision models, and the future of AI engineering.",
    estimatedTime: 180,
    difficulty: "advanced",
    expectedOutput: "Complete notes, implementation sketch, and knowledge graph nodes updated",
    resources: [
      "Attention Is All You Need (Paper)",
      "3Blue1Brown Attention Visualization",
      "The Annotated Transformer",
      "PyTorch Transformer Tutorial",
    ],
    checklist: [
      {
        id: "tr-1",
        label: "Read the Attention Is All You Need paper",
        duration: "40 min",
        done: false,
      },
      { id: "tr-2", label: "Understand self-attention mechanism", duration: "25 min", done: false },
      { id: "tr-3", label: "Study multi-head attention", duration: "20 min", done: false },
      { id: "tr-4", label: "Learn positional encoding", duration: "15 min", done: false },
      {
        id: "tr-5",
        label: "Study feed-forward networks in transformers",
        duration: "15 min",
        done: false,
      },
      {
        id: "tr-6",
        label: "Implement a minimal transformer in PyTorch",
        duration: "45 min",
        done: false,
      },
      {
        id: "tr-7",
        label: "Update knowledge graph with transformer nodes",
        duration: "15 min",
        done: false,
      },
    ],
    successCriteria: [
      "Can explain self-attention from first principles",
      "Minimal implementation produces correct output shapes",
      "Knowledge graph updated with transformer concepts",
      "Able to explain how transformers differ from RNNs",
    ],
    aiHints: [
      "Think of self-attention as a weighted average where each token decides how much to pay attention to every other token.",
      "Multi-head attention allows the model to attend to information from different representation subspaces.",
      "Positional encoding is necessary because self-attention is permutation-invariant — it has no built-in notion of order.",
    ],
    reflection: [
      "How does self-attention solve the long-range dependency problem that RNNs struggle with?",
      "Why is multi-head attention better than single-head attention?",
      "What are the computational complexity trade-offs of the transformer architecture?",
    ],
  },
};

export function generateMission(type: MissionType, templateKey: string): Mission {
  const template = templateLibrary[templateKey];
  if (!template) throw new Error(`Template not found: ${templateKey}`);

  const id = generateMissionId();
  return {
    id,
    type,
    template,
    state: "pending",
    priority: "high",
    progress: 0,
    dependencies: [],
    totalPausedTime: 0,
    category: getMissionCategory(type),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getTemplate(key: string): MissionTemplate | undefined {
  return templateLibrary[key];
}

export function getAllTemplates(): [string, MissionTemplate][] {
  return Object.entries(templateLibrary);
}
