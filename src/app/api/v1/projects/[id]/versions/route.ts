import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const versions = await prisma.projectVersion.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ versions });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { snapshot } = body;

  if (!snapshot) {
    return NextResponse.json(
      { error: "snapshot is required" },
      { status: 400 }
    );
  }

  const version = await prisma.$transaction(async (tx) => {
    const newVersion = await tx.projectVersion.create({
      data: {
        projectId: id,
        snapshot,
      },
    });

    await tx.project.update({
      where: { id },
      data: { vfsSnapshot: snapshot },
    });

    return newVersion;
  });

  return NextResponse.json({ version }, { status: 201 });
}
