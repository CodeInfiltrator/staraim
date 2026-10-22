/**
 * Live ephemeris for the Sun, Moon and planets.
 *
 * Astronomy Engine (MIT) provides high-precision VSOP87/ELP2000 positions;
 * everything here is derived from it so the catalogue stays offline-friendly.
 */

import {
  Body,
  Constellation,
  Equator,
  Horizon,
  Illumination,
  MakeTime,
  MoonPhase,
  Observer,
  SearchRiseSet,
} from "astronomy-engine";
import type { AstroTime } from "astronomy-engine";
import type { ObjectCategory, ObjectKind, ObserverLocation } from "./types";
import { CONSTELLATIONS } from "./data/constellations";
import { norm360 } from "./coords";

const CONSTELLATION_NAMES = new Map(
  CONSTELLATIONS.map((c) => [c.id.toUpperCase(), c.name]),
);

export function constellationName(abbreviation: string): string {
  return CONSTELLATION_NAMES.get(abbreviation.toUpperCase()) ?? abbreviation;
}

export interface EphemerisBody {
  id: string;
  name: string;
  kind: ObjectKind;
  category: ObjectCategory;
  /** Right ascension in degrees. */
  ra: number;
  /** Declination in degrees. */
  dec: number;
  /** Apparent visual magnitude. */
  mag: number;
  /** Altitude above the horizon, degrees. */
  alt: number;
  /** Azimuth from north, degrees. */
  az: number;
  /** Distance from Earth, formatted for display. */
  distance: string;
  /** Raw distance in AU. */
  distanceAu: number;
  /** IAU constellation abbreviation. */
  constellation: string;
  /** Illuminated fraction 0..1 (Moon and planets). */
  phase?: number;
  /** Whether the body is above the horizon. */
  aboveHorizon: boolean;
}

const PLANETS: { body: Body; name: string }[] = [
  { body: Body.Mercury, name: "Mercury" },
  { body: Body.Venus, name: "Venus" },
  { body: Body.Mars, name: "Mars" },
  { body: Body.Jupiter, name: "Jupiter" },
  { body: Body.Saturn, name: "Saturn" },
  { body: Body.Uranus, name: "Uranus" },
  { body: Body.Neptune, name: "Neptune" },
];

export function makeObserver(loc: ObserverLocation): Observer {
  return new Observer(loc.lat, loc.lon, loc.height ?? 0);
}

/**
 * Compute the current position of every major solar system body.
 */
export function computeEphemeris(
  date: Date,
  loc: ObserverLocation,
): EphemerisBody[] {
  const observer = makeObserver(loc);
  const time = MakeTime(date);
  const out: EphemerisBody[] = [];

  const push = (
    body: Body,
    name: string,
    kind: ObjectKind,
    category: ObjectCategory,
    distanceUnit: "km" | "AU",
  ) => {
    const eq = Equator(body, date, observer, true, true);
    const horizon = Horizon(date, observer, eq.ra, eq.dec, "normal");
    const illum = Illumination(body, time);
    const ra = norm360(eq.ra * 15);
    const distanceAu = eq.dist;

    out.push({
      id: name.toLowerCase(),
      name,
      kind,
      category,
      ra,
      dec: eq.dec,
      mag: illum.mag,
      alt: horizon.altitude,
      az: horizon.azimuth,
      distance:
        distanceUnit === "km"
          ? `${Math.round(distanceAu * 149_597_870).toLocaleString()} km`
          : `${distanceAu.toFixed(3)} AU`,
      distanceAu,
      constellation: constellationName(Constellation(eq.ra, eq.dec).symbol),
      phase: illum.phase_fraction,
      aboveHorizon: horizon.altitude > 0,
    });
  };

  push(Body.Sun, "Sun", "sun", "Sun", "AU");
  push(Body.Moon, "Moon", "moon", "Moon", "km");
  for (const p of PLANETS) push(p.body, p.name, "planet", "Planet", "AU");

  return out;
}

/** Illuminated fraction of the Moon, 0 (new) .. 1 (full). */
export function moonIllumination(date: Date): number {
  return Illumination(Body.Moon, MakeTime(date)).phase_fraction;
}

/** Moon phase angle in degrees: 0 new, 90 first quarter, 180 full, 270 last quarter. */
export function moonPhaseAngle(date: Date): number {
  return MoonPhase(date);
}

export interface RiseSet {
  rise: Date | null;
  set: Date | null;
}

/** Next rise and set of a body within the search window. */
export function riseSet(
  body: Body,
  loc: ObserverLocation,
  from: Date,
  limitDays = 2,
): RiseSet {
  const observer = makeObserver(loc);
  const rise = SearchRiseSet(body, observer, +1, from, limitDays);
  const set = SearchRiseSet(body, observer, -1, from, limitDays);
  return {
    rise: rise ? rise.date : null,
    set: set ? set.date : null,
  };
}

/** True when the Sun is below the horizon — i.e. it is night time. */
export function isNight(date: Date, loc: ObserverLocation): boolean {
  const eq = Equator(Body.Sun, date, makeObserver(loc), true, true);
  const horizon = Horizon(date, makeObserver(loc), eq.ra, eq.dec, "normal");
  return horizon.altitude < -0.833;
}

export type { AstroTime };
