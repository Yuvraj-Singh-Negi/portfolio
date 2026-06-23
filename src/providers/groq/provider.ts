import { AIProvider } from "../interface";
import type {
  GenerationRequest,
  AIProviderFileResult,
  StreamCallbacks,
} from "../types";

export class GroqProvider extends AIProvider {
  get type(): string {
    return "GROQ";
  }

  get defaultModel(): string {
    return "mixtral-8x7b-32768";
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
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: request.maxTokens ?? 4096,
          temperature: request.temperature ?? 0.7,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: request.prompt },
          ],
          stream: true,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Groq API error: ${res.status} ${error}`);
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
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              callbacks.onText?.(content);
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

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: request.prompt },
        ],
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Groq API error: ${res.status} ${error}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}
