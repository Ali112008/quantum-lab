"use client";

import { useEffect, useRef } from "react";

/**
 * QuantumBackground — full-page particle field.
 *
 * Visual metaphor: qubits drifting in superposition. Pairs that get close
 * become "entangled" and are connected by a glowing line whose opacity
 * fades with distance. The whole field parallaxes gently toward the cursor.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  phase: number;
}

const LINK_DISTANCE = 110;
const MOUSE_RADIUS = 180;

export default function QuantumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect users who prefer reduced motion — render a static frame.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const COLORS = ["#00D9FF", "#6C5CE7", "#00B894", "#56CCF2"];

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with viewport, capped for performance.
      const count = Math.min(
        70,
        Math.round((window.innerWidth * window.innerHeight) / 26000)
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.2 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const drawFrame = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Ease the mouse position for buttery parallax.
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      const parallaxX = mouse.x === -9999 ? 0 : (mouse.x - w / 2) * 0.018;
      const parallaxY = mouse.y === -9999 ? 0 : (mouse.y - h / 2) * 0.018;

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Soft repulsion from cursor — particles "decohere" around the mouse
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_RADIUS && dm > 0.01) {
          const force = ((MOUSE_RADIUS - dm) / MOUSE_RADIUS) * 0.35;
          p.x += (dxm / dm) * force;
          p.y += (dym / dm) * force;
        }

        const twinkle = 0.35 + 0.3 * Math.sin(p.phase + t * 0.0006);
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(p.x + parallaxX, p.y + parallaxY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Entanglement links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.hypot(dx, dy);
          if (distance < LINK_DISTANCE) {
            ctx.globalAlpha = 0.22 * (1 - distance / LINK_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(p1.x + parallaxX, p1.y + parallaxY);
            ctx.lineTo(p2.x + parallaxX, p2.y + parallaxY);
            ctx.strokeStyle = "#00D9FF";
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const animate = (t: number) => {
      drawFrame(t);
      raf = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    setup();

    if (reducedMotion) {
      drawFrame(0); // single static frame
    } else {
      raf = requestAnimationFrame(animate);
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    window.addEventListener("resize", setup);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          "linear-gradient(180deg, #0A192F 0%, #0B1B36 45%, #0A192F 100%)",
      }}
    />
  );
}
