import { AIProvider } from "../interface";
import type {
  GenerationRequest,
  AIProviderFileResult,
  StreamCallbacks,
} from "../types";

export class GoogleProvider extends AIProvider {
  get type(): string {
    return "GOOGLE";
  }

  get defaultModel(): string {
    return "gemini-1.5-flash";
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
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${this.config.apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${request.prompt}` }],
            },
          ],
          generationConfig: {
            maxOutputTokens: request.maxTokens ?? 4096,
            temperature: request.temperature ?? 0.7,
          },
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Google AI API error: ${res.status} ${error}`);
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
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              callbacks.onText?.(text);
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${request.prompt}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: request.maxTokens ?? 4096,
          temperature: request.temperature ?? 0.7,
        },
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Google AI API error: ${res.status} ${error}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }
}
