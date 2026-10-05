import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rateLimit";

/**
 * POST /api/inquiries — capture a partnership / funding signal.
 * GET  /api/inquiries — public aggregate: how many measurements have collapsed.
 *
 * Abuse hardening:
 *  - sliding-window rate limit (5 POSTs / 10 min / IP)
 *  - `website` honeypot: bots that fill the hidden field get a polite fake
 *    success so they never learn the trap exists — nothing is stored.
 */

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  org: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  interest: z.enum(["funding", "partnership", "join", "other"]).default("funding"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters")
    .max(2000),
  /** Honeypot — must stay empty. Hidden from humans, irresistible to bots. */
  website: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // ---- Rate limit: 5 transmissions per 10 minutes per client ----
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
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, org, email, interest, message, website } = parsed.data;

    // ---- Honeypot trip: pretend success, store nothing ----
    if (website && website.trim().length > 0) {
      return NextResponse.json(
        { ok: true, createdAt: new Date().toISOString() },
        { status: 202 }
      );
    }

    const inquiry = await db.inquiry.create({
      data: {
        name,
        org: org || null,
        email,
        interest,
        message,
      },
    });

    return NextResponse.json(
      { ok: true, id: inquiry.id, createdAt: inquiry.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/inquiries] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something decohered on our side. Try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [total, latest] = await Promise.all([
      db.inquiry.count(),
      db.inquiry.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    return NextResponse.json(
      { ok: true, total, latestAt: latest?.createdAt ?? null },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[api/inquiries] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not read the signal" },
      { status: 500 }
    );
  }
}
