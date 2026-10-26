import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WatchExperience } from "@/components/sections/WatchExperience";
import { Features } from "@/components/sections/Features";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <WatchExperience />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
