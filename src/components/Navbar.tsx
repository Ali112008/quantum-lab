"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Atom, Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

/**
 * Sticky navbar with a scroll-progress beam (the "measurement" bar),
 * smooth-scroll anchors, and a mobile sheet menu.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-quantum-navy/85 backdrop-blur-md border-b border-quantum-blue/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Scroll progress beam */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-quantum-blue via-quantum-purple to-quantum-green"
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
            Seed Pitch 2026
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm text-quantum-subtle hover:text-quantum-blue hover:bg-quantum-secondary/60 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a
              href="#budget"
              className="inline-flex items-center gap-1.5 rounded-lg bg-quantum-blue px-4 py-2 text-sm font-semibold text-quantum-navy hover:bg-quantum-blue/85 hover:shadow-[0_0_24px_rgba(0,217,255,0.45)] transition-all"
            >
              Fund the Future
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
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
            className="md:hidden overflow-hidden bg-quantum-navy/95 backdrop-blur-md border-b border-quantum-blue/10"
          >
            <ul className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-quantum-text hover:bg-quantum-secondary hover:text-quantum-blue transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#budget"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-quantum-blue px-4 py-3 font-semibold text-quantum-navy"
                >
                  Fund the Future
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
