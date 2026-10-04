import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rateLimit";

/**
 * GET /api/admin/digest — protected inbox for partnership signals + subscribers.
 *
 * The platform constraint says only the landing route (/) is user-visible,
 * so the students have no admin UI; this endpoint IS the dashboard. Fetch it
 * with either:
 *
 *   Authorization: Basic base64("admin:" + ADMIN_KEY)
 *   GET /api/admin/digest?key=ADMIN_KEY
 *
 * ADMIN_KEY lives in .env (server-side only — never NEXT_PUBLIC_*).
 * Comparison is constant-time (hashed both sides) to blunt timing attacks,
 * and the route is rate-limited like every other door in the building.
 *
 * Deployment note: set ADMIN_KEY in the host's env panel before exposing
 * this route; without a key configured the endpoint refuses to leak anything
 * (503) rather than defaulting to an open inbox.
 */

/** Constant-time equality over SHA-256 digests of the two secrets. */
function secretsMatch(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

function extractKey(req: Request): string | null {
  const url = new URL(req.url);
  const queryKey = url.searchParams.get("key");
  if (queryKey) return queryKey;

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
      // "user:password" — we only care about the password half.
      const colon = decoded.indexOf(":");
      return colon === -1 ? decoded : decoded.slice(colon + 1);
    } catch {
      return null;
    }
  }
  return null;
}

export async function GET(req: Request) {
  try {
    // ---- Gate 1: is the mailbox even configured? ----
    const adminKey = process.env.ADMIN_KEY ?? "";
    if (!adminKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Admin digest is not configured. Set ADMIN_KEY in the server environment to open this inbox.",
        },
        { status: 503 }
      );
    }

    // ---- Gate 2: rate limit BEFORE touching the secret comparison ----
    const rl = rateLimit(`admin-digest:${clientKey(req)}`, 20, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Slow down." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    // ---- Gate 3: constant-time key check ----
    const provided = extractKey(req);
    if (!provided || !secretsMatch(provided, adminKey)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="QRL admin digest"' },
        }
      );
    }

    // ---- Authenticated: ship the full inbox ----
    const [inquiryTotal, inquiries, subscriberTotal, subscribers, pledgePending, pledgeConfirmed, pledgeSum] =
      await Promise.all([
        db.inquiry.count(),
        db.inquiry.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        db.subscriber.count(),
        db.subscriber.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
          select: { id: true, email: true, createdAt: true },
        }),
        // Pledges: pending intents need action; confirmed ones are money in the tube.
        db.pledge.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        db.pledge.findMany({
          where: { status: "CONFIRMED" },
          orderBy: { confirmedAt: "desc" },
          take: 100,
        }),
        db.pledge.aggregate({ where: { status: "CONFIRMED" }, _sum: { amount: true } }),
      ]);

    return NextResponse.json(
      {
        ok: true,
        generatedAt: new Date().toISOString(),
        inquiries: { total: inquiryTotal, items: inquiries },
        subscribers: { total: subscriberTotal, items: subscribers },
        pledges: {
          pending: { items: pledgePending },
          confirmed: { items: pledgeConfirmed, totalUSD: pledgeSum._sum.amount ?? 0 },
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[api/admin/digest] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not assemble the digest" },
      { status: 500 }
    );
  }
}
