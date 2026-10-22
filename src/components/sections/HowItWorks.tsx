"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";

const STEPS = [
  {
    n: "01",
    title: "Calibrate",
    body: "Hold the Moon in the reticle for two seconds. Staraim learns the offset between your wrist and the sky.",
    detail: "Two seconds, once per session",
  },
  {
    n: "02",
    title: "Point",
    body: "Raise your arm naturally. The watch reads its own inertial motion and works out exactly where it is looking.",
    detail: "No compass, no magnetometer",
  },
  {
    n: "03",
    title: "Know",
    body: "The moment the crosshair settles, the watch names what you are pointing at — and how far away it is.",
    detail: "2,061 stars · 142 deep sky objects",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Three steps, no manual
                <br />
                alignment.
              </>
            }
            body="The hard part of sky identification is not the catalogue — it is knowing which way the wrist is pointing. Staraim solves that with the watch's own motion sensors."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {STEPS.map((step) => (
            <StaggerItem key={step.n} className="bg-surface">
              <div className="group relative h-full bg-surface p-7 transition-colors duration-500 hover:bg-surface-2 sm:p-9">
                <span className="font-mono text-[11px] tracking-[0.2em] text-mint">
                  {step.n}
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-mist">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fog">
                  {step.body}
                </p>
                <p className="mt-6 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">
                  {step.detail}
                </p>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-sage to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
