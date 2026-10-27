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
      <main className="bg-void h-[calc(100svh-4rem)] overflow-hidden">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 h-full flex flex-col">
          <header className="pt-14 pb-1 text-center flex-shrink-0">
            <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] text-mint uppercase">
              <span className="h-px w-4 bg-mint/50" />
              Live sky
              <span className="h-px w-4 bg-mint/50" />
            </span>
            <h1 className="mt-1 text-balance text-lg font-medium tracking-[-0.03em] text-mist sm:text-xl lg:text-2xl">
              See what's above · <span className="text-sage">right now</span>
            </h1>
          </header>

          <div className="relative flex-1 min-h-0">
            <div className="pointer-events-none absolute -inset-8 -z-10">
              <Starfield density={0.15} />
            </div>
            <SkyMap className="h-full w-full touch-pan-y" />
          </div>
        </div>
      </main>
    </>
  );
}
