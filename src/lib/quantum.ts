import type { L10n } from "@/lib/i18n";

/**
 * A tiny, dependency-free single-qubit engine.
 *
 * Why hand-rolled?  Because a qubit is just two complex numbers — α and β —
 * and every gate is a 2×2 unitary matrix. Shipping this in ~150 lines shows
 * students (and funders) that the "quantum" in our lab is math we actually
 * understand, not a black box. The same linear algebra drives Qiskit's
 * `Statevector` class — ours just fits in a browser tab.
 *
 *   |ψ⟩ = α|0⟩ + β|1⟩,   |α|² + |β|² = 1
 */

/** A complex number a + bi. */
export interface Complex {
  re: number;
  im: number;
}

/** A pure single-qubit state |ψ⟩ = α|0⟩ + β|1⟩. */
export interface QubitState {
  a: Complex; // amplitude of |0⟩
  b: Complex; // amplitude of |1⟩
}

/* ------------------------------------------------------------------ */
/*                        Complex arithmetic                           */
/* ------------------------------------------------------------------ */

export const c = (re: number, im = 0): Complex => ({ re, im });

export const cmul = (x: Complex, y: Complex): Complex => ({
  re: x.re * y.re - x.im * y.im,
  im: x.re * y.im + x.im * y.re,
});

export const cadd = (x: Complex, y: Complex): Complex => ({
  re: x.re + y.re,
  im: x.im + y.im,
});

export const cabsSq = (z: Complex): number => z.re * z.re + z.im * z.im;

export const cexpI = (theta: number): Complex => ({
  re: Math.cos(theta),
  im: Math.sin(theta),
});

/** Round off floating-point dust so 0.4999999… prints as 0.5. */
const clean = (n: number): number => (Math.abs(n) < 1e-10 ? 0 : n);

export const cformat = (z: Complex): string => {
  const re = clean(z.re);
  const im = clean(z.im);
  // Fixed 2-decimal fixed-point keeps the readout stable while animating.
  // U+2212 minus keeps the typography as elegant as the math.
  const f = (n: number) => n.toFixed(2).replace("-", "−");
  if (im === 0) return f(re);
  const sign = im < 0 ? "−" : "+";
  return `${f(re)}${sign}${f(Math.abs(im))}i`;
};

/* ------------------------------------------------------------------ */
/*                          Gate definitions                           */
/* ------------------------------------------------------------------ */

/** A 2×2 complex matrix (row-major) acting on [α, β]. */
export type Matrix2 = [[Complex, Complex], [Complex, Complex]];

const INV_SQRT2 = Math.SQRT1_2;

export interface GateDef {
  /** Circuit symbol shown on the wire + button label. */
  symbol: string;
  name: L10n;
  /** One-line physical intuition, shown under the controls. */
  blurb: L10n;
  matrix: Matrix2;
  /** Accent color for the button glow / circuit chip. */
  accent: string;
}

/**
 * The Phase-1 starter set — exactly the gates a student meets in week one
 * of Qiskit training, nothing more. Keep the tour small: five gates are
 * enough to build every state in the preset gallery.
 */
