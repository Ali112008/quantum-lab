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
