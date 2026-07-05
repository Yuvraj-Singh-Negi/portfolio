/// SM-2 Spaced Repetition Revision Engine

export interface RevisionCard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  hint?: string;
  tags: string[];
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReviewed?: number;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export function createCard(
  id: string,
  topic: string,
  question: string,
  answer: string,
  tags: string[],
  hint?: string,
): RevisionCard {
  return {
    id,
    topic,
    question,
    answer,
    hint,
    tags,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
  };
}

export function scheduleReview(card: RevisionCard, quality: ReviewQuality): RevisionCard {
  const newEase = Math.max(1.3, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    newInterval = 1;
    newRepetitions = 0;
  } else {
    newRepetitions = card.repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(card.interval * newEase);
    }
  }

  return {
    ...card,
    ease: newEase,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: Date.now() + newInterval * 86400000,
    lastReviewed: Date.now(),
  };
}

export function getDueCards(cards: RevisionCard[]): RevisionCard[] {
  const now = Date.now();
  return cards.filter((c) => c.nextReview <= now).sort((a, b) => a.nextReview - b.nextReview);
}

export function getCardStats(cards: RevisionCard[]) {
  const now = Date.now();
  const due = cards.filter((c) => c.nextReview <= now).length;
  const reviewed = cards.filter((c) => c.repetitions > 0).length;
  const mastered = cards.filter((c) => c.interval >= 21).length;
  const avgEase = cards.reduce((s, c) => s + c.ease, 0) / cards.length;
  return { total: cards.length, due, reviewed, mastered, avgEase: Math.round(avgEase * 100) / 100 };
}

