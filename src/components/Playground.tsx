"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  RotateCcw,
  Undo2,
  Gauge,
  Dices,
  CircuitBoard,
  Orbit,
  Atom,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import QuantumCard from "@/components/ui/QuantumCard";
import { useLang } from "@/lib/LanguageProvider";
import { quantumVariants, staggerContainer, viewport } from "@/lib/animations";
import {
  GATES,
  PRESETS,
  ZERO_STATE,
  applyGate,
  bloch,
  cformat,
  cloneState,
  probabilities,
  relativePhase,
  sampleOnce,
  type GateDef,
  type QubitState,
} from "@/lib/quantum";
import { Button } from "@/components/ui/button";

/**
 * SECTION 04 — TRY QUANTUM · the interactive qubit playground.
 *
 * A real single-qubit engine (src/lib/quantum.ts) rendered three ways:
 * a Bloch disc, a probability meter, and a circuit wire. The pitch in
 * miniature: "quantum" is not hand-waving — it is this math, and our
 * students will run it on real hardware.
 *
 * RTL note: physics notation (|0⟩, gate symbols, amplitudes) is pinned
 * dir="ltr" inside both languages; only surrounding chrome flips.
 */

interface Snapshot {
  state: QubitState;
  circuit: string[];
}

const HISTORY_LIMIT = 32;
const CIRCUIT_WINDOW = 9;

