import { ReactNode } from "react";
import type { Metadata } from "next";
import { dictionaries, Locale } from "@/lib/i18n";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = dictionaries[lang];
  
  return {
    title: "Staraim — Know what's above.",
    description:
      lang === "id"
        ? "Arahkan jam tangan Apple Watch Anda ke langit dan Staraim akan mengidentifikasinya."
        : "Point your Apple Watch at the sky and Staraim names the object.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <>
      <Nav lang={lang} />
      {children}
      <Footer lang={lang} />
    </>
  );
}
