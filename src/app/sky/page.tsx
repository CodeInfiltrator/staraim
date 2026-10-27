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
      <main className="min-h-screen bg-void pt-20 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-mint uppercase">
              <span className="h-px w-6 bg-mint/50" />
              Live sky
              <span className="h-px w-6 bg-mint/50" />
            </span>
            <h1 className="mt-3 text-balance text-3xl font-medium tracking-[-0.03em] text-mist sm:text-4xl lg:text-5xl">
              See what's above
              <br />
              <span className="text-sage">right now</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-fog">
              A live, interactive map of the sky computed from real ephemeris data.
            </p>
          </header>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-16 -z-10">
              <Starfield density={0.25} />
            </div>
            <SkyMap className="h-[min(82vh,calc(100svh-14rem))] w-full touch-pan-y" />
          </div>
        </div>
      </main>
    </>
  );
}
