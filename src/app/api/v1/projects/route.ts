import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

const projectSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function GET(request: Request) {
  const rl = await rateLimit(getIdentifier(request));
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const includeArchived = searchParams.get("includeArchived") === "true";

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
      archived: includeArchived ? undefined : false,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ projects }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
}

export async function POST(request: Request) {
  const rl = await rateLimit(getIdentifier(request));
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { userId, name, description } = parsed.data;

  const project = await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        ownerId: userId,
        name,
        description: description ?? null,
      },
    });

    await tx.projectVersion.create({
      data: {
        projectId: newProject.id,
        snapshot: { files: {}, timestamp: Date.now() },
      },
    });

    await tx.auditEvent.create({
      data: {
        userId,
        action: "project.created",
        entity: "project",
        entityId: newProject.id,
        metadata: { name },
      },
    });

    return newProject;
  });

  return NextResponse.json({ project }, { status: 201, headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
}
