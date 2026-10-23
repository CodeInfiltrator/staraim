"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SkyScene } from "./skyScene";
import { SkyIndex, type CatalogueEntry } from "@/lib/astro/sky";
import { compassPoint, norm360 } from "@/lib/astro/coords";
import { useObserverLocation } from "@/lib/useObserverLocation";
import type { SkyObject } from "@/lib/astro/types";

/* ------------------------------------------------------------------ helpers */

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function compassLabel(az: number) {
  return COMPASS[Math.round(norm360(az) / 45) % 8];
}

/** Local mean solar time at the observer's longitude. */
function shifted(date: Date, lon: number) {
  return new Date(date.getTime() + (lon / 15) * 3_600_000);
}

function clockAt(date: Date, lon: number) {
  return shifted(date, lon).toISOString().slice(11, 16);
}

function dayAt(date: Date, lon: number) {
  return shifted(date, lon)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ".");
}

/* ------------------------------------------------------------------ ribbon */

function CompassRibbon({ heading }: { heading: number }) {
  const span = 130; // degrees of sky shown across the ribbon
  const ticks = useMemo(() => {
    const out: { deg: number; label?: string; major: boolean }[] = [];
    const base = Math.round(heading / 5) * 5;
    for (let d = -70; d <= 70; d += 5) {
      const deg = base + d;
      const norm = ((deg % 360) + 360) % 360;
      const major = norm % 15 === 0;
      const label = norm % 45 === 0 ? COMPASS[norm / 45] : undefined;
      out.push({ deg, label, major });
    }
    return out;
  }, [Math.round(heading / 5)]);

  return (
    <div className="pointer-events-none relative h-9 w-full max-w-[420px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {ticks.map((t) => {
        const left = 50 + ((t.deg - heading) / span) * 100;
        return (
          <div
            key={t.deg}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${left}%` }}
          >
            <div
              className={`w-px ${t.major ? "h-3 bg-white/45" : "h-1.5 bg-white/20"}`}
            />
            {t.label ? (
              <div className="mt-0.5 text-center font-mono text-[10px] tracking-widest text-mist/80">
                {t.label}
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-sage shadow-[0_0_10px_rgba(207,224,160,0.9)]" />
    </div>
  );
}

/* --------------------------------------------------------------- object card */

function magnitudeText(mag?: number) {
  if (mag === undefined || Number.isNaN(mag)) return "—";
  if (mag > 0) return `+${mag.toFixed(2)}`;
  return mag.toFixed(2);
}

function ObjectCard({
  entry,
  onFocus,
}: {
  entry: SkyObject;
  onFocus: () => void;
}) {
  const facts = Object.entries(entry.facts ?? {}).slice(0, 4);

  return (
    <div className="glass w-[min(20rem,calc(100vw-3rem))] rounded-2xl p-4 shadow-2xl shadow-black/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl leading-tight font-medium tracking-[-0.02em] text-mist">
            {entry.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] tracking-[0.14em] text-mint uppercase">
            {entry.category}
            {entry.constellation ? ` · ${entry.constellation}` : ""}
          </p>
        </div>
        {entry.kind === "star" && entry.bv !== undefined ? (
          <span
            className="mt-1 h-4 w-4 shrink-0 rounded-full border border-white/25"
            style={{
              background: `rgb(${bvRgb(entry.bv)})`,
              boxShadow: "0 0 14px -2px rgba(255,255,255,0.35)",
            }}
          />
        ) : null}
      </div>

      {entry.blurb ? (
        <p className="mt-3 text-sm leading-relaxed text-fog">{entry.blurb}</p>
      ) : null}

      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <Stat label="Altitude" value={`${(entry.alt ?? 0).toFixed(1)}°`} />
        <Stat label="Azimuth" value={`${(entry.az ?? 0).toFixed(0)}° ${compassLabel(entry.az ?? 0)}`} />
        <Stat label="Magnitude" value={magnitudeText(entry.mag)} />
      </dl>

      {facts.length ? (
        <dl className="mt-2 grid grid-cols-2 gap-2">
          {facts.map(([k, v]) => (
            <Stat key={k} label={k} value={v} small />
          ))}
        </dl>
      ) : null}

      <button
        onClick={onFocus}
        className="mt-4 w-full cursor-pointer rounded-pill bg-sage/15 py-2 font-mono text-[11px] tracking-[0.16em] text-sage uppercase transition-colors hover:bg-sage/25"
      >
        Centre on object
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
        {label}
      </dt>
      <dd
        className={`mt-0.5 tabular-nums text-mist ${small ? "text-xs" : "text-sm"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/** Rough black-body colour for a B-V index. */
function bvRgb(bv: number) {
  const t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));
  const x = Math.min(40000, Math.max(1000, t)) / 100;
  let r: number, g: number, b: number;
  if (x <= 66) {
    r = 255;
    g = 99.47 * Math.log(x) - 161.12;
  } else {
    r = 329.7 * Math.pow(x - 60, -0.1332);
    g = 288.12 * Math.pow(x - 60, -0.0755);
  }
  if (x >= 66) b = 255;
  else if (x <= 19) b = 0;
  else b = 138.52 * Math.log(x - 10) - 305.04;
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `${c(r)}, ${c(g)}, ${c(b)}`;
}

/* ------------------------------------------------------------------- screen */

export function SkyMap({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SkyScene | null>(null);
  const indexRef = useRef<SkyIndex | null>(null);

  const headingRef = useRef(0);
  const pitchRef = useRef(18);

  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(18);
  const [selected, setSelected] = useState<SkyObject | null>(null);
  const [target, setTarget] = useState<SkyObject | null>(null);
  const [offsetHours, setOffsetHours] = useState(0);
  const [clock, setClock] = useState(() => new Date());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [drifting, setDrifting] = useState(true);

  const { location, status, located, request, reset, label } = useObserverLocation();

  /* ------------------------------------------------------------- scene boot */

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;

    let scene: SkyScene;
    try {
      scene = new SkyScene(
        {
          canvas,
          labelLayer: layer,
          onPick: (entry) => {
            if (entry) {
              setSelected(entry);
              setDrifting(false);
            }
          },
          onFrame: (info) => {
            headingRef.current = info.heading;
            pitchRef.current = info.pitch;
            setHeading(info.heading);
            setPitch(info.pitch);
          },
        },
        { date: new Date(), lat: location.lat, lon: location.lon },
      );
    } catch {
      // No WebGL context — the rest of the page still works, so show a
      // static placeholder instead of taking the whole page down.
      setFailed(true);
      return;
    }

    sceneRef.current = scene;
    setReady(true);

    const observer = new ResizeObserver(() => scene.resize());
    observer.observe(canvas);

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      scene.render(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
    // The scene is created once; state changes are pushed in through setState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------- push state to the scene */

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.setState({
      date: new Date(Date.now() + offsetHours * 3_600_000),
      lat: location.lat,
      lon: location.lon,
    });
  }, [offsetHours, location.lat, location.lon]);

  /* ------------------------------------------------------- the live index */

  useEffect(() => {
    if (!indexRef.current) {
      indexRef.current = new SkyIndex(new Date(), {
        lat: location.lat,
        lon: location.lon,
      });
    }
  }, [location.lat, location.lon]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const index = indexRef.current;
      if (!index) return;
      index.update(new Date(Date.now() + offsetHours * 3_600_000), {
        lat: location.lat,
        lon: location.lon,
      });

      const res = index.identify(pitchRef.current, headingRef.current, {
        tolerance: 9,
        limit: 3,
        namedOnly: true,
      });

      setTarget((prev) => {
        const next = res.best;
        if (!next) return null;
        if (prev && prev.id === next.id) return prev;
        return next;
      });
    }, 250);
    return () => window.clearInterval(tick);
  }, [offsetHours, location.lat, location.lon]);

  useEffect(() => {
    const tick = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  /* ------------------------------------------------------------- helpers */

  const focusOn = useCallback((entry: SkyObject) => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (entry.alt !== undefined && entry.az !== undefined) {
      scene.lookAt(entry.alt, entry.az);
    }
    setDrifting(false);
  }, []);

  const toggleDrift = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const next = !drifting;
    scene.setAutoDrift(next);
    setDrifting(next);
  }, [drifting]);

  const card = selected ?? target;

  const jumpToNow = useCallback(() => setOffsetHours(0), []);

  if (failed) {
    return (
      <SkyFallback
        className={className}
        location={location}
        label={label}
        now={clock}
        offsetHours={offsetHours}
      />
    );
  }

  return (
    <div
      className={`relative isolate overflow-hidden rounded-3xl border border-line bg-ink shadow-[0_60px_140px_-80px_rgba(207,224,160,0.25)] ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />
      <div ref={layerRef} className="pointer-events-none absolute inset-0" />

      {/* ---------------------------------------------------------- vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.55)_100%)]" />

      {/* ----------------------------------------------------------- top bar */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="glass flex items-center gap-2 rounded-pill px-3 py-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "granted"
                ? "bg-mint shadow-[0_0_8px_rgba(159,223,168,0.9)]"
                : "bg-fog/50"
            }`}
          />
          <span className="font-mono text-[11px] tracking-[0.12em] text-mist">
            {label}
          </span>
          {located ? (
            <button
              onClick={reset}
              className="cursor-pointer font-mono text-[10px] tracking-[0.12em] text-dim uppercase transition-colors hover:text-mist"
            >
              reset
            </button>
          ) : (
            <button
              onClick={request}
              disabled={status === "requesting"}
              className="cursor-pointer font-mono text-[10px] tracking-[0.12em] text-mint uppercase transition-colors hover:text-mist disabled:opacity-50"
            >
              {status === "requesting" ? "locating…" : "use my location"}
            </button>
          )}
        </div>

        <div className="glass flex items-center gap-3 rounded-pill px-3 py-1.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-mist tabular-nums">
            {clockAt(clock, location.lon)}
          </span>
          <span className="font-mono text-[10px] tracking-[0.12em] text-dim tabular-nums">
            {dayAt(clock, location.lon)}
          </span>
          {offsetHours === 0 ? (
            <span className="font-mono text-[10px] tracking-[0.18em] text-mint uppercase">
              live
            </span>
          ) : (
            <span className="font-mono text-[10px] tracking-[0.18em] text-sage uppercase">
              {offsetHours > 0 ? "+" : ""}
              {offsetHours}h
            </span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- compass */}
      <div className="absolute inset-x-0 top-16 flex justify-center sm:top-20">
        <CompassRibbon heading={heading} />
      </div>

      {/* ---------------------------------------------------------- reticle */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <svg width="72" height="72" viewBox="0 0 72 72" className="opacity-80">
            <g stroke="#CFE0A0" strokeWidth="1.2" fill="none" opacity="0.75">
              <path d="M6 20V6h14" />
              <path d="M52 6h14v14" />
              <path d="M66 52v14H52" />
              <path d="M20 66H6V52" />
            </g>
            <circle cx="36" cy="36" r="2.4" fill="#9FDFA8" />
          </svg>
          {target && !selected ? (
            <div className="absolute top-[76px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <div className="font-mono text-[11px] tracking-[0.18em] text-sage uppercase">
                {target.name}
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-dim tabular-nums">
                {((target.separation ?? 0) * 60).toFixed(0)}′ off centre
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------ object card */}
      <div className="absolute bottom-24 left-4 sm:bottom-28 sm:left-5">
        {card ? (
          <ObjectCard entry={card} onFocus={() => focusOn(card)} />
        ) : (
          <div className="glass max-w-[18rem] rounded-2xl p-4">
            <p className="font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
              Nothing in the reticle
            </p>
            <p className="mt-1.5 text-sm text-fog">
              Drag to look around. Staraim names whatever the crosshair settles on.
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------ bottom bar */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
              time
            </span>
            <input
              type="range"
              min={-12}
              max={12}
              step={0.25}
              value={offsetHours}
              onChange={(e) => setOffsetHours(Number(e.target.value))}
              aria-label="Scrub through time"
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-sage"
            />
            <button
              onClick={jumpToNow}
              className="cursor-pointer rounded-pill border border-line px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-fog uppercase transition-colors hover:border-sage/40 hover:text-sage"
            >
              now
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
              <span className="text-mist tabular-nums">
                {((heading % 360) + 360).toFixed(0).padStart(3, "0")}°{" "}
                {compassPoint(heading)}
              </span>
              <span className="text-dim">/</span>
              <span className="tabular-nums">{pitch.toFixed(0)}° alt</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDrift}
                className={`cursor-pointer rounded-pill border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors ${
                  drifting
                    ? "border-sage/40 text-sage"
                    : "border-line text-fog hover:border-sage/40 hover:text-sage"
                }`}
              >
                drift
              </button>
              <button
                onClick={() => {
                  const scene = sceneRef.current;
                  if (!scene) return;
                  scene.lookAt(45, 180);
                  setDrifting(false);
                }}
                className="cursor-pointer rounded-pill border border-line px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-fog uppercase transition-colors hover:border-sage/40 hover:text-sage"
              >
                south
              </button>
              <button
                onClick={() => {
                  const scene = sceneRef.current;
                  if (!scene) return;
                  scene.lookAt(0, 0);
                  setDrifting(false);
                }}
                className="cursor-pointer rounded-pill border border-line px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-fog uppercase transition-colors hover:border-sage/40 hover:text-sage"
              >
                north
              </button>
              <button
                onClick={() => {
                  const scene = sceneRef.current;
                  if (!scene) return;
                  scene.lookAt(60, 90);
                  setDrifting(false);
                }}
                className="cursor-pointer rounded-pill border border-line px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-fog uppercase transition-colors hover:border-sage/40 hover:text-sage"
              >
                zenith
              </button>
            </div>
          </div>
        </div>
      </div>

      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-ink">
          <div className="font-mono text-[11px] tracking-[0.2em] text-dim uppercase">
            Charting the sky…
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- fallback */

/**
 * Shown when the browser cannot give us a WebGL context.
 *
 * The renderer is the only thing that needs WebGL — the catalogue, the
 * ephemeris and the satellite propagation are all plain JavaScript, so the
 * data view still works.
 */
function SkyFallback({
  className,
  location,
  label,
  now,
  offsetHours,
}: {
  className: string;
  location: { lat: number; lon: number };
  label: string;
  now: Date;
  offsetHours: number;
}) {
  const rows = useMemo(() => {
    const index = new SkyIndex(
      new Date(now.getTime() + offsetHours * 3_600_000),
      { lat: location.lat, lon: location.lon },
    );
    return index
      .visible({ includeDso: true, limit: 14 })
      .map((e) => ({
        name: e.name,
        kind: e.kind,
        category: e.category,
        alt: e.alt ?? 0,
        az: e.az ?? 0,
      }));
  }, [now, offsetHours, location.lat, location.lon]);

  return (
    <div
      className={`relative isolate overflow-hidden rounded-3xl border border-line bg-[radial-gradient(ellipse_at_50%_100%,#16233a_0%,#080b12_45%,#05070f_100%)] ${className}`}
    >
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="glass flex items-center gap-2 rounded-pill px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-fog/50" />
          <span className="font-mono text-[11px] tracking-[0.12em] text-mist">
            {label}
          </span>
        </div>
        <div className="glass flex items-center gap-3 rounded-pill px-3 py-1.5">
          <span className="font-mono text-[11px] tracking-[0.12em] text-mist tabular-nums">
            {clockAt(now, location.lon)}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-mint uppercase">
            {offsetHours === 0 ? "live" : `${offsetHours > 0 ? "+" : ""}${offsetHours}h`}
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-4 px-6 text-center">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden>
          <g stroke="#CFE0A0" strokeWidth="1.2" opacity="0.6">
            <path d="M6 16V6h10M36 6h10v10M46 36v10H36M16 46H6V36" />
          </g>
          <circle cx="26" cy="26" r="2" fill="#9FDFA8" />
        </svg>
        <p className="max-w-xs font-mono text-[11px] leading-relaxed tracking-[0.14em] text-fog uppercase">
          This browser cannot open a WebGL context, so the live sky is
          unavailable here.
        </p>
        <p className="max-w-xs text-[13px] leading-relaxed text-dim">
          The catalogue and the ephemeris still work — everything above your
          horizon right now is listed below.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="glass max-h-[42%] overflow-y-auto rounded-2xl">
          <ul className="divide-y divide-line">
            {rows.map((r, i) => (
              <li
                key={`${r.name}-${i}`}
                className="flex items-center gap-3 px-4 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-[13px] text-mist">
                  {r.name}
                </span>
                <span className="font-mono text-[10px] tracking-[0.12em] text-dim uppercase">
                  {r.category}
                </span>
                <span className="font-mono text-[11px] text-fog tabular-nums">
                  {r.alt.toFixed(0)}° {compassPoint(r.az)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
