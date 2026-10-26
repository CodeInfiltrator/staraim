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
        <Starfield density={0.5} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_10%,rgba(208,52,44,0.14),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-void via-void/80 to-transparent" />
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
              <ButtonLink href="/sky">Open the live sky</ButtonLink>
              <ButtonLink href="/#watch" variant="secondary">
                See the watch
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal from="up" delay={0.36}>
            <div className="mt-10 rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium tracking-[-0.01em] text-mist">
                    Download our app
                  </h3>
                  <p className="mt-1 text-sm text-fog">
                    Coming soon to the App Store. Join the waitlist to get early access.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-pill border border-line bg-surface-2 px-5 py-2.5 text-sm font-medium text-dim opacity-60"
                  >
                    <AppleIcon />
                    App Store — Coming soon
                  </button>
                  <button
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-pill border border-line bg-surface-2 px-5 py-2.5 text-sm font-medium text-dim opacity-60"
                  >
                    TestFlight — Coming soon
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* -------------------------------------------------------- device */}
        <Reveal from="right" delay={0.2} duration={0.9} className="relative">
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(circle_at_center,rgba(208,52,44,0.14),transparent_62%)]" />
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

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
