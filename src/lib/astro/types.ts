/** Shared types for the Staraim sky model. */

export type ObjectKind =
  | "star"
  | "planet"
  | "moon"
  | "sun"
  | "dso"
  | "constellation"
  | "satellite";

export type ObjectCategory =
  | "Planet"
  | "Moon"
  | "Sun"
  | "Star"
  | "Star cluster"
  | "Nebula"
  | "Galaxy"
  | "Constellation"
  | "Satellite";

export interface ObserverLocation {
  /** Degrees north of the equator. */
  lat: number;
  /** Degrees east of Greenwich. */
  lon: number;
  /** Metres above sea level. */
  height?: number;
}

/** A single identifiable thing in the sky. */
export interface SkyObject {
  id: string;
  name: string;
  kind: ObjectKind;
  category: ObjectCategory;
  /** Right ascension, degrees. */
  ra: number;
  /** Declination, degrees. */
  dec: number;
  /** Apparent visual magnitude. */
  mag: number;
  /** Angular separation from the pointing direction, degrees. */
  separation?: number;
  /** Altitude above the horizon, degrees. */
  alt?: number;
  /** Azimuth from north, degrees. */
  az?: number;
  /** Human readable constellation. */
  constellation?: string;
  /** One line summary shown in the object card. */
  blurb?: string;
  /** Longer description for the detail view. */
  description?: string;
  /** B-V colour index for stars. */
  bv?: number;
  /** Distance (light years / AU / km) depending on kind. */
  distance?: string;
  /** Additional structured facts. */
  facts?: Record<string, string>;
}

/** Result of pointing the device at the sky. */
export interface IdentificationResult {
  /** The best candidate, if any is inside the tolerance. */
  best: SkyObject | null;
  /** All candidates inside the tolerance, closest first. */
  candidates: SkyObject[];
  /** True when two or more candidates are close enough to be ambiguous. */
  ambiguous: boolean;
}
