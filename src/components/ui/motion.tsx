"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ types */

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 36, y: 0 },
  right: { x: -36, y: 0 },
  none: { x: 0, y: 0 },
};

export interface RevealProps {
  children: ReactNode;
  /** Direction the content travels from. */
  from?: Direction;
  /** Seconds. */
  delay?: number;
  /** Seconds. */
  duration?: number;
  className?: string;
  /** Fraction of the element that must be visible before triggering. */
  amount?: number;
  /** Once the animation has played, keep it in place. */
  once?: boolean;
}

/**
 * Reveals its children the first time they scroll into view.
 * Honours `prefers-reduced-motion` by rendering the final state immediately.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.7,
  className,
  amount = 0.25,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = OFFSETS[from];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- stagger */

export const staggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

/** A group of children that animate in one after another. */
export function Stagger({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** A single item inside a {@link Stagger} group. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------- headline */

/**
 * Splits a headline into words and lifts them into place on scroll.
 */
export function AnimatedHeadline({
  text,
  className,
  wordClassName,
  delay = 0,
  amount = 0.4,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return (
      <span className={className}>
        {words.map((w, i) => (
          <span key={i} className={`inline-block ${wordClassName ?? ""}`}>
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={staggerParent(0.055, delay)}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className={`inline-block ${wordClassName ?? ""}`}
          variants={{
            hidden: { opacity: 0, y: "0.55em", filter: "blur(8px)" },
            show: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
