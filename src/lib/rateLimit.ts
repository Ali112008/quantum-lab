/**
 * Quantum-grade spam decoherence — an in-memory sliding-window rate limiter.
 *
 * In a real deployed lab we'd reach for Redis or an edge middleware, but for
 * this single-node seed-pitch site a local sliding window is plenty: it stops
 * burst abuse of POST /api/inquiries without any extra infrastructure.
 *
 * How it works (classical approximation of a "no-cloning" guard):
 *   - every unique client key gets a bucket of timestamps
 *   - a request is allowed only if fewer than `limit` timestamps fall
 *     inside the last `windowMs` milliseconds
 *   - buckets that go fully stale are pruned so memory stays O(active clients)
 */

const buckets = new Map<string, number[]>();

/** Last time we swept the whole map (avoid sweeping on every request). */
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

export interface RateLimitResult {
  /** true → request may proceed; false → caller should answer 429. */
  ok: boolean;
  /** Seconds until the oldest hit leaves the window (for Retry-After). */
  retryAfter: number;
  /** Requests remaining in the current window. */
  remaining: number;
}

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): RateLimitResult {
  const now = Date.now();

  // Periodic global sweep so abandoned buckets don't linger forever.
  if (now - lastSweep > SWEEP_INTERVAL_MS) {
    for (const [k, hits] of buckets) {
      if (hits.length === 0 || now - hits[hits.length - 1] > windowMs) {
        buckets.delete(k);
      }
    }
    lastSweep = now;
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0];
    buckets.set(key, hits);
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
      remaining: 0,
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  return { ok: true, retryAfter: 0, remaining: limit - hits.length };
}

/** Best-effort client identity behind the sandbox gateway / proxies. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}
