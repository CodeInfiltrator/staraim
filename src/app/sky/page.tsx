import { Nav } from "@/components/sections/Nav";
import { Starfield } from "@/components/sky/Starfield";
import { SkyMap } from "@/components/sky/SkyMap";

export const metadata = {
  title: "Live Sky — Staraim",
  description: "Interactive live sky map with real-time star positions, planets, satellites and object identification.",
};

export default function SkyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-void pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <header className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-mint uppercase">
              <span className="h-px w-6 bg-mint/50" />
              Live sky
              <span className="h-px w-6 bg-mint/50" />
            </span>
            <h1 className="mt-5 text-balance text-4xl font-medium tracking-[-0.03em] text-mist sm:text-5xl lg:text-6xl">
              See what's above
              <br />
              <span className="text-sage">right now</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fog">
              A live, interactive map of the sky computed from real ephemeris data.
              Drag to explore, tap to identify, and scrub through time.
            </p>
          </header>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-20 -z-10">
              <Starfield density={0.3} />
            </div>
            <SkyMap className="h-[min(85vh,52rem)] w-full" />
          </div>
        </div>
      </main>
    </>
  );
}
