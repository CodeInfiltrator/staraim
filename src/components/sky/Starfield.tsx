"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Star {
  x: number;
  y: number;
  r: number;
  /** Parallax depth, 0 (far) .. 1 (near). */
  d: number;
  /** Twinkle phase. */
  p: number;
  /** Base hue offset in degrees. */
  h: number;
}

/**
 * A light-weight parallax starfield for the hero.
 *
 * The real sky lives in the three.js canvas; this one is pure atmosphere —
 * three depth layers, slow drift and a gentle twinkle.
 */
export function Starfield({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let t = 0;

    const seed = () => {
      const count = Math.round(
        Math.min(420, Math.max(90, (width * height) / 5200)) * density,
      );
      stars = Array.from({ length: count }, () => {
        const d = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.35 + d * 1.35 + Math.random() * 0.3,
          d,
          p: Math.random() * Math.PI * 2,
          h: 180 + Math.random() * 60,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = reduced
          ? 1
          : 0.62 + 0.38 * Math.sin(t * 1.3 + s.p) * (0.35 + s.d * 0.65);
        const alpha = (0.22 + s.d * 0.72) * twinkle;
        const drift = reduced ? 0 : (t * (2 + s.d * 7)) % (width + 40);
        const x = (s.x - drift + width + 40) % (width + 40) - 20;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.h}, 45%, ${72 + s.d * 18}%, ${alpha})`;
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.d > 0.93) {
          const glow = ctx.createRadialGradient(x, s.y, 0, x, s.y, s.r * 7);
          glow.addColorStop(0, `hsla(${s.h}, 60%, 80%, ${alpha * 0.4})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, s.y, s.r * 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
