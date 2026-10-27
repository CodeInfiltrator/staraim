"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";
import { Locale } from "@/lib/i18n";

export function Features({ lang = "en" }: { lang?: Locale }) {
  const FEATURES =
    lang === "id"
      ? [
          {
            title: "Katalog nyata",
            body: "2.061 bintang hingga magnitudo 6,5, 89 figur rasi IAU dan 142 objek Messier dan NGC — dihitung di perangkat Anda, tidak diunduh.",
            icon: "catalogue",
          },
          {
            title: "Efemeris langsung",
            body: "Matahari, Bulan dan tujuh planet diposisikan menggunakan VSOP87 dan ELP2000 untuk lokasi dan waktu persis Anda.",
            icon: "ephemeris",
          },
          {
            title: "Satelit nyata",
            body: "Sepuluh pesawat ruang angkasa dilacak dari set elemen dua baris terkini. Saksikan ISS melintasi langit secara real-time.",
            icon: "satellite",
          },
          {
            title: "Arahkan, bukan geser",
            body: "Jam tangan membaca kerangka inersialnya sendiri, jadi Anda bisa mengangkat lengan dengan posisi alami dan tetap mendapatkan hasil akurat.",
            icon: "point",
          },
          {
            title: "Bisa offline",
            body: "Semua — katalog, efemeris, propagasi satelit — berjalan di perangkat. Tanpa akun, tanpa sinyal, tanpa langganan.",
            icon: "offline",
          },
          {
            title: "Jujur tentang ambiguitas",
            body: "Ketika dua objek berada dalam jarak kurang dari satu derajat, Staraim mengatakannya dan membiarkan Anda memilih, alih-alih menebak dengan yakin.",
            icon: "honest",
          },
        ]
      : [
          {
            title: "A real catalogue",
            body: "2,061 stars down to magnitude 6.5, 89 IAU constellation figures and 142 Messier and NGC objects — computed on your device, never fetched.",
            icon: "catalogue",
          },
          {
            title: "Live ephemeris",
            body: "The Sun, Moon and seven planets are positioned from VSOP87 and ELP2000 for your exact location and the exact second.",
            icon: "ephemeris",
          },
          {
            title: "Real satellites",
            body: "Ten tracked spacecraft propagated from current two-line element sets. Watch the ISS cross the sky in real time.",
            icon: "satellite",
          },
          {
            title: "Point, don't pan",
            body: "The watch reads its own inertial frame, so you can hold your arm however feels natural and still get an exact answer.",
            icon: "point",
          },
          {
            title: "Works offline",
            body: "Everything — catalogue, ephemeris, satellite propagation — runs on the device. No account, no signal, no subscription.",
            icon: "offline",
          },
          {
            title: "Honest about ambiguity",
            body: "When two objects sit within the same degree, Staraim says so and lets you pick, instead of confidently naming the wrong one.",
            icon: "honest",
          },
        ];

function Icon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "catalogue":
      return (
        <svg {...common}>
          <circle cx="7" cy="8" r="1.4" />
          <circle cx="17" cy="6" r="1" />
          <circle cx="14" cy="15" r="1.2" />
          <circle cx="5" cy="17" r="1" />
          <path d="M8.2 7.6 16 6.1M7.9 8.9l5.4 5.1M14.4 14.2 5.9 16.6M16.4 7.1l-2.2 6.8" />
        </svg>
      );
    case "ephemeris":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <ellipse cx="12" cy="12" rx="3.4" ry="8.5" />
          <path d="M3.5 12h17M4.8 7.2h14.4M4.8 16.8h14.4" />
        </svg>
      );
    case "satellite":
      return (
        <svg {...common}>
          <path d="m9.5 9.5 5 5M7 4.5l3.2 3.2M4.5 7 7.7 10.2M16.8 14.8l3.2 3.2M14.3 17l3.2 3.2" />
          <rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)" />
          <path d="M12 12 15 18M12 12 6 18" />
        </svg>
      );
    case "point":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case "offline":
      return (
        <svg {...common}>
          <path d="M6.5 17.5a5 5 0 0 1 6.5-4.7M4 12a9 9 0 0 1 4-2.6" />
          <path d="M20 12a9 9 0 0 0-3.4-2.4" />
          <path d="M15.8 20.6a5 5 0 0 0-1.3-9.5" />
          <path d="m3 3 18 18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 3.5 21 20H3z" />
          <path d="M12 10v4M12 17h.01" />
        </svg>
      );
  }
}

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={lang === "id" ? "Di balik layar" : "Under the hood"}
            title={lang === "id" ? "Astronomi yang muat di saku Anda." : "Astronomy that fits in your pocket."}
            body={
              lang === "id"
                ? "Staraim bukan pembungkus layanan web. Katalog sudah ada di aplikasi, efemeris dihitung saat dibutuhkan, dan perhitungan arah berjalan dalam hitungan mikrodetik."
                : "Staraim is not a wrapper around a web service. The catalogue ships with the app, the ephemeris is computed on demand and the pointing maths runs in a few hundred microseconds."
            }
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors duration-500 hover:border-sage/30 hover:bg-surface-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-3 text-sage transition-colors duration-500 group-hover:border-sage/40">
                  <Icon name={f.icon} />
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-[-0.01em] text-mist">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-fog">
                  {f.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
