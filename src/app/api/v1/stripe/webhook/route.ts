import { NextResponse } from "next/server";
import { handleLemonSqueezyWebhook } from "@/services/billing/webhook-handler";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rl = await rateLimit(getIdentifier(request), { limit: 100, window: '1 m' });
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing x-signature header" },
      { status: 400 }
    );
  }

  try {
    const result = await handleLemonSqueezyWebhook(rawBody, signature);
    return NextResponse.json(result, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
