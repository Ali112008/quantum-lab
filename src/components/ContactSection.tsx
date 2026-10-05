"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Send, Loader2, CheckCircle2, Activity, Check, Gem, Sparkles, Share2, Link2, Twitter, Linkedin, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import QuantumCard from "@/components/ui/QuantumCard";
import FundingTube, { PledgePrefill } from "@/components/ui/FundingTube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quantumVariants, viewport } from "@/lib/animations";
import { useLang } from "@/lib/LanguageProvider";

/**
 * SECTION 08 — MAKE CONTACT
 * A fullstack form: signals POST to /api/inquiries (Prisma + SQLite),
 * and a live counter shows how many "measurements" have collapsed so far.
 * Validation messages re-bind per language — the schema is rebuilt on toggle.
 */

function SignalCounter() {
  const [total, setTotal] = useState<number | null>(null);
  const { t } = useLang();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data: { ok: boolean; total?: number }) => {
        if (!cancelled && data.ok && typeof data.total === "number") {
          setTotal(data.total);
        }
      })
      .catch(() => {
        /* the counter stays in superposition */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-full border border-quantum-green/30 bg-quantum-green/10 px-5 py-2.5 mb-10 w-fit mx-auto">
      <motion.span
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="relative flex size-2.5"
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-quantum-green opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-quantum-green" />
      </motion.span>
      <span className="font-mono text-xs tracking-wider text-quantum-green">
        {total === null ? t.contact.counterScanning : t.contact.counter(total)}
      </span>
    </div>
  );
}

/**
 * Share pill button — one of five on-ramps that re-emit the proposal's URL.
 * `window.open(..., "noopener")` (not <a href>) keeps SSR honest: the target
 * URL only exists at click-time inside the browser, so no hydration
 * mismatch is possible. noopener prevents tab-nabbing on external hosts.
 */
