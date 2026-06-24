import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getProvider, getDefaultProvider } from "@/providers/registry";
import type { ProviderType, GenerationTemplate } from "@/providers/types";
import { getTemplateSystemPrompt } from "@/services/templates";
import { checkUsageLimit, checkTokenLimit } from "@/services/cost-controls";
import { enqueueJob } from "@/services/jobs/queue";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const generateSchema = z.object({
  userId: z.string().min(1),
  projectId: z.string().min(1),
  prompt: z.string().min(10).max(50000),
  provider: z.enum(['ANTHROPIC', 'OPENAI', 'DEEPSEEK', 'GOOGLE', 'GROQ', 'XIAOMI', 'OPENROUTER']).optional(),
  model: z.string().max(100).optional(),
  template: z.enum(['nextjs', 'react-vite', 'landing-page', 'dashboard', 'custom']).optional(),
  maxTokens: z.number().int().positive().max(100000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  async: z.boolean().optional(),
});

export async function POST(request: Request) {
  const requestId = request.headers.get('x-request-id') ?? `gen-${Date.now()}`;

  const rl = await rateLimit(getIdentifier(request));
  if (!rl.success) {
    logger.warn({ requestId }, 'Rate limit exceeded');
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please slow down.' },
      { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0', 'X-Request-ID': requestId } }
    );
  }

  const body = await request.json();
  const parsed = generateSchema.safeParse(body);

  if (!parsed.success) {
    logger.warn({ requestId, errors: parsed.error.flatten().fieldErrors }, 'Validation failed');
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: { 'X-Request-ID': requestId } }
    );
  }

  const { userId, projectId, prompt, provider, model, template, maxTokens, temperature } = parsed.data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project || project.ownerId !== userId) {
    logger.warn({ requestId, userId, projectId }, 'Project not found or access denied');
    return NextResponse.json(
      { error: "Project not found or access denied" },
      { status: 404 }
    );
  }

  try {
    await checkUsageLimit(userId, "generation");
    if (maxTokens) {
      await checkTokenLimit(userId, maxTokens);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Usage limit reached" },
      { status: 429 }
    );
  }

  const resolvedProvider: ProviderType = provider ?? getDefaultProvider();
  const systemPrompt = getTemplateSystemPrompt(
    (template as GenerationTemplate) ?? "custom",
    prompt
  );

  const generation = await prisma.generation.create({
    data: {
      projectId,
      prompt,
      status: "QUEUED",
      provider: resolvedProvider,
      model: model ?? null,
    },
  });

  await prisma.generationEvent.create({
    data: {
      generationId: generation.id,
      type: "queued",
      data: { provider: resolvedProvider, model },
    },
  });

  const isAsync = parsed.data.async === true;

  if (isAsync) {
    enqueueJob("ai-generation", {
      generationId: generation.id,
      projectId,
      userId,
      provider: resolvedProvider,
      model: model ?? getProvider(resolvedProvider).defaultModel,
      prompt,
      systemPrompt,
      template,
      maxTokens,
      temperature,
    });

    return NextResponse.json({
      generationId: generation.id,
      status: "QUEUED",
      message: "Generation queued for background processing",
    }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
  }

  try {
    const aiProvider = getProvider(resolvedProvider);

    const startTime = Date.now();
    const result = await aiProvider.generateFiles({
      prompt,
      systemPrompt,
      projectId,
      userId,
      provider: resolvedProvider,
      model: model ?? aiProvider.defaultModel,
      maxTokens,
      temperature,
      template: template as GenerationTemplate,
    });
    const duration = Date.now() - startTime;

    logger.info({ requestId, generationId: generation.id, files: result.files.length, duration }, 'Generation completed');

    const fileMap: Record<string, string> = {};
    for (const file of result.files) {
      fileMap[file.path] = file.content;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const gen = await tx.generation.update({
        where: { id: generation.id },
        data: {
          status: "COMPLETED",
          result: { files: result.files },
          tokensUsed: result.files.reduce(
            (sum, f) => sum + Math.ceil(f.content.length / 4),
            0
          ),
          duration,
        },
      });

      await tx.project.update({
        where: { id: projectId },
        data: { vfsSnapshot: { files: fileMap, timestamp: Date.now() } },
      });

      await tx.generationEvent.create({
        data: {
          generationId: generation.id,
          type: "completed",
          data: { files: result.files.length, duration },
        },
      });

      return gen;
    });

    return NextResponse.json({
      generationId: generation.id,
      status: "COMPLETED",
      files: result.files,
      tokensUsed: updated.tokensUsed,
      duration,
    }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining), 'X-Request-ID': requestId } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";

    logger.error({ requestId, generationId: generation.id, error: message }, 'Generation failed');

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "FAILED", error: message },
    });

    await prisma.generationEvent.create({
      data: {
        generationId: generation.id,
        type: "failed",
        data: { error: message },
      },
    });

    return NextResponse.json(
      { error: message, generationId: generation.id },
      { status: 500, headers: { 'X-RateLimit-Remaining': String(rl.remaining), 'X-Request-ID': requestId } }
    );
  }
}

export async function GET(request: Request) {
  const requestId = request.headers.get('x-request-id') ?? `gen-get-${Date.now()}`;
  const rl = await rateLimit(getIdentifier(request));
  if (!rl.success) {
    logger.warn({ requestId }, 'Rate limit exceeded');
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'X-Request-ID': requestId } }
    );
  }

  const { searchParams } = new URL(request.url);
  const generationId = searchParams.get("id");
  const projectId = searchParams.get("projectId");

  if (generationId) {
    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
      include: { events: { orderBy: { createdAt: "asc" } } },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ generation });
  }

  if (projectId) {
    const generations = await prisma.generation.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ generations });
  }

  return NextResponse.json(
    { error: "Provide generation id or projectId" },
    { status: 400 }
  );
}
