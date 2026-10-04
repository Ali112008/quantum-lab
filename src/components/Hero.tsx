"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronDown, Sparkles, Users, ArrowDown } from "lucide-react";
import { heroStagger, wordRise, quantumVariants, viewport } from "@/lib/animations";

/**
 * Quantum circuit — an SVG "3D-ish" visualization of a Bell-state circuit
 * (H gate → CNOT → measurement), the same circuit students run in week 2.
 * Nodes pulse; entangling wire glows.
 */
function QuantumCircuit() {
  return (
    <svg
      viewBox="0 0 420 210"
      role="img"
      aria-label="Quantum circuit diagram: Hadamard gate on qubit 0, CNOT entangling qubits 0 and 1, measurement on both"
      className="w-full max-w-[460px] drop-shadow-[0_0_25px_rgba(0,217,255,0.25)]"
    >
      <defs>
        <linearGradient id="wire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* qubit wires */}
      {[
        { y: 60, label: "q₀" },
        { y: 120, label: "q₁" },
        { y: 180, label: "c" },
      ].map((w) => (
        <g key={w.label}>
          <text
            x={14}
            y={w.y + 4}
            fill="#8892B0"
            fontSize="13"
            fontFamily="Courier New, monospace"
          >
            {w.label}
          </text>
          <line
            x1={40}
            y1={w.y}
            x2={400}
            y2={w.y}
            stroke="url(#wire)"
            strokeWidth={1.6}
          />
        </g>
      ))}

      {/* CNOT entanglement link */}
      <motion.line
        x1={180}
        y1={60}
        x2={180}
        y2={120}
        stroke="#6C5CE7"
        strokeWidth={2}
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* H gate on q0 */}
      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "110px 60px" }}
      >
        <circle cx={110} cy={60} r={24} fill="url(#nodeGlow)" opacity={0.55} />
        <rect
          x={92}
          y={42}
          width={36}
          height={36}
          rx={8}
          fill="#0A192F"
          stroke="#00D9FF"
          strokeWidth={1.8}
        />
        <text
          x={110}
          y={66}
          textAnchor="middle"
          fill="#00D9FF"
          fontSize="16"
          fontWeight="bold"
          fontFamily="Courier New, monospace"
        >
          H
        </text>
      </motion.g>

      {/* CNOT control dot on q0 */}
      <circle cx={180} cy={60} r={7} fill="#6C5CE7" />
      <circle cx={180} cy={60} r={13} fill="none" stroke="#6C5CE7" strokeOpacity={0.4} />

      {/* CNOT target ⊕ on q1 */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "180px 120px" }}
      >
        <circle cx={180} cy={120} r={14} fill="#0A192F" stroke="#6C5CE7" strokeWidth={1.8} />
        <line x1={166} y1={120} x2={194} y2={120} stroke="#6C5CE7" strokeWidth={1.6} />
        <line x1={180} y1={106} x2={180} y2={134} stroke="#6C5CE7" strokeWidth={1.6} />
      </motion.g>

      {/* X gate on q1 */}
      <rect
        x={258}
        y={102}
        width={36}
        height={36}
        rx={8}
        fill="#0A192F"
        stroke="#00B894"
        strokeWidth={1.8}
      />
      <text
        x={276}
        y={126}
        textAnchor="middle"
        fill="#00B894"
        fontSize="16"
        fontWeight="bold"
        fontFamily="Courier New, monospace"
      >
        X
      </text>

      {/* measurement meters */}
      {[60, 120].map((y, i) => (
        <g key={y}>
          <motion.path
            d={`M 330 ${y} a 18 18 0 0 1 36 0`}
            fill="none"
            stroke={i === 0 ? "#00D9FF" : "#00B894"}
            strokeWidth={2}
            strokeDasharray="70"
            animate={{ strokeDashoffset: [70, 18, 70] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
          <line x1={348} y1={y} x2={360} y2={y - 12} stroke="#E6F1FF" strokeWidth={2} strokeLinecap="round" />
          <circle cx={348} cy={y} r={3.4} fill="#E6F1FF" />
        </g>
      ))}
      <text x={340} y={202} fill="#8892B0" fontSize="10" fontFamily="Courier New, monospace">
        measure
      </text>
    </svg>
  );
}

/** Floating bra-ket symbols drifting through the hero */
const FLOATING_SYMBOLS = [
  { glyph: "|0⟩", x: "8%", y: "22%", delay: "0s", size: "text-2xl md:text-4xl" },
  { glyph: "|1⟩", x: "86%", y: "18%", delay: "1.2s", size: "text-xl md:text-3xl" },
  { glyph: "ψ", x: "12%", y: "68%", delay: "2.1s", size: "text-3xl md:text-5xl" },
  { glyph: "⊗", x: "90%", y: "62%", delay: "0.7s", size: "text-xl md:text-3xl" },
  { glyph: "⟨φ|", x: "78%", y: "82%", delay: "1.7s", size: "text-lg md:text-2xl" },
  { glyph: "ħ", x: "22%", y: "12%", delay: "2.6s", size: "text-lg md:text-2xl" },
];

