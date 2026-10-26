import Link from "next/link";
import { Reticle } from "./Nav";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Live sky", href: "#sky" },
      { label: "How it works", href: "#how" },
      { label: "The watch", href: "#watch" },
      { label: "Catalogue", href: "/catalogue" },
    ],
  },
  {
    title: "Data",
    links: [
      { label: "d3-celestial", href: "https://github.com/ofrohn/d3-celestial" },
      { label: "Astronomy Engine", href: "https://github.com/cosinekitty/astronomy" },
      { label: "Celestrak", href: "https://celestrak.org" },
      { label: "IAU constellations", href: "https://www.iau.org/public/themes/constellations/" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Next.js", href: "https://nextjs.org" },
      { label: "Three.js", href: "https://threejs.org" },
      { label: "Motion", href: "https://motion.dev" },
      { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    ],
  },
];

export function Footer() {
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

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
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
            © {new Date().getFullYear()} Staraim — a concept build
          </p>
          <p className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
            Star data: d3-celestial (BSD-3) · Ephemeris: Astronomy Engine (MIT)
          </p>
        </div>
      </div>
    </footer>
  );
}
