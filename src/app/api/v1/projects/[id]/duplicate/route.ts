import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const original = await prisma.project.findUnique({
    where: { id },
    include: {
      versions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!original) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const duplicate = await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        ownerId: original.ownerId,
        name: `${original.name} (Copy)`,
        description: original.description,
        vfsSnapshot: original.vfsSnapshot as Prisma.InputJsonValue | undefined,
      },
    });

    const latestVersion = original.versions[0];
    if (latestVersion) {
      await tx.projectVersion.create({
        data: {
          projectId: newProject.id,
          snapshot: latestVersion.snapshot as Prisma.InputJsonValue,
        },
      });
    }

    await tx.auditEvent.create({
      data: {
        userId: original.ownerId,
        action: "project.duplicated",
        entity: "project",
        entityId: newProject.id,
        metadata: { sourceProjectId: original.id },
      },
    });

    return newProject;
  });

  return NextResponse.json({ project: duplicate }, { status: 201 });
}
