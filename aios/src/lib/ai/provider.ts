/// AI Provider Abstraction Layer

import type { AIRequest, AIResponse, AIProviderConfig } from "./types";

interface AIProviderInterface {
  execute(request: AIRequest): Promise<AIResponse>;
  name: string;
}

class MockProvider implements AIProviderInterface {
  name = "mock";

  async execute(request: AIRequest): Promise<AIResponse> {
    const start = performance.now();

    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

    const responses: Record<string, string> = {
      explain: `Here's an explanation of "${request.context}":\n\n${request.prompt}\n\nThis concept is important because it forms the foundation for more advanced topics. Let me break it down:\n\n1. First, understand the core principle\n2. Then, look at practical applications\n3. Finally, connect it to what you already know`,
      review: `Reviewing: ${request.context}\n\nStrengths:\n- Clean structure\n- Good separation of concerns\n\nRecommendations:\n- Consider adding error boundaries\n- Extract shared logic into utilities\n- Add unit tests for edge cases`,
      generate: `Based on your request to "${request.context}":\n\nHere's a proposed implementation approach:\n\n1. Start with the data model\n2. Define the interface contract\n3. Implement core logic\n4. Add error handling\n5. Write tests\n\nWould you like me to elaborate on any specific part?`,
      suggest: `Suggestions for "${request.context}":\n\nBased on your learning velocity and current skill levels, I recommend:\n\n1. Deepen your understanding of ${request.context.split(" ").slice(0, 3).join(" ")}...\n2. Apply this knowledge to your current project\n3. Review related concepts in your knowledge graph`,
      analyze: `Analysis of "${request.context}":\n\nArchitecture Assessment:\n- Overall quality: Good\n- Scalability: Needs improvement\n- Maintainability: Strong\n\nKey findings:\n1. The modular structure is well-organized\n2. Consider adding caching for performance\n3. Some dependencies could be abstracted`,
    };

    const content =
      responses[request.action] ||
      `Processing your ${request.mode} request about "${request.context}"...\n\n${request.prompt}`;

    const latency = Math.round(performance.now() - start);

    return {
      content,
      usedTokens: Math.ceil(content.length / 4),
      provider: "mock",
      latency,
      suggestions: [
        "Can you elaborate on that?",
        "What specific aspect interests you?",
        "Would you like a code example?",
        "Should I connect this to your current project?",
      ],
    };
  }
}

class OpenAIProvider implements AIProviderInterface {
  name = "openai";
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async execute(request: AIRequest): Promise<AIResponse> {
    const start = performance.now();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: request.systemPrompt || this.getDefaultSystemPrompt(request.mode),
          },
          { role: "user", content: `${request.action}: ${request.context}\n\n${request.prompt}` },
        ],
        max_tokens: request.maxTokens || this.config.maxTokens,
        temperature: request.temperature || this.config.temperature,
      }),
    });

    const data = await response.json();
    const latency = Math.round(performance.now() - start);

    return {
      content: data.choices?.[0]?.message?.content || "",
      usedTokens: data.usage?.total_tokens || 0,
      provider: "openai",
      latency,
    };
  }

  private getDefaultSystemPrompt(mode: string): string {
    const prompts: Record<string, string> = {
      mentor:
        "You are a senior engineering mentor. Question assumptions, challenge weak decisions, detect shallow understanding. Encourage first principles thinking. Prefer asking questions over giving answers.",
      architect:
        "You are a Principal Software Architect. Review architecture, detect bottlenecks, suggest abstractions, identify scalability issues. Never generate code immediately without explaining reasoning first.",
      "pair-programmer":
        "You are a pair programmer. Explain your thinking, reason about alternatives, compare approaches before generating code. Never skip reasoning.",
      career:
        "You are a career development advisor for engineers. Estimate readiness, recommend improvements, identify gaps.",
      coach:
        "You are an AI mission coach. Observe progress, detect frustration, recommend breaks, adjust difficulty. Never interrupt unnecessarily.",
    };
    return (
      prompts[mode] ||
      "You are an expert AI engineering assistant. Be precise, concise, and helpful."
    );
  }
}

class AnthropicProvider implements AIProviderInterface {
  name = "anthropic";
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async execute(request: AIRequest): Promise<AIResponse> {
    const start = performance.now();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: request.maxTokens || this.config.maxTokens,
        system: request.systemPrompt || "",
        messages: [
          { role: "user", content: `${request.action}: ${request.context}\n\n${request.prompt}` },
        ],
      }),
    });

    const data = await response.json();
    const latency = Math.round(performance.now() - start);

    return {
      content: data.content?.[0]?.text || "",
      usedTokens: data.usage?.input_tokens || 0,
      provider: "anthropic",
      latency,
    };
  }
}

type ProviderConstructor = new (config: AIProviderConfig) => AIProviderInterface;

const providerRegistry: Record<string, ProviderConstructor> = {
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
};

export function createProvider(config: AIProviderConfig): AIProviderInterface {
  if (config.provider === "mock") return new MockProvider();
  const Constructor = providerRegistry[config.provider];
  if (!Constructor) {
    console.warn(`Provider ${config.provider} not available, falling back to mock`);
    return new MockProvider();
  }
  return new Constructor(config);
}

export type { AIProviderInterface };
