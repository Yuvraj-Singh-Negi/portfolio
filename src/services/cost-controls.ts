import { prisma } from "@/lib/prisma";

const TIER_LIMITS = {
  FREE: {
    tokensPerMonth: 100_000,
    generationsPerMonth: 50,
    maxTokensPerRequest: 4_000,
    timeout: 30_000,
  },
  PRO: {
    tokensPerMonth: 1_000_000,
    generationsPerMonth: 500,
    maxTokensPerRequest: 8_000,
    timeout: 60_000,
  },
  ENTERPRISE: {
    tokensPerMonth: 10_000_000,
    generationsPerMonth: 5_000,
    maxTokensPerRequest: 16_000,
    timeout: 120_000,
  },
};

type Tier = keyof typeof TIER_LIMITS;

class CircuitBreaker {
  private failures: number = 0;
  private lastFailure: number = 0;
  private readonly threshold: number;
  private readonly resetTimeout: number;

  constructor(threshold: number = 5, resetTimeoutMs: number = 60_000) {
    this.threshold = threshold;
    this.resetTimeout = resetTimeoutMs;
  }

  isOpen(): boolean {
    if (this.failures >= this.threshold) {
      if (Date.now() - this.lastFailure > this.resetTimeout) {
        this.failures = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
  }

  recordSuccess(): void {
    this.failures = 0;
  }
}

const providerCircuitBreakers = new Map<string, CircuitBreaker>();

function getCircuitBreaker(provider: string): CircuitBreaker {
  if (!providerCircuitBreakers.has(provider)) {
    providerCircuitBreakers.set(provider, new CircuitBreaker());
  }
  return providerCircuitBreakers.get(provider)!;
}

export async function checkUsageLimit(
  userId: string,
  action: "generation" | "token"
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const tier: Tier = user?.role === "ADMIN" ? "ENTERPRISE" : "FREE";
  const limits = TIER_LIMITS[tier];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyUsage = await prisma.usageRecord.aggregate({
    where: {
      userId,
      action,
      createdAt: { gte: startOfMonth },
    },
    _sum: { count: true },
  });

  const totalUsed = monthlyUsage._sum.count ?? 0;
  const limit =
    action === "generation"
      ? limits.generationsPerMonth
      : limits.tokensPerMonth;

  if (totalUsed >= limit) {
    throw new Error(
      `Monthly ${action} limit reached (${limit}). Upgrade your plan to increase limits.`
    );
  }
}

export async function checkTokenLimit(
  userId: string,
  requestedTokens: number
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const tier: Tier = user?.role === "ADMIN" ? "ENTERPRISE" : "FREE";
  const maxTokens = TIER_LIMITS[tier].maxTokensPerRequest;

  if (requestedTokens > maxTokens) {
    throw new Error(
      `Request exceeds maximum token limit (${maxTokens}). Reduce prompt length or upgrade your plan.`
    );
  }
}

export function getTimeout(role?: string): number {
  const tier: Tier = role === "ADMIN" ? "ENTERPRISE" : "FREE";
  return TIER_LIMITS[tier].timeout;
}

export function checkCircuitBreaker(provider: string): void {
  const cb = getCircuitBreaker(provider);
  if (cb.isOpen()) {
    throw new Error(
      `Provider ${provider} is temporarily unavailable due to repeated failures. Please try again later.`
    );
  }
}

export function recordProviderSuccess(provider: string): void {
  getCircuitBreaker(provider).recordSuccess();
}

export function recordProviderFailure(provider: string): void {
  getCircuitBreaker(provider).recordFailure();
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  provider: string,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      checkCircuitBreaker(provider);
      const result = await fn();
      recordProviderSuccess(provider);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      recordProviderFailure(provider);

      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10_000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error("Retry failed");
}

export { TIER_LIMITS };
export type { Tier };
