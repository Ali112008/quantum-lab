import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rateLimit";

/**
 * POST /api/admin/pledges — the human confirmation switch for the funding tube.
 *
 * This is where a PENDING pledge intent either collapses into CONFIRMED
 * (money counted, donor wall entry created) or DECLineD (never counted).
 * The endpoint exists because of the HONESTY RULE in FUNDRAISING/data.ts:
 * the public tube only counts money a real human on the team has verified.
 *
 * Auth is identical to /api/admin/digest (deliberately — same key, same
 * posture): ADMIN_KEY env var, constant-time SHA-256 comparison, Basic
 * auth or ?key=, rate limited BEFORE the secret comparison.
 *
 *   POST /api/admin/pledges?key=ADMIN_KEY
 *   { "id": "cle…", "action": "confirm" | "decline" }
 *
 * Deployment note: set ADMIN_KEY in the host's env panel before exposing
 * this route; without a key configured the endpoint fails closed (503).
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

const actionSchema = z.object({
  id: z.string().min(1, "Pledge id is required"),
  action: z.enum(["confirm", "decline"]),
});

export async function POST(req: NextRequest) {
  try {
    // ---- Gate 1: is the switch even wired? ----
    const adminKey = process.env.ADMIN_KEY ?? "";
    if (!adminKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Admin pledges endpoint is not configured. Set ADMIN_KEY in the server environment.",
        },
        { status: 503 }
      );
    }

    // ---- Gate 2: rate limit BEFORE touching the secret comparison ----
    const rl = rateLimit(`admin-pledges:${clientKey(req)}`, 30, 10 * 60 * 1000);
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
          headers: { "WWW-Authenticate": 'Basic realm="QRL admin pledges"' },
        }
      );
    }

    // ---- Authenticated: apply the action ----
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, action } = parsed.data;
    const nextStatus = action === "confirm" ? "CONFIRMED" : "DECLINED";

    const updated = await db.pledge.update({
      where: { id },
      data: {
        status: nextStatus,
        confirmedAt: action === "confirm" ? new Date() : null,
      },
      select: { id: true, name: true, amount: true, tier: true, status: true, confirmedAt: true },
    });

    return NextResponse.json(
      { ok: true, pledge: updated },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    // Prisma P2025 = record not found — worth a precise message for the operator.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "No pledge with that id" },
        { status: 404 }
      );
    }
    console.error("[api/admin/pledges] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update the pledge" },
      { status: 500 }
    );
  }
}
