"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Atom,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Handshake,
  FileText,
  Eye,
  FileDown,
  Send,
  Loader2,
  Waves,
} from "lucide-react";
import { LAB_EMAIL, PROPOSAL_PDFS } from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { quantumVariants, staggerContainer, scaleIn, viewport } from "@/lib/animations";

/** Partnership terms from the closing slide of the deck */
const SOCIALS = [
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
  { href: "https://twitter.com", label: "Twitter / X", Icon: Twitter },
  { href: "https://github.com", label: "GitHub", Icon: Github },
];

/**
 * Newsletter — "Stay Entangled". One email per month, no noise.
 * POSTs to /api/subscribe (Prisma + SQLite, honeypot + rate-limited).
 */
function NewsletterForm() {
  const { t } = useLang();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTotal = () =>
    fetch("/api/subscribe")
      .then((r) => r.json())
      .then((d: { ok: boolean; total?: number }) => {
        if (d.ok && typeof d.total === "number") setTotal(d.total);
      })
      .catch(() => {
        /* counter stays in superposition */
      });

  useEffect(() => {
    void fetchTotal();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot }),
      });
      const data: { ok: boolean; duplicate?: boolean; error?: string } =
        await res.json();

      if (data.duplicate) {
        toast({
          title: t.newsletter.toastDupTitle,
          description: t.newsletter.toastDupDesc,
        });
      } else if (!res.ok || !data.ok) {
        throw new Error(data.error ?? t.newsletter.toastErrorTitle);
      } else {
        toast({
          title: t.newsletter.toastTitle,
          description: t.newsletter.toastDesc,
        });
        setEmail("");
        void fetchTotal();
      }
    } catch {
      toast({
        title: t.newsletter.toastErrorTitle,
        description: t.newsletter.zodEmail,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-quantum-purple/25 bg-quantum-secondary/50 p-6 backdrop-blur-sm">
      <p className="flex items-center justify-center gap-2 font-heading text-base font-extrabold text-white">
        <Waves className="size-4 text-quantum-purple" aria-hidden="true" />
        {t.newsletter.title}
      </p>
      <p className="mt-1.5 text-center text-sm text-quantum-subtle">
        {t.newsletter.subtitle}
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2" noValidate>
        {/* Honeypot — invisible to humans */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="nl-website">{t.newsletter.honeypotLabel}</label>
          <input
            id="nl-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <Input
          type="email"
          dir="ltr"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletter.emailPh}
          aria-label={t.newsletter.emailPh}
          className="h-11 bg-quantum-navy/70 border-white/10 focus-visible:ring-quantum-purple/60"
        />
        <Button
          type="submit"
          disabled={submitting || email.trim().length === 0}
          className="h-11 shrink-0 rounded-xl bg-quantum-purple px-5 font-heading font-bold text-white hover:bg-quantum-purple/85 hover:shadow-[0_0_24px_rgba(108,92,231,0.5)] disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              <span className="hidden sm:inline">{t.newsletter.submit}</span>
            </>
          )}
        </Button>
      </form>
      {total !== null && (
        <motion.p
          key={total}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center font-mono text-[10px] tracking-widest text-quantum-subtle uppercase"
        >
          {t.newsletter.count(total)}
        </motion.p>
      )}
    </div>
  );
}

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer id="footer" className="relative mt-auto border-t border-quantum-blue/10" aria-label={t.misc.footerAria}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-blue/40 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(0,217,255,0.07),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* CTA */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center"
        >
          <motion.h2
            variants={scaleIn}
            className="font-heading text-3xl md:text-5xl font-black text-white"
          >
            {t.footer.ctaPre}
            <span className="bg-gradient-to-r from-quantum-blue to-quantum-purple bg-clip-text text-transparent text-glow-cyan">
              {t.footer.ctaAccent}
            </span>
          </motion.h2>
          <motion.p
            variants={scaleIn}
            className="mx-auto mt-4 max-w-xl text-quantum-subtle"
          >
            {t.footer.sub}
          </motion.p>

          <motion.div variants={scaleIn} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={`mailto:${LAB_EMAIL}?subject=Seed%20Funding%20—%20Quantum%20Research%20Lab`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-quantum-blue px-7 py-4 font-heading font-bold text-quantum-navy transition-colors hover:bg-[#33e1ff]"
            >
              <Mail className="size-4" aria-hidden="true" />
              {LAB_EMAIL}
            </motion.a>
            <motion.a
              href="#budget"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl border border-quantum-blue/40 bg-quantum-secondary/60 px-7 py-4 font-heading font-bold text-white transition-all hover:border-quantum-blue hover:shadow-[0_0_26px_rgba(0,217,255,0.35)]"
            >
              <Handshake className="size-4" aria-hidden="true" />
              {t.footer.reviewTerms}
            </motion.a>
            <motion.a
              href={PROPOSAL_PDFS[lang].href}
              download={PROPOSAL_PDFS[lang].download}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              aria-label={t.footer.onePagerAria}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-7 py-4 font-heading font-bold text-quantum-subtle transition-all hover:text-quantum-blue hover:border-quantum-blue/50"
            >
              <FileDown className="size-4" aria-hidden="true" />
              {t.footer.onePager}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <NewsletterForm />
        </motion.div>

        {/* Partnership terms */}
        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2"
          aria-label={t.footer.termsAria}
        >
          {t.footer.terms.map((term, i) => (
            <motion.li
              key={term}
              variants={scaleIn}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-quantum-secondary/60 px-4 py-3"
            >
              <span className="font-mono text-xs text-quantum-blue">0{i + 1}</span>
              <span className="text-sm text-quantum-text/90">{term}</span>
            </motion.li>
          ))}
        </motion.ol>

        {/* Middle row: brand + transparency strip + socials */}
        <div className="mt-14 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-10">
          {/* University logo placeholder */}
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full border border-quantum-blue/40 bg-quantum-secondary">
              <Atom className="size-6 text-quantum-blue" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading font-bold text-white text-sm leading-tight">
                {t.footer.brand}
              </p>
              <p className="font-mono text-[10px] tracking-[0.25em] text-quantum-subtle uppercase">
                {t.footer.dept}
              </p>
            </div>
          </div>

          {/* transparency strip */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-quantum-subtle" aria-label={t.footer.transparencyAria}>
            {t.footer.transparency.map((item, i) => (
              <li key={item} className="flex items-center gap-1.5">
                {i === 0 && <FileText className="size-3.5 text-quantum-green" aria-hidden="true" />}
                {i === 1 && <Eye className="size-3.5 text-quantum-green" aria-hidden="true" />}
                {i === 2 && <Handshake className="size-3.5 text-quantum-green" aria-hidden="true" />}
                {item}
              </li>
            ))}
          </ul>

          {/* socials */}
          <ul className="flex items-center gap-3" aria-label={t.footer.socialsLabel}>
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.footer.socialAria(label)}
                  whileHover={{ y: -3, scale: 1.08 }}
                  className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-quantum-secondary/70 text-quantum-subtle transition-colors hover:text-quantum-blue hover:border-quantum-blue/50 hover:shadow-[0_0_18px_rgba(0,217,255,0.35)]"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </motion.a>
              </li>
            ))}
          </ul>
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[11px] text-quantum-subtle">
          <p>{t.footer.copyright}</p>
          <p>
            {t.footer.madeWith}
            <span className="text-quantum-blue">{t.footer.madeAccent}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
