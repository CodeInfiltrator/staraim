import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WatchExperience } from "@/components/sections/WatchExperience";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";

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
      <WatchExperience lang={locale} />
      <Features lang={locale} />
      <CTA lang={locale} />
    </main>
  );
}
