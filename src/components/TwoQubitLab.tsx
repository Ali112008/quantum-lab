"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircuitBoard,
  Dices,
  Gauge,
  Link2,
  Orbit,
  RotateCcw,
  Undo2,
  Wand2,
} from "lucide-react";
import QuantumCard from "@/components/ui/QuantumCard";
import { useLang } from "@/lib/LanguageProvider";
import { quantumVariants, staggerContainer, viewport } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import {
  GATES,
  TWO_PRESETS,
  TWO_ZERO_STATE,
  applyCNOT,
  applySingleToWire,
  cloneTwoState,
  collapseTwo,
  concurrence,
  ketLabel,
  reducedBloch,
  sampleTwoOnce,
  twoProbabilities,
  type TwoQubitOp,
  type TwoQubitState,
} from "@/lib/quantum";

/**
 * The two-qubit wing of SECTION 04 — TRY QUANTUM.
 *
 * One qubit showed superposition; two qubits show the thing that actually
 * gives quantum computers their power: ENTANGLEMENT. The centerpiece is
 * CNOT + H = Bell pair, and the signature visual is the two Bloch discs
 * shrinking to their centers as the entanglement meter fills — each qubit
 * alone becomes pure noise while the correlation becomes perfect.
 *
 * Physics honesty notes:
 *  - Each disc shows the reduced (mixed) state, so the vector LENGTH now
 *    varies: length 1 = pure/separable, length 0 = maximally mixed.
 *  - The meter is the concurrence C = 2|c₀c₃ − c₁c₂| — exact for pure states.
 *  - Everything runs at build-free display precision, renormalized per gate.
 *
 * RTL note: kets, circuit lanes and C values stay dir="ltr"; chrome flips.
 */

const HISTORY_LIMIT = 32;
const CIRCUIT_WINDOW = 6;
const ENTANGLED_COLOR = "#FF6B9D"; // pink — reserved for entanglement
const JOINT_COLORS = ["#00D9FF", "#6C5CE7", "#00B894", "#FFD166"] as const;

interface Snapshot {
  state: TwoQubitState;
  circuit: TwoQubitOp[];
}

/** One row of the two-qubit gate rack. */
interface RackButton {
  id: string;
  label: string;
  accent: string;
  blurb: string;
  apply: (s: TwoQubitState) => TwoQubitState;
  op: TwoQubitOp;
}

/* ------------------------------------------------------------------ */
/*                     Reduced-state Bloch disc                        */
/* ------------------------------------------------------------------ */

/**
 * Mini Bloch disc of ONE qubit's reduced state. Unlike the single-qubit
 * disc, the vector length varies — watching it shrink toward the center
 * as CNOT entangles the pair is the whole lesson in one picture.
 */
