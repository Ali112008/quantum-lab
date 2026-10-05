"use client";

import { motion } from "framer-motion";

/**
 * SectionDivider — a thin "measurement line" between major sections:
 * a hairline beam, an entangled qubit pair at the center, and a soft glow.
 * Pure ornament (aria-hidden), flips perfectly under RTL because it is
 * symmetric around the center.
 */
export default function SectionDivider({
  accent = "#00D9FF",
  echo = "#6C5CE7",
}: {
  /** primary node color */
  accent?: string;
  /** secondary (entangled partner) color */
  echo?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 mx-auto flex h-10 max-w-7xl items-center px-4 sm:px-6 lg:px-8"
    >
      {/* beam */}
      <div className="relative h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      {/* entangled pair */}
      <div className="relative mx-5 flex items-center">
        <motion.span
          className="size-1.5 rounded-full"
          style={{ background: echo, boxShadow: `0 0 8px ${echo}` }}
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="mx-2 h-px w-8 bg-gradient-to-r from-transparent to-transparent"
          style={{ backgroundImage: `linear-gradient(90deg, ${echo}66, ${accent}66, ${echo}66)` }}
        />
        <motion.span
          className="size-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 14px ${accent}` }}
          animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.25, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
        />
        <motion.span
          className="mx-2 h-px w-8"
          style={{ backgroundImage: `linear-gradient(90deg, ${accent}66, ${echo}66, ${accent}66)` }}
        />
        <motion.span
          className="size-1.5 rounded-full"
          style={{ background: echo, boxShadow: `0 0 8px ${echo}` }}
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
      </div>
      {/* beam */}
      <div className="relative h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
    </div>
  );
}
