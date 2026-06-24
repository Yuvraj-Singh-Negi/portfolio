import { NextResponse } from "next/server";
import { z } from "zod";
import { deployProject } from "@/services/deployment";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

const deploySchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/).optional(),
});

export async function POST(request: Request) {
  const rl = await rateLimit(getIdentifier(request), { limit: 10, window: '1 h' });
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = deploySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { projectId, userId, name } = parsed.data;

  try {
    const result = await deployProject({ projectId, userId, name });

    return NextResponse.json(result, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deployment failed";
    const isUserError =
      message.includes("not found") ||
      message.includes("Access denied") ||
      message.includes("requires a PRO") ||
      message.includes("has no files");

    return NextResponse.json(
      { error: message },
      { status: isUserError ? 400 : 500 }
    );
  }
}
