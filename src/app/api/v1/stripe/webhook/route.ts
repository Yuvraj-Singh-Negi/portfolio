import { NextResponse } from "next/server";
import { handleLemonSqueezyWebhook } from "@/services/billing/webhook-handler";

export async function POST(request: Request) {
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
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
