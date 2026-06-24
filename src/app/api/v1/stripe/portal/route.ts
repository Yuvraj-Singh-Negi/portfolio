import { NextResponse } from "next/server";
import { z } from "zod";
import { createCustomerPortal, getCustomerId } from "@/services/billing/lemonsqueezy";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

const portalSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  const rl = await rateLimit(getIdentifier(request), { limit: 10, window: '1 m' });
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = portalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { userId } = parsed.data;

  try {
    const customerId = await getCustomerId(userId);
    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe first." },
        { status: 400 }
      );
    }

    const url = await createCustomerPortal({
      customerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings`,
    });

    return NextResponse.json({ url }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
