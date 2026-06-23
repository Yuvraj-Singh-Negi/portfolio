import type { ProviderType } from "./types";
import type { AIProvider } from "./interface";
import { AnthropicProvider } from "./anthropic/provider";
import { OpenAIProvider } from "./openai/provider";
import { DeepSeekProvider } from "./deepseek/provider";
import { GoogleProvider } from "./google/provider";
import { GroqProvider } from "./groq/provider";
import { XiaomiProvider } from "./xiaomi/provider";
import { OpenRouterProvider } from "./openrouter/provider";

const providerInstances = new Map<string, AIProvider>();

function getApiKey(type: ProviderType): string {
  const keys: Record<ProviderType, string | undefined> = {
    ANTHROPIC: process.env.ANTHROPIC_API_KEY,
    OPENAI: process.env.OPENAI_API_KEY,
    DEEPSEEK: process.env.DEEPSEEK_API_KEY,
    GOOGLE: process.env.GOOGLE_GEMINI_API_KEY,
    GROQ: process.env.GROQ_API_KEY,
    XIAOMI: process.env.XIAOMI_API_KEY,
    OPENROUTER: process.env.OPENROUTER_API_KEY,
  };

  const key = keys[type];
  if (!key) {
    throw new Error(`${type} API key not configured in environment variables`);
  }
  return key;
}

export function getProvider(type: ProviderType): AIProvider {
  const existing = providerInstances.get(type);
  if (existing) return existing;

  const apiKey = getApiKey(type);

  let provider: AIProvider;

  switch (type) {
    case "ANTHROPIC":
      provider = new AnthropicProvider({
        apiKey,
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    case "OPENAI":
      provider = new OpenAIProvider({
        apiKey,
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    case "DEEPSEEK":
      provider = new DeepSeekProvider({
        apiKey,
        baseUrl: "https://api.deepseek.com/v1",
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    case "GOOGLE":
      provider = new GoogleProvider({
        apiKey,
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    case "GROQ":
      provider = new GroqProvider({
        apiKey,
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    case "XIAOMI":
      provider = new XiaomiProvider({
        apiKey,
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    case "OPENROUTER":
      provider = new OpenRouterProvider({
        apiKey,
        timeout: 60_000,
        maxRetries: 3,
      });
      break;
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }

  providerInstances.set(type, provider);
  return provider;
}

export function getDefaultProvider(): ProviderType {
  if (process.env.OPENROUTER_API_KEY) return "OPENROUTER";
  if (process.env.XIAOMI_API_KEY) return "XIAOMI";
  if (process.env.GROQ_API_KEY) return "GROQ";
  if (process.env.GOOGLE_GEMINI_API_KEY) return "GOOGLE";
  if (process.env.ANTHROPIC_API_KEY) return "ANTHROPIC";
  if (process.env.OPENAI_API_KEY) return "OPENAI";
  if (process.env.DEEPSEEK_API_KEY) return "DEEPSEEK";
  throw new Error(
    "No AI provider configured. Set OPENROUTER_API_KEY, XIAOMI_API_KEY, GROQ_API_KEY, GOOGLE_GEMINI_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY."
  );
}
