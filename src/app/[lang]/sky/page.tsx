import { Nav } from "@/components/sections/Nav";
import { SkyDemo } from "@/components/sections/SkyDemo";

export const metadata = {
  title: "Live sky",
};

export default async function SkyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "id" ? "id" : "en") as "en" | "id";
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <Nav lang={locale} />
      <div className="flex min-h-[100svh] flex-1 flex-col pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 sm:px-8">
          <header className="pt-14 pb-1 text-center flex-shrink-0">
            <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
              {locale === "id" ? "Langit Langsung" : "Live sky"}
            </p>
            <h1 className="mt-4 text-balance text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.98] font-medium tracking-[-0.045em] text-mist">
              {locale === "id" ? "Arahkan ke langit." : "Point at the sky."}
            </h1>
            <p className="mt-4 text-lg text-fog">
              {locale === "id"
                ? "Tampilan real-time berdasarkan lokasi dan waktu Anda."
                : "Real-time view powered by your location and time."}
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
