"use client";

import { WatchSimulator } from "@/components/watch/WatchSimulator";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";
import { Locale } from "@/lib/i18n";

export function WatchExperience({ lang = "en" }: { lang?: Locale }) {
  const NOTES =
    lang === "id"
      ? [
          {
            title: "Kalibrasi dengan Bulan",
            body: "Dua detik mengarahkan ke target yang dikenal mengajarkan jam tangan offset antara pergelangan tangan dan langit. Hanya langkah ini yang perlu dilakukan sesekali.",
          },
          {
            title: "Arahkan, jangan bidik",
            body: "Reticle mengikuti kerangka inersial lengan. Tanpa kompas atau magnetometer, jadi tidak terpengaruh benda di sekitar.",
          },
          {
            title: "Ambiguitas ditangani dengan tepat",
            body: "Jika dua objek berada dalam sudut yang sama, jam tangan akan bertanya alih-alih menebak. Pilih salah satu, konfirmasi, dan lanjutkan.",
          },
        ]
      : [
          {
            title: "Calibrate against the Moon",
            body: "Two seconds of holding a known target teaches the watch the offset between your wrist and the sky. It is the only step that ever needs doing twice.",
          },
          {
            title: "Point, do not aim",
            body: "The reticle tracks the inertial frame of the arm. There is no compass magnetometer to be confused by a fridge.",
          },
          {
            title: "Ambiguity is a first-class state",
            body: "When two objects fall inside the same degree, the watch asks instead of guessing. Tap one, confirm, and move on.",
          },
        ];
  return (
    <section id="watch" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow={lang === "id" ? "Di pergelangan tangan" : "On the wrist"}
                title={
                  lang === "id" ? (
                    <>
                      Jam tangan yang
                      <br />
                      tahu ke mana ia melihat.
                    </>
                  ) : (
                    <>
                      A watch that
                      <br />
                      knows where it&apos;s looking.
                    </>
                  )
                }
                body={
                  lang === "id"
                    ? "Inilah pengalaman di Apple Watch. Setiap layar di bawah adalah antarmuka asli, bukan gambar."
                    : "This is the watch experience, running in the browser. Step through it — every screen below is the real interface, not a picture of it."
                }
              />

              <Stagger className="mt-10 space-y-7">
                {NOTES.map((n) => (
                  <StaggerItem key={n.title}>
                    <div className="border-l border-line pl-5">
                      <h3 className="text-[15px] font-medium text-mist">
                        {n.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-fog">
                        {n.body}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>

          <Reveal from="right" delay={0.12}>
            <WatchSimulator className="mx-auto max-w-sm" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
