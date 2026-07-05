import type { AIMode, AIAction } from "@/lib/ai/types";

export type ChatTab = "chat" | "code-review" | "architecture" | "research";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode: AIMode;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: AIMode;
  createdAt: string;
  updatedAt: string;
}

export interface CodeReviewRequest {
  code: string;
  language: string;
  focus: "correctness" | "performance" | "security" | "style" | "all";
}

export interface CodeReviewResult {
  issues: {
    line?: number;
    severity: "error" | "warning" | "info";
    message: string;
    suggestion?: string;
  }[];
  summary: string;
  score: number;
}

export interface ArchitectureReviewRequest {
  description: string;
  technologies: string[];
  patterns: string[];
  concerns?: string;
}

export interface ResearchQuery {
  topic: string;
  depth: "quick" | "moderate" | "deep";
}

export const FOCUS_OPTIONS: { value: CodeReviewRequest["focus"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "correctness", label: "Correctness" },
  { value: "performance", label: "Performance" },
  { value: "security", label: "Security" },
  { value: "style", label: "Style" },
];

export const LANGUAGE_OPTIONS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C#",
  "C++",
  "Ruby",
  "PHP",
  "SQL",
  "YAML",
  "JSON",
];
