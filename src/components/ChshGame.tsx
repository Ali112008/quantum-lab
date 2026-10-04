"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dices,
  GraduationCap,
  Link2,
  RotateCcw,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import QuantumCard from "@/components/ui/QuantumCard";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/LanguageProvider";
import { quantumVariants, viewport } from "@/lib/animations";
import {
  CHSH_CLASSICAL_S,
  CHSH_CLASSICAL_WIN,
  CHSH_QUANTUM_S,
  CHSH_QUANTUM_WIN,
  c,
  chshPhiA,
  chshPhiB,
  sampleChsh,
  type TwoQubitState,
} from "@/lib/quantum";
/**
 * THE CHSH GAME — Bell's inequality played live, inside SECTION 04.
 *
 * The loophole-free heart of the pitch. Alice and Bob share one Bell pair
 * per round and may NOT communicate. A referee hands Alice a random bit x
 * and Bob a random bit y; each must output a bit. The pair wins the round
 * IFF a ⊕ b = x·y.
 *
 *   · any classical strategy (even with shared randomness) wins ≤ 75%
 *   · measuring the shared Φ⁺ in rotated bases wins cos²(π/8) ≈ 85.36%
 *   · the CHSH statistic S built from all four setting pairs obeys
 *     |S| ≤ 2 classically but reaches 2√2 ≈ 2.83 quantumly (Tsirelson).
 *
 * The coach toggle suggests the optimal basis per station:
 *   φA = x·π/4      (Z axis, or halfway to X)
 *   φB = π/8 − y·π/4 (the famous ±22.5° half-angle split)
 *
 * Physics honesty: the engine (src/lib/quantum.ts) computes the full
 * Born rule over rotated bases — verified against cos(2Δφ) analytically
 * and against a 20k-round Monte-Carlo before shipping. The shared pair
 * is a fresh Φ⁺ every round, exactly like a Bell-test photon source.
 *
 * RTL note: all angles, bits and S values are pinned dir="ltr"; only
 * surrounding chrome flips.
 */

const GOLD = "#FFD166"; // the game's accent — referee yellow
const WIN_GREEN = "#00B894";
const LOSS_RED = "#FF6B6B";
const ENTANGLED_COLOR = "#FF6B9D";
const HISTORY_DOTS = 14; // recent rounds shown in the dot strip
const SIGNIFICANCE = 8; // samples per setting before S is "real"

/** Per-setting tally: one of the four (x,y) combinations. */
interface SettingTally {
  same: number;
  diff: number;
  n: number;
}

const EMPTY_TALLY = (): SettingTally[] =>
  Array.from({ length: 4 }, () => ({ same: 0, diff: 0, n: 0 }));

/** The shared resource — one fresh Bell pair per round. */
const BELL_PHI_PLUS: TwoQubitState = {
  amps: [c(Math.SQRT1_2), c(0), c(0), c(Math.SQRT1_2)],
};

type Phase = "ready" | "choosing" | "result";

interface Outcome {
  a: 0 | 1;
  b: 0 | 1;
  win: boolean;
}

/* ------------------------------------------------------------------ */
/*                        Basis dial (mini SVG)                        */
/* ------------------------------------------------------------------ */

/**
 * A tiny measurement dial: the needle shows which axis in the X–Z plane
 * this station will project onto. Z points up; 45° tilts halfway to X.
 * The angle is PHYSICAL — 22.5° is literally the number that breaks Bell.
 */
function BasisDial({ phi, accent }: { phi: number; accent: string }) {
  const SIZE = 56;
  const C = SIZE / 2;
  const R = 21;
  const deg = (phi * 180) / Math.PI;
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      dir="ltr"
      className="shrink-0"
    >
      <circle cx={C} cy={C} r={R} fill="rgba(10,25,47,0.7)" stroke="rgba(136,146,176,0.35)" strokeWidth="1.2" />
      {/* Z axis tick (0°) and X axis tick (90°) — the reference frame */}
      <line x1={C} y1={C - R + 1} x2={C} y2={C - R + 6} stroke="#8892B0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={C + R - 1} y1={C} x2={C + R - 6} y2={C} stroke="#8892B0" strokeWidth="1.5" strokeLinecap="round" />
      {/* the needle, rotated to φ */}
      <g transform={`rotate(${deg} ${C} ${C})`}>
        <motion.line
          x1={C}
          y1={C}
          x2={C}
          y2={C - R + 3}
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: 1 }}
        />
        <circle cx={C} cy={C - R + 3} r="3.2" fill={accent} />
      </g>
      <circle cx={C} cy={C} r="2" fill="#8892B0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*                             The game                                */
