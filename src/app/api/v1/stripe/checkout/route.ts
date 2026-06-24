import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckout } from "@/services/billing/lemonsqueezy";
import { rateLimit, getIdentifier } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  userId: z.string().min(1),
  variantId: z.string().min(1),
  email: z.string().email(),
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
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { userId, variantId, email } = parsed.data;

  try {
    const url = await createCheckout({
      variantId,
      email,
      userId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?checkout=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings?checkout=canceled`,
    });

    return NextResponse.json({ url }, { headers: { 'X-RateLimit-Remaining': String(rl.remaining) } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
