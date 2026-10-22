"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { SkyIndex } from "@/lib/astro/sky";
import { compassPoint } from "@/lib/astro/coords";
import { useObserverLocation } from "@/lib/useObserverLocation";
import { Counter } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const STATS = [
  { value: 2061, label: "Stars", note: "to magnitude 6.5" },
  { value: 464, label: "Proper names", note: "from the IAU list" },
  { value: 89, label: "Constellations", note: "IAU stick figures" },
  { value: 142, label: "Deep sky objects", note: "Messier and NGC" },
];

const KIND_TONE: Record<string, string> = {
  planet: "text-venus",
  moon: "text-moon",
  sun: "text-sage",
  satellite: "text-mint",
  dso: "text-neptune",
  star: "text-mist",
};

export function Catalogue() {
  const { location } = useObserverLocation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);

  const index = useMemo(
    () => new SkyIndex(now, { lat: location.lat, lon: location.lon }),
    [now, location.lat, location.lon],
  );

  const visible = useMemo(
    () =>
      index
        .visible({ includeDso: true, limit: 11 })
        .map((e) => ({
          name: e.name,
          kind: e.kind,
          category: e.category,
          constellation: e.constellation,
          alt: e.alt ?? 0,
          az: e.az ?? 0,
          mag: e.mag,
          distance: e.distance,
        })),
    [index],
  );

  return (
    <section id="catalogue" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal>
            <div className="flex flex-col gap-5">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-mint uppercase">
                <span className="h-px w-6 bg-mint/50" />
                The catalogue
              </span>
              <h2 className="text-balance text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-mist sm:text-4xl lg:text-5xl">
                Everything is computed
                <br />
                on the device.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-fog sm:text-lg">
                No API keys, no rate limits, no monthly subscription. The star
                catalogue ships inside the app and the planetary positions are
                derived from published orbital theory while you watch.
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
                      {s.label}
                    </dt>
                    <dd className="mt-1 text-3xl font-medium tracking-[-0.03em] text-mist tabular-nums">
                      <Counter value={s.value} />
                    </dd>
                    <p className="mt-1 text-xs text-fog">{s.note}</p>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.12} from="right">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="font-mono text-[11px] tracking-[0.16em] text-mist uppercase">
                  Above your horizon
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-mint uppercase">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
                  live
                </span>
              </div>

              <ul className="divide-y divide-line">
                {visible.map((o, i) => (
                  <motion.li
                    key={`${o.name}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.035,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-2"
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current ${
                        KIND_TONE[o.kind] ?? "text-mist"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] text-mist">
                        {o.name}
                      </span>
                      <span className="block truncate font-mono text-[10px] tracking-[0.12em] text-dim uppercase">
                        {o.constellation || o.category}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-[12px] text-fog tabular-nums">
                        {o.alt.toFixed(0)}° {compassPoint(o.az)}
                      </span>
                      <span className="block font-mono text-[10px] text-dim tabular-nums">
                        mag {o.mag.toFixed(1)}
                      </span>
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="border-t border-line px-5 py-3">
                <p className="font-mono text-[10px] tracking-[0.12em] text-dim">
                  computed for {location.lat.toFixed(2)}°,{" "}
                  {location.lon.toFixed(2)}° · {now.toUTCString().slice(17, 22)} utc
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
