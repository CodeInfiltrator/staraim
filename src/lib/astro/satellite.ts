/**
 * Satellite orbit propagation.
 *
 * This implements a Kozai/Brouwer mean-element propagator with secular J2
 * drift and first-order drag taken from the TLE's own mean-motion
 * derivatives. It is accurate to a few degrees for low Earth orbit over
 * several days — more than enough for a moving dot on a star map, and a
 * fraction of the size of a full SGP4 implementation.
 */

import { DEG, RAD, norm360 } from "./coords";

export interface Tle {
  name: string;
  /** Two line element set, as fetched from Celestrak. */
  line1: string;
  line2: string;
  /** Parsed elements. */
  inclination: number;
  raan: number;
  eccentricity: number;
  argOfPerigee: number;
  meanAnomaly: number;
  /** Revolutions per day. */
  meanMotion: number;
  /** Mean motion first derivative, rev/day². */
  meanMotionDot: number;
  /** B* drag term. */
  bstar: number;
  /** Epoch as a JS Date. */
  epoch: Date;
}

const EARTH_RADIUS_KM = 6378.137;
const J2 = 0.00108262668;
const MU = 398600.4418;

function parseEpoch(field: string): Date {
  // TLE epoch: yy ddd.dddddddd — day 1 is 1 January, so subtract one day.
  const yy = Number(field.slice(0, 2));
  const year = yy < 57 ? 2000 + yy : 1900 + yy;
  const day = Number(field.slice(2, 5));
  const fraction = Number(field.slice(5, 13));
  const ms = (day - 1 + fraction) * 86_400_000;
  return new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0) + ms);
}

function parseFloatField(s: string): number {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : 0;
}

/**
 * TLE drag terms use the packed form `±ddddd±e` where the implied
 * decimal point and exponent follow the sign character, e.g. "18188-3"
 * means 0.18188e-3.
 */
function parseBstar(raw: string): number {
  if (!raw) return 0;
  const m = raw.match(/^([+-]?)(\d+)([+-]\d+)?$/);
  if (!m) return parseFloatField(raw);
  const sign = m[1] === "-" ? -1 : 1;
  const mantissa = parseFloat(`0.${m[2]}`);
  const exponent = m[3] ? parseInt(m[3], 10) : 0;
  return sign * mantissa * Math.pow(10, exponent);
}

/** Parse a two line element set. */
export function parseTle(name: string, line1: string, line2: string): Tle | null {
  if (!line1.startsWith("1 ") || !line2.startsWith("2 ")) return null;

  const epoch = parseEpoch(line1.slice(18, 32));
  const meanMotionDot = parseFloatField(line1.slice(33, 43));
  const bstar = parseBstar(line1.slice(53, 61).trim());

  const inclination = parseFloatField(line2.slice(8, 16));
  const raan = parseFloatField(line2.slice(17, 25));
  const eccentricity = parseFloat(`0.${line2.slice(26, 33).trim()}`);
  const argOfPerigee = parseFloatField(line2.slice(34, 42));
  const meanAnomaly = parseFloatField(line2.slice(43, 51));
  const meanMotion = parseFloatField(line2.slice(52, 63));

  return {
    name: name.trim(),
    line1,
    line2,
    inclination,
    raan,
    eccentricity,
    argOfPerigee,
    meanAnomaly,
    meanMotion,
    meanMotionDot,
    bstar,
    epoch,
  };
}

function solveKepler(meanAnomaly: number, e: number): number {
  // Newton–Raphson on E - e sin E = M.
  let E = e < 0.8 ? meanAnomaly : Math.PI;
  for (let i = 0; i < 12; i++) {
    const f = E - e * Math.sin(E) - meanAnomaly;
    const fp = 1 - e * Math.cos(E);
    const d = f / fp;
    E -= d;
    if (Math.abs(d) < 1e-10) break;
  }
  return E;
}

