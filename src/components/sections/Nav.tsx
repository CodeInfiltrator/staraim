"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getDictionary, Locale } from "@/lib/i18n";

export function Nav({ lang = "en" }: { lang?: Locale }) {
  const dict = getDictionary(lang);
  const router = useRouter();
  const pathname = usePathname();
  
  const LINKS = [
    { href: `/${lang}`, label: dict.home },
    { href: `/${lang}#how`, label: dict.how },
    { href: `/${lang}#watch`, label: dict.watch },
    { href: `/${lang}/sky`, label: dict.live },
    { href: `/${lang}/catalogue`, label: dict.catalogue },
  ];

  const changeLanguage = (newLang: Locale) => {
    if (newLang === lang) return;
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/") || `/${newLang}`);
  };
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-void/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={`/${lang}`} className="group flex items-center gap-2.5">
          <Reticle className="h-6 w-6" />
          <span className="text-[15px] font-medium tracking-[-0.01em] text-mist">
            Staraim
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm text-fog transition-colors hover:text-mist"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-sage transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-line bg-surface/80 p-0.5 sm:flex">
            <button
              onClick={() => changeLanguage("en")}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                lang === "en"
                  ? "bg-sage text-white"
                  : "text-fog hover:text-mist"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("id")}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                lang === "id"
                  ? "bg-sage text-white"
                  : "text-fog hover:text-mist"
              }`}
            >
              ID
            </button>
          </div>
          <Link
            href={`/${lang}/sky`}
            className="hidden rounded-pill bg-sage px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#E03C34] sm:inline-flex"
          >
            {dict.openSky}
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-void/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col px-5 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 text-sm text-fog last:border-0"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    changeLanguage("en");
                    setOpen(false);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm ${lang === "en" ? "bg-sage text-white" : "border border-line text-fog"}`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    changeLanguage("id");
                    setOpen(false);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm ${lang === "id" ? "bg-sage text-white" : "border border-line text-fog"}`}
                >
                  Indonesia
                </button>
              </div>
              <Link
                href={`/${lang}/sky`}
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-pill bg-sage px-4 py-2 text-[13px] font-medium text-white hover:bg-[#E03C34]"
              >
                {dict.openSky}
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

/** The Staraim mark: a reticle with a sage crosshair. */
export function Reticle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.2" stroke="#D0342C" strokeWidth="1.1" opacity="0.6" />
      <path
        d="M12 1.5v6M12 16.5v6M1.5 12h6M16.5 12h6"
        stroke="#D0342C"
        strokeWidth="1.1"
        opacity="0.9"
      />
      <circle cx="12" cy="12" r="2.1" fill="#D0342C" />
    </svg>
  );
}
