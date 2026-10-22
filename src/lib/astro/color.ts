/**
 * Star colour rendering.
 *
 * A star's B-V colour index maps to an effective temperature via
 * Ballesteros' formula, which we then convert to RGB with a blackbody
 * approximation. The result is desaturated towards white because real
 * star fields read as far more neutral than a literal blackbody.
 */

import { clamp } from "./coords";

/** B-V -> effective temperature in kelvin. */
export function bvToTemperature(bv: number): number {
  const b = clamp(bv, -0.4, 2.2);
  return 4600 * (1 / (0.92 * b + 1.7) + 1 / (0.92 * b + 0.62));
}

/** Effective temperature -> linear-ish RGB triple in 0..1. */
export function temperatureToRgb(kelvin: number): [number, number, number] {
  const t = clamp(kelvin, 1000, 40000) / 100;

  let r: number;
  if (t <= 66) r = 255;
  else r = 329.698727446 * Math.pow(t - 60, -0.1332047592);

  let g: number;
  if (t <= 66) g = 99.4708025861 * Math.log(t) - 161.1195681661;
  else g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);

  let b: number;
  if (t >= 66) b = 255;
  else if (t <= 19) b = 0;
  else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;

  return [
    clamp(r, 0, 255) / 255,
    clamp(g, 0, 255) / 255,
    clamp(b, 0, 255) / 255,
  ];
}

/**
 * B-V -> display colour.
 * `desaturate` pulls the hue back towards white so a dense star field
 * still reads as starlight rather than a bag of coloured dots.
 */
export function bvToRgb(bv: number, desaturate = 0.45): [number, number, number] {
  const rgb = temperatureToRgb(bvToTemperature(bv));
  return rgb.map((c) => c + (1 - c) * desaturate) as [number, number, number];
}

/** Same, as a CSS `rgb()` string. */
export function bvToCss(bv: number, alpha = 1, desaturate = 0.45): string {
  const [r, g, b] = bvToRgb(bv, desaturate);
  const to255 = (c: number) => Math.round(clamp(c, 0, 1) * 255);
  return alpha >= 1
    ? `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`
    : `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${alpha})`;
}

/**
 * Apparent brightness weight for a star, derived from its magnitude.
 * Magnitude 0 is the brightest; each additional magnitude is ~2.512x fainter.
 */
export function magnitudeWeight(mag: number): number {
  return Math.pow(10, -0.4 * (mag - 1));
}
