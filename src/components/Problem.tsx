"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import QuantumCard from "@/components/ui/QuantumCard";
import Counter from "@/components/ui/Counter";
import { FUNNEL_STAGES } from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";
import {
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewport,
} from "@/lib/animations";

/**
 * SECTION 01 — THE PROBLEM
 * The talent funnel: 10,000 STEM students in, 4 quantum careers out.
 * Bars animate in sequence; counters tick up on view.
 */
export default function Problem() {
  const { t, tx } = useLang();

  return (
    <section id="problem" className="relative py-24 md:py-32" aria-label={t.misc.problemAria}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.problem.eyebrow}
          title={t.problem.title}
          subtitle={t.problem.subtitle}
        />

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-start">
          {/* Funnel — slides in from the reading-direction start */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-4"
            role="list"
            aria-label={t.problem.funnelAria}
          >
            {FUNNEL_STAGES.map((stage, i) => (
              <motion.div
                key={stage.width}
                variants={fadeInLeft}
                role="listitem"
                className="relative"
              >
                <div
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-quantum-secondary/60 px-5 py-4 md:px-6 md:py-5 transition-transform duration-300 hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                  style={{ width: `${stage.width}%`, minWidth: "240px" }}
                >
                  {/* colored wash */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity"
                    style={{ background: `linear-gradient(90deg, ${stage.color}55, transparent 70%)` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute start-0 inset-y-0 w-1"
                    style={{ background: stage.color, boxShadow: `0 0 14px ${stage.color}` }}
                  />
                  <div className="relative flex items-baseline gap-3 flex-wrap">
                    <span
                      className="font-heading text-2xl md:text-3xl font-extrabold text-white tabular-nums"
                      style={{ textShadow: `0 0 18px ${stage.color}66` }}
                    >
                      <Counter value={stage.value} duration={1.6 + i * 0.15} />
                    </span>
                    <span className="text-sm md:text-base text-quantum-subtle">
                      {tx(stage.label)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.p
              variants={fadeInLeft}
              className="pt-4 font-heading text-xl md:text-2xl font-bold text-white"
            >
              {t.problem.punchPre}
              <span className="text-quantum-red">{t.problem.punchAccent}</span>
            </motion.p>
          </motion.div>

          {/* Side rail — stats + definition card */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-5"
          >
            <motion.div variants={fadeInRight}>
              <QuantumCard accent="#FFD166" noReveal className="p-6">
                <p className="font-mono text-[11px] tracking-[0.3em] text-quantum-amber uppercase mb-3">
                  {t.problem.decoTerm}
                </p>
                <p className="text-quantum-subtle leading-relaxed">
                  {t.problem.decoBody}
                </p>
              </QuantumCard>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <QuantumCard accent="#00D9FF" noReveal className="p-6">
                <div className="flex items-baseline gap-2">
                  <Counter
                    value={300}
                    suffix="%"
                    className="font-heading text-4xl md:text-5xl font-extrabold text-quantum-blue text-glow-cyan tabular-nums"
                  />
                </div>
                <p className="mt-2 text-sm text-quantum-subtle">
                  {t.problem.stat300}
                </p>
              </QuantumCard>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <QuantumCard accent="#FF6B6B" noReveal className="p-6">
                <p className="font-heading text-4xl md:text-5xl font-extrabold text-quantum-red">
                  0
                </p>
                <p className="mt-2 text-sm text-quantum-subtle">
                  {t.problem.stat0}
                </p>
              </QuantumCard>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <QuantumCard accent="#6C5CE7" noReveal className="p-6">
                <p className="font-heading text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-quantum-blue to-quantum-purple bg-clip-text text-transparent">
                  2<sup className="text-xl md:text-2xl">300</sup>
                </p>
                <p className="mt-2 text-sm text-quantum-subtle">
                  {t.problem.stat2300}
                  <span className="text-quantum-text">{t.problem.stat2300Accent}</span>
                </p>
              </QuantumCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
