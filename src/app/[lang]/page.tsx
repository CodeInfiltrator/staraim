import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WatchExperience } from "@/components/sections/WatchExperience";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/ui/motion";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "id" ? "id" : "en") as "en" | "id";
  return (
    <main>
      <Hero lang={locale} />
      <HowItWorks lang={locale} />
      <section className="relative pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-line shadow-2xl">
              <video
                src="/videoPitch.mp4"
                controls
                playsInline
                preload="metadata"
                poster="/recentUI.jpeg"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <WatchExperience lang={locale} />
      <Features lang={locale} />
      <CTA lang={locale} />
    </main>
  );
}
