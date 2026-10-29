import { Nav } from "@/components/sections/Nav";

export const metadata = {
  title: "Sky Explorers",
};

export default async function ExplorersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "id" ? "id" : "en") as "en" | "id";
  return (
    <main className="min-h-screen bg-[#080B11]">
      <Nav lang={locale} />
      <div className="pt-16 h-[calc(100vh-64px)] overflow-hidden">
        <iframe
          src="/staraim_global_sky_explorers_dark_sky_clarity_3d_map.html"
          className="w-full h-full border-0"
          title="StarAim Sky Explorers 3D Map"
        />
      </div>
    </main>
  );
}
