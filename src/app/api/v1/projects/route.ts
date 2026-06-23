import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, name, description } = body;

  if (!userId || !name) {
    return NextResponse.json(
      { error: "userId and name are required" },
      { status: 400 }
    );
  }

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

  return NextResponse.json({ project }, { status: 201 });
}
