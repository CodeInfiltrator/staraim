import { Nav } from "@/components/sections/Nav";
import { Catalogue } from "@/components/sections/Catalogue";
import { Locale } from "@/lib/i18n";

export const metadata = {
  title: "Catalogue",
};

export default async function CataloguePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <main>
      <Nav lang={lang} />
      <div className="pt-24">
        <Catalogue />
      </div>
    </main>
  );
}
