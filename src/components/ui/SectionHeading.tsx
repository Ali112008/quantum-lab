"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { quantumVariants, viewport } from "@/lib/animations";

interface SectionHeadingProps {
  /** small mono eyebrow, e.g. "SECTION 01 — THE PROBLEM" */
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Section title with the deck's scientific typography:
 * a letter-spaced mono eyebrow, a bold Montserrat headline,
 * and an optional subtitle line.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <motion.div
      variants={quantumVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={cn(
        "mb-12 md:mb-16",
        centered ? "text-center" : "text-left",
        className
      )}
    >
      <p
        className={cn(
          "font-mono text-[11px] md:text-xs tracking-[0.35em] text-quantum-blue mb-4 flex items-center gap-3",
          centered && "justify-center"
        )}
      >
        <span className="inline-block h-px w-8 bg-quantum-blue/50" aria-hidden="true" />
        {eyebrow}
        <span className="inline-block h-px w-8 bg-quantum-blue/50" aria-hidden="true" />
      </p>
      <h2 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-white">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-quantum-subtle text-base md:text-lg leading-relaxed",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}
