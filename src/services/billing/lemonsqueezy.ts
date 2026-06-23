const LS_BASE = "https://api.lemonsqueezy.com/v1";

function getApiKey(): string {
  const key = process.env.LEMON_SQUEEZY_API_KEY;
  if (!key) throw new Error("LEMON_SQUEEZY_API_KEY not configured");
  return key;
}

function getStoreId(): string {
  const id = process.env.LEMON_SQUEEZY_STORE_ID;
  if (!id) throw new Error("LEMON_SQUEEZY_STORE_ID not configured");
  return id;
}

function headers() {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export async function createCheckout(params: {
  variantId: string;
  email: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const res = await fetch(`${LS_BASE}/checkouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: params.email,
            custom: { user_id: params.userId },
          },
          product_options: {
            redirect_url: params.successUrl,
          },
          cancel_url: params.cancelUrl,
        },
        relationships: {
          store: { data: { type: "stores", id: getStoreId() } },
          variant: { data: { type: "variants", id: params.variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lemon Squeezy API error (${res.status}): ${body}`);
  }

  const json = await res.json();
  const url = json.data?.attributes?.url;
  if (!url) throw new Error("No checkout URL returned");
  return url;
}

export async function createCustomerPortal(params: {
  customerId: string;
  returnUrl: string;
}): Promise<string> {
  const res = await fetch(`${LS_BASE}/customer-portals`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "customer-portals",
        attributes: {
          return_url: params.returnUrl,
        },
        relationships: {
          customer: { data: { type: "customers", id: params.customerId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lemon Squeezy API error (${res.status}): ${body}`);
  }

  const json = await res.json();
  const url = json.data?.attributes?.url;
  if (!url) throw new Error("No portal URL returned");
  return url;
}

export async function getCustomerId(userId: string): Promise<string | null> {
  const { prisma } = await import("@/lib/prisma");
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeCustomerId: true },
  });
  return sub?.stripeCustomerId ?? null;
}
