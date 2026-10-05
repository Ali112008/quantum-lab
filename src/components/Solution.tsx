"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Cloud, Terminal, Microscope, Award } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import QuantumCard from "@/components/ui/QuantumCard";
import {
  CORE_FEATURES,
  PILLARS,
  STACK_LAYERS,
  TRACK_RECORD,
} from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";
import {
  fadeInRight,
  fadeInLeft,
  staggerContainer,
  scaleIn,
  viewport,
} from "@/lib/animations";

const FEATURE_ICONS = {
  cloud: Cloud,
  terminal: Terminal,
  microscope: Microscope,
} as const;

/**
 * SECTION 02 — THE SOLUTION
 * The Quantum Simulation Lab: features, pillars, live stack,
 * and measured track record. Items slide in from the right.
 */
export default function Solution() {
  const { t, tx } = useLang();

  return (
    <section id="solution" className="relative py-24 md:py-32" aria-label={t.misc.solutionAria}>
      {/* soft separator glow */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-blue/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.solution.eyebrow}
          title={t.solution.title}
          subtitle={t.solution.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Features */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="space-y-5 order-2 lg:order-1"
          >
            {CORE_FEATURES.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <motion.div key={feature.color} variants={fadeInRight}>
                  <QuantumCard accent={feature.color} noReveal className="p-6 md:p-7">
                    <div className="flex items-start gap-5">
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover:shadow-[0_0_24px_var(--accent)]"
                        style={{
                          borderColor: `${feature.color}55`,
                          background: `${feature.color}14`,
                          color: feature.color,
                        }}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-white">
                          {tx(feature.title)}
                        </h3>
                        <p className="mt-1.5 text-sm md:text-[15px] leading-relaxed text-quantum-subtle">
                          {tx(feature.description)}
                        </p>
                      </div>
                    </div>
                  </QuantumCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Hardware image panel */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="order-1 lg:order-2"
          >
            <div className="group relative overflow-hidden rounded-3xl border border-quantum-blue/25 shadow-[0_0_60px_-18px_rgba(0,217,255,0.45)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/quantum-hardware.jpg"
                  alt={t.solution.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-quantum-navy/85 via-transparent to-quantum-navy/20" />
              </div>
              <p className="absolute bottom-4 inset-x-4 text-center font-mono text-[11px] md:text-xs tracking-[0.2em] text-quantum-text/90 uppercase">
                {t.solution.imageCaption}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Three pillars, one lab */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-20 md:mt-28"
        >
          <motion.h3
            variants={scaleIn}
            className="text-center font-heading text-2xl md:text-3xl font-extrabold text-white mb-10"
          >
            {t.solution.pillarsTitle}
          </motion.h3>

          {/* connecting beam */}
          <div aria-hidden="true" className="relative hidden md:block h-px mx-16 mb-[-2px] bg-gradient-to-r from-quantum-blue/50 via-quantum-purple/50 to-quantum-green/50">
            {PILLARS.map((p, i) => (
              <motion.span
                key={p.color}
                className="absolute -top-[3px] size-[7px] rounded-full"
                style={{ left: `${i * 50}%`, background: p.color, boxShadow: `0 0 10px ${p.color}` }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <motion.div key={pillar.color} variants={scaleIn}>
                <QuantumCard accent={pillar.color} noReveal className="p-7 h-full flex flex-col overflow-hidden">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: pillar.color }}
                  />
                  <h4
                    className="font-heading text-xl font-extrabold tracking-wide"
                    style={{ color: pillar.color }}
                  >
                    {tx(pillar.name)}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-quantum-subtle flex-1">
                    {tx(pillar.description)}
                  </p>
                  <p className="mt-5 pt-4 border-t border-white/5 font-mono text-xs tracking-wider" style={{ color: pillar.color }}>
                    {tx(pillar.footnote)}
                  </p>
                </QuantumCard>
              </motion.div>
            ))}
          </div>
          <motion.p
            variants={scaleIn}
            className="mt-6 text-center font-mono text-xs text-quantum-subtle italic"
          >
            {t.solution.pillarsNote}
          </motion.p>
        </motion.div>

        {/* Live stack + track record */}
        <div className="mt-20 md:mt-28 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h3 variants={fadeInLeft} className="font-heading text-xl md:text-2xl font-extrabold text-white mb-6">
              {t.solution.stackTitlePre}
              <span className="text-quantum-blue">{t.solution.stackTitleAccent}</span>
            </motion.h3>
            <div className="space-y-4">
              {STACK_LAYERS.map((layer) => (
                <motion.div key={layer.color} variants={fadeInLeft}>
                  <div className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 rounded-xl border border-white/5 bg-quantum-secondary/60 px-5 py-4 hover:bg-quantum-secondary transition-colors">
                    <span
                      className="font-heading text-sm font-extrabold tracking-[0.15em] sm:min-w-[130px]"
                      style={{ color: layer.color }}
                    >
                      {tx(layer.name)}
                    </span>
                    <span className="font-mono text-[13px] text-quantum-subtle group-hover:text-quantum-text transition-colors">
                      {tx(layer.detail)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.p variants={fadeInLeft} className="mt-5 font-mono text-xs text-quantum-subtle">
              {t.solution.stackNote}
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h3 variants={fadeInRight} className="font-heading text-xl md:text-2xl font-extrabold text-white mb-6">
              {t.solution.resultsTitlePre}
              <span className="text-quantum-green">{t.solution.resultsTitleAccent}</span>
            </motion.h3>
            <ul className="space-y-3.5">
              {TRACK_RECORD.map((tr) => (
                <motion.li key={tr.title.en} variants={fadeInRight}>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-quantum-secondary/60 px-5 py-3.5 hover:border-quantum-green/30 transition-colors">
                    <div>
                      <p className="font-semibold text-sm md:text-base text-white">{tx(tr.title)}</p>
                      <p className="text-xs text-quantum-subtle">{tr.year}</p>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-xs md:text-sm font-semibold shrink-0"
                      style={{ color: tr.color }}
                    >
                      <Award className="size-3.5" aria-hidden="true" />
                      {tx(tr.result)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
