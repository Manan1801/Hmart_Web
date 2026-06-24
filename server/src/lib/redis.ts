import { Redis } from "@upstash/redis";
import { env } from "../config/env";

export const redis =
  env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN
    ? new Redis({ url: env.UPSTASH_REDIS_URL, token: env.UPSTASH_REDIS_TOKEN })
    : null;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  return redis.get<T>(key);
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  await redis.set(key, value, { ex: ttlSeconds });
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}