export default function Playground() {
  const { t, tx, isAr } = useLang();
  const pg = t.playground;

  const [state, setState] = useState<QubitState>(ZERO_STATE);
  const [circuit, setCircuit] = useState<string[]>([]);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [flash, setFlash] = useState<0 | 1 | null>(null);
  const [shots, setShots] = useState<{ zeros: number; ones: number } | null>(
    null
  );
  const [liveMsg, setLiveMsg] = useState<string>("");
  const [hoverGate, setHoverGate] = useState<GateDef | null>(null);

  const { p0, p1 } = useMemo(() => probabilities(state), [state]);
  const { x, z } = useMemo(() => bloch(state), [state]);
  const phase = useMemo(() => relativePhase(state), [state]);

  /** Push the current configuration onto the decoherence-proof undo stack. */
  const snapshot = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-HISTORY_LIMIT + 1),
      { state: cloneState(state), circuit: [...circuit] },
    ]);
  }, [state, circuit]);

  const applyOne = useCallback(
    (gate: GateDef) => {
      snapshot();
      setState((prev) => applyGate(prev, gate.matrix));
      setCircuit((prev) => [...prev, gate.symbol]);
      setShots(null); // new state → old statistics no longer describe it
      setFlash(null);
    },
    [snapshot]
  );

  const loadPreset = useCallback(
    (presetState: QubitState) => {
      snapshot();
      setState(cloneState(presetState));
      setCircuit([]);
      setShots(null);
      setFlash(null);
    },
    [snapshot]
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setState(last.state);
      setCircuit(last.circuit);
      setShots(null);
      setFlash(null);
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    snapshot();
    setState(ZERO_STATE);
    setCircuit([]);
    setShots(null);
    setFlash(null);
  }, [snapshot]);

  /** Projective measurement in the computational basis — collapses ψ. */
  const measureOnce = useCallback(() => {
    snapshot();
    const outcome = sampleOnce(state);
    const collapsed: QubitState =
      outcome === 0
        ? { a: { re: 1, im: 0 }, b: { re: 0, im: 0 } }
        : { a: { re: 0, im: 0 }, b: { re: 1, im: 0 } };
    setState(collapsed);
    setShots(null);
    setFlash(outcome);
    setLiveMsg(pg.collapsedTo(String(outcome)));
  }, [state, snapshot, pg]);

  /** Born-rule sampling ×100 — the state itself is left untouched. */
  const runShots = useCallback(() => {
    let zeros = 0;
    for (let i = 0; i < 100; i++) if (sampleOnce(state) === 0) zeros++;
    setShots({ zeros, ones: 100 - zeros });
    setLiveMsg(pg.shotsSummary(zeros, 100 - zeros));
  }, [state, pg]);

  // Bloch disc geometry — a pure state always lies ON the sphere, so the
  // vector length is constant and only its angle ever animates.
  const R = 86;
  const CX = 120;
  const CY = 120;
  const thetaDeg = (Math.atan2(x, z) * 180) / Math.PI;
  const phaseDeg = (phase * 180) / Math.PI;
  const hasB = p1 > 0.001;

  const visibleChips = circuit.slice(-CIRCUIT_WINDOW);
  const hiddenCount = circuit.length - visibleChips.length;

  return (
    <section
      id="playground"
      className="relative py-24 md:py-32"
      aria-label={t.misc.playgroundAria}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={pg.eyebrow}
          title={pg.title}
          subtitle={pg.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* ── Left: the Bloch disc + probability meter ── */}
          <QuantumCard accent="#00D9FF" noReveal className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* Bloch disc (xz-plane projection of the Bloch sphere) */}
              <div className="relative shrink-0">
                <svg
                  width="240"
                  height="240"
                  viewBox="0 0 240 240"
                  role="img"
                  aria-label={pg.blochAria}
                  dir="ltr"
                  className="drop-shadow-[0_0_24px_rgba(0,217,255,0.15)]"
                >
                  {/* sphere silhouette */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="rgba(17,34,64,0.6)"
                    stroke="rgba(0,217,255,0.35)"
                    strokeWidth="1.5"
                  />
                  {/* equator hint */}
                  <ellipse
                    cx={CX}
                    cy={CY}
                    rx={R}
                    ry={R * 0.32}
                    fill="none"
                    stroke="rgba(108,92,231,0.4)"
                    strokeWidth="1"
                    strokeDasharray="4 5"
                  />
                  {/* z axis */}
                  <line
                    x1={CX}
                    y1={CY - R - 12}
                    x2={CX}
                    y2={CY + R + 12}
                    stroke="rgba(136,146,176,0.35)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  {/* pole labels */}
                  <text
                    x={CX}
                    y={CY - R - 16}
                    textAnchor="middle"
                    fill="#00D9FF"
                    fontSize="14"
                    fontFamily="var(--font-mono), monospace"
                  >
                    |0⟩
                  </text>
                  <text
                    x={CX}
                    y={CY + R + 24}
                    textAnchor="middle"
                    fill="#6C5CE7"
                    fontSize="14"
                    fontFamily="var(--font-mono), monospace"
                  >
                    |1⟩
                  </text>

                  {/* rotating state vector — length is constant for pure states */}
                  <g transform={`translate(${CX} ${CY})`}>
                    <motion.g
                      animate={{ rotate: thetaDeg }}
                      transition={{ type: "spring", stiffness: 120, damping: 16 }}
                      style={{ transformOrigin: "0px 0px" }}
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={-R}
                        stroke="#00D9FF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* glowing vector tip */}
                      <circle
                        cx="0"
                        cy={-R}
                        r="7"
                        fill="#00D9FF"
                        className="animate-pulse-glow"
                      />
                    </motion.g>
                    {/* origin pivot */}
                    <circle cx="0" cy="0" r="3" fill="#8892B0" />
                  </g>

                  {/* ground-state shading: |α|² of the disc from the top */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="url(#probGrad)"
                    opacity="0.16"
                    style={{
                      clipPath: `inset(${p0 * 100}% 0 0 0)`,
                    }}
                  />
                  <defs>
                    <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D9FF" />
                      <stop offset="100%" stopColor="#6C5CE7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* measurement collapse flash */}
                <AnimatePresence>
                  {flash !== null && (
                    <motion.div
                      key={flash}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.6 }}
                      transition={{ duration: 0.45 }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                      dir="ltr"
                    >
                      <span className="font-mono text-5xl font-bold text-quantum-blue text-glow">
                        |{flash}⟩
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* probability meter + phase dial + amplitude readout */}
              <div className="flex w-full min-w-0 flex-1 flex-col gap-5">
                <div dir={isAr ? "rtl" : "ltr"}>
                  <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-quantum-subtle">
                    <Atom className="me-1.5 inline h-3.5 w-3.5 text-quantum-blue" />
                    {pg.stateLabel}
                  </p>
                  <p
                    dir="ltr"
                    className="rounded-lg border border-quantum-blue/15 bg-quantum-navy/70 px-3 py-2.5 text-center font-mono text-sm text-quantum-blue"
                  >
                    |ψ⟩ = {cformat(state.a)}|0⟩ + {cformat(state.b)}|1⟩
                  </p>
                </div>

                {/* Born-rule probability bars */}
                <div className="space-y-3" role="img" aria-label={`${pg.prob0Label} ${(p0 * 100).toFixed(0)}%, ${pg.prob1Label} ${(p1 * 100).toFixed(0)}%`}>
                  {(
                    [
                      { label: pg.prob0Label, p: p0, color: "#00D9FF" },
                      { label: pg.prob1Label, p: p1, color: "#6C5CE7" },
                    ] as const
                  ).map((row) => (
                    <div key={row.label}>
                      <div className="mb-1 flex items-center justify-between text-[11px] text-quantum-subtle">
                        <span dir={isAr ? "rtl" : "ltr"}>{row.label}</span>
                        <span dir="ltr" className="font-mono text-white">
                          {(row.p * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${row.color}, ${row.color}99)`,
                            boxShadow: `0 0 12px ${row.color}66`,
                          }}
                          animate={{ width: `${row.p * 100}%` }}
                          transition={{ type: "spring", stiffness: 110, damping: 18 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* relative-phase dial — the invisible axis that makes quantum quantum */}
                <div className="flex items-center gap-4 rounded-lg border border-quantum-purple/20 bg-quantum-navy/60 p-3">
                  <svg width="56" height="56" viewBox="0 0 56 56" dir="ltr" aria-hidden="true">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="rgba(108,92,231,0.35)"
                      strokeWidth="1.5"
                      strokeDasharray="3 4"
                    />
                    <motion.g
                      animate={{ rotate: phaseDeg }}
                      transition={{ type: "spring", stiffness: 120, damping: 16 }}
                      style={{ transformOrigin: "28px 28px" }}
                      opacity={hasB ? 1 : 0.25}
                    >
                      <line
                        x1="28"
                        y1="28"
                        x2="50"
                        y2="28"
                        stroke={hasB ? "#FFD166" : "#8892B0"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="50"
                        cy="28"
                        r="3"
                        fill={hasB ? "#FFD166" : "#8892B0"}
                      />
                    </motion.g>
                    <circle cx="28" cy="28" r="2.5" fill="#8892B0" />
                  </svg>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-quantum-subtle" dir={isAr ? "rtl" : "ltr"}>
                      {pg.phaseLabel}
                    </p>
                    <p dir="ltr" className="font-mono text-sm text-white">
                      {hasB ? `${phase.toFixed(2)} rad` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </QuantumCard>

          {/* ── Right: gate rack, circuit wire, presets, actions ── */}
          <QuantumCard accent="#6C5CE7" noReveal className="flex flex-col gap-6 p-6 md:p-8">
            {/* gates */}
            <div aria-label={pg.controlsAria}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-white">
                  <Gauge className="h-4 w-4 text-quantum-purple" />
                  {pg.gatesTitle}
                </h3>
                <p className="text-[11px] text-quantum-subtle">{pg.gatesHint}</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {GATES.map((gate) => (
                  <button
                    key={gate.symbol}
                    type="button"
                    onClick={() => applyOne(gate)}
                    onMouseEnter={() => setHoverGate(gate)}
                    onMouseLeave={() => setHoverGate(null)}
                    onFocus={() => setHoverGate(gate)}
                    onBlur={() => setHoverGate(null)}
                    aria-label={pg.gateAria(tx(gate.name))}
                    aria-describedby="gate-blurb"
                    className="group/gate flex h-16 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-quantum-navy/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--gate-accent)_60%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quantum-blue"
                    style={{ "--gate-accent": gate.accent } as React.CSSProperties}
                  >
                    <span
                      className="font-mono text-lg font-bold transition-colors"
                      style={{ color: gate.accent }}
                    >
                      {gate.symbol}
                    </span>
                    <span className="px-1 text-center text-[9px] leading-tight text-quantum-subtle">
                      {tx(gate.name)}
                    </span>
                  </button>
                ))}
              </div>
              {/* gate intuition panel (hover/focus driven) */}
              <div
                id="gate-blurb"
                aria-live="polite"
                className="mt-3 min-h-[3.25rem] rounded-lg border border-white/5 bg-quantum-navy/60 px-3 py-2.5 text-xs leading-relaxed text-quantum-subtle"
              >
                {hoverGate ? (
                  <span>
                    <span
                      className="me-1.5 font-mono font-bold"
                      style={{ color: hoverGate.accent }}
                      dir="ltr"
                    >
                      {hoverGate.symbol}
                    </span>
                    {tx(hoverGate.blurb)}
                  </span>
                ) : (
                  <span className="opacity-50" dir={isAr ? "rtl" : "ltr"}>
                    {pg.gatesHint}
                  </span>
                )}
              </div>
            </div>

            {/* circuit wire */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold text-white">
                <CircuitBoard className="h-4 w-4 text-quantum-blue" />
                {pg.circuitTitle}
                {circuit.length > 0 && (
                  <span className="ms-auto font-mono text-[10px] text-quantum-subtle" dir="ltr">
                    {circuit.length} op{circuit.length === 1 ? "" : "s"}
                  </span>
                )}
              </h3>
              <div
                dir="ltr"
                className="relative flex min-h-[3.5rem] items-center overflow-hidden rounded-lg border border-quantum-blue/15 bg-quantum-navy/70 px-3"
              >
                {/* the wire */}
                <div
                  className="pointer-events-none absolute inset-x-3 top-1/2 h-px bg-gradient-to-r from-transparent via-quantum-blue/40 to-transparent"
                  aria-hidden="true"
                />
                {visibleChips.length === 0 ? (
                  <span className="relative z-10 w-full text-center font-mono text-xs text-quantum-subtle/70">
                    {pg.emptyCircuit}
                  </span>
                ) : (
                  <div className="relative z-10 flex w-full items-center gap-1.5 py-2">
                    {hiddenCount > 0 && (
                      <span className="font-mono text-[10px] text-quantum-subtle">
                        +{hiddenCount}
                      </span>
                    )}
                    <AnimatePresence initial={false}>
                      {visibleChips.map((symbol, idx) => {
                        const gate = GATES.find((g) => g.symbol === symbol);
                        return (
                          <motion.span
                            key={`${idx}-${symbol}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-quantum-secondary font-mono text-sm font-bold shadow-[0_0_10px_rgba(0,0,0,0.4)]"
                            style={{
                              color: gate?.accent ?? "#00D9FF",
                              borderColor: `${gate?.accent ?? "#00D9FF"}55`,
                            }}
                          >
                            {symbol}
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                    {/* metering dash at the end of the wire */}
                    <motion.span
                      className="ms-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-quantum-blue/40 bg-quantum-navy font-mono text-xs text-quantum-blue"
                      animate={{ boxShadow: [
                        "0 0 0 rgba(0,217,255,0)",
                        "0 0 14px rgba(0,217,255,0.45)",
                        "0 0 0 rgba(0,217,255,0)",
                      ] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      title="measure"
                    >
                      ⌖
                    </motion.span>
                  </div>
                )}
              </div>
            </div>

            {/* presets */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold text-white">
                <Orbit className="h-4 w-4 text-quantum-green" />
                {pg.presetsTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => loadPreset(preset.state)}
                    title={tx(preset.note)}
                    aria-label={pg.presetAria(preset.label)}
                    className="rounded-lg border border-quantum-green/25 bg-quantum-navy/70 px-3.5 py-2 font-mono text-sm text-quantum-green transition-all duration-200 hover:-translate-y-0.5 hover:border-quantum-green/60 hover:shadow-[0_0_16px_rgba(0,184,148,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-quantum-green"
                  >
                    {preset.label}
                  </button>
                ))}
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

          {/* ── Full-width result strip + histogram ── */}
          <div
            className="lg:col-span-2"
            role="status"
            aria-live="polite"
            aria-label={pg.resultAria}
          >
            <AnimatePresence mode="wait">
              {shots && (
                <motion.div
                  key={`${shots.zeros}-${shots.ones}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl border border-quantum-blue/15 bg-quantum-secondary/70 p-5 backdrop-blur-sm"
                >
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="space-y-2.5">
                      {(
                        [
                          { n: shots.zeros, label: "|0⟩", color: "#00D9FF" },
                          { n: shots.ones, label: "|1⟩", color: "#6C5CE7" },
                        ] as const
                      ).map((bar) => (
                        <div key={bar.label} className="flex items-center gap-3">
                          <span dir="ltr" className="w-10 shrink-0 font-mono text-sm" style={{ color: bar.color }}>
                            {bar.label}
                          </span>
                          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: bar.color, boxShadow: `0 0 14px ${bar.color}66` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${bar.n}%` }}
                              transition={{ type: "spring", stiffness: 60, damping: 16 }}
                            />
                          </div>
                          <span dir="ltr" className="w-8 shrink-0 text-end font-mono text-sm text-white">
                            {bar.n}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="text-center sm:text-start">
                      <p dir={isAr ? "rtl" : "ltr"} className="text-sm text-quantum-subtle">
                        {pg.shotsSummary(shots.zeros, shots.ones)}
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

          {/* ── Pedagogy footer — the pitch inside the toy ── */}
          <motion.div variants={quantumVariants} className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-quantum-blue/15 bg-gradient-to-br from-quantum-navy/90 to-quantum-secondary/60 p-6 md:p-8">
              {/* decorative psi */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 end-6 select-none font-heading text-[7rem] font-black leading-none text-white/[0.04]"
                dir="ltr"
              >
                ψ
              </span>
              <p className="max-w-3xl text-sm leading-relaxed text-quantum-subtle md:text-base" dir={isAr ? "rtl" : "ltr"}>
                {pg.pedagogyPre}
                <span className="font-heading font-bold text-quantum-blue">
                  {pg.pedagogyAccent}
                </span>
                {pg.pedagogyPost}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
