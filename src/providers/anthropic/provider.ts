import { AIProvider } from "../interface";
import type {
  GenerationRequest,
  AIProviderFileResult,
  StreamCallbacks,
} from "../types";

export class AnthropicProvider extends AIProvider {
  get type(): string {
    return "ANTHROPIC";
  }

  get defaultModel(): string {
    return "claude-sonnet-4-20250514";
  }

  async generateFiles(request: GenerationRequest): Promise<AIProviderFileResult> {
    const response = await this.makeRequest(request);
    return this.parseResponse(response);
  }

  async stream(
    request: GenerationRequest,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const model = request.model ?? this.defaultModel;
    const systemPrompt = this.buildSystemPrompt(request.template);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: request.maxTokens ?? 4096,
          temperature: request.temperature ?? 0.7,
          system: systemPrompt,
          messages: [{ role: "user", content: request.prompt }],
          stream: true,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Anthropic API error: ${res.status} ${error}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              callbacks.onText?.(parsed.delta.text);
            }
          } catch {
            // Skip malformed events
          }
        }
      }

      callbacks.onDone?.(await this.generateFiles(request));
    } catch (error) {
      callbacks.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async generateProject(request: GenerationRequest): Promise<AIProviderFileResult> {
    return this.generateFiles(request);
  }

  private async makeRequest(
    request: GenerationRequest
  ): Promise<string> {
    const model = request.model ?? this.defaultModel;
    const systemPrompt = this.buildSystemPrompt(request.template);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: request.prompt }],
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Anthropic API error: ${res.status} ${error}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }
}