const HEADLINE_WORDS: { text: string; accent?: string }[] = [
  { text: "Building" },
  { text: "Egypt's" },
  { text: "Quantum", accent: "gradient" },
  { text: "Future", accent: "gradient" },
  { text: "Today" },
];

export default function Hero() {
  // Mouse parallax — the circuit drifts gently against the cursor.
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const circuitX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const circuitY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const symbolsX = useTransform(sx, [-0.5, 0.5], [-14, 14]);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMouse}
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
      aria-label="Introduction"
    >
      {/* radial spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(0,217,255,0.10),transparent_70%)]"
      />
      {/* grid lines */}
      <div aria-hidden="true" className="absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />

      {/* floating quantum symbols */}
      <motion.div style={{ x: symbolsX }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {FLOATING_SYMBOLS.map((s) => (
          <span
            key={s.glyph + s.x}
            className={`absolute font-mono text-quantum-blue/30 animate-float ${s.size}`}
            style={{ left: s.x, top: s.y, animationDelay: s.delay }}
          >
            {s.glyph}
          </span>
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <motion.div variants={heroStagger} initial="hidden" animate="visible">
            <motion.p
              variants={wordRise}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-quantum-blue/30 bg-quantum-secondary/60 px-4 py-1.5 font-mono text-[11px] md:text-xs tracking-[0.25em] text-quantum-blue uppercase"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Seed Pitch · 2026 · Student-Led · Faculty-Mentored
            </motion.p>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-white">
              {HEADLINE_WORDS.map((w, i) => (
                <motion.span
                  key={w.text + i}
                  variants={wordRise}
                  className={
                    w.accent === "gradient"
                      ? "inline-block mr-[0.28em] bg-gradient-to-r from-quantum-blue via-[#4CC9F0] to-quantum-purple bg-clip-text text-transparent text-glow-cyan"
                      : "inline-block mr-[0.28em]"
                  }
                >
                  {w.text}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={wordRise}
              className="mt-6 max-w-xl text-base md:text-xl text-quantum-subtle leading-relaxed"
            >
              A student-led{" "}
              <span className="text-quantum-text font-medium">
                Quantum Research Lab
              </span>{" "}
              seeking{" "}
              <span className="text-quantum-green font-semibold text-glow-green">
                $50,000
              </span>{" "}
              in seed funding — where students simulate reality on real quantum
              hardware, and the first lab of its kind in the region.
            </motion.p>

            <motion.div variants={wordRise} className="mt-9 flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#problem"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-quantum-blue px-7 py-4 font-heading font-bold text-quantum-navy animate-pulse-glow hover:bg-[#33e1ff] transition-colors"
              >
                Explore Our Proposal
                <ArrowDown className="size-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href="#team"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-quantum-purple/60 bg-quantum-purple/10 px-7 py-4 font-heading font-bold text-white hover:bg-quantum-purple/25 hover:shadow-[0_0_28px_rgba(108,92,231,0.4)] transition-all"
              >
                <Users className="size-4" aria-hidden="true" />
                Meet the Team
              </motion.a>
            </motion.div>

            {/* credibility badges — mirrors the deck's opening slide */}
            <motion.ul
              variants={wordRise}
              className="mt-10 flex flex-wrap gap-2.5 font-mono text-[10px] md:text-[11px] tracking-wider text-quantum-subtle"
            >
              {[
                "Presented to ASRT · ITIDA",
                "Global Quantum Partners",
                "15-Minute Investor Edition",
              ].map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-quantum-blue/20 bg-quantum-secondary/50 px-3.5 py-1.5"
                >
                  {b}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Circuit visualization */}
          <motion.div
            variants={quantumVariants}
            initial="hidden"
            animate="visible"
            style={{ x: circuitX, y: circuitY }}
            className="relative mx-auto hidden sm:block"
          >
            <div className="glass-panel rounded-3xl p-6 md:p-8 animate-float-slow">
              <QuantumCircuit />
              <p className="mt-4 text-center font-mono text-[11px] tracking-[0.25em] text-quantum-subtle uppercase">
                grover_bell.py · backend: ibm_torino · shots: 1024
              </p>
            </div>
            {/* orbiting electron accents */}
            <div aria-hidden="true" className="absolute -inset-6 pointer-events-none">
              <motion.span
                className="absolute left-1/2 top-1/2 size-2 rounded-full bg-quantum-blue shadow-[0_0_12px_#00D9FF]"
                animate={{
                  rotate: 360,
                  x: ["0px", "220px", "0px", "-220px", "0px"],
                  y: ["-120px", "0px", "120px", "0px", "-120px"],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-quantum-purple shadow-[0_0_10px_#6C5CE7]"
                animate={{
                  rotate: -360,
                  x: ["0px", "-190px", "0px", "190px", "0px"],
                  y: ["100px", "0px", "-100px", "0px", "100px"],
                }}
                transition={{ duration: 17, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#problem"
        aria-label="Scroll to the problem section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-quantum-subtle hover:text-quantum-blue transition-colors"
      >
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}
