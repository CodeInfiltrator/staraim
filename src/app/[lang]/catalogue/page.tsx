import { Nav } from "@/components/sections/Nav";
import { Catalogue } from "@/components/sections/Catalogue";

export const metadata = {
  title: "Catalogue",
};

export default async function CataloguePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "id" ? "id" : "en") as "en" | "id";
  return (
    <main>
      <Nav lang={locale} />
      <div className="pt-24">
        <Catalogue />
      </div>
    </main>
  );
}
