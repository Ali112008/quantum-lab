"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { HandCoins, Info, Sparkles, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BUDGET_CATEGORIES,
  BUDGET_ITEMS,
  BUDGET_SCENARIOS,
  TOTAL_SEED,
  calculateROI,
} from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";
import { quantumVariants, viewport, staggerContainer, scaleIn } from "@/lib/animations";

/** Spring-driven dollar readout — updates without re-rendering React trees */
function AnimatedDollars({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 90, damping: 22 });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) =>
    `$${Math.round(v).toLocaleString("en-US")}`
  );
  return <motion.span className={className}>{text}</motion.span>;
}

const STEP = 500;

export default function BudgetCalculator() {
  const { t, tx } = useLang();
  const [amount, setAmount] = useState(TOTAL_SEED);
  const funded = amount / TOTAL_SEED;
  const roi = useMemo(() => calculateROI(amount), [amount]);

  /* Donut geometry: each slice covers its fixed share of the *funded* fraction
     of the full $50K ring — at $25K the ring is half-illuminated. */
  const R = 84;
  const CIRC = 2 * Math.PI * R;
  const segments = useMemo(() => {
    // cumulative arc length per category (functional, no reassignment)
    const arcs = BUDGET_CATEGORIES.map((cat) => cat.percent * funded * CIRC);
    return BUDGET_CATEGORIES.map((cat, i) => ({
      ...cat,
      len: Math.max(arcs[i] - 2.5, 0.01),
      offset: -arcs.slice(0, i).reduce((sum, arc) => sum + arc, 0),
    }));
  }, [funded]);

  const perStudent = Math.round(amount / 200);
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <section id="budget" className="relative py-24 md:py-32" aria-label={t.misc.budgetAria}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-green/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_20%,rgba(0,184,148,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- The Ask strip ---- */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-mono text-[11px] md:text-xs tracking-[0.4em] text-quantum-subtle uppercase mb-4">
            {t.budget.askEyebrow}
          </p>
          <p className="font-heading text-6xl md:text-8xl font-black text-quantum-green text-glow-green tabular-nums" dir="ltr">
            $50,000
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {t.budget.askChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-quantum-blue/30 bg-quantum-secondary/70 px-4 py-2 text-sm text-quantum-text"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm md:text-base text-quantum-subtle italic">
            {t.budget.askNote}
          </p>
        </motion.div>

        <SectionHeading
          eyebrow={t.budget.eyebrow}
          title={t.budget.title}
          subtitle={t.budget.subtitle}
        />

        {/* ---- Calculator ---- */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="glass-panel rounded-3xl p-6 md:p-10"
        >
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
            {/* Donut */}
            <div className="relative mx-auto w-fit">
              <svg
                viewBox="0 0 220 220"
                className="size-64 md:size-80 -rotate-90"
                role="img"
                aria-label={t.budget.donutAria(Math.round(funded * 100))}
              >
                {/* ghost ring = unfunded share */}
                <circle
                  cx="110" cy="110" r={R}
                  fill="none"
                  stroke="#1D3357"
                  strokeWidth="26"
                />
                {segments.map((seg) => (
                  <motion.circle
                    key={seg.id}
                    cx="110" cy="110" r={R}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="26"
                    strokeLinecap="butt"
                    strokeDashoffset={seg.offset}
                    animate={{ strokeDasharray: `${seg.len} ${CIRC - seg.len}` }}
                    transition={{ type: "spring", stiffness: 60, damping: 18 }}
                    style={{ filter: `drop-shadow(0 0 6px ${seg.color}88)` }}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center rotate-0">
                <AnimatedDollars
                  value={amount}
                  className="font-heading text-3xl md:text-4xl font-black text-white tabular-nums"
                />
                <p className="mt-1 font-mono text-[10px] md:text-[11px] tracking-widest text-quantum-subtle uppercase">
                  {t.budget.perStudent(`$${perStudent.toLocaleString("en-US")}`)}
                </p>
                <p className="mt-1 text-xs font-semibold" style={{ color: funded >= 1 ? "#00B894" : "#00D9FF" }}>
                  {t.budget.pctOfLab(Math.round(funded * 100))}
                </p>
              </div>
            </div>

            {/* Legend + slider */}
            <div>
              <ul className="space-y-1.5" aria-label={tx({ en: "Budget allocation by category", ar: "توزيع الميزانية حسب الفئة" })}>
                {BUDGET_CATEGORIES.map((cat) => {
                  const catAmount = Math.round(cat.percent * amount);
                  return (
                    <li key={cat.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start hover:bg-white/5 focus-visible:bg-white/5 outline-none transition-colors"
                            aria-label={t.budget.legendAria(
                              tx(cat.label),
                              Math.round(cat.percent * 100),
                              fmt(catAmount),
                              tx(cat.description)
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-125"
                              style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }}
                            />
                            <span className="flex-1 text-sm text-quantum-text/90 group-hover:text-white transition-colors">
                              {tx(cat.label)}
                            </span>
                            <span className="font-mono text-xs text-quantum-subtle tabular-nums">
                              {Math.round(cat.percent * 100)}%
                            </span>
                            <span className="w-20 text-end font-mono text-sm font-semibold text-white tabular-nums" dir="ltr">
                              {fmt(catAmount)}
                            </span>
                            <Info className="size-3.5 text-quantum-subtle/60 group-hover:text-quantum-blue transition-colors" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-60 bg-quantum-light text-quantum-text border border-quantum-blue/30">
                          {tx(cat.description)}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>

              {/* slider */}
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between font-mono text-[11px] tracking-widest text-quantum-subtle uppercase">
                  <span dir="ltr">$0</span>
                  <label htmlFor="budget-slider" className="text-quantum-blue">
                    {t.budget.sliderLabel}
                  </label>
                  <span dir="ltr">${(TOTAL_SEED / 1000).toFixed(0)}K</span>
                </div>
                <Slider
                  id="budget-slider"
                  aria-label={tx({ en: "Total seed funding amount in US dollars", ar: "إجمالي مبلغ التمويل التأسيسي بالدولار" })}
                  value={[amount]}
                  onValueChange={(v) => setAmount(v[0] ?? amount)}
                  min={0}
                  max={TOTAL_SEED}
                  step={STEP}
                  className="[&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-quantum-blue [&_[data-slot=slider-range]]:to-quantum-green [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-quantum-blue [&_[data-slot=slider-thumb]]:shadow-[0_0_14px_rgba(0,217,255,0.7)]"
                />
                <p className="mt-2.5 text-xs text-quantum-subtle">
                  {t.budget.sliderHint(`$${STEP.toLocaleString("en-US")}`)}
                </p>
              </div>
            </div>
          </div>

          {/* ---- Scenarios ---- */}
          <div className="mt-10 border-t border-white/5 pt-8">
            <p className="mb-4 flex items-center gap-2 font-heading text-sm font-bold tracking-wide text-white">
              <Sparkles className="size-4 text-quantum-amber" aria-hidden="true" />
              {t.budget.scenariosTitle}
            </p>
            <div className="flex flex-wrap gap-2.5" role="group" aria-label={t.budget.scenariosAria}>
              {BUDGET_SCENARIOS.map((s) => {
                const activeScenario = amount === s.amount;
                return (
                  <motion.button
                    key={s.amount}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(s.amount)}
                    aria-pressed={activeScenario}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      activeScenario
                        ? "border-quantum-blue bg-quantum-blue/15 text-quantum-blue shadow-[0_0_20px_rgba(0,217,255,0.35)]"
                        : "border-white/10 bg-quantum-secondary/60 text-quantum-subtle hover:text-white hover:border-quantum-blue/40"
                    }`}
                  >
                    {t.budget.scenarioBtn(`$${(s.amount / 1000).toFixed(0)}K`, tx(s.title))}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={roi.studentsTrained}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-4 text-sm md:text-base text-quantum-text/90"
              >
                <span className="text-quantum-green font-semibold" dir="ltr">
                  {t.budget.outcomeWith(fmt(Math.round(amount / 500) * 500))}
                </span>
                {amount === 0
                  ? t.budget.outcomeZero
                  : t.budget.outcomeBody(roi)}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ---- ROI projection ---- */}
          <div className="mt-10 border-t border-white/5 pt-8">
            <p className="mb-5 flex items-center gap-2 font-heading text-sm font-bold tracking-wide text-white">
              <TrendingUp className="size-4 text-quantum-green" aria-hidden="true" />
              {t.budget.roiTitle}
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {t.budget.roiLabels.map((label, i) => {
                const values = [
                  roi.studentsTrained,
                  roi.projectsCompleted,
                  roi.publications,
                  roi.industryPartners,
                  roi.hackathons,
                ];
                return (
                  <motion.div
                    key={label}
                    variants={scaleIn}
                    className="rounded-xl border border-white/5 bg-quantum-navy/70 p-4 text-center"
                  >
                    <Counter
                      value={values[i] ?? 0}
                      className="font-heading text-2xl md:text-3xl font-extrabold text-quantum-blue tabular-nums"
                    />
                    <p className="mt-1 text-[11px] md:text-xs text-quantum-subtle leading-tight">{label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
            <p className="mt-5 text-center font-mono text-xs md:text-sm text-quantum-subtle">
              <span className="text-quantum-green font-bold">{t.budget.promise}</span>
              {t.budget.promiseDetail}
              <span className="block md:inline">{t.budget.promiseDetail2}</span>
            </p>
          </div>
        </motion.div>

        {/* ---- Itemized & audit-ready ---- */}
        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-14"
        >
          <h3 className="font-heading text-xl md:text-2xl font-extrabold text-white mb-1">
            {t.budget.itemizedTitlePre}
            <span className="text-quantum-blue">{t.budget.itemizedTitleAccent}</span>
          </h3>
          <p className="text-sm text-quantum-subtle mb-6">
            {t.budget.itemizedSub}
          </p>
          <div className="overflow-x-auto thin-scroll rounded-2xl border border-white/5 bg-quantum-secondary/60">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">
                {t.budget.tableCaption}
              </caption>
              <thead>
                <tr className="border-b border-quantum-blue/15 text-start font-mono text-[11px] tracking-[0.25em] text-quantum-subtle uppercase">
                  <th scope="col" className="px-6 py-4 text-start">{t.budget.colResource}</th>
                  <th scope="col" className="px-6 py-4 text-end">{t.budget.colQty}</th>
                  <th scope="col" className="px-6 py-4 text-end">{t.budget.colCost}</th>
                  <th scope="col" className="px-4 py-4 text-center">{t.budget.fundCol}</th>
                </tr>
              </thead>
              <tbody>
                {BUDGET_ITEMS.map((item, i) => (
                  <tr
                    key={item.resource.en}
                    className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${
                      i % 2 === 1 ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    <th scope="row" className="px-6 py-3.5 text-start font-medium text-quantum-text/90">
                      {tx(item.resource)}
                    </th>
                    <td className="px-6 py-3.5 text-end font-mono text-xs text-quantum-subtle">{tx(item.qty)}</td>
                    <td className="px-6 py-3.5 text-end font-mono text-quantum-text tabular-nums" dir="ltr">
                      {fmt(item.cost)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {/* Adopt-a-line: every audited item scrolls the funder
                          straight to the pledge-intent tube — the transparency
                          table doubles as a funding menu, with zero email. */}
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("funding-tube")
                            ?.scrollIntoView({ behavior: "smooth", block: "center" })
                        }
                        aria-label={t.budget.fundAria(tx(item.resource), fmt(item.cost))}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-quantum-green/30 bg-quantum-green/5 text-quantum-green/75 opacity-70 transition-all hover:opacity-100 hover:shadow-[0_0_16px_rgba(0,184,148,0.4)] hover:border-quantum-green/60 focus-visible:opacity-100"
                      >
                        <HandCoins className="size-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-t-2 border-quantum-blue/30 bg-quantum-navy/60">
                  <th scope="row" className="px-6 py-4 text-start font-heading font-extrabold tracking-wide text-white">
                    {t.budget.totalSeed}
                  </th>
                  <td />
                  <td className="px-6 py-4 text-end font-heading text-xl font-black text-quantum-green text-glow-green tabular-nums" dir="ltr">
                    $50,000
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center font-heading text-sm md:text-base font-bold text-quantum-blue">
            {t.budget.closing}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
