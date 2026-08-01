import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Always run per-request so the count is live (never statically cached).
export const dynamic = "force-dynamic";

const KEY = "cvdock:visits";

/**
 * Find an env var whose name ends with one of the given suffixes. This lets the
 * counter work no matter which prefix the Upstash/Vercel integration applied
 * (UPSTASH_REDIS_*, KV_*, STORAGE_*, …) — we match on the REST suffix instead of
 * a fixed variable name. Read-only tokens (…_READ_ONLY_TOKEN) are never matched,
 * so INCR always uses a write-capable token.
 */
function envBySuffix(suffixes: string[]): string | undefined {
  for (const [k, v] of Object.entries(process.env)) {
    if (!v) continue;
    const K = k.toUpperCase();
    if (suffixes.some((s) => K.endsWith(s))) return v;
  }
  return undefined;
}

/**
 * Lazily build the Redis client from env. Returns null when no Upstash REST
 * credentials are present (local dev, or before the Vercel integration is
 * connected) so the site keeps working without a counter instead of crashing.
 */
function getRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    envBySuffix(["_REST_API_URL", "_REST_URL"]);
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    envBySuffix(["_REST_API_TOKEN", "_REST_TOKEN"]);
  if (!url || !token) return null;
  return new Redis({ url: String(url), token: String(token) });
}

// Read the current total (no increment).
export async function GET() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ count: null, configured: false });
  try {
    const count = (await redis.get<number>(KEY)) ?? 0;
    return NextResponse.json({ count, configured: true });
  } catch {
    return NextResponse.json({ count: null, configured: false });
  }
}

// Register one visit and return the new total.
export async function POST() {
  const redis = getRedis();
  if (!redis) return NextResponse.json({ count: null, configured: false });
  try {
    const count = await redis.incr(KEY);
    return NextResponse.json({ count, configured: true });
  } catch {
    return NextResponse.json({ count: null, configured: false });
  }
}
