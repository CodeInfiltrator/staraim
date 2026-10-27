import Link from "next/link";
import { Reticle } from "./Nav";
import { getDictionary, Locale } from "@/lib/i18n";

export function Footer({ lang = "en" }: { lang?: Locale }) {
  const dict = getDictionary(lang);
  
  const COLUMNS = [
    {
      title: dict.pages,
      links: [
        { label: dict.home, href: `/${lang}` },
        { label: dict.how, href: `/${lang}#how` },
        { label: dict.watch, href: `/${lang}#watch` },
        { label: dict.live, href: `/${lang}/sky` },
        { label: dict.catalogue, href: `/${lang}/catalogue` },
      ],
    },
    {
      title: dict.founders,
      links: [
        { label: "Frizzia Darren", href: "#" },
        { label: "Ady Junior", href: "#" },
        { label: "Ryujin", href: "#" },
        { label: "Vannya", href: "#" },
      ],
    },
    {
      title: dict.followUs,
      links: [
        { label: "Instagram", href: "https://www.instagram.com/staraim.app" },
      ],
    },
    {
      title: dict.language,
      links: [
        { label: "English", href: "/en" },
        { label: "Indonesia", href: "/id" },
      ],
    },
  ];
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Reticle className="h-6 w-6" />
              <span className="text-[15px] font-medium text-mist">Staraim</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
              Point at the sky. The Watch reveals only what matters.
            </p>
            <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
              Built for the Apple Watch
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-fog transition-colors hover:text-mist"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
            © {new Date().getFullYear()} Staraim — by fourward
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
            Star data: d3-celestial (BSD-3) · Ephemeris: Astronomy Engine (MIT)
          </p>
        </div>
      </div>
    </footer>
  );
}
