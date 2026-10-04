"use client";

import { motion } from "framer-motion";
import { Atom, Linkedin, Twitter, Github, Mail, Handshake, FileText, Eye, FileDown } from "lucide-react";
import { LAB_EMAIL, PROPOSAL_PDF } from "@/lib/data";
import { quantumVariants, staggerContainer, scaleIn, viewport } from "@/lib/animations";

/** Partnership terms from the closing slide of the deck */
const PARTNERSHIP_TERMS = [
  { term: "$50,000 — seed investment" },
  { term: "3-year partnership — quarterly transparency reports" },
  { term: "Co-branded outcomes — lab naming rights" },
  { term: "First-look — at graduating quantum talent" },
];

const SOCIALS = [
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
  { href: "https://twitter.com", label: "Twitter / X", Icon: Twitter },
  { href: "https://github.com", label: "GitHub", Icon: Github },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative mt-auto border-t border-quantum-blue/10" aria-label="Contact and partnership">
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
            Join the{" "}
            <span className="bg-gradient-to-r from-quantum-blue to-quantum-purple bg-clip-text text-transparent text-glow-cyan">
              Quantum Revolution
            </span>
          </motion.h2>
          <motion.p
            variants={scaleIn}
            className="mx-auto mt-4 max-w-xl text-quantum-subtle"
          >
            For three years this lab has existed in superposition — every
            outcome possible at once. Today, you are the measurement.
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
              Review the Terms
            </motion.a>
            <motion.a
              href={PROPOSAL_PDF}
              download="QRL-Lab-Seed-Proposal.pdf"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Download the one-page proposal PDF (A4)"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-7 py-4 font-heading font-bold text-quantum-subtle transition-all hover:text-quantum-blue hover:border-quantum-blue/50"
            >
              <FileDown className="size-4" aria-hidden="true" />
              One-Page PDF
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Partnership terms */}
        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2"
          aria-label="Partnership terms"
        >
          {PARTNERSHIP_TERMS.map((t, i) => (
            <motion.li
              key={t.term}
              variants={scaleIn}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-quantum-secondary/60 px-4 py-3"
            >
              <span className="font-mono text-xs text-quantum-blue">0{i + 1}</span>
              <span className="text-sm text-quantum-text/90">{t.term}</span>
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
                University Quantum Research Laboratory
              </p>
              <p className="font-mono text-[10px] tracking-[0.25em] text-quantum-subtle uppercase">
                Dept. of Physics · Computer Science
              </p>
            </div>
          </div>

          {/* transparency strip */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-quantum-subtle" aria-label="Transparency commitments">
            <li className="flex items-center gap-1.5">
              <FileText className="size-3.5 text-quantum-green" aria-hidden="true" />
              Quarterly reports
            </li>
            <li className="flex items-center gap-1.5">
              <Eye className="size-3.5 text-quantum-green" aria-hidden="true" />
              Open finances
            </li>
            <li className="flex items-center gap-1.5">
              <Handshake className="size-3.5 text-quantum-green" aria-hidden="true" />
              ASRT · ITIDA aligned
            </li>
          </ul>

          {/* socials */}
          <ul className="flex items-center gap-3" aria-label="Social media">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Quantum Research Lab on ${label}`}
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
          <p>© 2026 Quantum Research Lab — Seed Proposal · v1.0</p>
          <p>
            Made with <span aria-label="love">❤️</span> by the Quantum Research
            Team — <span className="text-quantum-blue">Where Students Simulate Reality</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
