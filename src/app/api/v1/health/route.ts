import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const rl = await rateLimit(getIdentifier(request), { limit: 60, window: '1 m' });
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: String(error) },
      { status: 503 }
    );
  }
}
