import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type UpstashDuration = `${number} ms` | `${number} s` | `${number} m` | `${number} h` | `${number}d` | `${number}ms` | `${number}s` | `${number}m` | `${number}h` | `${number}d`;

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis not configured, rate limiting disabled');
    return null;
  }

  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'opencode:ratelimit',
  });

  return ratelimit;
}

export async function rateLimit(
  identifier: string,
  options?: { limit?: number; window?: UpstashDuration }
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const rl = getRatelimit();
  if (!rl) {
    return { success: true, limit: 9999, remaining: 9999, reset: Date.now() + 60000 };
  }

  const limit = options?.limit ?? 100;
  const window = options?.window ?? '1 m';

  const customRl = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: 'opencode:ratelimit',
  });

  const { success, limit: lim, remaining, reset } = await customRl.limit(identifier);
  return { success, limit: lim, remaining, reset };
}

export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? (forwarded.split(',')[0] ?? '').trim() : 'unknown';
  const userAgent = request.headers.get('user-agent') ?? '';
  return `${ip}:${userAgent.slice(0, 50)}`;
}
