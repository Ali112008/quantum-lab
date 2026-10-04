"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom } from "lucide-react";

/**
 * Quantum scroll-to-top: a little qubit that only "collapses" into view
 * after you have scrolled past the first viewport.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 650);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          key="scrolltop"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-quantum-blue/50 bg-quantum-secondary/90 backdrop-blur-md text-quantum-blue shadow-[0_0_24px_rgba(0,217,255,0.35)] hover:shadow-[0_0_36px_rgba(0,217,255,0.6)] transition-shadow"
        >
          <Atom className="size-5 animate-spin-slow" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
