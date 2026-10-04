import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, clientKey } from "@/lib/rateLimit";

/**
 * POST /api/pledges — record a pledge INTENT on the Road-to-$50K tube.
 * GET  /api/pledges — public summary that powers the live funding tube.
 *
 * ── HONESTY MODEL ─────────────────────────────────────────────────────
 * A POST never moves the tube. Money only counts after a human on the
 * team verifies the intent (email/call/letter) and flips the row to
 * CONFIRMED via the protected /api/admin/pledges endpoint. Until then
 * the pledge sits in PENDING superposition — visible to nobody except
 * the admin digest.
 *
 * ── PRIVACY MODEL ─────────────────────────────────────────────────────
 * The public GET never returns emails or messages. Names are masked to
 * a "first name + last initial" display form inside maskName() before
 * leaving the server. The wall shows generosity, not PII.
 *
 * Abuse hardening mirrors /api/inquiries and /api/subscribe:
 *   - sliding-window rate limit (5 POSTs / 10 min / IP)
 *   - `website` honeypot → polite fake success, nothing stored
 */

/** Maximum plausible single pledge — one Founding Partner covers the ask. */
const MAX_PLEDGE_USD = 50_000;
/** Below a dollar the quantum funding tube does not resolve. */
const MIN_PLEDGE_USD = 1;

const pledgeSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .int("Amount must be a whole number of dollars")
    .min(MIN_PLEDGE_USD, `Minimum pledge is $${MIN_PLEDGE_USD}`)
    .max(MAX_PLEDGE_USD, `Maximum single pledge is $${MAX_PLEDGE_USD}`),
  tier: z.enum(["qubit", "gate", "founding", "custom"]).optional().default("custom"),
  message: z.string().trim().max(500).optional().or(z.literal("")),
  /** Honeypot — must stay empty. */
  website: z.string().max(200).optional(),
});

/**
 * Privacy mask: "Dr. Ahmed Hassan" → "Ahmed H."; single-word names pass
 * through untouched. Honorifics (EN + AR) are skipped so titles don't
 * masquerade as first names. Diacritics-safe (we only cut at whitespace).
 */
const HONORIFICS = new Set(["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof.", "د", "د.", "أ", "م"]);

function maskName(fullName: string): string {
  const raw = fullName.trim().split(/\s+/).filter(Boolean);
  const parts = raw.filter((p) => !HONORIFICS.has(p.toLowerCase()));
  const use = parts.length > 0 ? parts : raw;
  if (use.length === 0) return "Anonymous";
  if (use.length === 1) return use[0]!;
  const first = use[0]!;
  const lastInitial = use[use.length - 1]!.charAt(0).toUpperCase();
  return `${first} ${lastInitial}.`;
}

export async function POST(req: NextRequest) {
  try {
    // ---- Rate limit: 5 intents per 10 minutes per client ----
    const rl = rateLimit(`pledges:${clientKey(req)}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Too many pledges from your node — the channel needs to decohere for a bit. Try again later.",
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = pledgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, amount, tier, message, website } = parsed.data;

    // ---- Honeypot trip: pretend success, store nothing ----
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true, status: "PENDING" }, { status: 202 });
    }

    const pledge = await db.pledge.create({
      data: {
        name,
        email,
        amount,
        tier,
        message: message && message.length > 0 ? message : null,
        status: "PENDING",
      },
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json(
      { ok: true, id: pledge.id, status: pledge.status },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/pledges] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something decohered on our side. Try again." },
      { status: 500 }
    );
  }
}

/** Public summary — the exact shape the funding tube + donor wall consume. */
export interface PledgeSummary {
  ok: true;
  /** Confirmed USD only — the honesty rule made numeric. */
  raised: number;
  goal: number;
  confirmedCount: number;
  pendingCount: number;
  /** Most recent CONFIRMED pledges, masked, newest first. */
  recent: {
    id: string;
    name: string;
    amount: number;
    tier: string;
    at: string;
  }[];
}

export async function GET() {
  try {
    const [confirmed, pendingCount, sumAgg] = await Promise.all([
      db.pledge.findMany({
        where: { status: "CONFIRMED" },
        orderBy: { confirmedAt: "desc" },
        take: 12,
        select: { id: true, name: true, amount: true, tier: true, confirmedAt: true },
      }),
      db.pledge.count({ where: { status: "PENDING" } }),
      db.pledge.aggregate({ where: { status: "CONFIRMED" }, _sum: { amount: true } }),
    ]);

    const summary: PledgeSummary = {
      ok: true,
      raised: sumAgg._sum.amount ?? 0,
      goal: 50_000, // mirrors TOTAL_SEED in data.ts; kept literal so the API stays dependency-free
      confirmedCount: confirmed.length,
      pendingCount,
      recent: confirmed.map((p) => ({
        id: p.id,
        name: maskName(p.name),
        amount: p.amount,
        tier: p.tier,
        at: (p.confirmedAt ?? new Date(0)).toISOString(),
      })),
    };

    return NextResponse.json(summary, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[api/pledges] GET failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not read the funding state" },
      { status: 500 }
    );
  }
}
