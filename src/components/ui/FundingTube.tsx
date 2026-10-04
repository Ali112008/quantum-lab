"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Rocket,
  Loader2,
  CheckCircle2,
  Coins,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Counter from "@/components/ui/Counter";
import { useToast } from "@/hooks/use-toast";
import { quantumVariants, viewport } from "@/lib/animations";
import { useLang } from "@/lib/LanguageProvider";
import { FUNDRAISING } from "@/lib/data";

/**
 * ROAD TO $50,000 — the live, Prisma-backed funding tube.
 *
 * Data flow (the honesty rule, implemented end-to-end):
 *
 *   visitor records a pledge INTENT ──POST /api/pledges──▶ Pledge(PENDING)
 *   team human verifies it (email/call/letter)
 *          ──POST /api/admin/pledges {action:"confirm"}──▶ Pledge(CONFIRMED)
 *   GET /api/pledges sums CONFIRMED rows ──▶ THIS tube moves.
 *
 * So the number on screen is only ever money a real human verified —
 * the database is the honesty mechanism, not a comment.
 *
 * The component also owns the donor wall (masked names only — the API
 * never leaks emails or notes) and the inline pledge-intent form.
 */

interface PledgeSummaryDto {
  ok: boolean;
  raised: number;
  goal: number;
  confirmedCount: number;
  pendingCount: number;
  recent: { id: string; name: string; amount: number; tier: string; at: string }[];
}

export interface PledgePrefill {
  amount: number;
  tier: string;
  nonce: number;
}

/** Tier dot colors — visual taxonomy shared with the tier cards. */
const TIER_DOT: Record<string, string> = {
  qubit: "bg-quantum-blue",
  gate: "bg-quantum-purple",
  founding: "bg-quantum-amber",
  custom: "bg-quantum-green",
};

