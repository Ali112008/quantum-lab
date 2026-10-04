import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants — quantum-flavoured motion language.
 * Every section reveals once when it scrolls into view (see `viewport`).
 */

/** Standard reveal: rise from below with a soft deceleration */
export const quantumVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/** Problem items slide in from the left */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/** Solution items slide in from the right */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Parent wrapper that staggers its children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

/** Faster stagger for hero headline words */
export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.25 },
  },
};

/** Per-word rise for the hero headline */
export const wordRise: Variants = {
  hidden: { opacity: 0, y: 34, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/** Idle “entangled” wobble for decorative quantum symbols */
export const entangled: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    rotate: [0, 4, -4, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

/** Shared viewport config — animate once, slightly before fully in view */
export const viewport = { once: true, margin: "-80px" } as const;
