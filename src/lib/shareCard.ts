/**
 * CHSH SHARE CARD — renders the player's quantum scoreboard onto a
 * 1200×630 canvas (the standard Open-Graph share size) and returns a PNG
 * blob, ready for navigator.share({ files }) or a plain download.
 *
 * Design: the same visual language as the game — quantum-navy field,
 * gold referee accent, cyan/purple stations, green "violation" state —
 * so a shared card is instantly recognizable as this lab's game.
 *
 * Language note: the CARD is intentionally always English (it is a share
 * artifact aimed at international funders and physics folks), while the
 * button / toasts around it speak the page language. One less canvas
 * bidi headache, zero meaning lost.
 */

import { CHSH_CLASSICAL_S, CHSH_QUANTUM_S } from "@/lib/quantum";

export interface ShareCardStats {
  /** Session CHSH S estimate (null until all 4 setting pairs sampled). */
  s: number | null;
  /** Session win rate in percent, or null if no rounds yet. */
  winPct: number | null;
  /** Session rounds / wins. */
  rounds: number;
  wins: number;
  /** Lifetime Hall-of-Fame figures (from localStorage records). */
  bestStreak: number;
  totalRoundsEver: number;
  violationEver: boolean;
}

/* palette (kept in sync with the site tokens) */
const NAVY = "#0A192F";
const CARD_BG = "#112240";
const GOLD = "#FFD166";
const BLUE = "#00D9FF";
const PURPLE = "#6C5CE7";
const GREEN = "#00B894";
const PINK = "#FF6B9D";
const SUBTLE = "#8892B0";
const WHITE = "#FFFFFF";

/** Rounded-rect path (ctx.roundRect is still missing in some targets). */
function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Shrink-to-fit: returns the largest font size ≤ size that fits maxW. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: string,
  size: number,
  maxW: number
): number {
  let s = size;
  for (; s > 18; s -= 2) {
    ctx.font = `${weight} ${s}px Montserrat, "Segoe UI", sans-serif`;
    if (ctx.measureText(text).width <= maxW) break;
  }
  return s;
}

