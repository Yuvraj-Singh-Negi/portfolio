import type { GenerationStatus } from "@prisma/client";

export interface AIProviderFileResult {
  files: Array<{
    path: string;
    content: string;
  }>;
}

export interface GenerationRequest {
  prompt: string;
  systemPrompt?: string;
  projectId: string;
  userId: string;
  provider?: ProviderType;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  template?: GenerationTemplate;
}

export interface GenerationResult {
  id: string;
  files: Array<{ path: string; content: string }>;
  tokensUsed: number;
  model: string;
  provider: ProviderType;
  duration: number;
  status: GenerationStatus;
  error?: string;
}

export type ProviderType = "ANTHROPIC" | "OPENAI" | "DEEPSEEK" | "GOOGLE" | "GROQ" | "XIAOMI" | "OPENROUTER";

export type GenerationTemplate =
  | "nextjs"
  | "react-vite"
  | "landing-page"
  | "dashboard"
  | "custom";

export interface StreamCallbacks {
  onText?: (text: string) => void;
  onFile?: (file: { path: string; content: string }) => void;
  onError?: (error: Error) => void;
  onDone?: (result: AIProviderFileResult) => void;
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  timeout: number;
  maxRetries: number;
}

export interface AICostEstimate {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export const PROVIDER_COST_PER_1K_TOKENS: Record<ProviderType, number> = {
  ANTHROPIC: 0.015,
  OPENAI: 0.01,
  DEEPSEEK: 0.002,
  GOOGLE: 0,
  GROQ: 0,
  XIAOMI: 0,
  OPENROUTER: 0,
};
