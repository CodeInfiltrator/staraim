import { Nav } from "@/components/sections/Nav";
import { Starfield } from "@/components/sky/Starfield";

export const metadata = {
  title: "Catalogue — Staraim",
  description: "Browse the Staraim celestial catalogue — stars, deep sky objects, planets, and satellites.",
};

const CATALOGUE = [
  { name: "Sun", type: "Star", mag: "-26.74", constellation: "—" },
  { name: "Moon", type: "Satellite", mag: "-12.74", constellation: "—" },
  { name: "Venus", type: "Planet", mag: "-4.14", constellation: "Pisces" },
  { name: "Jupiter", type: "Planet", mag: "-2.02", constellation: "Taurus" },
  { name: "Mars", type: "Planet", mag: "1.23", constellation: "Cancer" },
  { name: "Saturn", type: "Planet", mag: "0.98", constellation: "Aquarius" },
  { name: "Sirius", type: "Star", mag: "-1.46", constellation: "Canis Major" },
  { name: "Canopus", type: "Star", mag: "-0.72", constellation: "Carina" },
  { name: "Arcturus", type: "Star", mag: "-0.05", constellation: "Boötes" },
  { name: "Vega", type: "Star", mag: "0.03", constellation: "Lyra" },
  { name: "Capella", type: "Star", mag: "0.08", constellation: "Auriga" },
  { name: "Rigel", type: "Star", mag: "0.13", constellation: "Orion" },
  { name: "Procyon", type: "Star", mag: "0.34", constellation: "Canis Minor" },
  { name: "Betelgeuse", type: "Star", mag: "0.50", constellation: "Orion" },
  { name: "Orion Nebula (M42)", type: "Nebula", mag: "4.00", constellation: "Orion" },
  { name: "Andromeda Galaxy (M31)", type: "Galaxy", mag: "3.44", constellation: "Andromeda" },
  { name: "Pleiades (M45)", type: "Open Cluster", mag: "1.60", constellation: "Taurus" },
  { name: "Beehive Cluster (M44)", type: "Open Cluster", mag: "3.70", constellation: "Cancer" },
  { name: "Crab Nebula (M1)", type: "Supernova Remnant", mag: "8.40", constellation: "Taurus" },
  { name: "ISS (ZARYA)", type: "Satellite", mag: "-2.00", constellation: "—" },
];

export default function CataloguePage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-void pt-24 pb-16">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <Starfield density={0.25} />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <header className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-mint uppercase">
              <span className="h-px w-6 bg-mint/50" />
              Catalogue
              <span className="h-px w-6 bg-mint/50" />
            </span>
            <h1 className="mt-5 text-balance text-4xl font-medium tracking-[-0.03em] text-mist sm:text-5xl lg:text-6xl">
              Celestial
              <br />
              <span className="text-sage">catalogue</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fog">
              Over 2,000 stars, deep sky objects, planets, and satellites.
              All computed locally on your device.
            </p>
          </header>

          <div className="overflow-hidden rounded-2xl border border-line bg-surface/60 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <span className="font-mono text-[11px] tracking-[0.16em] text-mist uppercase">
                Objects
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                {CATALOGUE.length} shown · 2,219 total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-6 py-3 text-left font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                      Magnitude
                    </th>
                    <th className="px-6 py-3 text-right font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                      Constellation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {CATALOGUE.map((obj, i) => (
                    <tr
                      key={i}
                      className="transition-colors hover:bg-surface-2"
                    >
                      <td className="px-6 py-3.5 text-[15px] text-mist">
                        {obj.name}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex rounded-pill border border-line px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-fog uppercase">
                          {obj.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-[13px] text-fog tabular-nums">
                        {obj.mag}
                      </td>
                      <td className="px-6 py-3.5 text-right text-[13px] text-dim">
                        {obj.constellation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