export const GATES: GateDef[] = [
  {
    symbol: "H",
    name: { en: "Hadamard", ar: "هادامارد" },
    blurb: {
      en: "Puts |0⟩ into equal superposition (|+⟩) — the source of quantum parallelism.",
      ar: "يضع |0⟩ في تراكب متساوٍ (|+⟩) — مصدر التزامن الكمومي.",
    },
    matrix: [
      [c(INV_SQRT2), c(INV_SQRT2)],
      [c(INV_SQRT2), c(-INV_SQRT2)],
    ],
    accent: "#00D9FF",
  },
  {
    symbol: "X",
    name: { en: "Pauli-X (NOT)", ar: "باولي-X (النفي)" },
    blurb: {
      en: "The quantum NOT — flips |0⟩↔|1⟩, swapping the amplitudes.",
      ar: "النفي الكمومي — يقلب |0⟩↔|1⟩ ويبدّل السعات.",
    },
    matrix: [
      [c(0), c(1)],
      [c(1), c(0)],
    ],
    accent: "#6C5CE7",
  },
  {
    symbol: "Z",
    name: { en: "Pauli-Z", ar: "باولي-Z" },
    blurb: {
      en: "Phase flip — leaves |0⟩ alone, multiplies |1⟩ by −1. Invisible to measurement on |0⟩.",
      ar: "قلب الطور — يترك |0⟩ كما هو ويضرب |1⟩ بـ −1. لا يظهر في القياس على |0⟩.",
    },
    matrix: [
      [c(1), c(0)],
      [c(0), c(-1)],
    ],
    accent: "#00B894",
  },
  {
    symbol: "S",
    name: { en: "S (√Z phase)", ar: "S (طور √Z)" },
    blurb: {
      en: "Quarter-turn of phase: maps |+⟩ into |+i⟩. Two S gates make a Z.",
      ar: "ربع دورة طور: يحوّل |+⟩ إلى |+i⟩. بوابتا S تكافئان Z.",
    },
    matrix: [
      [c(1), c(0)],
      [c(0), cexpI(Math.PI / 2)],
    ],
    accent: "#FFD166",
  },
  {
    symbol: "T",
    name: { en: "T (π/8 phase)", ar: "T (طور π/8)" },
    blurb: {
      en: "The magic gate — without T's 45° phase, quantum computers could only do classical math.",
      ar: "البوابة السحرية — دون طور T البالغ 45°، لكانت الحواسيب الكمومية محدودة بحسابات كلاسيكية.",
    },
    matrix: [
      [c(1), c(0)],
      [c(0), cexpI(Math.PI / 4)],
    ],
    accent: "#FF6B9D",
  },
];

/* ------------------------------------------------------------------ */
/*                        State operations                             */
/* ------------------------------------------------------------------ */

/** The computational ground state |0⟩. */
export const ZERO_STATE: QubitState = { a: c(1), b: c(0) };

/** Apply a gate matrix to a state — a textbook matrix–vector product. */
export function applyGate(state: QubitState, gate: Matrix2): QubitState {
  const a = cadd(cmul(gate[0][0], state.a), cmul(gate[0][1], state.b));
  const b = cadd(cmul(gate[1][0], state.a), cmul(gate[1][1], state.b));
  // Renormalize to kill floating-point drift (unitarity is our safety net).
  const norm = Math.sqrt(cabsSq(a) + cabsSq(b));
  return {
    a: { re: clean(a.re / norm), im: clean(a.im / norm) },
    b: { re: clean(b.re / norm), im: clean(b.im / norm) },
  };
}

/** Born rule: P(outcome) = |amplitude|². */
export const probabilities = (s: QubitState): { p0: number; p1: number } => ({
  p0: cabsSq(s.a),
  p1: cabsSq(s.b),
});

/** Simulate one projective measurement in the computational basis. */
export function sampleOnce(s: QubitState): 0 | 1 {
  return Math.random() < cabsSq(s.a) ? 0 : 1;
}

/**
 * Bloch-sphere coordinates of a pure state:
 *   x = 2·Re(ᾱβ),  y = 2·Im(ᾱβ),  z = |α|² − |β|²
 * We render the xz-plane as the disc and report y as the relative phase.
 */
export function bloch(s: QubitState) {
  const x = clean(2 * (s.a.re * s.b.re + s.a.im * s.b.im));
  const y = clean(2 * (s.a.im * s.b.re - s.a.re * s.b.im));
  const z = clean(cabsSq(s.a) - cabsSq(s.b));
  return { x, y, z };
}

/** Relative phase φ = arg(β) − arg(α), normalized to (−π, π]. */
export function relativePhase(s: QubitState): number {
  const phi = Math.atan2(s.b.im, s.b.re) - Math.atan2(s.a.im, s.a.re);
  const wrapped = Math.atan2(Math.sin(phi), Math.cos(phi));
  return clean(wrapped);
}

/* ------------------------------------------------------------------ */
/*                          Preset gallery                             */
/* ------------------------------------------------------------------ */

export interface PresetDef {
  label: string;
  state: QubitState;
  note: L10n;
}

