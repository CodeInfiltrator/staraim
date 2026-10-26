"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/* ---------------------------------------------------------------- button */

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-sage text-white hover:bg-[#ff453a] active:bg-[#ff2d20] shadow-[0_10px_40px_-18px_rgba(255,59,48,0.9)]",
  secondary:
    "bg-surface-2 text-mist border border-line hover:bg-surface-3 hover:border-char",
  ghost: "text-fog hover:text-mist",
};

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  children: ReactNode;
}

/** Pill button with a springy press and a subtle magnetic hover. */
export function Button({
  variant = "primary",
  className = "",
  children,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: ButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.35 });

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      whileHover={reduced ? undefined : { scale: 1.025 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * 0.16);
        y.set((event.clientY - (rect.top + rect.height / 2)) * 0.22);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        x.set(0);
        y.set(0);
      }}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/* ----------------------------------------------------------- link button */

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(255,59,48,0.5)] ${BUTTON_STYLES[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* --------------------------------------------------------------- headings */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-mint uppercase">
      <span className="h-px w-6 bg-mint/50" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start"
      } ${className}`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-balance text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-mist sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {body ? (
        <p
          className={`max-w-2xl text-base leading-relaxed text-fog sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ pill */

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "sage" | "mint";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-2 text-fog border-line",
    sage: "bg-sage/12 text-sage border-sage/25",
    mint: "bg-mint/12 text-mint border-mint/25",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- counter */

import { useEffect, useState } from "react";

/** Counts up to `value` when scrolled into view. */
export function Counter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1600,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutExpo
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay(value * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* --------------------------------------------------------------- marquee */

export function Marquee({
  children,
  className = "",
  speed = 38,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className="flex w-max shrink-0 items-center gap-12 pr-12 group-hover:[animation-play-state:paused]"
        style={{ animation: `staraim-marquee ${speed}s linear infinite` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
