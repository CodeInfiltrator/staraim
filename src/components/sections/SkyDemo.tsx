"use client";

import { SkyMap } from "@/components/sky/SkyMap";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";

const NOTES = [
  {
    label: "Drag",
    body: "Look around the sky with the pointer. The compass ribbon and the altitude readout follow the view.",
  },
  {
    label: "Scroll",
    body: "Zoom from a 62° field of view down to a narrow slice, or all the way out to a fisheye of the whole sky.",
  },
  {
    label: "Scrub time",
    body: "Move the slider to see the sky at any point in the next or previous twelve hours. The planets keep moving.",
  },
];

export function SkyDemo() {
  return (
    <section id="sky" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Live sky"
            title={
              <>
                This is your sky,
                <br />
                right now.
              </>
            }
            body="Not a picture of a sky. The actual catalogue, rotated to your coordinates for this second, rendered in the browser. Touch the reticle and Staraim tells you what is there."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <SkyMap className="h-[min(78vh,44rem)] w-full" />
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {NOTES.map((n, i) => (
            <Reveal key={n.label} delay={0.1 + i * 0.08}>
              <div className="flex gap-4">
                <span className="mt-0.5 shrink-0 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-mint uppercase">
                  {n.label}
                </span>
                <p className="text-[15px] leading-relaxed text-fog">{n.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