/** Famous one-qubit states visitors can load in a single click. */
export const PRESETS: PresetDef[] = [
  {
    label: "|0⟩",
    state: ZERO_STATE,
    note: {
      en: "The computational ground state — where every circuit begins.",
      ar: "الحالة الأرضية الحسابية — حيث يبدأ كل مسار كمومي.",
    },
  },
  {
    label: "|1⟩",
    state: { a: c(0), b: c(1) },
    note: {
      en: "The excited state — X applied to |0⟩.",
      ar: "الحالة المثارة — ناتج تطبيق X على |0⟩.",
    },
  },
  {
    label: "|+⟩",
    state: { a: c(INV_SQRT2), b: c(INV_SQRT2) },
    note: {
      en: "Equal superposition — H applied to |0⟩. Measures 0 or 1 with 50/50 odds.",
      ar: "تراكب متساوٍ — H على |0⟩. القياس يعطي 0 أو 1 باحتمال متساوٍ.",
    },
  },
  {
    label: "|−⟩",
    state: { a: c(INV_SQRT2), b: c(-INV_SQRT2) },
    note: {
      en: "Same odds as |+⟩ but with a π phase — the difference Z makes.",
      ar: "الاحتمالات نفسها مثل |+⟩ لكن بطور π — هذا أثر Z.",
    },
  },
  {
    label: "|+i⟩",
    state: { a: c(INV_SQRT2), b: c(0, INV_SQRT2) },
    note: {
      en: "Complex amplitudes at work — H then S. Phase now lives in the imaginary axis.",
      ar: "سعات عقدية بحق — H ثم S. الطور يسكن المحور التخيلي الآن.",
    },
  },
];

/** Snapshot of a state for the undo (decoherence-proof) history stack. */
export const cloneState = (s: QubitState): QubitState => ({
  a: { ...s.a },
  b: { ...s.b },
});

/* ================================================================== */
/*                                                                    */
/*                    T W O - Q U B I T   E N G I N E                 */
/*                                                                    */
/*  Entanglement is the whole pitch — "15 students in one wave-       */
/*  function" — so the playground grows a second qubit and the gate   */
/*  that makes quantum computing *quantum*: CNOT. Two qubits need     */
/*  four amplitudes (2² = 4) and 4×4 unitaries, but the same linear   */
/*  algebra carries us: no new machinery, just a tensor product.      */
/*                                                                    */
/*  Indexing convention: amps[q0 + 2·q1] — q0 is the least            */
/*  significant bit, exactly Qiskit's little-endian. Ket labels are   */
/*  written |q1 q0⟩, so the top wire (q0) is the right-hand digit.    */
/*                                                                    */
/* ================================================================== */

/**
 * A pure two-qubit state |Ψ⟩ = Σ cᵢ|i⟩ over the computational basis
 * {|00⟩, |01⟩, |10⟩, |11⟩}.
 */
export interface TwoQubitState {
  /** amps[q0 + 2·q1] — little-endian, matching Qiskit. */
  amps: [Complex, Complex, Complex, Complex];
}

/** The two-qubit ground state |00⟩ — where every entangling story starts. */
export const TWO_ZERO_STATE: TwoQubitState = {
  amps: [c(1), c(0), c(0), c(0)],
};

/** Ket label for basis index i, in Qiskit order |q1 q0⟩. */
export const ketLabel = (i: number): string => `|${i >> 1}${i & 1}⟩`;

/** Renormalize away floating-point drift (unitarity is still our safety net). */
function normalize2(amps: TwoQubitState["amps"]): TwoQubitState {
  const norm = Math.sqrt(amps.reduce((acc, z) => acc + cabsSq(z), 0));
  return {
    amps: amps.map((z) => ({
      re: clean(z.re / norm),
      im: clean(z.im / norm),
    })) as TwoQubitState["amps"],
  };
}

/**
 * Apply a single-qubit gate to ONE wire of the pair:
 * the 2×2 gate becomes a 4×4 unitary via the tensor product
 * (U ⊗ I for target q0, I ⊗ U for target q1) — but we never build
 * the big matrix, we just pair up the amplitudes it mixes.
 */