/** Position in the Earth-fixed (ITRF-ish) frame, in kilometres. */
export function propagateEcef(tle: Tle, date: Date): [number, number, number] {
  const dt = (date.getTime() - tle.epoch.getTime()) / 86_400_000; // days

  const nRadPerDay = tle.meanMotion * 2 * Math.PI;
  const nDot = tle.meanMotionDot * 2 * Math.PI; // rad/day²

  // Semi-major axis needs the mean motion per second, not per day.
  const nRadPerSec = nRadPerDay / 86_400;
  const a = Math.cbrt(MU / (nRadPerSec * nRadPerSec)); // km

  // Secular J2 drift of the classical elements (rates in rad/day).
  // Everything below is in radians; the TLE stores degrees.
  const p = a * (1 - tle.eccentricity * tle.eccentricity);
  const factor = 1.5 * J2 * (EARTH_RADIUS_KM / p) ** 2 * nRadPerDay;
  const ci = Math.cos(tle.inclination * DEG);
  const ci2 = ci * ci;

  const raan = tle.raan * DEG - factor * ci * dt;
  const argPerigee =
    tle.argOfPerigee * DEG + 0.5 * factor * (5 * ci2 - 1) * dt;
  const meanAnomaly =
    tle.meanAnomaly * DEG +
    (nRadPerDay * dt + 0.5 * nDot * dt * dt) +
    0.5 * factor * Math.sqrt(1 - tle.eccentricity ** 2) * (3 * ci2 - 1) * dt;

  const E = solveKepler(meanAnomaly, tle.eccentricity);
  const e = tle.eccentricity;
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);

  // Perifocal coordinates.
  const xv = a * (cosE - e);
  const yv = a * Math.sqrt(1 - e * e) * sinE;

  const w = argPerigee;
  const i = tle.inclination * DEG;
  const o = raan;

  const cw = Math.cos(w);
  const sw = Math.sin(w);
  const ci2v = Math.cos(i);
  const si = Math.sin(i);
  const co = Math.cos(o);
  const so = Math.sin(o);

  // Equatorial-of-date (TEME) position.
  const x = xv * (co * cw - so * sw * ci2v) - yv * (co * sw + so * cw * ci2v);
  const y = xv * (so * cw + co * sw * ci2v) - yv * (so * sw - co * cw * ci2v);
  const z = xv * (sw * si) + yv * (cw * si);

  // Rotate by Greenwich mean sidereal time into the Earth-fixed frame.
  const gmstDeg = gmstFromJulian(date.getTime() / 86_400_000 + 2_440_587.5);
  const theta = gmstDeg * DEG;
  const ct = Math.cos(theta);
  const st = Math.sin(theta);

  return [x * ct + y * st, -x * st + y * ct, z];
}

function gmstFromJulian(jd: number): number {
  const d = jd - 2_451_545.0;
  const t = d / 36_525;
  return norm360(
    280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - (t * t * t) / 38_710_000,
  );
}

export interface SatellitePosition {
  ra: number;
  dec: number;
  alt: number;
  az: number;
  /** Distance from the observer in kilometres. */
  range: number;
  /** Apparent magnitude, roughly estimated for a sunlit body. */
  mag: number;
}

/** Topocentric position of a satellite for an observer. */
export function satellitePosition(
  tle: Tle,
  date: Date,
  latDeg: number,
  lonDeg: number,
): SatellitePosition {
  const [sx, sy, sz] = propagateEcef(tle, date);

  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  const rx = EARTH_RADIUS_KM * Math.cos(lat) * Math.cos(lon);
  const ry = EARTH_RADIUS_KM * Math.cos(lat) * Math.sin(lon);
  const rz = EARTH_RADIUS_KM * Math.sin(lat);

  const dx = sx - rx;
  const dy = sy - ry;
  const dz = sz - rz;
  const range = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // South-East-Zenith components of the range vector.
  const s = Math.sin(lat) * Math.cos(lon) * dx + Math.sin(lat) * Math.sin(lon) * dy - Math.cos(lat) * dz;
  const eComp = -Math.sin(lon) * dx + Math.cos(lon) * dy;
  const zComp =
    Math.cos(lat) * Math.cos(lon) * dx +
    Math.cos(lat) * Math.sin(lon) * dy +
    Math.sin(lat) * dz;

  const alt = Math.asin(Math.max(-1, Math.min(1, zComp / range))) * RAD;
  // Azimuth measured from north, increasing eastwards.
  const az = norm360(Math.atan2(eComp, -s) * RAD);

  // Geocentric equatorial coordinates: undo the Earth rotation.
  const gmstDeg = gmstFromJulian(date.getTime() / 86_400_000 + 2_440_587.5);
  const theta = gmstDeg * DEG;
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const ex = sx * ct - sy * st;
  const ey = sx * st + sy * ct;
  const geoRadius = Math.hypot(sx, sy, sz);

  const ra = norm360(Math.atan2(ey, ex) * RAD);
  const dec = Math.asin(Math.max(-1, Math.min(1, sz / geoRadius))) * RAD;

  return { ra, dec, alt, az, range, mag: magnitudeFromRange(range) };
}

/**
 * Crude apparent magnitude for a sunlit satellite.
 * Rough fit of the typical ISS brightness range from a dark site.
 */
function magnitudeFromRange(rangeKm: number): number {
  const m = 5.9 - 5 * Math.log10(Math.max(rangeKm, 100) / 1000);
  return Math.max(-1, Math.min(6, m));
}
