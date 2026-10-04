"use client";

import { motion } from "framer-motion";
import { TrendingUp, Landmark, FlaskConical } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";
import QuantumCard from "@/components/ui/QuantumCard";
import { YEAR3_OUTCOMES } from "@/lib/data";
import {
  quantumVariants,
  scaleIn,
  staggerContainer,
  fadeInLeft,
  fadeInRight,
  viewport,
} from "@/lib/animations";

/**
 * SECTION 05 — THE SCOREBOARD
 * What Year 3 looks like in numbers (from the pitch deck),
 * plus the "$50K exchange rate" — what the same money buys elsewhere.
 */

const EXCHANGE_RATE = {
  elsewhere: [
    { item: "One mid-size conference sponsorship booth", detail: "and it's gone after 3 days" },
    { item: "0.15% of a new physics building", detail: "with your name on a brick, maybe" },
    { item: "One month of a single consultant", detail: "who leaves, and nothing stays" },
  ],
  here: [
    { item: "A permanent student-run quantum hub", detail: "that compounds for decades" },
    { item: "200 certified quantum-fluent graduates", detail: "the region's first talent pipeline" },
    { item: "5 publications + 3 industry pilots", detail: "assets that attract the next grant" },
  ],
};

export default function Scoreboard() {
  return (
    <section id="scoreboard" className="relative py-24 md:py-32" aria-label="Year three scoreboard">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-amber/25 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="SECTION 05 — THE SCOREBOARD"
          title="Year 3, Measured"
          subtitle="We do not ask you to believe a vision. We ask you to hold us to these numbers — they are the acceptance criteria of your investment."
        />

        {/* Outcome tiles */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
          role="list"
          aria-label="Year 3 target outcomes"
        >
          {YEAR3_OUTCOMES.map((outcome) => (
            <motion.div key={outcome.label} variants={scaleIn} role="listitem">
              <div
                className="group relative h-full rounded-2xl border border-white/8 bg-quantum-secondary/70 p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent"
                style={
                  {
                    "--c": outcome.color,
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                  } as React.CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-[2px] rounded-full opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_14px_var(--c)]"
                  style={{ background: outcome.color }}
                />
                <span style={{ color: outcome.color }}>
                  <Counter
                    value={outcome.value}
                    className="block font-heading text-4xl md:text-5xl font-black tabular-nums"
                  />
                </span>
                <p className="mt-2 text-[11px] md:text-xs leading-snug text-quantum-subtle">
                  {outcome.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* $50K exchange rate comparison */}
        <div className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <QuantumCard accent="#FF6B6B" className="h-full p-7 md:p-8">
              <h3 className="flex items-center gap-2.5 font-heading text-lg font-extrabold text-quantum-red">
                <Landmark className="size-5" aria-hidden="true" />
                WHAT $50K USUALLY BUYS
              </h3>
              <ul className="mt-6 space-y-5">
                {EXCHANGE_RATE.elsewhere.map((row) => (
                  <li key={row.item} className="border-l-2 border-quantum-red/40 pl-4">
                    <p className="text-sm md:text-base font-semibold text-quantum-text/80 line-through decoration-quantum-red/50 decoration-2">
                      {row.item}
                    </p>
                    <p className="mt-0.5 text-xs text-quantum-subtle">{row.detail}</p>
                  </li>
                ))}
              </ul>
            </QuantumCard>
          </motion.div>

          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <QuantumCard accent="#00B894" className="h-full p-7 md:p-8 relative overflow-hidden">
              <span
                aria-hidden="true"
                className="absolute -right-10 -top-10 size-36 rounded-full bg-quantum-green/10 blur-2xl"
              />
              <h3 className="flex items-center gap-2.5 font-heading text-lg font-extrabold text-quantum-green">
                <FlaskConical className="size-5" aria-hidden="true" />
                WHAT $50K BUYS HERE
              </h3>
              <ul className="mt-6 space-y-5">
                {EXCHANGE_RATE.here.map((row) => (
                  <li key={row.item} className="border-l-2 border-quantum-green/60 pl-4">
                    <p className="text-sm md:text-base font-semibold text-white">{row.item}</p>
                    <p className="mt-0.5 text-xs text-quantum-subtle">{row.detail}</p>
                  </li>
                ))}
              </ul>
            </QuantumCard>
          </motion.div>
        </div>

        {/* Ten-year promise */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14"
        >
          <div className="relative overflow-hidden rounded-3xl border border-quantum-green/30 bg-gradient-to-r from-quantum-secondary via-quantum-navy to-quantum-secondary px-6 py-10 md:px-12 text-center">
            <div aria-hidden="true" className="absolute inset-0 grid-lines opacity-40" />
            <motion.div
              aria-hidden="true"
              className="absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-quantum-green/10 to-transparent"
              animate={{ x: ["-20%", "120%"] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative">
              <p className="font-mono text-[11px] md:text-xs tracking-[0.4em] text-quantum-subtle uppercase">
                The ten-year exchange rate · 2026 → 2036
              </p>
              <p className="mt-4 font-heading text-5xl md:text-7xl font-black text-quantum-green text-glow-green">
                $1 <TrendingUp className="mb-2 inline size-8 md:size-12 text-quantum-subtle" aria-hidden="true" /> $100
              </p>
              <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-quantum-subtle">
                Every seed dollar compounds into roughly <span className="text-quantum-text">one hundred dollars</span> of
                created value — skills premium, follow-on grants, and ecosystem effects.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
