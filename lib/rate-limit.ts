import { NextResponse } from 'next/server';

/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * This is a best-effort defence against brute-force and abuse. On serverless
 * platforms each warm instance keeps its own counters, so it is not a hard
 * global limit, but it meaningfully raises the cost of automated attacks.
 * For strict guarantees, back this with a shared store (Redis/Upstash).
 */

interface RateEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateEntry>();
const MAX_KEYS = 10000;

function prune(now: number) {
  if (store.size < MAX_KEYS) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
  // If still too large, drop the oldest entries to bound memory usage.
  if (store.size >= MAX_KEYS) {
    const overflow = store.size - MAX_KEYS + 1;
    let removed = 0;
    for (const key of store.keys()) {
      store.delete(key);
      if (++removed >= overflow) break;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  prune(now);

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { success: true, remaining: limit - entry.count, retryAfter: 0 };
}

/** Best-effort client IP extraction from proxy headers. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(Math.max(1, retryAfter)) } }
  );
}

/**
 * Convenience guard: returns a 429 response when the limit is exceeded,
 * otherwise `null` so the caller can continue.
 */
export function enforceRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
  extraKey = ''
): NextResponse | null {
  const key = `${scope}:${getClientIp(req)}:${extraKey}`;
  const result = rateLimit(key, limit, windowMs);
  return result.success ? null : tooManyRequests(result.retryAfter);
}
