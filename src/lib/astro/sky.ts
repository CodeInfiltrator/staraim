/**
 * The sky model.
 *
 * A `SkyIndex` snapshots everything that is visible from one place at one
 * moment: the star catalogue, deep sky objects, the solar system, and any
 * tracked satellites. Pointing the device at the sky is then just a dot
 * product against pre-computed unit vectors.
 */

import {
  angularSeparation,
  compassPoint,
  horizontalToVector,
  localSiderealTime,
  norm360,
  vectorToHorizontal,
} from "./coords";
import { computeEphemeris, isNight } from "./ephemeris";
import { DSO_META, DSO_TYPE_BLURB, MOON_META, PLANET_META, SUN_META } from "./metadata";
import { parseTle, satellitePosition } from "./satellite";
import { DSO } from "./data/dso";
import { NAMED_STARS, STAR_BV, STAR_DEC, STAR_MAG, STAR_RA } from "./data/stars";
import { SATELLITES } from "./data/satellites";
import type { IdentificationResult, ObjectCategory, ObserverLocation, SkyObject } from "./types";

/** Unit vector for an equatorial position, in the equatorial frame. */
export function equatorialUnit(raDeg: number, decDeg: number): [number, number, number] {
  const a = (raDeg * Math.PI) / 180;
  const d = (decDeg * Math.PI) / 180;
  const cd = Math.cos(d);
  return [cd * Math.cos(a), cd * Math.sin(a), Math.sin(d)];
}

export interface CatalogueEntry extends SkyObject {
  /** Unit vector in the equatorial frame. */
  vec: [number, number, number];
}

export interface IdentifyOptions {
  /** Maximum angular separation, in degrees. */
  tolerance?: number;
  /** Maximum number of candidates to return. */
  limit?: number;
  /** Ignore objects below the horizon. */
  aboveHorizonOnly?: boolean;
  /** Include deep sky objects (faint; often filtered out). */
  includeDso?: boolean;
  /** Include the full star list or only the named ones. */
  namedOnly?: boolean;
}

const DEFAULT_TOLERANCE = 6;

export class SkyIndex {
  date: Date;
  location: ObserverLocation;
  /** Local apparent sidereal time in degrees. */
  lst: number;
  night: boolean;

  readonly stars: CatalogueEntry[] = [];
  readonly namedStars: CatalogueEntry[] = [];
  readonly dso: CatalogueEntry[] = [];
  readonly solarSystem: CatalogueEntry[] = [];
  readonly satellites: CatalogueEntry[] = [];

  /** id -> entry, for quick lookup. */
  private readonly byId = new Map<string, CatalogueEntry>();

  constructor(date: Date, location: ObserverLocation) {
    this.date = date;
    this.location = location;
    this.lst = localSiderealTime(date, location.lon);
    this.night = isNight(date, location);

    this.buildStars();
    this.buildDso();
    this.buildDynamic();
  }

  /**
   * Move the snapshot to a new time and/or place.
   *
   * The static catalogue (stars, deep sky objects) never changes, so only
   * the moving bodies are recomputed. That keeps a live sky at 10 Hz on a
   * phone without rebuilding two thousand star records every frame.
   */
  update(date: Date, location: ObserverLocation = this.location) {
    this.date = date;
    this.location = location;
    this.lst = localSiderealTime(date, location.lon);
    this.night = isNight(date, location);
    this.buildDynamic();
  }

  private push(entry: CatalogueEntry) {
    this.byId.set(entry.id, entry);
  }

