import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WatchExperience } from "@/components/sections/WatchExperience";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";
import { Locale } from "@/lib/i18n";

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <main>
      <Hero lang={lang} />
      <HowItWorks lang={lang} />
      <WatchExperience lang={lang} />
      <Features lang={lang} />
      <CTA lang={lang} />
    </main>
  );
}
