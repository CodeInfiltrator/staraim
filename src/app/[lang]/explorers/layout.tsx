import { ReactNode } from "react";
import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";

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
    title: "Sky Explorers — Staraim",
    description:
      locale === "id"
        ? "Peta penjelajah langit di seluruh dunia."
        : "Map of sky explorers around the world.",
  };
}

export default async function ExplorersLayout({
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
    </>
  );
}
