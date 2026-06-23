import type {
  GenerationRequest,
  AIProviderFileResult,
  StreamCallbacks,
  ProviderConfig,
} from "./types";

export abstract class AIProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract get type(): string;
  abstract get defaultModel(): string;

  abstract generateFiles(
    request: GenerationRequest
  ): Promise<AIProviderFileResult>;

  abstract stream(
    request: GenerationRequest,
    callbacks: StreamCallbacks
  ): Promise<void>;

  abstract generateProject(
    request: GenerationRequest
  ): Promise<AIProviderFileResult>;

  protected buildSystemPrompt(template?: string): string {
    const basePrompt = `You are an expert software engineer. Generate complete, production-ready code files.
All files must be valid, compilable, and follow best practices.
Return ONLY valid JSON in the following format, with no markdown formatting or code blocks around it:
{ "files": [{ "path": "relative/file/path", "content": "file content here" }] }`;

    if (!template) return basePrompt;

    const templatePrompts: Record<string, string> = {
      "nextjs":
        "Generate a Next.js 15+ project with App Router, TypeScript strict mode, and Tailwind CSS v4.",
      "react-vite":
        "Generate a React 19+ project with Vite, TypeScript strict mode, and Tailwind CSS v4.",
      "landing-page":
        "Generate a modern, responsive landing page with Next.js, Tailwind CSS, and Framer Motion animations.",
      "dashboard":
        "Generate a data dashboard with Next.js App Router, recharts, and Tailwind CSS.",
    };

    return `${basePrompt}\n\n${templatePrompts[template] ?? ""}`;
  }

  protected parseResponse(response: string): AIProviderFileResult {
    const cleaned = response
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.files || !Array.isArray(parsed.files)) {
      throw new Error(
        "Invalid response format: expected { files: [{ path, content }] }"
      );
    }

    for (const file of parsed.files) {
      if (typeof file.path !== "string" || typeof file.content !== "string") {
        throw new Error(
          `Invalid file entry: ${JSON.stringify(file)}`
        );
      }
    }

    return parsed as AIProviderFileResult;
  }
}
