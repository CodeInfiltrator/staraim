import Link from "next/link";
import { Reticle } from "./Nav";
import { getDictionary, Locale } from "@/lib/i18n";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.75-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
    </svg>
  );
}

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
        { label: dict.explorers, href: `/${lang}/explorers` },
        { label: dict.catalogue, href: `/${lang}/catalogue` },
      ],
    },
    {
      title: dict.founders,
      links: [
        { label: "Frizzia Darren", href: "https://www.linkedin.com/in/frizziadarren/" },
        { label: "Ady Junior", href: "https://www.linkedin.com/in/adysbgy/" },
        { label: "Ryujin", href: "https://www.linkedin.com/in/daniel-ferryal-a54578226/" },
        { label: "Vannya", href: "https://www.linkedin.com/in/vannya-ade-gunawan/" },
      ],
    },
    {
      title: dict.followUs,
      links: [
        { label: "Instagram", href: "https://www.instagram.com/staraim.app", icon: InstagramIcon },
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
              <img src="/logo.jpeg" alt="Staraim" className="h-7 w-7 rounded-full" />
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
                  {col.links.map((l: any) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="flex items-center gap-2 text-sm text-fog transition-colors hover:text-mist"
                      >
                        {l.icon ? <l.icon /> : null}
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
            © {new Date().getFullYear()} StarAim. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
            <a href="mailto:staraim2026@gmail.com">staraim2026@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