export function applySingleToWire(
  s: TwoQubitState,
  gate: Matrix2,
  target: 0 | 1
): TwoQubitState {
  const amps = s.amps.map((z) => ({ ...z })) as TwoQubitState["amps"];
  // Indices of the |0⟩ and |1⟩ branches of the target wire.
  const zeroIdx = target === 0 ? [0, 2] : [0, 1];
  const oneIdx = target === 0 ? [1, 3] : [2, 3];
  for (let k = 0; k < 2; k++) {
    const a = amps[zeroIdx[k]];
    const b = amps[oneIdx[k]];
    amps[zeroIdx[k]] = cadd(cmul(gate[0][0], a), cmul(gate[0][1], b));
    amps[oneIdx[k]] = cadd(cmul(gate[1][0], a), cmul(gate[1][1], b));
  }
  return normalize2(amps);
}

/**
 * CNOT — the entangling gate.
 * Flips the target qubit IFF the control reads 1: in amplitude-space
 * that is a swap of exactly two basis amplitudes.
 *   control q0 → swaps |01⟩ (1) ↔ |11⟩ (3)
 *   control q1 → swaps |10⟩ (2) ↔ |11⟩ (3)
 * One controlled flip is all it takes to turn product states into
 * Bell states. That asymmetry is why hardware teams obsess over
 * two-qubit gate fidelity.
 */
export function applyCNOT(s: TwoQubitState, control: 0 | 1): TwoQubitState {
  const amps = s.amps.map((z) => ({ ...z })) as TwoQubitState["amps"];
  // The amplitude that gets swapped with |11⟩ (index 3):
  //   control q0 → |01⟩ (1),  control q1 → |10⟩ (2)
  const from = control === 0 ? 1 : 2;
  const to = 3;
  const tmp = { ...amps[from] };
  amps[from] = { ...amps[to] };
  amps[to] = tmp;
  return normalize2(amps);
}

/** Born rule over the joint basis: P(i) = |cᵢ|². */
export function twoProbabilities(s: TwoQubitState): [number, number, number, number] {
  return s.amps.map(cabsSq) as [number, number, number, number];
}

/** Sample one projective measurement of BOTH qubits (destructive). */
export function sampleTwoOnce(s: TwoQubitState): 0 | 1 | 2 | 3 {
  const p = twoProbabilities(s);
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < 4; i++) {
    acc += p[i];
    if (r < acc) return i as 0 | 1 | 2 | 3;
  }
  return 3;
}

/** Collapse to a definite basis state after measurement. */
export function collapseTwo(i: 0 | 1 | 2 | 3): TwoQubitState {
  const amps = [c(0), c(0), c(0), c(0)] as TwoQubitState["amps"];
  amps[i] = c(1);
  return { amps };
}

/**
 * Concurrence C ∈ [0,1] — the entanglement meter for pure states:
 *   C = 2·|c₀c₃ − c₁c₂|
 * C = 0 for product states, C = 1 for the four maximally-entangled
 * Bell states. (For mixed states this generalizes via the Wootters
 * formula; our simulator only ever holds pure states.)
 */
export function concurrence(s: TwoQubitState): number {
  const [a, b, c2, d] = s.amps;
  // det = c₀c₃ − c₁c₂  (the “entanglement determinant”)
  const det = cadd(cmul(a, d), cmul(mulNeg(b), c2));
  return clean(2 * Math.hypot(det.re, det.im));
}

/** Helper: multiply a complex number by −1. */
function mulNeg(z: Complex): Complex {
  return { re: -z.re, im: -z.im };
}

/**
 * Bloch vector of ONE qubit's reduced density matrix (trace out the other).
 *   ρ_q0 = [[|c₀|²+|c₁|², c₀c̄₂+c₁c̄₃], …]
 * For a Bell pair both reduced states collapse to ½I — the Bloch vector
 * shrinks to the origin: each qubit alone is pure noise, all the
 * information lives in the correlation. That is the quantum magic in
 * one picture.
 */
