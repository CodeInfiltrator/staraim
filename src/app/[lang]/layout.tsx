import { ReactNode } from "react";
import type { Metadata } from "next";
import { dictionaries } from "@/lib/i18n";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "id" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as "en" | "id";
  
  return {
    title: "Staraim — Know what's above.",
    description:
      locale === "id"
        ? "Arahkan jam tangan Apple Watch Anda ke langit dan Staraim akan mengidentifikasinya."
        : "Point your Apple Watch at the sky and Staraim names the object.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "id" ? "id" : "en") as "en" | "id";
  return (
    <>
      <Nav lang={locale} />
      {children}
      <Footer lang={locale} />
    </>
  );
}
