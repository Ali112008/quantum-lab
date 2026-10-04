"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { TEAM_MEMBERS, LAB_EMAIL } from "@/lib/data";
import { staggerContainer, scaleIn, quantumVariants, viewport } from "@/lib/animations";

/** Initials for the avatar halo — bra-ket placeholders keep their glyph */
function initials(name: string) {
  if (name.includes("⟩")) return name;
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/**
 * SECTION 04 — THE TEAM
 * 15 entangled students: 13 founding members + 2 open seats (|0⟩ / |1⟩).
 */
export default function Team() {
  return (
    <section id="team" className="relative py-24 md:py-32" aria-label="The team">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-purple/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="SECTION 04 — THE TEAM"
          title="Entangled Expertise"
          subtitle="15 students, one wavefunction — physicists, engineers, and mathematicians led by the people who will do the work: the students themselves."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5"
          role="list"
          aria-label="Team members"
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.article
              key={member.name + member.role}
              variants={scaleIn}
              role="listitem"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group relative flex flex-col items-center rounded-2xl border bg-quantum-secondary/70 backdrop-blur-sm p-5 text-center transition-all duration-300 hover:shadow-[0_16px_50px_-14px_rgba(0,217,255,0.4)] ${
                member.open
                  ? "border-dashed border-quantum-subtle/40 hover:border-quantum-blue/60"
                  : "border-white/8 hover:border-quantum-blue/40"
              }`}
            >
              {/* avatar halo */}
              <div
                className={`relative mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} p-[2px] transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(0,217,255,0.45)]`}
              >
                <span className="flex size-full items-center justify-center rounded-full bg-quantum-navy font-mono text-sm font-bold text-white">
                  {initials(member.name)}
                </span>
                {member.open && (
                  <span
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-full border border-quantum-blue/30 animate-spin-slow"
                    style={{ borderStyle: "dashed" }}
                  />
                )}
              </div>

              <h3 className="font-heading text-sm font-bold text-white leading-snug">
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-semibold text-quantum-blue">
                {member.role}
              </p>
              <p className="mt-0.5 text-[11px] text-quantum-subtle">{member.year}</p>

              {/* skills — reveal on hover */}
              <div className="mt-3 flex max-h-0 flex-wrap justify-center gap-1.5 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-quantum-blue/25 bg-quantum-navy/70 px-2 py-0.5 font-mono text-[10px] text-quantum-blue/90"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 text-center font-mono text-xs text-quantum-subtle"
        >
          one entangled system — full roster & photos available on request
        </motion.p>

        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-6 flex justify-center"
        >
          <a
            href={`mailto:${LAB_EMAIL}?subject=Founding%20Seat%20Application`}
            className="inline-flex items-center gap-2 rounded-xl border border-quantum-purple/50 bg-quantum-purple/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-quantum-purple/25 hover:shadow-[0_0_26px_rgba(108,92,231,0.45)]"
          >
            <Mail className="size-4" aria-hidden="true" />
            Claim an open founding seat
          </a>
        </motion.div>
      </div>
    </section>
  );
}