  private buildStars() {
    for (let i = 0; i < STAR_RA.length; i++) {
      const entry: CatalogueEntry = {
        id: `star:${STAR_RA[i]}:${STAR_DEC[i]}`,
        name: "",
        kind: "star",
        category: "Star",
        ra: STAR_RA[i],
        dec: STAR_DEC[i],
        mag: STAR_MAG[i],
        bv: STAR_BV[i],
        vec: equatorialUnit(STAR_RA[i], STAR_DEC[i]),
      };
      this.stars.push(entry);
      this.push(entry);
    }

    // Named stars get their proper names attached.
    for (const s of NAMED_STARS) {
      const key = `star:${s.ra}:${s.dec}`;
      const match = this.stars.find(
        (st) => Math.abs(st.ra - s.ra) < 0.02 && Math.abs(st.dec - s.dec) < 0.02,
      );
      const entry: CatalogueEntry = {
        id: key,
        name: s.n,
        kind: "star",
        category: "Star",
        ra: s.ra,
        dec: s.dec,
        mag: s.m,
        bv: match?.bv ?? 0.3,
        constellation: s.c,
        vec: equatorialUnit(s.ra, s.dec),
      };
      this.namedStars.push(entry);
      this.push(entry);
    }
  }

  private buildDso() {
    for (const d of DSO) {
      const meta = DSO_META[d.id];
      const entry: CatalogueEntry = {
        id: `dso:${d.id}`,
        name: meta ? d.name : d.name || d.desig,
        kind: "dso",
        category: (d.type as ObjectCategory) ?? "Deep sky object",
        ra: d.ra,
        dec: d.dec,
        mag: d.mag,
        constellation: d.con,
        blurb: meta?.blurb ?? DSO_TYPE_BLURB[d.type],
        description: meta?.description ?? DSO_TYPE_BLURB[d.type],
        facts: {
          Designation: d.desig,
          Type: d.type,
          ...(d.dim ? { "Apparent size": `${d.dim}'` } : {}),
        },
        vec: equatorialUnit(d.ra, d.dec),
      };
      this.dso.push(entry);
      this.push(entry);
    }
  }

  private buildDynamic() {
    for (const e of this.solarSystem) this.byId.delete(e.id);
    for (const e of this.satellites) this.byId.delete(e.id);
    this.solarSystem.length = 0;
    this.satellites.length = 0;
    this.buildSolarSystem();
    this.buildSatellites();
  }

  private buildSolarSystem() {
    const bodies = computeEphemeris(this.date, this.location);
    for (const b of bodies) {
      const meta =
        b.kind === "sun" ? SUN_META : b.kind === "moon" ? MOON_META : PLANET_META[b.name];
      const entry: CatalogueEntry = {
        id: `body:${b.id}`,
        name: b.name,
        kind: b.kind,
        category: b.category as ObjectCategory,
        ra: b.ra,
        dec: b.dec,
        mag: b.mag,
        constellation: b.constellation,
        blurb: meta?.blurb,
        description: meta?.description,
        distance: b.distance,
        facts: meta?.facts,
        vec: equatorialUnit(b.ra, b.dec),
      };
      this.solarSystem.push(entry);
      this.push(entry);
    }
  }

  private buildSatellites() {
    for (const s of SATELLITES) {
      const tle = parseTle(s.name, s.line1, s.line2);
      if (!tle) continue;
      const pos = satellitePosition(tle, this.date, this.location.lat, this.location.lon);
      const entry: CatalogueEntry = {
        id: `sat:${s.id}`,
        name: s.label,
        kind: "satellite",
        category: "Satellite",
        ra: pos.ra,
        dec: pos.dec,
        mag: pos.mag,
        blurb: `${s.kind} tracking live from a current two line element set.`,
        distance: `${Math.round(pos.range).toLocaleString()} km`,
        facts: { "Orbital type": s.kind, NORAD: s.id },
        vec: equatorialUnit(pos.ra, pos.dec),
      };
      this.satellites.push(entry);
      this.push(entry);
    }
  }

  /** Look up an entry by id. */
  get(id: string): CatalogueEntry | undefined {
    return this.byId.get(id);
  }

  /** All entries, optionally filtered. */
  all(opts: { includeDso?: boolean; namedOnly?: boolean } = {}): CatalogueEntry[] {
    const out: CatalogueEntry[] = [];
    out.push(...this.solarSystem, ...this.satellites);
    out.push(...(opts.namedOnly === false ? this.stars : this.namedStars));
    if (opts.includeDso) out.push(...this.dso);
    return out;
  }

