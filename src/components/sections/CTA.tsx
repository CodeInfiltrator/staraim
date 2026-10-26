"use client";

import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { Starfield } from "@/components/sky/Starfield";

export function CTA() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div className="pointer-events-none absolute inset-0">
        <Starfield density={0.8} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_5%,rgba(255,59,48,0.08)_40%,var(--color-void)_85%)]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-mint uppercase">
            <span className="h-px w-6 bg-mint/50" />
            Ready when you are
            <span className="h-px w-6 bg-mint/50" />
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-7 text-balance text-4xl leading-[1.04] font-medium tracking-[-0.035em] text-mist sm:text-6xl">
            Look up.
            <br />
            We&apos;ll tell you what&apos;s there.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-fog sm:text-lg">
            The whole catalogue, the whole solar system and ten live satellites —
            on a watch that already knows which way you are pointing.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#sky">Open the live sky</ButtonLink>
            <ButtonLink href="#watch" variant="secondary">
              See the watch
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <motion.p
            className="mt-8 font-mono text-[11px] tracking-[0.14em] text-dim uppercase"
            animate={reduced ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            No account · No subscription · Works offline
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