export const revisionDecks: Record<string, RevisionCard[]> = {
  "system-design": [
    createCard(
      "sd-1",
      "System Design",
      "What is CAP theorem?",
      "Consistency, Availability, Partition Tolerance — pick two.",
      ["distributed-systems", "cap"],
    ),
    createCard(
      "sd-2",
      "System Design",
      "Explain consistent hashing",
      "Distributed hashing scheme that minimizes remapping when nodes change.",
      ["distributed-systems", "hashing"],
    ),
    createCard(
      "sd-3",
      "System Design",
      "What is a leader election?",
      "Process of selecting one node as leader in a distributed system for coordination.",
      ["distributed-systems", "consensus"],
    ),
    createCard(
      "sd-4",
      "System Design",
      "Explain the difference between REST and gRPC",
      "REST uses HTTP/1.1 with JSON; gRPC uses HTTP/2 with Protocol Buffers for typed, streaming APIs.",
      ["api", "protocols"],
    ),
    createCard(
      "sd-5",
      "System Design",
      "What is eventual consistency?",
      "A consistency model where updates propagate asynchronously; reads may see stale data temporarily.",
      ["distributed-systems", "consistency"],
    ),
    createCard(
      "sd-6",
      "System Design",
      "Explain CQRS pattern",
      "Command Query Responsibility Segregation — separate read and write models for different concerns.",
      ["patterns", "architecture"],
    ),
    createCard(
      "sd-7",
      "System Design",
      "What is a circuit breaker pattern?",
      "Prevents cascading failures by stopping calls to failing services after a threshold.",
      ["patterns", "reliability"],
    ),
    createCard(
      "sd-8",
      "System Design",
      "Explain the difference between SQL and NoSQL",
      "SQL: relational, ACID, schema-on-write. NoSQL: flexible schema, scale horizontally, BASE.",
      ["databases", "architecture"],
    ),
    createCard(
      "sd-9",
      "System Design",
      "What is a bloom filter?",
      "Space-efficient probabilistic data structure for set membership queries with false positives.",
      ["algorithms", "data-structures"],
    ),
    createCard(
      "sd-10",
      "System Design",
      "Explain rate limiting strategies",
      "Token bucket, leaky bucket, fixed window, sliding window log, sliding window counter.",
      ["api", "infrastructure"],
    ),
  ],
  algorithms: [
    createCard(
      "algo-1",
      "Algorithms",
      "What is Big O notation?",
      "Describes upper bound of time/space complexity as input size grows.",
      ["complexity"],
    ),
    createCard(
      "algo-2",
      "Algorithms",
      "Explain Dijkstra's algorithm",
      "Finds shortest paths from source node in weighted graph with non-negative edges.",
      ["graphs"],
    ),
    createCard(
      "algo-3",
      "Algorithms",
      "What is a B-tree?",
      "Self-balancing tree maintaining sorted data for efficient O(log n) search, insert, delete.",
      ["data-structures", "databases"],
    ),
    createCard(
      "algo-4",
      "Algorithms",
      "Explain LRU cache",
      "Evicts least recently used item when capacity is reached; O(1) get/put using hashmap + doubly linked list.",
      ["caching", "data-structures"],
    ),
    createCard(
      "algo-5",
      "Algorithms",
      "What is dynamic programming?",
      "Solving complex problems by breaking into overlapping subproblems with optimal substructure.",
      ["optimization"],
    ),
  ],
  typescript: [
    createCard(
      "ts-1",
      "TypeScript",
      "What are TypeScript generics?",
      "Allow reusable components/functions that work with multiple types while maintaining type safety.",
      ["typescript"],
    ),
    createCard(
      "ts-2",
      "TypeScript",
      "Explain union vs intersection types",
      "Union (A | B): value is A or B. Intersection (A & B): value has all properties of A and B.",
      ["typescript"],
    ),
    createCard(
      "ts-3",
      "TypeScript",
      "What is a discriminated union?",
      "Union type with a common discriminant property to narrow via switch/if checks.",
      ["typescript"],
    ),
    createCard(
      "ts-4",
      "TypeScript",
      "Explain conditional types",
      "T extends U ? X : Y — type depends on a condition, enabling type-level programming.",
      ["typescript"],
    ),
    createCard(
      "ts-5",
      "TypeScript",
      "What are template literal types?",
      "String literal types with placeholders for type-level string manipulation.",
      ["typescript"],
    ),
  ],
  react: [
    createCard(
      "react-1",
      "React",
      "What is the virtual DOM?",
      "Lightweight JS representation of real DOM; React diffs virtual DOM to minimize actual DOM updates.",
      ["react"],
    ),
    createCard(
      "react-2",
      "React",
      "Explain useMemo vs useCallback",
      "useMemo caches computed values; useCallback caches function references. Both prevent unnecessary re-renders.",
      ["react", "hooks"],
    ),
    createCard(
      "react-3",
      "React",
      "What is React Suspense?",
      "Declarative loading states for async operations like data fetching and code splitting.",
      ["react"],
    ),
    createCard(
      "react-4",
      "React",
      "Explain the rules of hooks",
      "Only call hooks at top level; only call from React function components or custom hooks.",
      ["react", "hooks"],
    ),
    createCard(
      "react-5",
      "React",
      "What is the effect cleanup function?",
      "Returned function from useEffect runs on unmount or before re-run to clean up subscriptions/timers.",
      ["react", "hooks"],
    ),
  ],
  rust: [
    createCard(
      "rust-1",
      "Rust",
      "What is Rust's ownership system?",
      "Each value has exactly one owner; ownership can be borrowed (&) or moved.",
      ["rust", "memory"],
    ),
    createCard(
      "rust-2",
      "Rust",
      "Explain borrowing and references",
      "Immutable references (&T) are shared; mutable references (&mut T) are exclusive.",
      ["rust"],
    ),
    createCard(
      "rust-3",
      "Rust",
      "What are lifetimes?",
      "Annotations tying reference scopes together; every reference has a lifetime.",
      ["rust"],
    ),
    createCard(
      "rust-4",
      "Rust",
      "Explain the ? operator",
      "Short-circuit propagation of Result/Option — unwraps Ok/Some or returns Err/None early.",
      ["rust"],
    ),
    createCard(
      "rust-5",
      "Rust",
      "What are Rust traits?",
      "Interface defining shared behavior; similar to typeclasses in Haskell.",
      ["rust"],
    ),
  ],
};