  /**
   * Convert a horizontal direction to the equatorial frame.
   */
  pointingVector(alt: number, az: number): [number, number, number] {
    const [x, y, z] = horizontalToVector(alt, az);
    // Invert the equatorial -> alt-az rotation.
    const phi = (this.location.lat * Math.PI) / 180;
    const l = (this.lst * Math.PI) / 180;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const cl = Math.cos(l);
    const sl = Math.sin(l);
    // Rows of the forward matrix; the inverse is its transpose.
    const m00 = -sl;
    const m01 = cl;
    const m02 = 0;
    const m10 = c * cl;
    const m11 = c * sl;
    const m12 = s;
    const m20 = s * cl;
    const m21 = s * sl;
    const m22 = -c;
    const ex = m00 * x + m10 * y + m20 * z;
    const ey = m01 * x + m11 * y + m21 * z;
    const ez = m02 * x + m12 * y + m22 * z;
    return [ex, ey, ez];
  }

  /** Altitude and azimuth of an entry right now. */
  altAz(entry: CatalogueEntry): { alt: number; az: number } {
    const v = this.altAzVector(entry);
    return vectorToHorizontal(v);
  }

  /** Alt-az unit vector for an entry, using the current sidereal time. */
  altAzVector(entry: CatalogueEntry): [number, number, number] {
    const phi = (this.location.lat * Math.PI) / 180;
    const l = (this.lst * Math.PI) / 180;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const cl = Math.cos(l);
    const sl = Math.sin(l);
    const [ex, ey, ez] = entry.vec;
    return [
      -sl * ex + cl * ey,
      c * cl * ex + c * sl * ey + s * ez,
      s * cl * ex + s * sl * ey - c * ez,
    ];
  }

  /**
   * Find the objects closest to a pointing direction.
   */
  identify(alt: number, az: number, opts: IdentifyOptions = {}): IdentificationResult {
    const tolerance = opts.tolerance ?? DEFAULT_TOLERANCE;
    const limit = opts.limit ?? 5;
    const includeDso = opts.includeDso ?? false;
    const namedOnly = opts.namedOnly ?? false;

    const dir = this.pointingVector(alt, az);

    const pool: CatalogueEntry[] = [
      ...this.solarSystem,
      ...this.satellites,
      ...(namedOnly ? this.namedStars : this.stars),
      ...(includeDso ? this.dso : []),
    ];

    const scored: CatalogueEntry[] = [];
    for (const entry of pool) {
      const dot = dir[0] * entry.vec[0] + dir[1] * entry.vec[1] + dir[2] * entry.vec[2];
      const sep = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
      if (sep > tolerance) continue;
      const { alt: a, az: z } = this.altAz(entry);
      if (opts.aboveHorizonOnly && a < 0) continue;
      scored.push({ ...entry, separation: sep, alt: a, az: z });
    }

    scored.sort((a, b) => (a.separation ?? 0) - (b.separation ?? 0));

    return {
      best: scored[0] ?? null,
      candidates: scored.slice(0, limit),
      ambiguous: scored.length > 1,
    };
  }

  /** Objects currently above the horizon, brightest first. */
  visible(opts: { includeDso?: boolean; limit?: number } = {}): CatalogueEntry[] {
    const pool = [
      ...this.solarSystem,
      ...this.satellites,
      ...this.namedStars,
      ...(opts.includeDso ? this.dso : []),
    ];
    return pool
      .map((e) => ({ ...e, ...this.altAz(e) }))
      .filter((e) => (e.alt ?? 0) > 0)
      .sort((a, b) => (a.mag ?? 99) - (b.mag ?? 99))
      .slice(0, opts.limit ?? 40);
  }

  /** Human readable direction of an azimuth. */
  static compass(az: number): string {
    return compassPoint(norm360(az));
  }
}

/**
 * Separation between two catalogue entries, in degrees.
 */
export function separation(a: CatalogueEntry, b: CatalogueEntry): number {
  return angularSeparation(a.ra, a.dec, b.ra, b.dec);
}
