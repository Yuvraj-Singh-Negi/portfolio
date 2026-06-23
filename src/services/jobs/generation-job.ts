import { prisma } from "@/lib/prisma";
import { getProvider } from "@/providers/registry";
import type {
  GenerationRequest,
  AIProviderFileResult,
  ProviderType,
} from "@/providers/types";
import { registerJobHandler } from "./queue";
import {
  checkUsageLimit,
  checkTokenLimit,
  retryWithBackoff,
} from "@/services/cost-controls";

interface GenerationJobData {
  generationId: string;
  projectId: string;
  userId: string;
  provider: ProviderType;
  model: string;
  prompt: string;
  systemPrompt?: string;
  template?: string;
  maxTokens?: number;
  temperature?: number;
}

export function registerGenerationJobHandler(): void {
  registerJobHandler("ai-generation", async (job) => {
    const data = job.data as GenerationJobData;

    await prisma.generation.update({
      where: { id: data.generationId },
      data: { status: "PROCESSING" },
    });

    await prisma.generationEvent.create({
      data: {
        generationId: data.generationId,
        type: "started",
        data: { provider: data.provider, model: data.model },
      },
    });

    try {
      await checkUsageLimit(data.userId, "generation");

      if (data.maxTokens) {
        await checkTokenLimit(data.userId, data.maxTokens);
      }

      const provider = getProvider(data.provider);

      const request: GenerationRequest = {
        prompt: data.prompt,
        systemPrompt: data.systemPrompt,
        projectId: data.projectId,
        userId: data.userId,
        provider: data.provider,
        model: data.model,
        maxTokens: data.maxTokens,
        temperature: data.temperature,
        template: data.template as any,
      };

      const startTime = Date.now();
      const result = await retryWithBackoff(
        () => provider.generateFiles(request),
        data.provider,
        3
      );
      const duration = Date.now() - startTime;

      const fileMap: Record<string, string> = {};
      for (const file of result.files) {
        fileMap[file.path] = file.content;
      }

      const tokenEstimate = estimateTokens(data.prompt, result);

      await prisma.$transaction(async (tx) => {
        await tx.generation.update({
          where: { id: data.generationId },
          data: {
            status: "COMPLETED",
            result: { files: result.files },
            tokensUsed: tokenEstimate,
            duration,
          },
        });

        await tx.project.update({
          where: { id: data.projectId },
          data: { vfsSnapshot: { files: fileMap, timestamp: Date.now() } },
        });

        await tx.generationEvent.create({
          data: {
            generationId: data.generationId,
            type: "completed",
            data: { files: result.files.length, tokens: tokenEstimate, duration },
          },
        });

        await tx.usageRecord.create({
          data: {
            userId: data.userId,
            action: "generation",
            count: 1,
            metadata: { generationId: data.generationId, tokens: tokenEstimate },
          },
        });

        await tx.usageRecord.create({
          data: {
            userId: data.userId,
            action: "token",
            count: tokenEstimate,
            metadata: { generationId: data.generationId },
          },
        });
      });

      job.result = result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      await prisma.generation.update({
        where: { id: data.generationId },
        data: { status: "FAILED", error: message },
      });

      await prisma.generationEvent.create({
        data: {
          generationId: data.generationId,
          type: "failed",
          data: { error: message },
        },
      });

      throw error;
    }
  });
}

export function estimateTokens(prompt: string, result: AIProviderFileResult): number {
  const promptTokens = Math.ceil(prompt.length / 4);
  const completionTokens = result.files.reduce(
    (sum, f) => sum + Math.ceil(f.content.length / 4),
    0
  );
  return promptTokens + completionTokens;
}

registerGenerationJobHandler();
