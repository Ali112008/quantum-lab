"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

/**
 * Quantum scroll-to-top: a little qubit that only "collapses" into view
 * after you have scrolled past the first viewport — now wearing a
 * measurement ring that fills with page progress.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 650);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ring geometry
  const R = 21;
  const CIRC = 2 * Math.PI * R;

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
          aria-label={t.misc.backToTop}
          title={t.misc.backToTop}
          className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 flex size-12 items-center justify-center rounded-full border border-quantum-blue/50 bg-quantum-secondary/90 backdrop-blur-md text-quantum-blue shadow-[0_0_24px_rgba(0,217,255,0.35)] hover:shadow-[0_0_36px_rgba(0,217,255,0.6)] transition-shadow"
        >
          {/* measurement ring — stroke fills with reading progress */}
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(0,217,255,0.15)" strokeWidth="2" />
            <circle
              cx="24" cy="24" r={R}
              fill="none"
              stroke="#00D9FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
              style={{ filter: "drop-shadow(0 0 4px rgba(0,217,255,0.8))" }}
            />
          </svg>
          <Atom className="size-5 animate-spin-slow" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
