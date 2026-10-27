import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WatchExperience } from "@/components/sections/WatchExperience";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";

export default async function LangPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <WatchExperience />
      <Features />
      <CTA />
    </main>
  );
}
