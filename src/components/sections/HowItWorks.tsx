"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";
import { getDictionary, Locale } from "@/lib/i18n";

export function HowItWorks({ lang = "en" }: { lang?: Locale }) {
  const STEPS =
    lang === "id"
      ? [
          {
            n: "01",
            title: "Kalibrasi",
            body: "Pegang Bulan di dalam reticle selama dua detik. Staraim mempelajari perbedaan antara pergelangan tangan Anda dan langit.",
            detail: "Dua detik, sekali per sesi",
          },
          {
            n: "02",
            title: "Arahkan",
            body: "Angkat lengan Anda secara alami. Jam tangan membaca gerakan inersialnya sendiri dan menentukan ke mana arahnya.",
            detail: "Tanpa kompas, tanpa magnetometer",
          },
          {
            n: "03",
            title: "Ketahui",
            body: "Saat bidikan stabil, jam tangan langsung menamai objek yang Anda arahkan — dan seberapa jauh jaraknya.",
            detail: "2.061 bintang · 142 objek langit dalam",
          },
        ]
      : [
          {
            n: "01",
            title: "Calibrate",
            body: "Hold the Moon in the reticle for two seconds. Staraim learns the offset between your wrist and the sky.",
            detail: "Two seconds, once per session",
          },
          {
            n: "02",
            title: "Point",
            body: "Raise your arm naturally. The watch reads its own inertial motion and works out exactly where it is looking.",
            detail: "No compass, no magnetometer",
          },
          {
            n: "03",
            title: "Know",
            body: "The moment the crosshair settles, the watch names what you are pointing at — and how far away it is.",
            detail: "2,061 stars · 142 deep sky objects",
          },
        ];
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={lang === "id" ? "Cara Kerja" : "How it works"}
            title={
              lang === "id" ? (
                <>
                  Tiga langkah, tanpa
                  <br />
                  penyelarasan manual.
                </>
              ) : (
                <>
                  Three steps, no manual
                  <br />
                  alignment.
                </>
              )
            }
            body={
              lang === "id"
                ? "Bagian tersulit dari identifikasi langit bukan katalognya — tapi mengetahui ke arah mana pergelangan tangan menunjuk. Staraim menyelesaikannya dengan sensor gerak bawaan jam tangan."
                : "The hard part of sky identification is not the catalogue — it is knowing which way the wrist is pointing. Staraim solves that with the watch's own motion sensors."
            }
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {STEPS.map((step) => (
            <StaggerItem key={step.n} className="bg-surface">
              <div className="group relative h-full bg-surface p-7 transition-colors duration-500 hover:bg-surface-2 sm:p-9">
                <span className="font-mono text-[11px] tracking-[0.2em] text-mint">
                  {step.n}
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-mist">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fog">
                  {step.body}
                </p>
                <p className="mt-6 font-mono text-[11px] tracking-[0.12em] text-dim uppercase">
                  {step.detail}
                </p>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-sage to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-2xl border border-line shadow-2xl">
            <video
              src="/videoPitch.mp4"
              controls
              playsInline
              preload="metadata"
              poster="/recentUI.jpeg"
              className="w-full aspect-video object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
