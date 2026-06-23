import { prisma } from "@/lib/prisma";

export type UsageAction = "generation" | "token" | "build_minute" | "deployment";

interface TierLimit {
  generationsPerMonth: number;
  tokensPerMonth: number;
  buildMinutesPerMonth: number;
  deploymentsEnabled: boolean;
}

const TIER_LIMITS: Record<string, TierLimit> = {
  FREE: {
    generationsPerMonth: 50,
    tokensPerMonth: 100_000,
    buildMinutesPerMonth: 0,
    deploymentsEnabled: false,
  },
  PRO: {
    generationsPerMonth: 500,
    tokensPerMonth: 1_000_000,
    buildMinutesPerMonth: 100,
    deploymentsEnabled: true,
  },
  ENTERPRISE: {
    generationsPerMonth: 5_000,
    tokensPerMonth: 10_000_000,
    buildMinutesPerMonth: 1_000,
    deploymentsEnabled: true,
  },
};

const TIER_NAMES: Record<string, string> = {
  FREE: "Free",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

export async function checkUsageLimit(
  userId: string,
  action: UsageAction
): Promise<void> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { tier: true },
  });

  const tier = subscription?.tier ?? "FREE";
  const tierKey = tier in TIER_LIMITS ? tier : "FREE";
  const limits = TIER_LIMITS[tierKey]!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  switch (action) {
    case "generation": {
      const count = await prisma.usageRecord.count({
        where: {
          userId,
          action: "generation",
          createdAt: { gte: startOfMonth },
        },
      });
      if (count >= limits.generationsPerMonth) {
        throw new UsageLimitError(
          "generation",
          limits.generationsPerMonth,
          tier
        );
      }
      break;
    }
    case "token": {
      const tokens = await prisma.usageRecord.aggregate({
        where: {
          userId,
          action: "token",
          createdAt: { gte: startOfMonth },
        },
        _sum: { count: true },
      });
      const totalTokens = tokens._sum.count ?? 0;
      if (totalTokens >= limits.tokensPerMonth) {
        throw new UsageLimitError("token", limits.tokensPerMonth, tier);
      }
      break;
    }
    case "deployment": {
      if (!limits.deploymentsEnabled) {
        throw new UsageLimitError("deployment", 0, tier);
      }
      break;
    }
  }
}

export async function getUsage(userId: string): Promise<{
  tier: string;
  usage: Record<string, number>;
  limits: TierLimit;
}> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { tier: true },
  });

  const tierKey = subscription?.tier && subscription.tier in TIER_LIMITS ? subscription.tier : "FREE";
  const limits = TIER_LIMITS[tierKey]!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [generationCount, tokenAgg] = await Promise.all([
    prisma.usageRecord.count({
      where: {
        userId,
        action: "generation",
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.usageRecord.aggregate({
      where: {
        userId,
        action: "token",
        createdAt: { gte: startOfMonth },
      },
      _sum: { count: true },
    }),
  ]);

  return {
    tier: tierKey,
    usage: {
      generations: generationCount,
      tokens: tokenAgg._sum.count ?? 0,
    },
    limits,
  };
}

export function getTierName(tier: string): string {
  return TIER_NAMES[tier] ?? tier;
}

export class UsageLimitError extends Error {
  public action: string;
  public limit: number;
  public tier: string;

  constructor(action: string, limit: number, tier: string) {
    super(
      `Monthly ${action} limit reached (${limit}). Upgrade from ${getTierName(tier)} to increase limits.`
    );
    this.name = "UsageLimitError";
    this.action = action;
    this.limit = limit;
    this.tier = tier;
  }
}

export { TIER_LIMITS };