function ReducedBloch({
  x,
  z,
  qubit,
  ariaLabel,
}: {
  x: number;
  z: number;
  qubit: 0 | 1;
  ariaLabel: string;
}) {
  const SIZE = 150;
  const R = SIZE / 2 - 20;
  const C = SIZE / 2;
  const len = Math.min(1, Math.hypot(x, z)); // |ρ| ∈ [0,1]
  const thetaDeg = (Math.atan2(x, z) * 180) / Math.PI;
  const mixed = len < 0.05; // maximally mixed → pure noise, no direction
  const accent = qubit === 0 ? "#00D9FF" : "#6C5CE7";

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={ariaLabel}
      dir="ltr"
      className="drop-shadow-[0_0_18px_rgba(0,217,255,0.12)]"
    >
      {/* sphere silhouette */}
      <circle cx={C} cy={C} r={R} fill="rgba(17,34,64,0.6)" stroke="rgba(136,146,176,0.3)" strokeWidth="1.2" />
      {/* equator hint */}
      <ellipse cx={C} cy={C} rx={R} ry={R * 0.32} fill="none" stroke="rgba(136,146,176,0.25)" strokeWidth="1" strokeDasharray="3 4" />
      {/* poles */}
      <text x={C} y={C - R - 8} textAnchor="middle" fill="#8892B0" fontSize="11" fontFamily="var(--font-mono), monospace">
        |0⟩
      </text>
      <text x={C} y={C + R + 16} textAnchor="middle" fill="#8892B0" fontSize="11" fontFamily="var(--font-mono), monospace">
        |1⟩
      </text>

      {mixed ? (
        /* maximally mixed: no direction at all — render a breathing blob */
        <motion.circle
          cx={C}
          cy={C}
          r={6}
          fill={accent}
          animate={{ opacity: [0.35, 0.9, 0.35], scale: [0.8, 1.25, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${C}px ${C}px` }}
        />
      ) : (
        <g transform={`translate(${C} ${C})`}>
          <motion.g
            animate={{ rotate: thetaDeg, scale: len }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <line x1="0" y1="0" x2="0" y2={-R} stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy={-R} r="6" fill={accent} className="animate-pulse-glow" />
          </motion.g>
          <circle cx="0" cy="0" r="2.5" fill="#8892B0" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*                       Circuit op column                             */
/* ------------------------------------------------------------------ */

const LANE_TOP = 18; // px — center of q0 lane inside a 72px column
const LANE_BOTTOM = 54; // px — center of q1 lane

/** One column of the two-lane circuit: a gate chip or a CNOT pair. */
function OpColumn({ op }: { op: TwoQubitOp }) {
  if (op.kind === "gate") {
    const gate = GATES.find((g) => g.symbol === op.symbol);
    const accent = gate?.accent ?? "#00D9FF";
    return (
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative block h-[72px] w-10 shrink-0"
      >
        <span
          className="absolute flex h-9 w-9 items-center justify-center rounded-md border bg-quantum-secondary font-mono text-sm font-bold shadow-[0_0_10px_rgba(0,0,0,0.4)]"
          style={{
            color: accent,
            borderColor: `${accent}55`,
            top: op.target === 0 ? LANE_TOP - 18 : LANE_BOTTOM - 18,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {op.symbol}
        </span>
      </motion.span>
    );
  }

  // CNOT: control dot on one lane, ⊕ target on the other, vertical connector.
  const ctrlY = op.control === 0 ? LANE_TOP : LANE_BOTTOM;
  const tgtY = op.control === 0 ? LANE_BOTTOM : LANE_TOP;
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative block h-[72px] w-10 shrink-0"
    >
      {/* vertical connector */}
      <span
        className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-quantum-green shadow-[0_0_8px_rgba(0,184,148,0.6)]"
        style={{ top: Math.min(ctrlY, tgtY), height: Math.abs(ctrlY - tgtY) }}
        aria-hidden="true"
      />
      {/* control dot */}
      <span
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-quantum-green shadow-[0_0_10px_rgba(0,184,148,0.8)]"
        style={{ top: ctrlY }}
        aria-hidden="true"
      />
      {/* target ⊕ */}
      <span
        className="absolute left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-quantum-green bg-quantum-navy font-mono text-[11px] font-bold leading-none text-quantum-green"
        style={{ top: tgtY }}
        aria-hidden="true"
      >
        +
      </span>
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*                            The lab                                  */
/* ------------------------------------------------------------------ */

export default function TwoQubitLab() {
  const { t, tx, isAr } = useLang();
  const pg = t.playground;
  const tq = t.twoQubit;

  const [state, setState] = useState<TwoQubitState>(TWO_ZERO_STATE);
  const [circuit, setCircuit] = useState<TwoQubitOp[]>([]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const [shots, setShots] = useState<[number, number, number, number] | null>(null);
  const [liveMsg, setLiveMsg] = useState<string>("");
  const [hoverOp, setHoverOp] = useState<RackButton | null>(null);
  const [celebrated, setCelebrated] = useState(false);

  const probs = useMemo(() => twoProbabilities(state), [state]);
  const C = useMemo(() => concurrence(state), [state]);
  const blochQ0 = useMemo(() => reducedBloch(state, 0), [state]);
  const blochQ1 = useMemo(() => reducedBloch(state, 1), [state]);
  const isBell = C > 0.99;

  const H_MATRIX = GATES[0].matrix;
  const X_MATRIX = GATES[1].matrix;

  /** The six-operation rack: 4 single-wire gates + 2 CNOT directions. */
  const RACK: RackButton[] = [
    { id: "h0", label: "H·q0", accent: "#00D9FF", blurb: tq.blurbH(0), apply: (s) => applySingleToWire(s, H_MATRIX, 0), op: { kind: "gate", symbol: "H", target: 0 } },
    { id: "x0", label: "X·q0", accent: "#6C5CE7", blurb: tq.blurbX(0), apply: (s) => applySingleToWire(s, X_MATRIX, 0), op: { kind: "gate", symbol: "X", target: 0 } },
    { id: "h1", label: "H·q1", accent: "#00D9FF", blurb: tq.blurbH(1), apply: (s) => applySingleToWire(s, H_MATRIX, 1), op: { kind: "gate", symbol: "H", target: 1 } },
    { id: "x1", label: "X·q1", accent: "#6C5CE7", blurb: tq.blurbX(1), apply: (s) => applySingleToWire(s, X_MATRIX, 1), op: { kind: "gate", symbol: "X", target: 1 } },
    { id: "c01", label: "⊕ 0→1", accent: "#00B894", blurb: tq.blurbCnot(0, 1), apply: (s) => applyCNOT(s, 0), op: { kind: "cnot", control: 0 } },
    { id: "c10", label: "⊕ 1→0", accent: "#00B894", blurb: tq.blurbCnot(1, 0), apply: (s) => applyCNOT(s, 1), op: { kind: "cnot", control: 1 } },
  ];

  const snapshot = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-HISTORY_LIMIT + 1),
      { state: cloneTwoState(state), circuit: [...circuit] },
    ]);
  }, [state, circuit]);

  const clearTransient = () => {
    setShots(null);
    setFlash(null);
  };

  const applyOne = useCallback(
    (btn: RackButton) => {
      snapshot();
      const next = btn.apply(state);
      setState(next);
      setCircuit((prev) => [...prev, btn.op]);
      clearTransient();
      // One-shot celebration the first time a Bell pair appears.
      if (!celebrated && concurrence(next) > 0.99) setCelebrated(true);
    },
    [snapshot, state, celebrated]
  );

  const loadPreset = useCallback(
    (presetState: TwoQubitState) => {
      snapshot();
      setState(cloneTwoState(presetState));
      setCircuit([]);
      clearTransient();
    },
    [snapshot]
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setState(last.state);
      setCircuit(last.circuit);
      clearTransient();
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    snapshot();
    setState(TWO_ZERO_STATE);
    setCircuit([]);
    clearTransient();
  }, [snapshot]);

  /** Destructive projective measurement of BOTH qubits. */
  const measureOnce = useCallback(() => {
    snapshot();
    const outcome = sampleTwoOnce(state);
    setState(collapseTwo(outcome));
    clearTransient();
    const label = ketLabel(outcome);
    setLiveMsg(tq.collapsedTo2(label));
  }, [state, snapshot, tq]);

  /** Born-rule sampling ×100 — non-destructive. */
  const runShots = useCallback(() => {
    const counts: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < 100; i++) counts[sampleTwoOnce(state)]++;
    setShots(counts);
    const summary = counts
      .map((n, i) => `${n}× ${ketLabel(i)}`)
      .filter((s) => !s.startsWith("0×"))
      .join(" · ");
    setLiveMsg(tq.shotsSummary2(summary));
  }, [state, tq]);

  const visibleOps = circuit.slice(-CIRCUIT_WINDOW);
  const hiddenCount = circuit.length - visibleOps.length;

  const jointAria = probs
    .map((p, i) => `${ketLabel(i)} ${(p * 100).toFixed(0)}%`)
    .join(", ");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* ── Left: reduced Bloch discs + entanglement meter + joint probs ── */}
      <QuantumCard accent={ENTANGLED_COLOR} noReveal className="p-6 md:p-8">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-white">
            <Orbit className="h-4 w-4 text-quantum-purple" />
            {tq.spheresTitle}
          </h3>
        </div>
        <p className="mb-5 text-[11px] text-quantum-subtle">{tq.wireHint}</p>

        {/* the pair, linked by their correlation */}
        <div className="relative flex items-center justify-center gap-1 sm:gap-3">
          <div className="flex flex-col items-center">
            <ReducedBloch
              x={blochQ0.x}
              z={blochQ0.z}
              qubit={0}
              ariaLabel={tq.reducedAria(0)}
            />
            <p className="mt-1 font-mono text-[10px] tracking-wider text-quantum-subtle" dir="ltr">
              {tq.qubitLabel(0)}
            </p>
          </div>

          {/* correlation beam — intensity IS the concurrence */}
          <div className="flex w-10 flex-col items-center gap-1.5 sm:w-14" aria-hidden="true">
            <span
              className="font-mono text-lg transition-colors"
              style={{ color: ENTANGLED_COLOR, opacity: 0.35 + C * 0.65 }}
            >
              ⊗
            </span>
            <div
              className={`h-16 w-1 rounded-full ${isBell ? "animate-pulse-glow" : ""}`}
              style={{
                background: `linear-gradient(180deg, transparent, ${ENTANGLED_COLOR}, transparent)`,
                opacity: 0.12 + C * 0.88,
                boxShadow: C > 0.9 ? `0 0 18px ${ENTANGLED_COLOR}` : "none",
              }}
            />
            <span className="font-mono text-[10px] text-quantum-subtle" dir="ltr">
              C={C.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <ReducedBloch
              x={blochQ1.x}
              z={blochQ1.z}
              qubit={1}
              ariaLabel={tq.reducedAria(1)}
            />
            <p className="mt-1 font-mono text-[10px] tracking-wider text-quantum-subtle" dir="ltr">
              {tq.qubitLabel(1)}
            </p>
          </div>

          {/* collapse flash — shared by the pair */}
          <AnimatePresence>
            {flash !== null && (
              <motion.div
                key={flash}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.45 }}
                className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                dir="ltr"
              >
                <span className="rounded-xl bg-quantum-navy/70 px-4 py-2 font-mono text-4xl font-bold text-quantum-blue text-glow">
                  {ketLabel(flash)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* entanglement meter */}
        <div className="mt-6" role="img" aria-label={tq.meterAria(C)}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-quantum-subtle">
              <Link2 className="h-3.5 w-3.5" style={{ color: ENTANGLED_COLOR }} />
              {tq.meterLabel}
            </span>
            <span className="font-mono text-sm text-white" dir="ltr">
              {(C * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #00D9FF, #6C5CE7, ${ENTANGLED_COLOR})`,
                boxShadow: `0 0 14px ${ENTANGLED_COLOR}66`,
              }}
              animate={{ width: `${C * 100}%` }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-quantum-subtle/80">
            <span>{tq.meterLeft}</span>
            <span>{tq.meterRight}</span>
          </div>
        </div>

        {/* Bell achievement — the payoff moment */}
        <AnimatePresence>
          {isBell && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mt-5 rounded-xl border border-[#FF6B9D]/40 bg-[#FF6B9D]/[0.07] p-4"
            >
              <p className="flex items-center gap-2 font-heading text-sm font-bold text-[#FF6B9D]">
                <Link2 className="h-4 w-4 animate-pulse" />
                {tq.bellBadge}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-quantum-subtle" dir={isAr ? "rtl" : "ltr"}>
                {tq.bellNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* joint probabilities over the 4-outcome basis */}
        <div className="mt-6" role="img" aria-label={jointAria}>
          <p className="mb-1 font-mono text-[10px] tracking-[0.25em] text-quantum-subtle">
            {tq.jointTitle}
          </p>
          <p className="mb-3 text-[11px] italic text-quantum-subtle/70" dir={isAr ? "rtl" : "ltr"}>
            {tq.endianNote}
          </p>
          <div className="space-y-2.5">
            {probs.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span dir="ltr" className="w-12 shrink-0 font-mono text-xs text-quantum-subtle">
                  {ketLabel(i)}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${JOINT_COLORS[i]}, ${JOINT_COLORS[i]}99)`,
                      boxShadow: `0 0 12px ${JOINT_COLORS[i]}55`,
                    }}
                    animate={{ width: `${p * 100}%` }}
                    transition={{ type: "spring", stiffness: 110, damping: 18 }}
                  />
                </div>
                <span dir="ltr" className="w-12 shrink-0 text-end font-mono text-[11px] text-white">
                  {(p * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </QuantumCard>

      {/* ── Right: 2Q gate rack, entangling circuit, presets, actions ── */}
      <QuantumCard accent="#00B894" noReveal className="flex flex-col gap-6 p-6 md:p-8">
        {/* rack */}
        <div aria-label={pg.controlsAria}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-white">
              <Gauge className="h-4 w-4 text-quantum-green" />
              {tq.gates2Title}
            </h3>
            <p className="text-[11px] text-quantum-subtle">{tq.gates2Hint}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {RACK.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => applyOne(btn)}
                onMouseEnter={() => setHoverOp(btn)}
                onMouseLeave={() => setHoverOp(null)}
                onFocus={() => setHoverOp(btn)}
                onBlur={() => setHoverOp(null)}
                aria-label={tq.opAria(btn.label)}
                aria-describedby="gate-blurb-2q"
                className="group/gate flex h-16 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-quantum-navy/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--gate-accent)_60%,transparent)] hover:shadow-[0_0_18px_color-mix(in_srgb,var(--gate-accent)_25%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quantum-blue"
                style={{ "--gate-accent": btn.accent } as React.CSSProperties}
              >
                <span className="font-mono text-sm font-bold" style={{ color: btn.accent }} dir="ltr">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
          <div
            id="gate-blurb-2q"
            aria-live="polite"
            className="mt-3 min-h-[3.25rem] rounded-lg border border-white/5 bg-quantum-navy/60 px-3 py-2.5 text-xs leading-relaxed text-quantum-subtle"
          >
            {hoverOp ? (
              <span>
                <span className="me-1.5 font-mono font-bold" style={{ color: hoverOp.accent }} dir="ltr">
                  {hoverOp.label}
                </span>
                {hoverOp.blurb}
              </span>
            ) : (
              <span className="opacity-50" dir={isAr ? "rtl" : "ltr"}>
                {tq.gates2Hint}
              </span>
            )}
          </div>
          {/* the two-gate recipe — a cheat sheet that fits on one line */}
          <p
            className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-[#FF6B9D]/25 bg-[#FF6B9D]/[0.04] px-3 py-2 text-[11px] text-quantum-subtle"
            dir={isAr ? "rtl" : "ltr"}
          >
            <Wand2 className="h-3.5 w-3.5 shrink-0 text-[#FF6B9D]" aria-hidden="true" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#FF6B9D]/80">{tq.recipeLabel}</span>
            <span className="font-mono" dir="ltr">{tq.recipe}</span>
          </p>
        </div>

        {/* two-lane circuit */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold text-white">
            <CircuitBoard className="h-4 w-4 text-quantum-blue" />
            {tq.circuit2Title}
            {circuit.length > 0 && (
              <span className="ms-auto font-mono text-[10px] text-quantum-subtle" dir="ltr">
                {circuit.length} op{circuit.length === 1 ? "" : "s"}
              </span>
            )}
          </h3>
          <div
            dir="ltr"
            className="relative min-h-[88px] overflow-hidden rounded-lg border border-quantum-blue/15 bg-quantum-navy/70 px-3"
          >
            {/* the two lanes */}
            <div className="pointer-events-none absolute inset-x-3 top-[26px] h-px bg-gradient-to-r from-transparent via-quantum-blue/40 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-3 top-[62px] h-px bg-gradient-to-r from-transparent via-quantum-purple/40 to-transparent" aria-hidden="true" />
            {/* lane tags */}
            <span className="pointer-events-none absolute start-3 top-[16px] font-mono text-[9px] text-quantum-blue/70" aria-hidden="true">
              q0
            </span>
            <span className="pointer-events-none absolute start-3 top-[52px] font-mono text-[9px] text-quantum-purple/70" aria-hidden="true">
              q1
            </span>
            {visibleOps.length === 0 ? (
              <span className="relative z-10 flex h-[88px] w-full items-center justify-center font-mono text-xs text-quantum-subtle/70">
                {tq.emptyCircuit2}
              </span>
            ) : (
              <div className="relative z-10 flex w-full items-center gap-1.5 py-2 ps-6">
                {hiddenCount > 0 && (
                  <span className="font-mono text-[10px] text-quantum-subtle">+{hiddenCount}</span>
                )}
                <AnimatePresence initial={false}>
                  {visibleOps.map((op, idx) => (
                    <OpColumn key={`${idx}-${op.kind}-${op.kind === "gate" ? op.symbol + op.target : op.control}`} op={op} />
                  ))}
                </AnimatePresence>
                {/* metering terminals at the end of both lanes */}
                <motion.span
                  className="ms-auto flex flex-col justify-center gap-[22px] py-2"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 0 rgba(0,217,255,0))",
                      "drop-shadow(0 0 6px rgba(0,217,255,0.6))",
                      "drop-shadow(0 0 0 rgba(0,217,255,0))",
                    ],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  aria-hidden="true"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded border border-quantum-blue/40 bg-quantum-navy font-mono text-[10px] text-quantum-blue">
                    ⌖
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded border border-quantum-purple/40 bg-quantum-navy font-mono text-[10px] text-quantum-purple">
                    ⌖
                  </span>
                </motion.span>
              </div>
            )}
          </div>
        </div>

        {/* presets */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold text-white">
            <Orbit className="h-4 w-4 text-quantum-green" />
            {tq.presets2Title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {TWO_PRESETS.map((preset) => {
              // Entangled presets wear a pulsing pink badge — visual taxonomy:
              // pink dot = maximally entangled member of the gallery.
              const presetBell = concurrence(preset.state) > 0.99;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => loadPreset(preset.state)}
                  title={tx(preset.note)}
                  aria-label={tq.preset2Aria(preset.label)}
                  className="flex items-center gap-1.5 rounded-lg border border-quantum-green/25 bg-quantum-navy/70 px-3 py-2 font-mono text-sm text-quantum-green transition-all duration-200 hover:-translate-y-0.5 hover:border-quantum-green/60 hover:shadow-[0_0_16px_rgba(0,184,148,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quantum-green"
                  dir="ltr"
                >
                  {presetBell && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#FF6B9D] shadow-[0_0_6px_#FF6B9D]"
                      aria-hidden="true"
                    />
                  )}
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* actions */}
        <div className="mt-auto flex flex-wrap gap-2 border-t border-white/5 pt-5">
          <Button
            type="button"
            onClick={measureOnce}
            className="min-h-11 flex-1 bg-quantum-blue font-heading text-quantum-navy shadow-[0_0_20px_rgba(0,217,255,0.25)] hover:bg-quantum-blue/85 hover:shadow-[0_0_30px_rgba(0,217,255,0.45)] sm:flex-none"
          >
            <Dices className="me-1.5 h-4 w-4" />
            {pg.measure}
          </Button>
          <Button
            type="button"
            onClick={runShots}
            variant="outline"
            className="min-h-11 flex-1 border-quantum-purple/40 bg-transparent font-heading text-quantum-purple hover:bg-quantum-purple/10 hover:text-quantum-purple sm:flex-none"
          >
            <Dices className="me-1.5 h-4 w-4" />
            {pg.shots}
          </Button>
          <Button
            type="button"
            onClick={undo}
            disabled={history.length === 0}
            variant="ghost"
            className="min-h-11 font-heading text-quantum-subtle hover:bg-white/5 hover:text-white"
          >
            <Undo2 className="me-1.5 h-4 w-4" />
            {pg.undo}
          </Button>
          <Button
            type="button"
            onClick={reset}
            variant="ghost"
            className="min-h-11 font-heading text-quantum-subtle hover:bg-white/5 hover:text-white"
          >
            <RotateCcw className="me-1.5 h-4 w-4" />
            {pg.reset}
          </Button>
        </div>
      </QuantumCard>

      {/* ── Full-width histogram strip over the 4-outcome basis ── */}
      <div className="lg:col-span-2" role="status" aria-live="polite" aria-label={pg.resultAria}>
        <span className="sr-only">{liveMsg}</span>
        <AnimatePresence mode="wait">
          {shots && (
            <motion.div
              key={shots.join("-")}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-quantum-blue/15 bg-quantum-secondary/70 p-5 backdrop-blur-sm"
            >
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="space-y-2.5">
                  {shots.map((n, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span dir="ltr" className="w-12 shrink-0 font-mono text-sm" style={{ color: JOINT_COLORS[i] }}>
                        {ketLabel(i)}
                      </span>
                      <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: JOINT_COLORS[i], boxShadow: `0 0 14px ${JOINT_COLORS[i]}66` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${n}%` }}
                          transition={{ type: "spring", stiffness: 60, damping: 16 }}
                        />
                      </div>
                      <span dir="ltr" className="w-8 shrink-0 text-end font-mono text-sm text-white">
                        {n}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-start">
                  <p className="text-sm text-quantum-subtle" dir={isAr ? "rtl" : "ltr"}>
                    {tq.shotsSummary2(
                      shots.map((n, i) => `${n}× ${ketLabel(i)}`).filter((s) => !s.startsWith("0×")).join(" · ")
                    )}
                  </p>
                  <p className="mt-1 text-[11px] italic text-quantum-subtle/70">
                    {pg.histogramNote}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pedagogy footer — the Phase-2 pitch inside the toy ── */}
      <motion.div variants={quantumVariants} className="lg:col-span-2">
        <div className="relative overflow-hidden rounded-2xl border border-[#FF6B9D]/15 bg-gradient-to-br from-quantum-navy/90 to-quantum-secondary/60 p-6 md:p-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 end-6 select-none font-heading text-[7rem] font-black leading-none text-white/[0.04]"
            dir="ltr"
          >
            ⊗
          </span>
          <p className="max-w-3xl text-sm leading-relaxed text-quantum-subtle md:text-base" dir={isAr ? "rtl" : "ltr"}>
            {tq.pedagogy2Pre}
            <span className="font-heading font-bold text-[#FF6B9D]">{tq.pedagogy2Accent}</span>
            {tq.pedagogy2Post}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
