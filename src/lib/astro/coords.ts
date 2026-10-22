/**
 * Spherical astronomy helpers shared by the sky map and the watch simulator.
 *
 * Frame conventions
 * -----------------
 * Equatorial : right ascension (degrees, eastwards from the vernal equinox)
 *              and declination (degrees).
 * Horizontal : altitude (degrees above the horizon) and azimuth (degrees
 *              measured from true north, increasing eastwards).
 * Alt-az unit vectors use the three.js basis:
 *              +x = east, +y = up, +z = south (so north is -z).
 */

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;

export const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

export const toRad = (d: number) => d * DEG;
export const toDeg = (r: number) => r * RAD;

/** Normalise an angle to [0, 360). */
export const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Smallest signed difference between two angles, in [-180, 180). */
export function angleDelta(a: number, b: number): number {
  let d = norm360(a - b);
  if (d >= 180) d -= 360;
  return d;
}

/** Julian day from a JS Date (UTC based). */
export function julianDay(date: Date): number {
  return date.getTime() / 86_400_000 + 2_440_587.5;
}

/**
 * Greenwich mean sidereal time in degrees.
 * IAU 1982 series, accurate to a fraction of an arcsecond.
 */
export function gmst(date: Date): number {
  const jd = julianDay(date);
  const d = jd - 2_451_545.0;
  const t = d / 36_525;
  let g =
    280.46061837 +
    360.98564736629 * d +
    0.000387933 * t * t -
    (t * t * t) / 38_710_000;
  return norm360(g);
}

/** Local apparent sidereal time in degrees for an observer longitude. */
export function localSiderealTime(date: Date, lonDeg: number): number {
  return norm360(gmst(date) + lonDeg);
}

export interface Horizontal {
  alt: number;
  az: number;
}

/**
 * Equatorial -> horizontal for a given local sidereal time.
 */
export function equatorialToHorizontal(
  raDeg: number,
  decDeg: number,
  latDeg: number,
  lstDeg: number,
): Horizontal {
  const h = toRad(lstDeg - raDeg);
  const dec = toRad(decDeg);
  const lat = toRad(latDeg);
  const sinAlt =
    Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(h);
  const alt = Math.asin(clamp(sinAlt, -1, 1));
  const az = Math.atan2(
    -Math.cos(dec) * Math.sin(h),
    Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(h),
  );
  return { alt: toDeg(alt), az: norm360(toDeg(az)) };
}

/**
 * Horizontal -> equatorial. Inverse of {@link equatorialToHorizontal}.
 */
export function horizontalToEquatorial(
  altDeg: number,
  azDeg: number,
  latDeg: number,
  lstDeg: number,
): { ra: number; dec: number } {
  const alt = toRad(altDeg);
  const az = toRad(azDeg);
  const lat = toRad(latDeg);
  const sinDec =
    Math.sin(alt) * Math.sin(lat) + Math.cos(alt) * Math.cos(lat) * Math.cos(az);
  const dec = Math.asin(clamp(sinDec, -1, 1));
  // Hour angle from the two components of cos(dec) * {sin,cos}(H).
  const cosDec = Math.cos(dec);
  const sinH = -Math.cos(alt) * Math.sin(az);
  const cosH =
    cosDec === 0
      ? 0
      : (Math.sin(alt) * Math.cos(lat) - sinDec * Math.sin(lat)) / cosDec;
  const h = Math.atan2(sinH, cosH);
  return { ra: norm360(lstDeg - toDeg(h)), dec: toDeg(dec) };
}

/**
 * Unit vector for an equatorial position in the alt-az (three.js) basis.
 * +x east, +y up, +z south.
 */
export function equatorialToVector(
  raDeg: number,
  decDeg: number,
  latDeg: number,
  lstDeg: number,
): [number, number, number] {
  const h = toRad(lstDeg - raDeg);
  const dec = toRad(decDeg);
  const lat = toRad(latDeg);
  const cosDec = Math.cos(dec);
  const north =
    Math.sin(dec) * Math.cos(lat) - cosDec * Math.sin(lat) * Math.cos(h);
  const east = -cosDec * Math.sin(h);
  const up =
    Math.sin(dec) * Math.sin(lat) + cosDec * Math.cos(lat) * Math.cos(h);
  return [east, up, -north];
}

/** Unit vector for a horizontal position in the alt-az (three.js) basis. */
export function horizontalToVector(
  altDeg: number,
  azDeg: number,
): [number, number, number] {
  const alt = toRad(altDeg);
  const az = toRad(azDeg);
  const c = Math.cos(alt);
  return [c * Math.sin(az), Math.sin(alt), -c * Math.cos(az)];
}

/** Convert an alt-az unit vector back to horizontal angles. */
export function vectorToHorizontal(v: [number, number, number]): Horizontal {
  const [x, y, z] = v;
  const alt = toDeg(Math.asin(clamp(y, -1, 1)));
  const az = norm360(toDeg(Math.atan2(x, -z)));
  return { alt, az };
}

/** Angular separation between two equatorial positions, in degrees. */
export function angularSeparation(
  ra1: number,
  dec1: number,
  ra2: number,
  dec2: number,
): number {
  const a1 = toRad(ra1);
  const d1 = toRad(dec1);
  const a2 = toRad(ra2);
  const d2 = toRad(dec2);
  const cos =
    Math.sin(d1) * Math.sin(d2) +
    Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2);
  return toDeg(Math.acos(clamp(cos, -1, 1)));
}

/**
 * Angle between two horizontal directions, in degrees.
 * Uses the dot product of their unit vectors — stable near the poles.
 */
export function horizontalSeparation(
  a: { alt: number; az: number },
  b: { alt: number; az: number },
): number {
  const va = horizontalToVector(a.alt, a.az);
  const vb = horizontalToVector(b.alt, b.az);
  const dot = clamp(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2], -1, 1);
  return toDeg(Math.acos(dot));
}

/** Compass label for an azimuth. */
export function compassPoint(az: number): string {
  const points = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  return points[Math.round(norm360(az) / 22.5) % 16];
}
