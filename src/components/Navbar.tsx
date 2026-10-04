"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Atom, Menu, X, ArrowUpRight, FileDown, Languages } from "lucide-react";
import { NAV_LINKS, PROPOSAL_PDFS } from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";

/**
 * Sticky navbar with a scroll-progress beam (the "measurement" bar),
 * scroll-spy active link, smooth-scroll anchors, an EN⇄AR language toggle,
 * and a mobile sheet menu.
 */

/** Section ids the scroll-spy watches (mirrors the nav anchors). */
const SPY_IDS = NAV_LINKS.map((link) => link.href.replace("#", ""));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const { t, tx, lang, toggle } = useLang();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Scroll-spy: the section whose top passed the 40% viewport line wins.
      const probe = window.scrollY + window.innerHeight * 0.4;
      let current = "";
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = `#${id}`;
      }
      setActiveHref(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const langLabel = lang === "en" ? "عربي" : "EN";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-quantum-navy/85 backdrop-blur-md border-b border-quantum-blue/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Scroll progress beam — flips origin with reading direction */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left rtl:origin-right bg-gradient-to-r from-quantum-blue via-quantum-purple to-quantum-green"
      />

      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
      >
        {/* Brand */}
        <a
          href="#top"
          className="flex items-center gap-2.5 group"
          aria-label="Quantum Research Lab — back to top"
        >
          <span className="relative flex items-center justify-center size-9 rounded-full border border-quantum-blue/40 bg-quantum-secondary/80">
            <Atom
              className="size-5 text-quantum-blue group-hover:animate-spin-slow transition-transform"
              aria-hidden="true"
            />
          </span>
          <span className="font-heading font-bold tracking-wide text-white">
            QRL<span className="text-quantum-blue">·</span>Lab
          </span>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.3em] text-quantum-subtle uppercase">
            {t.nav.brandTag}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = activeHref === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={`relative px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "text-quantum-blue bg-quantum-secondary/70"
                      : "text-quantum-subtle hover:text-quantum-blue hover:bg-quantum-secondary/60"
                  }`}
                >
                  {tx(link.label)}
                  {/* active measurement beam */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-quantum-blue shadow-[0_0_8px_#00D9FF] transition-all duration-300 ${
                      active ? "opacity-100" : "opacity-0 scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
          <li className="ms-2 flex items-center gap-2">
            {/* EN ⇄ AR language toggle */}
            <button
              type="button"
              onClick={toggle}
              aria-label={t.nav.langToggleAria}
              title={t.nav.langToggleAria}
              className="inline-flex items-center gap-1.5 rounded-lg border border-quantum-purple/40 px-2.5 h-9 font-heading text-xs font-bold text-quantum-purple hover:bg-quantum-purple/15 hover:text-white hover:border-quantum-purple transition-all"
            >
              <Languages className="size-4" aria-hidden="true" />
              <span
                className={lang === "en" ? "[font-family:var(--font-cairo)]" : ""}
              >
                {langLabel}
              </span>
            </button>
            <a
              href={PROPOSAL_PDFS[lang].href}
              download={PROPOSAL_PDFS[lang].download}
              aria-label={t.nav.downloadPdfAria}
              title={t.nav.downloadPdfAria}
              className="inline-flex items-center justify-center size-9 rounded-lg border border-quantum-blue/30 text-quantum-blue hover:bg-quantum-blue/10 hover:border-quantum-blue/60 transition-all"
            >
              <FileDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#budget"
              className="inline-flex items-center gap-1.5 rounded-lg bg-quantum-blue px-4 py-2 text-sm font-semibold text-quantum-navy hover:bg-quantum-blue/85 hover:shadow-[0_0_24px_rgba(0,217,255,0.45)] transition-all"
            >
              {t.nav.cta}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          className="md:hidden inline-flex items-center justify-center size-11 rounded-lg border border-quantum-blue/20 text-quantum-blue hover:bg-quantum-secondary/60"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-quantum-navy/[0.98] backdrop-blur-xl border-b border-quantum-blue/10 shadow-[0_24px_48px_-12px_rgba(0,217,255,0.12)]"
          >
            <ul className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      activeHref === link.href
                        ? "bg-quantum-secondary text-quantum-blue"
                        : "text-quantum-text hover:bg-quantum-secondary hover:text-quantum-blue"
                    }`}
                  >
                    {tx(link.label)}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#budget"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-quantum-blue px-4 py-3 font-semibold text-quantum-navy"
                >
                  {t.nav.cta}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={PROPOSAL_PDFS[lang].href}
                  download={PROPOSAL_PDFS[lang].download}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-quantum-blue/30 px-4 py-3 font-medium text-quantum-blue hover:bg-quantum-blue/10 transition-colors"
                >
                  <FileDown className="size-4" aria-hidden="true" />
                  {t.nav.proposalPdfLabel}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    toggle();
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-quantum-purple/40 px-4 py-3 font-semibold text-quantum-purple hover:bg-quantum-purple/15 transition-colors"
                >
                  <Languages className="size-4" aria-hidden="true" />
                  {langLabel}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