export function reducedBloch(s: TwoQubitState, qubit: 0 | 1) {
  const [c0, c1, c2, c3] = s.amps;
  // ρ01 = ⟨0|ρ|1⟩ of the reduced state (conjugation handled inline).
  const rho01 =
    qubit === 0
      ? cadd(cmul(c0, conj(c2)), cmul(c1, conj(c3)))
      : cadd(cmul(c0, conj(c1)), cmul(c2, conj(c3)));
  const rho00 =
    qubit === 0 ? cabsSq(c0) + cabsSq(c1) : cabsSq(c0) + cabsSq(c2);
  const rho11 =
    qubit === 0 ? cabsSq(c2) + cabsSq(c3) : cabsSq(c1) + cabsSq(c3);
  return {
    x: clean(2 * rho01.re),
    y: clean(-2 * rho01.im),
    z: clean(rho00 - rho11),
  };
}

/** Complex conjugate. */
function conj(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

/* ------------------------------------------------------------------ */
/*                     Two-qubit circuit + presets                     */
/* ------------------------------------------------------------------ */

/** One column of the two-lane circuit diagram. */
export type TwoQubitOp =
  | { kind: "gate"; symbol: string; target: 0 | 1 }
  | { kind: "cnot"; control: 0 | 1 };

/** A preset two-qubit state with a one-line bilingual story. */
export interface TwoPresetDef {
  label: string;
  state: TwoQubitState;
  note: L10n;
}

const INV_SQRT2_2 = INV_SQRT2;

/** Famous pairs — product states plus the full Bell family. */
export const TWO_PRESETS: TwoPresetDef[] = [
  {
    label: "|00⟩",
    state: TWO_ZERO_STATE,
    note: {
      en: "Two independent qubits at rest — nothing entangled yet.",
      ar: "كيوبتان مستقلان في حالة السكون — لا تشابك بعد.",
    },
  },
  {
    label: "|11⟩",
    state: { amps: [c(0), c(0), c(0), c(1)] },
    note: {
      en: "Both qubits excited — still a plain product state.",
      ar: "كيوبتان مثيران — ما زالا حالة حاصل ضرب مباشرة.",
    },
  },
  {
    label: "Φ⁺",
    state: { amps: [c(INV_SQRT2_2), c(0), c(0), c(INV_SQRT2_2)] },
    note: {
      en: "Bell Φ⁺ = (|00⟩+|11⟩)/√2 — measure one qubit and you instantly know the other. Einstein's “spooky action”, now a resource.",
      ar: "حالة بِل Φ⁺ = (|00⟩+|11⟩)/√2 — قِس كيوبتًا واحدًا لتعرف الآخر فورًا. «الفعل الشيطاني» عند أينشتاين، صار اليوم موردًا تقنيًا.",
    },
  },
  {
    label: "Φ⁻",
    state: { amps: [c(INV_SQRT2_2), c(0), c(0), c(-INV_SQRT2_2)] },
    note: {
      en: "Bell Φ⁻ — same perfect correlation, opposite phase. The phase difference only shows up in interference.",
      ar: "حالة بِل Φ⁻ — الارتباط الكامل نفسه بطور معاكس. يظهر فرق الطور في التداخل فقط.",
    },
  },
  {
    label: "Ψ⁺",
    state: { amps: [c(0), c(INV_SQRT2_2), c(INV_SQRT2_2), c(0)] },
    note: {
      en: "Bell Ψ⁺ = (|01⟩+|10⟩)/√2 — anti-correlated twin states, the basis of quantum teleportation demos.",
      ar: "حالة بِل Ψ⁺ = (|01⟩+|10⟩)/√2 — حالتان توأم متعاكسان، أساس تجارب النقل الكمومي.",
    },
  },
  {
    label: "Ψ⁻",
    state: { amps: [c(0), c(INV_SQRT2_2), c(-INV_SQRT2_2), c(0)] },
    note: {
      en: "Bell Ψ⁻ — the singlet. Perfectly anti-correlated on EVERY axis; the workhorse of CHSH loophole tests.",
      ar: "حالة بِل Ψ⁻ — الحالة الأحادية. تعاكس تام على كل محور؛ حصان العمل في اختبارات CHSH.",
    },
  },
];

/** Deep-copy a two-qubit state for the undo stack. */
export const cloneTwoState = (s: TwoQubitState): TwoQubitState => ({
  amps: s.amps.map((z) => ({ ...z })) as TwoQubitState["amps"],
});
