import { NextResponse } from "next/server";
import { createCheckout } from "@/services/billing/lemonsqueezy";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, variantId, email } = body;

  if (!userId || !variantId || !email) {
    return NextResponse.json(
      { error: "userId, variantId, and email are required" },
      { status: 400 }
    );
  }

  try {
    const url = await createCheckout({
      variantId,
      email,
      userId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?checkout=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings?checkout=canceled`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
