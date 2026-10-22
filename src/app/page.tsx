import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { SkyDemo } from "@/components/sections/SkyDemo";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WatchExperience } from "@/components/sections/WatchExperience";
import { Features } from "@/components/sections/Features";
import { Catalogue } from "@/components/sections/Catalogue";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SkyDemo />
        <HowItWorks />
        <WatchExperience />
        <Features />
        <Catalogue />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
