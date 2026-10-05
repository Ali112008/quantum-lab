"use client";

import { useMemo } from "react";

/**
 * QUANTUM AVATAR — a deterministic, seeded "quantum identity" pattern.
 *
 * Instead of stock photos (which would misrepresent real students), each
 * team member gets a unique micro-universe derived from a hash of their
 * name — the same name always collapses into the same pattern, like a
 * measurement of a prepared state. Four pattern families:
 *
 *   orbit   — a Bloch-sphere-like needle at a hashed polar angle
 *   lattice — a constellation of hashed dots, entangled by lines
 *   rings   — interference rings with gaps at hashed angles
 *   wave    — two phase-shifted sinusoids interfering
 *
 * Rendered as a low-opacity backdrop inside the avatar halo; the member's
 * initials stay on top for instant recognition. aria-hidden throughout —
 * it is purely decorative.
 *
 * ⚠ SSR HYDRATION NOTE: every floating-point coordinate is quantized via
 * n1()/n2() before it reaches the DOM. Raw doubles serialize differently
 * on the two engines that render this app (server: Bun/JavaScriptCore,
 * browser: V8) — e.g. 27.39980692227271 vs 27.399806922272706 — which
 * React flags as a hydration mismatch on SVG attributes. Fixed-precision
 * strings are identical everywhere.
 */

/** FNV-1a — tiny, stable, no deps. */
function hashName(name: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Deterministic double → fixed-precision string (engine-stable). */
function n2(x: number): string {
  return (Math.round(x * 100) / 100).toFixed(2);
}

/** Map the tailwind gradient classes in data.ts to concrete hex pairs. */
const GRADIENT_HEX: Record<string, string> = {
  blue: "#00d9ff",
  purple: "#6c5ce7",
  green: "#00b894",
  amber: "#ffd166",
  red: "#ff6b6b",
  subtle: "#8892b0",
};

/** "from-quantum-blue/80 to-quantum-purple/30" → ["#00d9ff", "#6c5ce7"] */
function gradientToHexes(gradient: string): [string, string] {
  const names = Array.from(gradient.matchAll(/quantum-(\w+)/g)).map((m) => m[1]);
  const a = GRADIENT_HEX[names[0] ?? "blue"] ?? GRADIENT_HEX.blue;
  const b = GRADIENT_HEX[names[1] ?? "purple"] ?? GRADIENT_HEX.purple;
  return [a, b];
}

export interface QuantumAvatarProps {
  name: string;
  /** The member's tailwind gradient classes — repurposed as SVG accents. */
  gradient: string;
  /** Rendered box size in px (the halo is 64px = size-16). */
  size?: number;
}

export default function QuantumAvatar({ name, gradient, size = 64 }: QuantumAvatarProps) {
  const [accentA, accentB] = useMemo(() => gradientToHexes(gradient), [gradient]);

  const art = useMemo(() => {
    const h = hashName(name);
    const variant = h % 4;
    const rnd = (n: number) => ((h >>> (n * 5)) & 1023) / 1023; // 0..1 deterministic

    if (variant === 0) {
      /* orbit — needle on a Bloch-like dial */
      const angle = rnd(1) * 360;
      const electronAngle = rnd(2) * 360;
      const ex = 32 + 17 * Math.cos((electronAngle * Math.PI) / 180);
      const ey = 32 + 17 * Math.sin((electronAngle * Math.PI) / 180);
      return (
        <g>
          <circle cx="32" cy="32" r="17" fill="none" stroke={accentA} strokeWidth="1.1" opacity="0.8" />
          <ellipse cx="32" cy="32" rx="17" ry="6.5" fill="none" stroke={accentB} strokeWidth="0.9" opacity="0.7" />
          <line
            x1="32" y1="32"
            x2={n2(32 + 15 * Math.sin((angle * Math.PI) / 180))}
            y2={n2(32 - 15 * Math.cos((angle * Math.PI) / 180))}
            stroke={accentA} strokeWidth="1.6" strokeLinecap="round" opacity="0.95"
          />
          <circle cx={n2(ex)} cy={n2(ey)} r="2.2" fill={accentB} opacity="0.95" />
          <circle cx="32" cy="32" r="2" fill={accentA} />
        </g>
      );
    }

    if (variant === 1) {
      /* lattice — hashed constellation, entangled by lines */
      const dots = Array.from({ length: 5 }, (_, i) => ({
        x: n2(10 + rnd(i + 1) * 44),
        y: n2(10 + rnd(i + 3) * 44),
      }));
      return (
        <g>
          <polyline
            points={dots.map((d) => `${d.x},${d.y}`).join(" ")}
            fill="none" stroke={accentB} strokeWidth="0.9" opacity="0.75"
          />
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={i === 0 ? "2.6" : "1.7"} fill={i % 2 ? accentB : accentA} opacity="0.95" />
          ))}
        </g>
      );
    }

    if (variant === 2) {
      /* rings — interference pattern with hashed gap angles */
      const g1 = rnd(1) * 360;
      const dash1 = n2(14 + rnd(2) * 30);
      const gap1 = n2(10 + rnd(3) * 22);
      const dash2 = n2(10 + rnd(4) * 20);
      const gap2 = n2(8 + rnd(5) * 16);
      return (
        <g fill="none" strokeLinecap="round">
          <circle cx="32" cy="32" r="18" stroke={accentA} strokeWidth="1.1" opacity="0.85"
            strokeDasharray={`${dash1} ${gap1}`}
            transform={`rotate(${n2(g1)} 32 32)`} />
          <circle cx="32" cy="32" r="12" stroke={accentB} strokeWidth="1" opacity="0.8"
            strokeDasharray={`${dash2} ${gap2}`}
            transform={`rotate(${n2(-g1)} 32 32)`} />
          <circle cx="32" cy="32" r="6" stroke={accentA} strokeWidth="1" opacity="0.9" />
          <circle cx="32" cy="32" r="1.8" fill={accentB} />
        </g>
      );
    }

    /* wave — two interfering sinusoids */
    const amp = 7 + rnd(1) * 5;
    const phase = rnd(2) * 40;
    const path = (dir: number, p: number) => {
      let d = "M 10 32";
      for (let x = 10; x <= 54; x += 4) {
        const y = 32 + dir * amp * Math.sin((x - 10) / 5 + p);
        d += ` L ${x} ${y.toFixed(1)}`;
      }
      return d;
    };
    return (
      <g fill="none" strokeLinecap="round">
        <path d={path(1, phase)} stroke={accentA} strokeWidth="1.4" opacity="0.9" />
        <path d={path(-1, phase / 2)} stroke={accentB} strokeWidth="1.2" opacity="0.8" />
        <circle cx="32" cy="32" r="1.8" fill="#ffffff" opacity="0.9" />
      </g>
    );
  }, [name, accentA, accentB]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {art}
    </svg>
  );
}
