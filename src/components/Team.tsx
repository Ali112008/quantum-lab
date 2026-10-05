"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { TEAM_MEMBERS, type TeamMember } from "@/lib/data";
import { useLang } from "@/lib/LanguageProvider";
import { staggerContainer, scaleIn, quantumVariants, viewport } from "@/lib/animations";

/** zero-padded roster index — Q1…Q15, a nod to the 15-qubit register */
function qubitIndex(i: number) {
  return `Q${String(i + 1).padStart(2, "0")}`;
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { tx } = useLang();
  return (
    <motion.article
      layout
      variants={scaleIn}
      role="listitem"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`group relative flex flex-col items-center rounded-2xl border bg-quantum-secondary/70 backdrop-blur-sm px-4 py-6 text-center transition-[border-color,box-shadow] duration-300 hover:shadow-[0_16px_50px_-14px_rgba(0,217,255,0.4)] ${
        member.open
          ? "border-dashed border-quantum-subtle/40 hover:border-quantum-blue/60"
          : "border-white/8 hover:border-quantum-blue/40"
      }`}
    >
      {/* roster index — mono chip in the top-left corner */}
      <span
        aria-hidden="true"
        className="absolute left-3 top-3 font-mono text-[10px] tracking-widest text-quantum-subtle/50 transition-colors duration-300 group-hover:text-quantum-blue/70"
      >
        {qubitIndex(index)}
      </span>

      {/* gradient accent bar — the member's color signature (no photos by design) */}
      <span
        aria-hidden="true"
        className={`mb-4 h-1 w-10 rounded-full bg-gradient-to-r ${member.gradient} transition-shadow duration-300 group-hover:shadow-[0_0_16px_rgba(0,217,255,0.5)]`}
      />

      {member.open ? (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-1 rounded-xl border border-quantum-blue/15 animate-spin-slow"
            style={{ borderStyle: "dashed" }}
          />
          <h3 className="font-mono text-lg font-bold text-quantum-subtle transition-colors duration-300 group-hover:text-quantum-blue" dir="ltr">
            {member.name}
          </h3>
        </>
      ) : (
        <h3 className="font-heading text-sm font-bold leading-snug text-white" dir="ltr">
          {member.name}
        </h3>
      )}

      <p className="mt-1.5 text-[11px] text-quantum-subtle">{tx(member.year)}</p>
    </motion.article>
  );
}

/**
 * SECTION 06 — THE TEAM
 * 15 entangled students: 13 founding members + 2 open seats (|0⟩ / |1⟩).
 * Deliberately role-free and photo-free — one entangled system of equal
 * co-founders, names only.
 */
export default function Team() {
  const { t } = useLang();

  return (
    <section id="team" className="relative py-24 md:py-32" aria-label={t.misc.teamAria}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-purple/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.team.eyebrow}
          title={t.team.title}
          subtitle={t.team.subtitle}
        />

        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
          role="list"
          aria-label={t.team.gridAria}
        >
          {TEAM_MEMBERS.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </motion.div>

        <motion.p
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-10 text-center font-mono text-xs text-quantum-subtle"
        >
          {t.team.note}
        </motion.p>
      </div>
    </section>
  );
}
