import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  limit: number;
  reset: number;
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redisClient = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const ratelimiter = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "roamalto",
    })
  : null;

const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export const checkRateLimit = async (
  key: string,
  limit = 10,
  windowSeconds = 60,
): Promise<RateLimitResult> => {
  if (ratelimiter) {
    const result = await ratelimiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      limit: result.limit,
      reset: result.reset,
    };
  }

  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.expiresAt <= now) {
    const expiresAt = now + windowSeconds * 1000;
    memoryStore.set(key, { count: 1, expiresAt });
    return {
      success: true,
      remaining: limit - 1,
      limit,
      reset: expiresAt,
    };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      limit,
      reset: entry.expiresAt,
    };
  }

  entry.count += 1;
  memoryStore.set(key, entry);

  return {
    success: true,
    remaining: limit - entry.count,
    limit,
    reset: entry.expiresAt,
  };
};

export const rateLimitHeaders = (result: RateLimitResult) => ({
  "X-RateLimit-Limit": result.limit.toString(),
  "X-RateLimit-Remaining": Math.max(0, result.remaining).toString(),
  "X-RateLimit-Reset": result.reset.toString(),
});