function SharePill({
  onClick,
  icon,
  label,
  featured = false,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 font-heading text-xs font-bold transition-all ${
        featured
          ? "border-quantum-blue/60 bg-quantum-blue/15 text-quantum-blue hover:bg-quantum-blue/25 hover:shadow-[0_0_18px_rgba(0,217,255,0.35)]"
          : "border-white/10 bg-quantum-secondary/70 text-quantum-text/85 hover:border-quantum-blue/50 hover:bg-quantum-blue/10 hover:text-quantum-blue hover:shadow-[0_0_16px_rgba(0,217,255,0.22)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function ContactSection() {
  const { toast } = useToast();
  const { t, lang } = useLang();
  const [submitted, setSubmitted] = useState(false);

  /* navigator.share exists only on capable devices — detect after mount so
     SSR output stays deterministic (no hydration mismatch). On unsupported
     browsers the pill disappears and Copy link takes over its job. */
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  /** Tier cards can prefill the pledge-intent form inside <FundingTube/>:
      a new object identity per click makes the tube's prefill effect fire. */
  const [pledgePrefill, setPledgePrefill] = useState<PledgePrefill | null>(null);
  const handleTierPledge = (index: number) => {
    const amounts = [500, 5000, 50_000]; // mirrors the tier ladder
    const keys = ["qubit", "gate", "founding"];
    setPledgePrefill({ amount: amounts[index], tier: keys[index], nonce: Date.now() });
    requestAnimationFrame(() => {
      document
        .getElementById("funding-tube")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  // Schema rebuilt per language so validation errors speak the page language.
  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t.contact.zodName).max(80),
        org: z.string().trim().max(120).optional().or(z.literal("")),
        email: z.string().trim().email(t.contact.zodEmail),
        interest: z.enum(["funding", "partnership", "join", "other"]),
        message: z
          .string()
          .trim()
          .min(10, t.contact.zodMessage)
          .max(2000),
        /** Honeypot — hidden from humans; must stay empty. */
        website: z.string().max(0).optional().or(z.literal("")),
      }),
    [t]
  );

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      org: "",
      email: "",
      interest: "funding",
      message: "",
      website: "",
    },
  });

  const interest = watch("interest");

  /* ── share handlers ── the URL is read at click-time (window.location),
     so the module is deploy-agnostic: sandbox preview, Vercel, or a
     university domain all share their own address automatically. */
  const pageUrl = () => `${window.location.origin}/`;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: document.title, text: t.contact.shareText, url: pageUrl() });
    } catch (err) {
      /* user dismissed the share sheet (AbortError) — silence is polite */
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        toast({ title: t.contact.shareToastCopiedTitle, description: t.contact.shareToastCopiedDesc });
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${t.contact.shareText} ${pageUrl()}`);
      toast({ title: t.contact.shareToastCopiedTitle, description: t.contact.shareToastCopiedDesc });
    } catch {
      toast({
        title: t.contact.shareToastCopiedTitle,
        description: pageUrl(),
      });
    }
  };

  const openExternal = (base: string, params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    window.open(`${base}${base.includes("?") ? "&" : "?"}${qs}`, "_blank", "noopener,noreferrer");
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: { ok: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        // Server messages are English — localize the common rate-limit case.
        throw new Error(
          res.status === 429 ? t.contact.rateLimited : data.error ?? t.contact.toastErrorDesc
        );
      }

      setSubmitted(true);
      reset();
      toast({
        title: t.contact.toastTitle,
        description: t.contact.toastDesc,
      });
    } catch (err) {
      toast({
        title: t.contact.toastErrorTitle,
        description: err instanceof Error ? err.message : t.contact.toastErrorDesc,
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32" aria-label={t.misc.contactAria}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-blue/30 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <SignalCounter />

        {/* ══ ROAD TO $50,000 — LIVE seed-round progress (Prisma-backed) ══
            FundingTube fetches /api/pledges: only human-CONFIRMED pledges
            move the tube. It also hosts the donor wall and the pledge
            intent form; tier cards below can prefill it. */}
        <FundingTube prefill={pledgePrefill} />

        {/* ══ SPONSORSHIP TIERS — pick your entanglement level ══
            Three on-ramps into the ask: a single qubit, a gate, or the
            whole register. The featured tier mirrors the full $50K ask. */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mb-10"
          role="group"
          aria-label={t.contact.tiersAria}
        >
          <p className="mb-5 flex items-center justify-center gap-2 text-center font-mono text-[11px] tracking-[0.3em] text-quantum-amber">
            <Gem className="size-3.5" aria-hidden="true" />
            {t.contact.tiersEyebrow}
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {t.contact.tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 140, damping: 18 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-2xl border p-5 backdrop-blur-sm transition-shadow duration-300 ${
                  tier.featured
                    ? "border-quantum-amber/50 bg-gradient-to-b from-quantum-amber/[0.10] to-quantum-secondary/70 shadow-[0_0_36px_-8px_rgba(251,191,36,0.35)]"
                    : "border-white/10 bg-quantum-secondary/60 hover:border-quantum-blue/40"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-2.5 end-4 inline-flex items-center gap-1 rounded-full border border-quantum-amber/60 bg-quantum-navy px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-[0.18em] text-quantum-amber shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                    <Sparkles className="size-3" aria-hidden="true" />
                    {t.contact.tiersFeaturedBadge}
                  </span>
                )}
                <p className="font-mono text-2xl font-black tracking-tight text-white" dir="ltr">
                  {tier.amount}
                </p>
                <h3 className={`mt-1 font-heading text-sm font-bold ${tier.featured ? "text-quantum-amber" : "text-quantum-blue"}`}>
                  {tier.name}
                </h3>
                <p className="mt-1.5 min-h-10 text-xs leading-relaxed text-quantum-subtle">
                  {tier.tagline}
                </p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5 text-[11px] leading-snug text-quantum-text/85">
                      <Check className="mt-0.5 size-3 shrink-0 text-quantum-green" aria-hidden="true" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 grid gap-2">
                  {/* Zero-email on-ramp: claiming a tier pre-fills the
                      pledge-intent form inside <FundingTube/> and scrolls to
                      it — no mailto, no address leakage. */}
                  <button
                    type="button"
                    onClick={() => handleTierPledge(i)}
                    className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border font-heading text-xs font-bold transition-all ${
                      tier.featured
                        ? "border-quantum-amber/60 bg-quantum-amber/15 text-quantum-amber hover:bg-quantum-amber/25 hover:shadow-[0_0_22px_rgba(251,191,36,0.4)]"
                        : "border-quantum-blue/40 bg-quantum-blue/5 text-quantum-blue hover:bg-quantum-blue/15 hover:shadow-[0_0_16px_rgba(0,217,255,0.3)]"
                    }`}
                  >
                    <Send className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                    {t.contact.tiersCta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-quantum-subtle/80">{t.contact.tiersNote}</p>
        </motion.div>

        {/* ══ AMPLIFY THE SIGNAL — the viral loop for the pitch itself.
            One tap re-emits the proposal to a funder's own network:
            native share sheet → clipboard → X → LinkedIn → WhatsApp
            (WhatsApp matters: it IS the academic social graph in Egypt).
            All targets are computed at click-time, so the module works
            unchanged on any future domain. ══ */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mb-10 flex flex-col items-center gap-3"
          role="group"
          aria-label={t.contact.shareAria}
        >
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-quantum-purple">
            <Share2 className="size-3.5" aria-hidden="true" />
            {t.contact.shareEyebrow}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {canShare && (
              <SharePill
                onClick={() => void handleNativeShare()}
                icon={<Share2 className="size-3.5" aria-hidden="true" />}
                label={t.contact.shareBtnNative}
                featured
              />
            )}
            <SharePill
              onClick={() => void handleCopyLink()}
              icon={<Link2 className="size-3.5" aria-hidden="true" />}
              label={t.contact.shareBtnCopy}
            />
            <SharePill
              onClick={() =>
                openExternal("https://twitter.com/intent/tweet", {
                  text: t.contact.shareText,
                  url: pageUrl(),
                })
              }
              icon={<Twitter className="size-3.5" aria-hidden="true" />}
              label={t.contact.shareBtnX}
            />
            <SharePill
              onClick={() => openExternal("https://www.linkedin.com/sharing/share-offsite", { url: pageUrl() })}
              icon={<Linkedin className="size-3.5" aria-hidden="true" />}
              label={t.contact.shareBtnLinkedIn}
            />
            <SharePill
              onClick={() =>
                openExternal("https://wa.me/", { text: `${t.contact.shareText} ${pageUrl()}` })
              }
              icon={<MessageCircle className="size-3.5" aria-hidden="true" />}
              label={t.contact.shareBtnWhatsApp}
            />
          </div>
        </motion.div>

        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <QuantumCard accent="#00D9FF" className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="mb-5 flex size-20 items-center justify-center rounded-full bg-quantum-green/15 border border-quantum-green/40"
                  >
                    <CheckCircle2 className="size-10 text-quantum-green" aria-hidden="true" />
                  </motion.span>
                  <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                    {t.contact.successTitle}
                  </h3>
                  <p className="mt-3 max-w-md text-quantum-subtle">
                    {t.contact.successBody}
                  </p>
                  <Button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-7 border-quantum-blue/50 bg-transparent text-quantum-blue hover:bg-quantum-blue/10 hover:text-quantum-blue"
                  >
                    {t.contact.successBtn}
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="grid gap-5 md:grid-cols-2"
                  aria-label={t.contact.subtitle}
                >
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-quantum-text">
                      {t.contact.name} <span className="text-quantum-red">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder={t.contact.namePh}
                      aria-invalid={!!errors.name}
                      className="bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-quantum-red">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-quantum-text">
                      {t.contact.email} <span className="text-quantum-red">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      dir="ltr"
                      placeholder={t.contact.emailPh}
                      aria-invalid={!!errors.email}
                      className="bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-quantum-red">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="org" className="text-quantum-text">
                      {t.contact.org}{" "}
                      <span className="text-quantum-subtle text-xs">{t.contact.orgOptional}</span>
                    </Label>
                    <Input
                      id="org"
                      placeholder={t.contact.orgPh}
                      className="bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("org")}
                    />
                  </div>

                  {/* Interest */}
                  <div className="space-y-2">
                    <Label htmlFor="interest" className="text-quantum-text">
                      {t.contact.interest}
                    </Label>
                    <input type="hidden" {...register("interest")} />
                    <Select
                      value={interest}
                      onValueChange={(v) =>
                        setValue("interest", v as FormValues["interest"], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="interest"
                        className="w-full bg-quantum-navy/60 border-white/10 data-[placeholder]:text-quantum-subtle"
                      >
                        <SelectValue placeholder={t.contact.interestPh} />
                      </SelectTrigger>
                      <SelectContent className="bg-quantum-secondary border-quantum-blue/20">
                        {t.contact.interestOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message" className="text-quantum-text">
                      {t.contact.message} <span className="text-quantum-red">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder={t.contact.messagePh}
                      aria-invalid={!!errors.message}
                      className="resize-none bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("message")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.message ? (
                        <p className="text-xs text-quantum-red">
                          {errors.message.message}
                        </p>
                      ) : (
                        <p className="text-xs text-quantum-subtle flex items-center gap-1.5">
                          <Radio className="size-3" aria-hidden="true" />
                          {t.contact.privacy}
                        </p>
                      )}
                      <span className="font-mono text-[10px] text-quantum-subtle tabular-nums">
                        {watch("message")?.length ?? 0}/2000
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    {/* Honeypot: invisible to humans & screen readers.
                        Bots that fill it are silently dropped. */}
                    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                      <label htmlFor="website">{t.contact.honeypotLabel}</label>
                      <input
                        id="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register("website")}
                      />
                    </div>
                    <p className="font-mono text-[11px] text-quantum-subtle flex items-center gap-2">
                      <Activity className="size-3.5 text-quantum-green" aria-hidden="true" />
                      {t.contact.responseTime}
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-12 rounded-xl bg-quantum-blue px-8 font-heading font-bold text-quantum-navy hover:bg-[#33e1ff] hover:shadow-[0_0_28px_rgba(0,217,255,0.5)] disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          {t.contact.submitting}
                        </>
                      ) : (
                        <>
                          <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                          {t.contact.submit}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </QuantumCard>
        </motion.div>
      </div>
    </section>
  );
}