/* ------------------------------------------------------------------ */

export default function ChshGame() {
  const { t } = useLang();
  const ch = t.chsh;

  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [x, setX] = useState<0 | 1 | null>(null);
  const [y, setY] = useState<0 | 1 | null>(null);
  const [phiA, setPhiA] = useState<number | null>(null);
  const [phiB, setPhiB] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [coach, setCoach] = useState(true);
  const [tally, setTally] = useState<SettingTally[]>(EMPTY_TALLY);
  const [history, setHistory] = useState<boolean[]>([]);
  const [wins, setWins] = useState(0);
  const [violated, setViolated] = useState(false);

  const target: 0 | 1 | null = x !== null && y !== null ? ((x & y) as 0 | 1) : null;

  /** Aggregate stats. */
  const totalRounds = tally.reduce((acc, s) => acc + s.n, 0);
  const winRate = totalRounds > 0 ? wins / totalRounds : 0;

  /**
   * The CHSH statistic S = E(0,0) + E(0,1) + E(1,0) − E(1,1), where
   * E = P(same) − P(diff) per setting pair. Estimable only after all
   * four (x,y) combinations have been played.
   */
  const S = useMemo<number | null>(() => {
    if (tally.some((s) => s.n === 0)) return null;
    const E = tally.map((s) => (s.same - s.diff) / s.n);
    return E[0] + E[1] + E[2] - E[3];
  }, [tally]);

  /* --------------------------- game flow --------------------------- */

  const deal = useCallback(() => {
    setX(Math.random() < 0.5 ? 0 : 1);
    setY(Math.random() < 0.5 ? 0 : 1);
    setPhiA(null);
    setPhiB(null);
    setOutcome(null);
    setRound((r) => r + 1);
    setPhase("choosing");
  }, []);

  const measure = useCallback(() => {
    if (x === null || y === null || phiA === null || phiB === null) return;
    const { a, b } = sampleChsh(BELL_PHI_PLUS, phiA, phiB);
    const t2: 0 | 1 = (x & y) as 0 | 1;
    const win = (a ^ b) === t2;
    const idx = x * 2 + y;

    // Fold this round into the per-setting tally.
    const nextTally: SettingTally[] = tally.map((s, i) =>
      i === idx
        ? a === b
          ? { ...s, same: s.same + 1, n: s.n + 1 }
          : { ...s, diff: s.diff + 1, n: s.n + 1 }
        : s
    );

    // One celebration, ever — crossing |S| > 2 with real sampling stats
    // (every setting pair played at least SIGNIFICANCE times).
    if (!violated && nextTally.every((s) => s.n >= SIGNIFICANCE)) {
      const E = nextTally.map((s) => (s.same - s.diff) / s.n);
      if (E[0] + E[1] + E[2] - E[3] > CHSH_CLASSICAL_S) setViolated(true);
    }

    setOutcome({ a, b, win });
    setTally(nextTally);
    setWins((w) => (win ? w + 1 : w));
    setHistory((h) => [...h.slice(-(HISTORY_DOTS - 1)), win]);
    setPhase("result");
  }, [x, y, phiA, phiB, tally, violated]);

  const nextRound = useCallback(() => {
    setPhase("ready");
    setOutcome(null);
  }, []);

  const resetStats = useCallback(() => {
    setTally(EMPTY_TALLY());
    setHistory([]);
    setWins(0);
    setRound(0);
    setPhase("ready");
    setX(null);
    setY(null);
    setPhiA(null);
    setPhiB(null);
    setOutcome(null);
    setViolated(false);
  }, []);

  /* --------------------------- render ------------------------------ */

  const stationLocked = phase !== "choosing";
  const optimalA: 0 | 1 = x === 0 ? 0 : 1;
  const optimalB: 0 | 1 = y === 0 ? 0 : 1;

  // Basis geometry lives in the engine (quantum.ts) — the UI only renders it.
  const basisA = [
    { id: 0 as const, phi: chshPhiA(0), label: ch.basisA0, blurb: ch.basisBlurbA0, accent: "#00D9FF" },
    { id: 1 as const, phi: chshPhiA(1), label: ch.basisA1, blurb: ch.basisBlurbA1, accent: "#00D9FF" },
  ];
  const basisB = [
    { id: 0 as const, phi: chshPhiB(0), label: ch.basisB0, blurb: ch.basisBlurbB0, accent: "#6C5CE7" },
    { id: 1 as const, phi: chshPhiB(1), label: ch.basisB1, blurb: ch.basisBlurbB1, accent: "#6C5CE7" },
  ];

  const winPct = winRate * 100;
  const sClamp = S !== null ? Math.min(Math.max(S, 0), CHSH_QUANTUM_S) : 0;
  const sBeat = S !== null && S > CHSH_CLASSICAL_S;

  return (
    <QuantumCard accent={GOLD} noReveal className="p-6 md:p-8">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-white">
          <Swords className="h-4 w-4" style={{ color: GOLD }} />
          {ch.title}
          <span className="font-mono text-[10px] tracking-[0.25em] text-quantum-subtle" dir="ltr">
            a ⊕ b = x·y
          </span>
        </h3>
        {/* coach toggle */}
        <button
          type="button"
          onClick={() => setCoach((c2) => !c2)}
          aria-pressed={coach}
          className={`flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition-all ${
            coach
              ? "border-[#FFD166]/60 bg-[#FFD166]/10 text-[#FFD166] shadow-[0_0_14px_rgba(255,209,102,0.25)]"
              : "border-white/10 bg-quantum-secondary/60 text-quantum-subtle hover:border-[#FFD166]/40 hover:text-white"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
          {ch.coachLabel} {coach ? "ON" : "OFF"}
        </button>
      </div>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-quantum-subtle md:text-sm">
        {ch.subtitle}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* ══════════════ LEFT: the duel ══════════════ */}
        <div className="flex flex-col gap-5">
          {/* challenge zone
              NOTE: no AnimatePresence mode="wait" here — rapid phase flips
              (a user speed-running the game) can orphan a pending enter and
              freeze the zone with no button at all. Plain conditional render
              keeps enter animations while making a stall impossible. */}
          <div className="relative min-h-[132px] overflow-hidden rounded-xl border border-[#FFD166]/15 bg-quantum-navy/60 p-4">
            {phase === "ready" ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-[100px] flex-col items-center justify-center gap-3 text-center"
                >
                  <Target className="h-5 w-5 text-[#FFD166]/70" aria-hidden="true" />
                  <Button
                    type="button"
                    onClick={deal}
                    className="min-h-11 bg-[#FFD166] font-heading text-quantum-navy shadow-[0_0_20px_rgba(255,209,102,0.3)] hover:bg-[#FFD166]/85 hover:shadow-[0_0_30px_rgba(255,209,102,0.5)]"
                  >
                    <Dices className="me-1.5 h-4 w-4" />
                    {ch.dealBtn}
                  </Button>
                </motion.div>
            ) : (
                <motion.div
                  key={`round-${round}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-[#FFD166]/80">
                    {ch.roundN(round)}
                  </p>
                  <div className="grid grid-cols-2 gap-3" dir="ltr">
                    {/* Alice's question card */}
                    <motion.div
                      initial={{ opacity: 0, y: 14, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className="rounded-lg border border-[#00D9FF]/30 bg-[#00D9FF]/[0.06] p-3"
                    >
                      <p className="font-mono text-[9px] tracking-[0.2em] text-[#00D9FF]/80">
                        ALICE · x
                      </p>
                      <p className="font-mono text-3xl font-black text-white">{x}</p>
                    </motion.div>
                    {/* Bob's question card */}
                    <motion.div
                      initial={{ opacity: 0, y: 14, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.08 }}
                      className="rounded-lg border border-[#6C5CE7]/30 bg-[#6C5CE7]/[0.06] p-3"
                    >
                      <p className="font-mono text-[9px] tracking-[0.2em] text-[#6C5CE7]/80">
                        BOB · y
                      </p>
                      <p className="font-mono text-3xl font-black text-white">{y}</p>
                    </motion.div>
                  </div>
                  {/* the target */}
                  {target !== null && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 rounded-lg border border-[#FFD166]/30 bg-[#FFD166]/[0.07] px-3 py-1.5 text-center font-mono text-[11px] font-bold text-[#FFD166]"
                    >
                      {target === 0 ? ch.targetSame : ch.targetDiff}
                    </motion.p>
                  )}
                </motion.div>
            )}
          </div>

          {/* the two stations */}
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              { who: ch.aliceStation, basis: basisA, sel: phiA, set: setPhiA, opt: optimalA, q: x === null ? null : ch.questionAlice(x as 0 | 1) },
              { who: ch.bobStation, basis: basisB, sel: phiB, set: setPhiB, opt: optimalB, q: y === null ? null : ch.questionBob(y as 0 | 1) },
            ] as const).map((station) => (
              <div
                key={station.who}
                role="radiogroup"
                aria-label={ch.stationAria(station.who)}
                className="rounded-xl border border-white/8 bg-quantum-secondary/50 p-3"
              >
                <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-quantum-subtle">
                  {station.who}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {station.basis.map((b) => {
                    const selected = station.sel === b.phi;
                    const isCoachPick = coach && !stationLocked && station.opt === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={stationLocked}
                        onClick={() => station.set(b.phi)}
                        title={b.blurb}
                        className={`relative flex min-h-11 items-center gap-2 rounded-lg border p-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                          selected
                            ? "border-[#FFD166]/70 bg-[#FFD166]/10 shadow-[0_0_16px_rgba(255,209,102,0.3)]"
                            : "border-white/10 bg-quantum-navy/70 hover:border-white/25"
                        } ${isCoachPick && !selected ? "animate-pulse-glow border-[#FFD166]/50" : ""}`}
                      >
                        <BasisDial phi={b.phi} accent={b.accent} />
                        <span className="font-mono text-xs font-bold text-white" dir="ltr">
                          {b.label}
                        </span>
                        {isCoachPick && (
                          <span className="absolute -top-2 end-1.5 rounded-full border border-[#FFD166]/60 bg-quantum-navy px-1.5 py-px font-mono text-[8px] tracking-wider text-[#FFD166]">
                            {ch.coachPick}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {station.q && (
                  <p className="mt-2 text-[10px] leading-relaxed text-quantum-subtle/80">
                    {station.q}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* actions + result */}
          <div className="mt-auto flex flex-wrap items-center gap-2">
            {phase === "choosing" && (
              <Button
                type="button"
                onClick={measure}
                disabled={phiA === null || phiB === null}
                className="min-h-11 flex-1 bg-quantum-blue font-heading text-quantum-navy shadow-[0_0_20px_rgba(0,217,255,0.25)] hover:bg-quantum-blue/85 sm:flex-none"
              >
                <Dices className="me-1.5 h-4 w-4" />
                {ch.measureBtn}
              </Button>
            )}
            {phase === "result" && (
              <Button
                type="button"
                onClick={nextRound}
                className="min-h-11 flex-1 bg-[#FFD166] font-heading text-quantum-navy shadow-[0_0_20px_rgba(255,209,102,0.3)] hover:bg-[#FFD166]/85 sm:flex-none"
              >
                <Swords className="me-1.5 h-4 w-4" />
                {ch.nextBtn}
              </Button>
            )}
            {phase === "ready" && totalRounds === 0 && (
              <span className="text-xs text-quantum-subtle/70">{ch.coachHintOn}</span>
            )}
            <Button
              type="button"
              onClick={resetStats}
              variant="ghost"
              aria-label={ch.resetAria}
              className="min-h-11 ms-auto font-heading text-quantum-subtle hover:bg-white/5 hover:text-white"
            >
              <RotateCcw className="me-1.5 h-4 w-4" />
              {ch.resetBtn}
            </Button>
          </div>

          {/* round result banner */}
          <AnimatePresence>
            {phase === "result" && outcome && target !== null && (
              <motion.div
                key={`result-${round}`}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                role="status"
                className="rounded-xl border p-4"
                style={{
                  borderColor: outcome.win ? `${WIN_GREEN}55` : `${LOSS_RED}55`,
                  background: outcome.win ? `${WIN_GREEN}12` : `${LOSS_RED}12`,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    className="font-heading text-sm font-black tracking-wide"
                    style={{ color: outcome.win ? WIN_GREEN : LOSS_RED }}
                  >
                    {outcome.win ? "★ " : "✕ "}
                    {outcome.win ? ch.winBanner : ch.lossBanner}
                  </p>
                  <div className="flex items-center gap-2 font-mono text-xs" dir="ltr">
                    {[
                      { k: "a", v: outcome.a, c: "#00D9FF" },
                      { k: "b", v: outcome.b, c: "#6C5CE7" },
                      { k: "a⊕b", v: outcome.a ^ outcome.b, c: "#FFFFFF" },
                      { k: "x·y", v: target, c: "#FFD166" },
                    ].map((chip) => (
                      <span
                        key={chip.k}
                        className="flex items-center gap-1 rounded-md border border-white/10 bg-quantum-navy/80 px-2 py-1"
                      >
                        <span className="text-[9px] text-quantum-subtle">{chip.k}</span>
                        <span className="font-bold" style={{ color: chip.c }}>
                          {chip.v}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-quantum-subtle">
                  <span dir="ltr">
                    {ch.winDetail(outcome.a, outcome.b, target)}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══════════════ RIGHT: shared pair + scoreboard ══════════════ */}
        <div className="flex flex-col gap-4">
          {/* shared pair chip */}
          <div className="rounded-xl border border-[#FF6B9D]/25 bg-[#FF6B9D]/[0.05] p-3">
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#FF6B9D]">
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
              {ch.sharedTitle}
              <span className="ms-auto flex items-center gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6B9D] shadow-[0_0_6px_#FF6B9D]" />
                <span className="font-mono text-xs text-white" dir="ltr">Φ⁺</span>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6B9D] shadow-[0_0_6px_#FF6B9D]" />
              </span>
            </p>
            <p className="mt-1.5 text-[10px] text-quantum-subtle">{ch.sharedNote}</p>
          </div>

          {/* scoreboard */}
          <div className="rounded-xl border border-white/8 bg-quantum-secondary/50 p-4">
            <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-quantum-subtle">
              {ch.statsTitle}
            </p>
            <div className="grid grid-cols-2 gap-2 text-center" dir="ltr">
              <div className="rounded-lg bg-quantum-navy/70 p-2">
                <p className="font-mono text-[9px] tracking-widest text-quantum-subtle">{ch.roundsLabel}</p>
                <p className="font-mono text-xl font-black text-white">{totalRounds}</p>
              </div>
              <div className="rounded-lg bg-quantum-navy/70 p-2">
                <p className="font-mono text-[9px] tracking-widest text-quantum-subtle">{ch.winsLabel}</p>
                <p className="font-mono text-xl font-black" style={{ color: WIN_GREEN }}>{wins}</p>
              </div>
            </div>

            {/* win-rate bar vs the two ceilings */}
            <div className="mt-4" role="img" aria-label={ch.winRateAria(Math.round(winPct))}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] text-quantum-subtle">
                  {ch.winRateLabel}
                </span>
                <span className="font-mono text-sm text-white" dir="ltr">
                  {winPct.toFixed(1)}%
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #00D9FF, ${WIN_GREEN})`,
                    boxShadow: `0 0 12px ${WIN_GREEN}55`,
                  }}
                  animate={{ width: `${winPct}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
                {/* classical ceiling 75% */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-px bg-white/60"
                  style={{ left: `${CHSH_CLASSICAL_WIN * 100}%` }}
                />
                {/* quantum optimum 85.4% */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-px bg-[#FFD166]"
                  style={{ left: `${CHSH_QUANTUM_WIN * 100}%`, boxShadow: `0 0 6px ${GOLD}` }}
                />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[8px] tracking-wider text-quantum-subtle/80" dir="ltr">
                <span>▎{ch.classicalMark}</span>
                <span style={{ color: `${GOLD}cc` }}>▎{ch.quantumMark}</span>
              </div>
            </div>

            {/* S estimator */}
            <div className="mt-4" role={S !== null ? "img" : undefined} aria-label={S !== null ? ch.sAria(S) : undefined}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] text-quantum-subtle">
                  {ch.sTitle}
                </span>
                <motion.span
                  key={S === null ? "pending" : S.toFixed(3)}
                  initial={{ opacity: 0.4, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`font-mono text-sm font-black ${sBeat ? "text-[#00B894]" : "text-white"}`}
                  dir="ltr"
                >
                  {S === null ? "S = —" : `S = ${S.toFixed(3)}`}
                </motion.span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-quantum-navy/80 ring-1 ring-inset ring-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: sBeat
                      ? `linear-gradient(90deg, #00D9FF, ${WIN_GREEN}, #FF6B9D)`
                      : `linear-gradient(90deg, #00D9FF, #6C5CE7)`,
                    boxShadow: sBeat ? `0 0 14px ${WIN_GREEN}88` : "none",
                  }}
                  animate={{ width: `${(sClamp / CHSH_QUANTUM_S) * 100}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
                {/* classical bound at S=2 → 70.7% of the 2√2 track */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 w-px bg-white/70"
                  style={{ left: `${(CHSH_CLASSICAL_S / CHSH_QUANTUM_S) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[8px] tracking-wider text-quantum-subtle/80" dir="ltr">
                <span>▎{ch.sClassicalMark}</span>
                <span>▎{ch.sQuantumMark}</span>
              </div>
              {S === null && (
                <p className="mt-1.5 text-[10px] italic text-quantum-subtle/70">{ch.sPending}</p>
              )}
            </div>

            {/* recent rounds strip */}
            <div className="mt-4" role="status" aria-label={ch.historyAria}>
              <p className="mb-1.5 font-mono text-[9px] tracking-[0.2em] text-quantum-subtle">
                {ch.historyLabel}
              </p>
              {history.length === 0 ? (
                <p className="text-[10px] text-quantum-subtle/60">{ch.noRoundYet}</p>
              ) : (
                <div className="flex flex-wrap gap-1.5" dir="ltr">
                  {history.map((won, i) => (
                    <motion.span
                      key={`${i}-${won}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: won ? WIN_GREEN : LOSS_RED,
                        boxShadow: won ? `0 0 6px ${WIN_GREEN}` : "none",
                        opacity: won ? 1 : 0.55,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bell violation celebration */}
          <AnimatePresence>
            {violated && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative overflow-hidden rounded-xl border border-[#FFD166]/50 bg-gradient-to-br from-[#FFD166]/[0.12] to-[#FF6B9D]/[0.08] p-4"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 end-3 select-none font-heading text-6xl font-black text-white/[0.05]"
                  dir="ltr"
                >
                  2√2
                </span>
                <p className="flex items-center gap-2 font-heading text-sm font-black text-[#FFD166]">
                  <Trophy className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  {ch.violationBadge}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-quantum-subtle">
                  {ch.violationNote}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* pedagogy footer */}
      <motion.div variants={quantumVariants} initial="hidden" whileInView="visible" viewport={viewport}>
        <div className="mt-6 border-t border-white/5 pt-4">
          <p className="text-xs leading-relaxed text-quantum-subtle md:text-sm">
            {ch.footerPre}
            <span className="font-heading font-bold text-[#FFD166]">{ch.footerAccent}</span>
            {ch.footerPost}
          </p>
        </div>
      </motion.div>
    </QuantumCard>
  );
}
