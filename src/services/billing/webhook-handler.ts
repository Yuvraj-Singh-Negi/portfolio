import { updateSubscriptionWithHistory } from "@/lib/transactions";

import { createHmac } from "crypto";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return signature === expected;
}

export async function handleLemonSqueezyWebhook(
  rawBody: string,
  signature: string
): Promise<{ received: boolean }> {
  if (!verifySignature(rawBody, signature)) {
    throw new Error("Webhook signature verification failed");
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta?.event_name;
  const data = event.data?.attributes;

  if (!eventName || !data) {
    return { received: true };
  }

  const userId = data.custom_data?.user_id;
  if (!userId) return { received: true };

  switch (eventName) {
    case "order_created": {
      const variantId = data.first_order_item?.variant_id?.toString();
      await updateSubscriptionWithHistory({
        userId,
        status: "ACTIVE",
        stripeCustomerId: data.customer_id?.toString(),
        stripeSubscriptionId: variantId ? `ls_variant_${variantId}` : undefined,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      break;
    }

    case "subscription_created":
    case "subscription_updated": {
      const statusMap: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE"> = {
        active: "ACTIVE",
        cancelled: "CANCELED",
        expired: "CANCELED",
        past_due: "PAST_DUE",
        paused: "PAST_DUE",
      };

      await updateSubscriptionWithHistory({
        userId,
        status: statusMap[data.status] ?? "ACTIVE",
        stripeCustomerId: data.customer_id?.toString(),
        stripeSubscriptionId: data.id?.toString(),
        currentPeriodEnd: data.renews_at
          ? new Date(data.renews_at)
          : undefined,
      });
      break;
    }

    case "subscription_cancelled": {
      await updateSubscriptionWithHistory({
        userId,
        status: "CANCELED",
        stripeCustomerId: data.customer_id?.toString(),
      });
      break;
    }
  }

  return { received: true };
}
