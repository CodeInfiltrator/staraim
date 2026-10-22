"use client";

import { motion, useReducedMotion } from "motion/react";
import { AnimatedHeadline, Reveal } from "@/components/ui/motion";
import { ButtonLink } from "@/components/ui/primitives";
import { Starfield } from "@/components/sky/Starfield";
import { WatchSimulator } from "@/components/watch/WatchSimulator";

const STATS = [
  { value: "2,061", label: "stars" },
  { value: "142", label: "deep sky objects" },
  { value: "10", label: "live satellites" },
  { value: "0", label: "network calls" },
];

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-28 pb-16 sm:pt-32">
      {/* ------------------------------------------------------------ backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <Starfield />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(207,224,160,0.09),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* --------------------------------------------------------- copy */}
        <div>
          <Reveal from="up" duration={0.6}>
            <span className="inline-flex items-center gap-2.5 rounded-pill border border-line bg-surface/60 px-3.5 py-1.5 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.18em] text-fog uppercase">
                Apple Watch · inertial pointing
              </span>
            </span>
          </Reveal>

          <Reveal from="up" delay={0.08} duration={0.8}>
            <h1 className="mt-7 text-balance text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-mist">
              <AnimatedHeadline text="Know what" />
              <br />
              <AnimatedHeadline
                text="is above."
                wordClassName="text-sage"
                delay={0.12}
              />
            </h1>
          </Reveal>

          <Reveal from="up" delay={0.2}>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-fog">
              The real sky is the interface. Point your wrist at anything and
              Staraim names it — using the watch&apos;s own motion sensors and a
              catalogue that runs entirely on device.
            </p>
          </Reveal>

          <Reveal from="up" delay={0.28}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#sky">Open the live sky</ButtonLink>
              <ButtonLink href="#watch" variant="secondary">
                <WatchGlyph />
                See the watch
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal from="up" delay={0.36}>
            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-medium tracking-[-0.02em] text-mist tabular-nums">
                    {s.value}
                  </dt>
                  <dd className="mt-1 font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* -------------------------------------------------------- device */}
        <Reveal from="right" delay={0.2} duration={0.9} className="relative">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(circle_at_center,rgba(207,224,160,0.14),transparent_62%)]" />
            <motion.div
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <WatchSimulator compact />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WatchGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="7"
        y="5"
        width="10"
        height="14"
        rx="3.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M9 5 10 2.5h4L15 5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 10v4M10 12h4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
