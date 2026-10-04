"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Zap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { PHASES } from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";
import { quantumVariants, viewport, staggerContainer, fadeInLeft } from "@/lib/animations";

/**
 * SECTION 03 — THE CIRCUIT
 * Three-phase implementation plan as an interactive timeline.
 * Phases expand/collapse with AnimatePresence; the progress beam
 * fills toward the active phase like a state measurement.
 */
export default function Methodology() {
  const [active, setActive] = useState<number>(1);
  const { t, tx } = useLang();

  return (
    <section id="methodology" className="relative py-24 md:py-32" aria-label={t.misc.methodologyAria}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-purple/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.methodology.eyebrow}
          title={t.methodology.title}
          subtitle={t.methodology.subtitle}
        />

        {/* timeline rail */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative mb-12"
          aria-hidden="true"
        >
          <div className="absolute left-6 md:left-1/2 top-1/2 -translate-y-1/2 h-1 w-[calc(100%-3rem)] md:w-[calc(100%-16rem)] md:translate-x-0 md:left-32 md:right-32 rounded-full bg-quantum-light/60" />
          <motion.div
            className="absolute left-6 md:left-32 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gradient-to-r from-quantum-blue via-quantum-purple to-quantum-green"
            initial={{ width: 0 }}
            animate={{ width: `${((active - 1) / (PHASES.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
          <ol className="relative flex justify-between px-1 md:px-32">
            {PHASES.map((phase) => {
              const isActive = active === phase.id;
              return (
                <li key={phase.id} className="flex flex-col items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={() => setActive(phase.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={t.methodology.phaseAria(phase.id, tx(phase.name))}
                    className={`relative z-10 flex size-12 md:size-14 items-center justify-center rounded-full border-2 font-heading font-extrabold transition-all ${
                      isActive
                        ? "bg-quantum-navy text-white animate-pulse-glow"
                        : "bg-quantum-secondary text-quantum-subtle hover:text-white"
                    }`}
                    style={{ borderColor: phase.color }}
                  >
                    <Zap className="size-5" style={{ color: phase.color }} aria-hidden="true" />
                    <span className="sr-only">{tx(phase.name)}</span>
                  </motion.button>
                  <span
                    className={`font-mono text-[10px] md:text-xs tracking-widest transition-colors ${
                      isActive ? "text-white" : "text-quantum-subtle"
                    }`}
                  >
                    {tx(phase.monthsShort)}
                  </span>
                </li>
              );
            })}
          </ol>
        </motion.div>

        {/* phase cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-6 lg:grid-cols-3"
        >
          {PHASES.map((phase) => {
            const isOpen = active === phase.id;
            return (
              <motion.article
                key={phase.id}
                variants={fadeInLeft}
                className={`relative rounded-2xl border bg-quantum-secondary/70 backdrop-blur-sm transition-all duration-300 ${
                  isOpen
                    ? "border-transparent shadow-[0_0_0_1px_var(--pc),0_18px_60px_-16px_var(--pc)]"
                    : "border-white/5 hover:border-white/15"
                }`}
                style={{ "--pc": phase.color } as React.CSSProperties}
                aria-expanded={isOpen}
              >
                {/* accent top */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl" style={{ background: phase.color }} />

                <button
                  type="button"
                  onClick={() => setActive(phase.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 pt-6 pb-4 text-start"
                  aria-controls={`phase-panel-${phase.id}`}
                >
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: phase.color }}>
                      {t.methodology.phaseBraKet(phase.id)} · {tx(phase.months)}
                    </p>
                    <h3 className="mt-2 font-heading text-xl md:text-2xl font-extrabold text-white">
                      {tx(phase.name)}
                      <span className="block text-sm font-semibold text-quantum-subtle mt-0.5">
                        {tx(phase.title)}
                      </span>
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-quantum-subtle"
                  >
                    <ChevronDown className="size-5" aria-hidden="true" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`phase-panel-${phase.id}`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-sm italic text-quantum-subtle border-s-2 ps-3" style={{ borderColor: phase.color }}>
                          {tx(phase.tagline)}
                        </p>

                        <ul className="mt-4 space-y-2.5" aria-label={t.methodology.activitiesAria(phase.id)}>
                          {phase.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-quantum-text/90">
                              <Check
                                className="mt-0.5 size-4 shrink-0 rtl:-scale-x-100"
                                style={{ color: phase.color }}
                                aria-hidden="true"
                              />
                              {tx(activity)}
                            </li>
                          ))}
                        </ul>

                        {/* exit criteria */}
                        <div className="mt-5 rounded-xl border border-white/5 bg-quantum-navy/60 p-4">
                          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-quantum-subtle mb-3">
                            {t.methodology.exitCriteria(phase.id)}
                          </p>
                          <div className="flex gap-6">
                            {phase.milestones.map((m, i) => (
                              <div key={i}>
                                <p className="font-heading text-2xl font-extrabold" style={{ color: phase.color }}>
                                  {m.value}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-tight text-quantum-subtle max-w-[110px]">
                                  {tx(m.label)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* collapsed summary */}
                {!isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-quantum-subtle line-clamp-2">{tx(phase.tagline)}</p>
                    <div className="mt-3 flex gap-5">
                      {phase.milestones.map((m, i) => (
                        <p key={i} className="text-xs text-quantum-subtle">
                          <span className="font-heading font-bold text-white">{m.value}</span>{" "}
                          {tx(m.label)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </motion.div>

        <motion.p
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 text-center font-mono text-xs md:text-sm text-quantum-subtle italic"
        >
          {t.methodology.quote}
        </motion.p>
      </div>
    </section>
  );
}
