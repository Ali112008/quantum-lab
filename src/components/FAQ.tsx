"use client";

import { motion } from "framer-motion";
import { Plus, MessageCircleQuestion, ArrowUpRight, FileDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS, LAB_EMAIL, PROPOSAL_PDF } from "@/lib/data";
import { staggerContainer, quantumVariants, viewport } from "@/lib/animations";

/**
 * SECTION 07 — FAQ ("Measured Answers")
 * Two-column layout: sticky pitch panel + custom-styled accordion.
 * Radix accordion drives the open/close physics; we dress it in quantum.
 */

export default function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32" aria-label="Frequently asked questions">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-blue/30 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* ---- Sticky pitch panel ---- */}
          <motion.div
            variants={quantumVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-quantum-blue">
              <MessageCircleQuestion className="size-4" aria-hidden="true" />
              SECTION 07 — FAQ
            </p>
            <h2 className="font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
              Measured <span className="text-quantum-blue text-glow">Answers</span>
            </h2>
            <p className="mt-4 max-w-md text-quantum-subtle">
              Every funder asks the same eight questions. We&apos;d rather
              collapse the uncertainty here than in a meeting — read on, then
              bring the hard ones.
            </p>

            {/* Ornament card — the guarantee */}
            <div className="mt-8 rounded-2xl border border-quantum-blue/20 bg-quantum-secondary/50 p-6 backdrop-blur-sm">
              <p className="font-mono text-[11px] tracking-[0.25em] text-quantum-blue/80">
                {"<GUARANTEE />"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-quantum-text/90">
                If any answer above feels hand-wavy, email us and we&apos;ll
                send the spreadsheet behind it —{" "}
                <span className="text-quantum-green">quarterly, signed, and open</span>.
              </p>
              <a
                href={`mailto:${LAB_EMAIL}?subject=Question%20about%20the%20%2450K%20seed`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-quantum-blue transition-all hover:gap-2.5 hover:text-quantum-blue"
              >
                Ask a question directly
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <div className="mt-4 border-t border-white/5 pt-4">
                <a
                  href={PROPOSAL_PDF}
                  download="QRL-Lab-Seed-Proposal.pdf"
                  className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-quantum-subtle transition-colors hover:text-quantum-blue"
                >
                  <FileDown className="size-4" aria-hidden="true" />
                  Prefer paper?{" "}
                  <span className="font-semibold text-quantum-text">
                    Download the one-page PDF
                  </span>
                  <span className="font-mono text-[10px] text-quantum-subtle/70">
                    A4 · 276KB
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* ---- Accordion ---- */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport}>
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div key={item.q} variants={quantumVariants}>
                  <AccordionItem
                    value={`item-${i}`}
                    className="group rounded-xl border border-white/8 bg-quantum-secondary/40 px-5 transition-all duration-300 hover:border-quantum-blue/30 hover:bg-quantum-secondary/60 data-[state=open]:border-quantum-blue/40 data-[state=open]:bg-quantum-secondary/70 data-[state=open]:shadow-[0_0_30px_rgba(0,217,255,0.08)]"
                  >
                    <AccordionTrigger className="group/trigger py-5 text-left font-heading text-base font-bold text-white hover:no-underline [&>svg:last-child]:hidden">
                      <span className="flex items-start gap-4">
                        <span
                          className="mt-0.5 font-mono text-xs font-medium tabular-nums text-quantum-blue/70 transition-colors group-data-[state=open]:text-quantum-blue"
                          aria-hidden="true"
                        >
                          Q{i.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[15px] leading-snug md:text-base">{item.q}</span>
                      </span>
                      <span
                        className="ml-2 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-quantum-navy/60 transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-quantum-blue/60 group-data-[state=open]:shadow-[0_0_14px_rgba(0,217,255,0.35)]"
                        aria-hidden="true"
                      >
                        <Plus className="size-3.5 text-quantum-subtle transition-colors group-data-[state=open]:text-quantum-blue" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pl-9 pr-8 text-sm leading-relaxed text-quantum-subtle md:text-[15px]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <p className="mt-6 text-center font-mono text-[11px] tracking-wider text-quantum-subtle/70">
              OBSERVED: {FAQ_ITEMS.length} QUESTIONS · SUPERPOSITION INTACT:{" "}
              <span className="text-quantum-blue">|FAQ⟩ = Σ qᵢ |aᵢ⟩</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
