import { Nav } from "@/components/sections/Nav";
import { SkyDemo } from "@/components/sections/SkyDemo";
import { Locale } from "@/lib/i18n";

export const metadata = {
  title: "Live sky",
};

export default async function SkyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <Nav lang={lang} />
      <div className="flex min-h-[100svh] flex-1 flex-col pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 sm:px-8">
          <header className="pt-14 pb-1 text-center flex-shrink-0">
            <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
              Live sky
            </p>
            <h1 className="mt-4 text-balance text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.98] font-medium tracking-[-0.045em] text-mist">
              Point at the sky.
            </h1>
            <p className="mt-4 text-lg text-fog">
              Real-time view powered by your location and time.
            </p>
          </header>
          <div className="mt-10 flex-1 pb-12">
            <SkyDemo />
          </div>
        </div>
      </div>
    </main>
  );
}