/** A little atom glyph — nucleus + two crossed orbits + an "electron". */
function drawAtom(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
): void {
  ctx.save();
  ctx.translate(cx, cy);
  for (const [rot, color] of [
    [-Math.PI / 6, BLUE],
    [Math.PI / 6, PURPLE],
  ] as const) {
    ctx.save();
    ctx.rotate(rot);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = PINK;
  ctx.shadowColor = PINK;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export async function buildShareCardBlob(
  stats: ShareCardStats
): Promise<Blob | null> {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  /* ---------------- backdrop ---------------- */
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H * 0.32, 80, W / 2, H * 0.32, 760);
  glow.addColorStop(0, "rgba(108,92,231,0.18)");
  glow.addColorStop(1, "rgba(10,25,47,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  /* dot grid — the lab's starfield */
  ctx.fillStyle = "rgba(136,146,176,0.13)";
  for (let gx = 44; gx < W; gx += 52) {
    for (let gy = 44; gy < H; gy += 52) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* frame */
  ctx.strokeStyle = "rgba(0,217,255,0.35)";
  ctx.lineWidth = 2;
  rr(ctx, 16, 16, W - 32, H - 32, 22);
  ctx.stroke();

  /* ---------------- header: brand ---------------- */
  drawAtom(ctx, 92, 96, 30);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = WHITE;
  ctx.font = '800 27px Montserrat, "Segoe UI", sans-serif';
  ctx.fillText("QUANTUM RESEARCH LAB", 148, 92);
  ctx.fillStyle = SUBTLE;
  ctx.font = '400 15px Inter, "Segoe UI", sans-serif';
  ctx.fillText("EGYPT · STUDENT-LED SEED PROPOSAL · $50K", 148, 118);

  /* gold chip, top-right: the physics claim */
  const chipText = "BELL TEST · LIVE";
  ctx.font = '700 15px "Courier New", monospace';
  const chipW = ctx.measureText(chipText).width + 34;
  ctx.fillStyle = "rgba(255,209,102,0.12)";
  ctx.strokeStyle = "rgba(255,209,102,0.55)";
  ctx.lineWidth = 1.5;
  rr(ctx, W - 40 - chipW, 66, chipW, 40, 20);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.fillText(chipText, W - 40 - chipW + 17, 91);

  /* ---------------- headline (centered) ---------------- */
  const headline = "QUANTUM BEATS CLASSICAL";
  const hSize = fitFont(ctx, headline, "900", 58, W - 220);
  ctx.font = `900 ${hSize}px Montserrat, "Segoe UI", sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.shadowColor = "rgba(255,209,102,0.35)";
  ctx.shadowBlur = 18;
  ctx.textAlign = "center";
  ctx.fillText(headline, W / 2, 208);
  ctx.shadowBlur = 0;

  ctx.fillStyle = SUBTLE;
  ctx.font = '400 21px Inter, "Segoe UI", sans-serif';
  ctx.fillText(
    "Bell's CHSH game — played live in a browser tab",
    W / 2,
    244
  );
  ctx.textAlign = "left";

  /* ---------------- stat tiles ---------------- */
  const tiles: { label: string; value: string; color: string }[] = [
    {
      label: "SESSION S",
      value: stats.s === null ? "—" : stats.s.toFixed(3),
      color:
        stats.s !== null && stats.s > CHSH_CLASSICAL_S ? GREEN : WHITE,
    },
    {
      label: "WIN RATE",
      value: stats.winPct === null ? "—" : `${stats.winPct.toFixed(1)}%`,
      color: WHITE,
    },
    { label: "BEST STREAK", value: String(stats.bestStreak), color: GOLD },
    {
      label: "LIFETIME ROUNDS",
      value: String(stats.totalRoundsEver),
      color: WHITE,
    },
  ];
  const tileW = 252;
  const tileH = 118;
  const gap = 16;
  const rowW = tiles.length * tileW + (tiles.length - 1) * gap;
  const x0 = (W - rowW) / 2;
  const y0 = 292;
  tiles.forEach((tile, i) => {
    const tx = x0 + i * (tileW + gap);
    ctx.fillStyle = "rgba(17,34,64,0.92)";
    ctx.strokeStyle = "rgba(255,255,255,0.09)";
    ctx.lineWidth = 1;
    rr(ctx, tx, y0, tileW, tileH, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = SUBTLE;
    ctx.font = '400 13px "Courier New", monospace';
    ctx.fillText(tile.label, tx + 22, y0 + 34);
    ctx.fillStyle = tile.color;
    ctx.font = '700 42px "Courier New", monospace';
    ctx.fillText(tile.value, tx + 22, y0 + 88);
  });

  /* violation flash strip */
  if (stats.violationEver) {
    const vText = "⚛  BELL VIOLATION ACHIEVED — S > 2";
    ctx.font = '700 17px "Courier New", monospace';
    const vw = ctx.measureText(vText).width + 44;
    ctx.fillStyle = "rgba(255,209,102,0.14)";
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.5;
    rr(ctx, (W - vw) / 2, y0 + tileH + 18, vw, 40, 20);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.fillText(vText, (W - vw) / 2 + 22, y0 + tileH + 44);
  }

  /* ---------------- bottom: classical vs quantum bar ---------------- */
  const barX = 110;
  const barW = W - 220;
  const barY = 540;
  const pct = stats.winPct ?? 0;

  // track
  ctx.fillStyle = "rgba(10,25,47,0.9)";
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  rr(ctx, barX, barY, barW, 12, 6);
  ctx.fill();
  ctx.stroke();

  // fill — session win rate (or full quantum span when nothing played yet)
  const fillPct = stats.winPct === null ? CHSH_QUANTUM_S * 100 : pct;
  const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  grad.addColorStop(0, BLUE);
  grad.addColorStop(0.6, PURPLE);
  grad.addColorStop(1, PINK);
  ctx.fillStyle = grad;
  if (fillPct > 0) {
    rr(ctx, barX, barY, Math.max((barW * Math.min(fillPct, 100)) / 100, 10), 12, 6);
    ctx.fill();
  }

  // classical bound marker at 75%
  const clsX = barX + (barW * 75) / 100;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(clsX, barY - 6);
  ctx.lineTo(clsX, barY + 18);
  ctx.stroke();

  // labels
  ctx.font = '400 14px "Courier New", monospace';
  ctx.fillStyle = SUBTLE;
  ctx.textAlign = "left";
  ctx.fillText("CLASSICAL 75%", barX, barY - 14);
  ctx.textAlign = "right";
  ctx.fillStyle = GREEN;
  ctx.fillText("QUANTUM 85.4%", barX + barW, barY - 14);
  ctx.textAlign = "left";

  /* footer strip */
  ctx.fillStyle = SUBTLE;
  ctx.font = '400 15px "Courier New", monospace';
  ctx.fillText("Quantum Research Lab · Egypt", 40, H - 34);
  ctx.textAlign = "right";
  ctx.fillStyle = BLUE;
  ctx.fillText("PLAY THE CHSH GAME →", W - 40, H - 34);
  ctx.textAlign = "left";

  /* ---------------- to blob ---------------- */
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/png"
    );
  });
}
