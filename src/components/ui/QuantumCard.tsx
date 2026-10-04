"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { quantumVariants, viewport } from "@/lib/animations";

interface QuantumCardProps {
  children: React.ReactNode;
  className?: string;
  /** Hex accent color — drives the border/glow on hover */
  accent?: string;
  /** disable the reveal animation (for cards inside an already-staggered parent) */
  noReveal?: boolean;
}

/**
 * Reusable lab-glass card: frosted panel, hairline border,
 * and an accent-colored hover glow.
 */
export default function QuantumCard({
  children,
  className,
  accent = "#00D9FF",
  noReveal = false,
}: QuantumCardProps) {
  return (
    <motion.div
      variants={noReveal ? undefined : quantumVariants}
      initial={noReveal ? undefined : "hidden"}
      whileInView={noReveal ? undefined : "visible"}
      viewport={noReveal ? undefined : viewport}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={
        {
          "--accent": accent,
        } as React.CSSProperties
      }
      className={cn(
        "group relative rounded-2xl border border-quantum-blue/15 bg-quantum-secondary/70 backdrop-blur-sm p-6",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-[color-mix(in_srgb,var(--accent)_60%,transparent)]",
        "hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent),0_18px_50px_-12px_color-mix(in_srgb,var(--accent)_35%,transparent)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
