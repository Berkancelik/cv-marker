import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Always run per-request so the count is live (never statically cached).
export const dynamic = "force-dynamic";

const KEY = "cvdock:visits";

/**
 * Lazily build the Redis client from env. Returns null when the Upstash
 * credentials aren't set (local dev, or before the Vercel integration is
 * connected) so the site keeps working without a counter instead of crashing.
 */
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
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