/** USD formatting pinned LTR everywhere (money is a language of its own). */
const fmtUSD = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function FundingTube({ prefill }: { prefill?: PledgePrefill | null }) {
  const { t } = useLang();
  const { toast } = useToast();

  // ---- live summary state ----
  const [summary, setSummary] = useState<PledgeSummaryDto | null>(null);
  const [refetching, setRefetching] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      setRefetching(true);
      const res = await fetch("/api/pledges", { cache: "no-store" });
      const data: PledgeSummaryDto = await res.json();
      if (data.ok) setSummary(data);
    } catch {
      /* the tube stays on its FUNDRAISING fallback (superposition) */
    } finally {
      setRefetching(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const raised = summary?.raised ?? FUNDRAISING.raised;
  const goal = summary?.goal ?? FUNDRAISING.goal;
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const pendingCount = summary?.pendingCount ?? 0;

  // ---- pledge intent form ----
  const [pledged, setPledged] = useState(false);

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t.contact.pledgeZodName).max(80),
        email: z.string().trim().email(t.contact.pledgeZodEmail),
        amount: z.coerce
          .number({ invalid_type_error: t.contact.pledgeZodAmount })
          .int(t.contact.pledgeZodAmount)
          .min(1, t.contact.pledgeZodAmount)
          .max(50_000, t.contact.pledgeZodAmount),
        tier: z.enum(["qubit", "gate", "founding", "custom"]),
        message: z.string().trim().max(500).optional().or(z.literal("")),
        /** Honeypot — hidden from humans; must stay empty. */
        website: z.string().max(0).optional().or(z.literal("")),
      }),
    [t]
  );

  type PledgeValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PledgeValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", amount: undefined as unknown as number, tier: "custom", message: "", website: "" },
  });

  // ---- tier-card prefill: amount + tier + show the form if it was in success state ----
  useEffect(() => {
    if (!prefill) return;
    setPledged(false);
    setValue("amount", prefill.amount, { shouldValidate: false });
    setValue("tier", prefill.tier as PledgeValues["tier"], { shouldValidate: false });
  }, [prefill, setValue]);

  const onPledge = async (values: PledgeValues) => {
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: { ok: boolean; error?: string } = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(
          res.status === 429 ? t.contact.rateLimited : data.error ?? t.contact.pledgeToastDesc
        );
      }
      setPledged(true);
      reset();
      void loadSummary(); // pendingCount ticks up immediately — honest feedback
      toast({ title: t.contact.pledgeToastTitle, description: t.contact.pledgeToastDesc });
    } catch (err) {
      toast({
        title: t.contact.pledgeToastErrorTitle,
        description: err instanceof Error ? err.message : t.contact.pledgeToastDesc,
        variant: "destructive",
      });
    }
  };

  const amountValue = watch("amount");

  return (
    <motion.div
      variants={quantumVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      id="funding-tube"
      className="relative mb-10 scroll-mt-24 overflow-hidden rounded-2xl border border-quantum-amber/25 bg-gradient-to-b from-quantum-amber/[0.07] to-quantum-secondary/60 p-5 md:p-6"
      role="group"
      aria-label={t.contact.fundAria}
    >
      {/* decorative corner glows */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-14 -start-14 size-36 rounded-full bg-quantum-amber/10 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -end-10 size-40 rounded-full bg-quantum-purple/10 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-quantum-amber">
            <Rocket className="size-3.5" aria-hidden="true" />
            {t.contact.fundEyebrow}
          </p>
          <h3 className="mt-1.5 font-heading text-lg font-extrabold text-white md:text-xl">
            {t.contact.fundTitle}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-quantum-green/40 bg-quantum-green/10 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.18em] text-quantum-green">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="size-1.5 rounded-full bg-quantum-green"
            aria-hidden="true"
          />
          {t.contact.fundGoalChip}
        </span>
      </div>

      <p className="relative mt-2 max-w-xl text-xs leading-relaxed text-quantum-subtle md:text-sm">
        {t.contact.fundSub}
      </p>

      {/* raised / goal readout — aria-live so a screen reader hears the tube move */}
      <div className="relative mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="font-heading text-3xl font-black text-white tabular-nums" dir="ltr" aria-live="polite">
          <Counter value={raised} prefix="$" className="text-quantum-amber" />
        </p>
        <p className="pb-0.5 text-xs text-quantum-subtle">
          {t.contact.fundRaisedLabel}
          <span className="mx-2 text-quantum-subtle/40">·</span>
          <span className="font-mono text-quantum-amber/90" dir="ltr">
            {t.contact.fundPctLabel(pct)}
          </span>
        </p>
        {/* manual refresh — the tube is live data, not a decoration */}
        <button
          type="button"
          onClick={() => void loadSummary()}
          aria-label="Refresh funding progress"
          className="ms-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-quantum-navy/60 px-2.5 py-1 font-mono text-[10px] text-quantum-subtle transition-colors hover:border-quantum-amber/40 hover:text-quantum-amber"
        >
          <RefreshCw className={`size-3 ${refetching ? "animate-spin" : ""}`} aria-hidden="true" />
          <span dir="ltr">GOAL $50,000</span>
        </button>
      </div>

      {/* the tube */}
      <div
        className="relative mt-3 h-3.5 rounded-full bg-quantum-navy/90 ring-1 ring-inset ring-white/10"
        dir="ltr"
        aria-hidden="true"
      >
        {/* current fill — grows as CONFIRMED pledges land */}
        <motion.div
          className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-quantum-amber via-[#FFE29A] to-quantum-amber shadow-[0_0_18px_rgba(251,191,36,0.55)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* shimmer sweep — the tube is "live" even at zero */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 w-16 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-80px", "420px"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
        />
        {/* milestone ticks */}
        {FUNDRAISING.milestones.map((m) => (
          <span
            key={m}
            className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-white/40"
            style={{ left: `${m * 100}%` }}
          />
        ))}
        {/* YOU-ARE-HERE node — slides to the live progress point */}
        <motion.span
          className={`absolute top-1/2 ${pct > 0 ? "-translate-x-1/2" : ""}`}
          initial={false}
          animate={{ left: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          <span className="relative flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-quantum-amber opacity-60" />
            <span className="relative inline-flex size-3.5 rounded-full border-2 border-quantum-navy bg-quantum-amber shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          </span>
        </motion.span>
      </div>

      {/* milestone legend — absolute at the exact tick positions,
          edge labels anchored inward so nothing overflows */}
      <div className="relative mt-3 h-10 font-mono text-[9px] tracking-wider text-quantum-subtle md:text-[10px]" dir="ltr">
        {t.contact.fundMilestones.map((ms, i) => {
          const pos = FUNDRAISING.milestones[i] * 100;
          const anchor =
            i === 0
              ? { left: 0 }
              : i === t.contact.fundMilestones.length - 1
                ? { right: 0 }
                : { left: `${pos}%`, transform: "translateX(-50%)" };
          return (
            <span
              key={ms.at}
              className="absolute top-0 flex flex-col items-center whitespace-nowrap"
              style={anchor}
            >
              <span className={`font-bold ${raised >= [500, 5000, 50000][i] ? "text-quantum-amber" : "text-quantum-text/80"}`}>{ms.at}</span>
              <span>{ms.label}</span>
            </span>
          );
        })}
      </div>

      {/* pending superposition note — intents exist but are not money yet */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative mt-1 flex items-center gap-1.5 text-center font-mono text-[10px] tracking-wider text-quantum-purple/90"
          >
            <span className="inline-block size-1.5 rounded-full bg-quantum-purple motion-safe:animate-pulse" aria-hidden="true" />
            {t.contact.pledgePendingNote(pendingCount)}
          </motion.p>
        )}
      </AnimatePresence>

      {raised === 0 && (
        <p className="relative mt-4 text-center font-heading text-xs font-bold text-quantum-amber/90 md:text-sm">
          {t.contact.fundEmpty}
        </p>
      )}

      <p className="relative mt-3 flex items-start gap-1.5 border-t border-white/5 pt-3 text-[11px] leading-relaxed text-quantum-subtle/80">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-quantum-green/80" aria-hidden="true" />
        {t.contact.fundDisclaimer}
      </p>

      {/* ══ lower half: donor wall (left) + pledge intent form (right) ══ */}
      <div className="relative mt-5 grid gap-4 lg:grid-cols-5">
        {/* ---- DONOR WALL ---- */}
        <div
          className="rounded-xl border border-white/8 bg-quantum-navy/50 p-4 lg:col-span-2"
          aria-label={t.contact.pledgeWallTitle}
        >
          <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-quantum-amber">
            <Coins className="size-3.5" aria-hidden="true" />
            {t.contact.pledgeWallTitle}
          </p>

          {summary && summary.recent.length > 0 ? (
            <ul className="mt-3 max-h-44 space-y-2 overflow-y-auto pe-1">
              <AnimatePresence initial={false}>
                {summary.recent.map((p) => (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-quantum-secondary/70 px-2.5 py-1.5"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`size-2 shrink-0 rounded-full ${TIER_DOT[p.tier] ?? TIER_DOT.custom}`} aria-hidden="true" />
                      <span className="truncate text-xs font-medium text-quantum-text/90">{p.name}</span>
                      <span className="shrink-0 font-mono text-[9px] tracking-wider text-quantum-subtle/70">
                        {t.contact.pledgeTierNames[p.tier as keyof typeof t.contact.pledgeTierNames] ?? t.contact.pledgeTierNames.custom}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-quantum-amber" dir="ltr">
                      {fmtUSD(p.amount)}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {/* ghost "next slot" — decorative invitation, dashed until someone claims it */}
              {summary.recent.length < 3 && (
                <li
                  aria-hidden="true"
                  className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-white/10 px-2.5 py-1.5"
                >
                  <span className="flex items-center gap-2 opacity-40">
                    <span className="size-2 rounded-full border border-dashed border-white/40" />
                    <span className="font-mono text-[10px] tracking-wider text-quantum-subtle">· · ·</span>
                  </span>
                  <span className="font-mono text-[10px] text-quantum-subtle opacity-40" dir="ltr">
                    $ ?
                  </span>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-3 text-[11px] leading-relaxed text-quantum-subtle/60">
              {t.contact.fundEmpty}
            </p>
          )}
        </div>

        {/* ---- PLEDGE INTENT FORM ---- */}
        <div className="rounded-xl border border-quantum-amber/20 bg-quantum-navy/50 p-4 lg:col-span-3">
          <AnimatePresence mode="wait">
            {pledged ? (
              <motion.div
                key="pledge-done"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-56 flex-col items-center justify-center py-6 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -120 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  className="mb-4 flex size-14 items-center justify-center rounded-full border border-quantum-amber/40 bg-quantum-amber/15"
                >
                  <CheckCircle2 className="size-7 text-quantum-amber" aria-hidden="true" />
                </motion.span>
                <h4 className="font-heading text-lg font-extrabold text-white">
                  {t.contact.pledgeSuccessTitle}
                </h4>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-quantum-subtle md:text-sm">
                  {t.contact.pledgeSuccessBody}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPledged(false);
                    reset();
                  }}
                  className="mt-5 min-h-10 rounded-xl border border-quantum-amber/50 bg-quantum-amber/10 px-4 font-heading text-xs font-bold text-quantum-amber transition-colors hover:bg-quantum-amber/20"
                >
                  {t.contact.pledgeAnother}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="pledge-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onSubmit={handleSubmit(onPledge)}
                noValidate
                aria-label={t.contact.pledgeAria}
              >
                <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.22em] text-quantum-amber">
                  <Rocket className="size-3" aria-hidden="true" />
                  {t.contact.pledgeEyebrow}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-quantum-subtle">
                  {t.contact.pledgeIntro}
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="pledge-name" className="text-xs font-medium text-quantum-text">
                      {t.contact.pledgeName} <span className="text-quantum-red">*</span>
                    </label>
                    <input
                      id="pledge-name"
                      type="text"
                      placeholder={t.contact.pledgeNamePh}
                      aria-invalid={!!errors.name}
                      className="h-10 w-full rounded-lg border border-white/10 bg-quantum-secondary/80 px-3 text-sm text-white placeholder:text-quantum-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum-amber/60"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-[11px] text-quantum-red">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="pledge-email" className="text-xs font-medium text-quantum-text">
                      {t.contact.pledgeEmail} <span className="text-quantum-red">*</span>
                    </label>
                    <input
                      id="pledge-email"
                      type="email"
                      dir="ltr"
                      placeholder={t.contact.pledgeEmailPh}
                      aria-invalid={!!errors.email}
                      className="h-10 w-full rounded-lg border border-white/10 bg-quantum-secondary/80 px-3 text-sm text-white placeholder:text-quantum-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum-amber/60"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-[11px] text-quantum-red">{errors.email.message}</p>}
                  </div>

                  {/* Amount + quick chips */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="pledge-amount" className="text-xs font-medium text-quantum-text">
                      {t.contact.pledgeAmount} <span className="text-quantum-red">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-2" dir="ltr">
                      <input
                        id="pledge-amount"
                        type="number"
                        min={1}
                        max={50000}
                        step={1}
                        inputMode="numeric"
                        placeholder={t.contact.pledgeAmountPh}
                        aria-invalid={!!errors.amount}
                        className="h-10 w-32 rounded-lg border border-white/10 bg-quantum-secondary/80 px-3 font-mono text-sm tabular-nums text-white placeholder:text-quantum-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum-amber/60"
                        {...register("amount")}
                      />
                      {FUNDRAISING.suggestedAmounts.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setValue("amount", v, { shouldValidate: true })}
                          aria-pressed={Number(amountValue) === v}
                          className={`min-h-9 rounded-full border px-3 font-mono text-[11px] font-bold tabular-nums transition-all ${
                            Number(amountValue) === v
                              ? "border-quantum-amber/70 bg-quantum-amber/20 text-quantum-amber shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                              : "border-white/10 bg-quantum-secondary/60 text-quantum-subtle hover:border-quantum-amber/40 hover:text-quantum-amber/90"
                          }`}
                        >
                          {fmtUSD(v)}
                        </button>
                      ))}
                    </div>
                    {errors.amount && <p className="text-[11px] text-quantum-red">{errors.amount.message}</p>}
                  </div>

                  {/* Note */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="pledge-message" className="text-xs font-medium text-quantum-text">
                      {t.contact.pledgeMessage}{" "}
                      <span className="text-quantum-subtle">{t.contact.pledgeMessageOptional}</span>
                    </label>
                    <input
                      id="pledge-message"
                      type="text"
                      placeholder={t.contact.pledgeMessagePh}
                      className="h-10 w-full rounded-lg border border-white/10 bg-quantum-secondary/80 px-3 text-sm text-white placeholder:text-quantum-subtle/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quantum-amber/60"
                      {...register("message")}
                    />
                  </div>
                </div>

                {/* Honeypot: invisible to humans & screen readers. */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                  <label htmlFor="pledge-website">{t.contact.honeypotLabel}</label>
                  <input
                    id="pledge-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="hidden text-[10px] leading-snug text-quantum-subtle/60 sm:block">
                    {t.contact.pledgeTierNames.qubit} · {t.contact.pledgeTierNames.gate} · {t.contact.pledgeTierNames.founding}
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-quantum-amber px-6 font-heading text-sm font-bold text-quantum-navy transition-all hover:bg-[#FFD166] hover:shadow-[0_0_24px_rgba(251,191,36,0.45)] disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        {t.contact.pledgeSubmitting}
                      </>
                    ) : (
                      <>
                        <Coins className="size-4" aria-hidden="true" />
                        {t.contact.pledgeSubmit}
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
