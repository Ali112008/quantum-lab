import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rateLimit";

/**
 * POST /api/subscribe — join the monthly "progress signal" newsletter.
 * GET  /api/subscribe — public aggregate: how many qubits are on the list.
 *
 * Abuse hardening (mirrors /api/inquiries):
 *  - sliding-window rate limit (5 POSTs / 10 min / IP)
 *  - `website` honeypot: bots get a polite fake success, nothing stored
 *  - unique email constraint → duplicate friendly answer (no error leak)
 */

const subscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(160),
  /** Honeypot — must stay empty. */
  website: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // ---- Rate limit: 5 subscribes per 10 minutes per client ----
    const rl = rateLimit(clientKey(req), 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many signals from your node — the channel needs to decohere for a bit. Try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfter) },
        }
      );
    }

    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed" },
        { status: 400 }
      );
    }

    const { email, website } = parsed.data;

    // ---- Honeypot trip: pretend success, store nothing ----
    if (website && website.trim().length > 0) {
      return NextResponse.json(
        { ok: true, createdAt: new Date().toISOString() },
        { status: 202 }
      );
    }

    try {
      const subscriber = await db.subscriber.create({ data: { email } });
      return NextResponse.json(
        { ok: true, id: subscriber.id },
        { status: 201 }
      );
    } catch (err) {
      // P2002 = unique violation → already subscribed. A friendly classic.
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as { code?: string }).code === "P2002"
      ) {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      throw err;
    }
  } catch (err) {
    console.error("[api/subscribe] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something decohered on our side. Try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const total = await db.subscriber.count();
    return NextResponse.json(
      { ok: true, total },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[api/subscribe] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not read the list" },
      { status: 500 }
    );
  }
}
