"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface Star {
  x: number;
  y: number;
  r: number;
  d: number;
  p: number;
  h: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function Starfield({ density = 0.6 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let raf = 0;
    let t = 0;
    let lastShoot = 0;

    const seed = () => {
      const count = Math.round(
        Math.min(160, Math.max(40, (width * height) / 10000)) * density,
      );
      stars = Array.from({ length: count }, () => {
        const d = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.25 + d * 0.6,
          d,
          p: Math.random() * Math.PI * 2,
          h: 200 + Math.random() * 40,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.016;

      for (const s of stars) {
        const twinkle = reduced
          ? 1
          : 0.72 + 0.28 * Math.sin(t * 1.4 + s.p);
        const alpha = (0.35 + s.d * 0.55) * twinkle;
        const drift = reduced ? 0 : (t * (0.8 + s.d * 3)) % (width + 24);
        const x = (s.x - drift + width + 24) % (width + 24) - 12;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.h}, 55%, ${78 + s.d * 12}%, ${alpha})`;
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced && t - lastShoot > 4 + Math.random() * 6) {
        lastShoot = t;
        shootingStars.push({
          x: Math.random() * width * 0.6,
          y: Math.random() * height * 0.25,
          vx: 160 + Math.random() * 120,
          vy: 40 + Math.random() * 60,
          life: 0,
          maxLife: 0.5 + Math.random() * 0.3,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        st.life += 0.016;
        if (st.life >= st.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }
        const progress = st.life / st.maxLife;
        const alpha = (1 - progress) * 0.8;
        const x = st.x + st.vx * st.life;
        const y = st.y + st.vy * st.life;
        const gradient = ctx.createLinearGradient(x, y, x - st.vx * 0.04, y - st.vy * 0.04);
        gradient.addColorStop(0, `rgba(243, 241, 232, ${alpha})`);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, y);
        ctx.lineTo(x - st.vx * 0.025, y - st.vy * 0.025);
        ctx.stroke();
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
