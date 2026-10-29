import { Nav } from "@/components/sections/Nav";

export const metadata = {
  title: "Sky explorers",
};

const CITIES = [
  { name: "Jakarta", count: 19255 },
  { name: "Bandung", count: 9430 },
  { name: "Surabaya", count: 9397 },
  { name: "Semarang", count: 4641 },
  { name: "Makassar", count: 4580 },
  { name: "Bekasi", count: 4482 },
  { name: "Medan", count: 4243 },
  { name: "Tangerang", count: 3549 },
  { name: "Yogyakarta", count: 3093 },
  { name: "Banjarmasin", count: 2884 },
];

const COUNTRIES = [
  { name: "Malaysia", count: 3193 },
  { name: "Singapore", count: 385 },
  { name: "Philippines", count: 212 },
  { name: "Timor-Leste", count: 184 },
  { name: "United States", count: 170 },
  { name: "Taiwan", count: 106 },
];

export default async function ExplorersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === "id" ? "id" : "en") as "en" | "id";
  const isId = locale === "id";

  return (
    <main>
      <Nav lang={locale} />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
              {isId ? "Penjelajah Langit" : "Sky explorers"}
            </p>
            <h1 className="mt-6 text-balance text-[clamp(2.5rem,7vw,5rem)] leading-[1.02] font-medium tracking-[-0.035em] text-mist">
              {isId ? "138.032 penjelajah langit." : "138,032 sky explorers."}
              <br />
              {isId ? "105 negara. Satu dunia di bawah bintang." : "105 countries. One sky."}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog">
              {isId
                ? "Setiap orang yang menikmati keindahan langit dan mengarahkan pandangannya ke bintang dalam 12 bulan terakhir, tersebar di seluruh dunia. Sebagian besar berada di Indonesia."
                : "Everyone who looks up to explore the night sky with Staraim over the last twelve months, placed by city. Most are under Indonesian skies, but stargazers span the globe."}
            </p>
            <p className="mt-4 text-sm text-dim">
              {isId
                ? "Geser untuk memutar · Arahkan ke puncak untuk melihat kota"
                : "Drag to orbit · Hover a peak for its city"}
            </p>
          </div>

          <div className="relative mt-14 overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/40 to-transparent" />
            <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[620px]">
              <svg viewBox="0 0 1000 520" className="h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id="peak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D0342C" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#D0342C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#D0342C" stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                <g opacity="0.25">
                  {[80, 160, 240, 320, 400, 480].map((y) => (
                    <line key={y} x1="40" y1={y} x2="960" y2={y} stroke="var(--color-line)" strokeWidth="1" />
                  ))}
                </g>
                <g>
                  {[
                    { x: 120, h: 320 },
                    { x: 200, h: 210 },
                    { x: 280, h: 208 },
                    { x: 360, h: 150 },
                    { x: 440, h: 148 },
                    { x: 520, h: 146 },
                    { x: 600, h: 142 },
                    { x: 680, h: 128 },
                    { x: 760, h: 118 },
                    { x: 840, h: 112 },
                  ].map((p, i) => (
                    <g key={i}>
                      <path
                        d={`M ${p.x - 28} 440 L ${p.x} ${440 - p.h} L ${p.x + 28} 440 Z`}
                        fill="url(#peak)"
                      />
                      <ellipse cx={p.x} cy={440 - p.h} rx="12" ry="4" fill="#D0342C" opacity="0.9" />
                    </g>
                  ))}
                </g>
                <text x="500" y="500" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="0.18em" fill="var(--color-dim)">
                  {isId ? "JAWA · INDONESIA · DUNIA" : "JAVA · INDONESIA · WORLD"}
                </text>
              </svg>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <h2 className="text-lg font-medium text-mist">
                  {isId ? "Kota Teratas" : "Top cities"}
                </h2>
                <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                  {isId ? "12 bulan terakhir" : "Last 12 months"}
                </span>
              </div>
              <ol className="divide-y divide-line">
                {CITIES.map((city, i) => (
                  <li key={city.name} className="flex items-center gap-4 px-6 py-3.5">
                    <span className="font-mono text-[11px] text-dim">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-mist">{city.name}</span>
                    <span className="font-mono text-sm text-fog tabular-nums">
                      {city.count.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2">
                {[
                  { value: "138K+", label: isId ? "Penjelajah dalam 12 bulan" : "Explorers in 12 months" },
                  { value: "105", label: isId ? "Negara & wilayah" : "Countries & territories" },
                  { value: "261", label: isId ? "Kota di peta" : "Cities on the map" },
                  { value: "96%", label: isId ? "Di Indonesia" : "In Indonesia" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line bg-surface p-5">
                    <p className="text-2xl font-medium tracking-[-0.02em] text-mist">{stat.value}</p>
                    <p className="mt-1 text-sm text-fog">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-line bg-surface">
                <div className="border-b border-line px-6 py-4">
                  <h2 className="text-lg font-medium text-mist">
                    {isId ? "Di luar Indonesia" : "Beyond Indonesia"}
                  </h2>
                </div>
                <ul className="divide-y divide-line">
                  {COUNTRIES.map((c) => (
                    <li key={c.name} className="flex items-center justify-between px-6 py-3.5">
                      <span className="text-fog">{c.name}</span>
                      <span className="font-mono text-sm text-mist tabular-nums">
                        {c.count.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line px-6 py-3 text-xs text-dim">
                  {isId
                    ? "Data berdasarkan penjelajah unik yang membuka Staraim dalam 12 bulan terakhir."
                    : "Based on unique explorers who opened Staraim in the last twelve months."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
