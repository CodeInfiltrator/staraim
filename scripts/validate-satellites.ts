/**
 * Validates the built-in satellite propagator against the reference
 * `satellite.js` (SGP4) implementation.
 *
 *   node --experimental-strip-types scripts/validate-satellites.ts
 */
import { parseTle, satellitePosition } from "../src/lib/astro/satellite";
import { SATELLITES } from "../src/lib/astro/data/satellites";
import * as ref from "satellite.js";

const LOC = { lat: -6.2088, lon: 106.8456 }; // Jakarta
const TIMES = [
  new Date("2026-10-22T00:00:00Z"),
  new Date("2026-10-22T06:30:00Z"),
  new Date("2026-10-23T18:45:00Z"),
];

let worst = 0;
for (const sat of SATELLITES) {
  const tle = parseTle(sat.name, sat.line1, sat.line2);
  if (!tle) {
    console.log(`SKIP ${sat.name}: unparseable`);
    continue;
  }
  for (const when of TIMES) {
    const mine = satellitePosition(tle, when, LOC.lat, LOC.lon);

    const rec = ref.twoline2satrec(sat.line1, sat.line2);
    const pv = ref.propagate(rec, when);
    if (!pv) {
      console.log(`SKIP ${sat.name}: reference propagation failed`);
      continue;
    }
    const observer = {
      latitude: LOC.lat * (Math.PI / 180),
      longitude: LOC.lon * (Math.PI / 180),
      height: 0,
    };
    // satellite.js v6 takes the geodetic observer and a pre-rotated ECF vector.
    const gmst = ref.gstime(when);
    const ecf = ref.eciToEcf(pv.position, gmst);
    const look = ref.ecfToLookAngles(observer, ecf);
    const lookAz = ((look.azimuth * 180) / Math.PI + 360) % 360;

    let dAz = Math.abs(lookAz - mine.az);
    if (dAz > 180) dAz = 360 - dAz;
    const dAlt = Math.abs((look.elevation * 180) / Math.PI - mine.alt);
    const sep = Math.hypot(dAz * Math.cos((look.elevation * Math.PI) / 180), dAlt);

    worst = Math.max(worst, sep);
    console.log(
      `${sat.name.padEnd(16)} ${when.toISOString().slice(0, 16)}  ` +
        `dAlt ${dAlt.toFixed(3).padStart(7)}°  dAz ${dAz.toFixed(3).padStart(7)}°  ` +
        `sep ${sep.toFixed(3).padStart(7)}°  range ${(mine.range / 1000).toFixed(0)}/${look.rangeSat.toFixed(0)} km`,
    );
  }
}

console.log(`\nworst angular separation from SGP4 reference: ${worst.toFixed(3)}°`);
