import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = await rateLimit(getIdentifier(request));
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const { id } = await params;

  const deployment = await prisma.deployment.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!deployment) {
    return NextResponse.json(
      { error: "Deployment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ deployment }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
}
