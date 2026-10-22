"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ObserverLocation } from "./astro/types";

/**
 * The Prime Meridian at the Royal Observatory — a sensible default for a
 * demo, and the reference point the ephemeris is written against.
 */
export const DEFAULT_LOCATION: ObserverLocation = {
  lat: 51.4779,
  lon: -0.0015,
  height: 47,
};

export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface ObserverLocationState {
  location: ObserverLocation;
  status: LocationStatus;
  /** True when the location came from the browser rather than the default. */
  located: boolean;
  /** Ask the browser for a position. */
  request: () => void;
  /** Return to the default location. */
  reset: () => void;
  /** Human readable place name, when the browser gave us one. */
  label: string;
}

/** Rough label for a coordinate, used when reverse geocoding is unavailable. */
export function describeLocation(loc: ObserverLocation): string {
  const ns = loc.lat >= 0 ? "N" : "S";
  const ew = loc.lon >= 0 ? "E" : "W";
  return `${Math.abs(loc.lat).toFixed(2)}°${ns} ${Math.abs(loc.lon).toFixed(2)}°${ew}`;
}

/**
 * Wraps the browser geolocation API and falls back to a fixed observatory.
 */
export function useObserverLocation(
  fallback: ObserverLocation = DEFAULT_LOCATION,
): ObserverLocationState {
  const [location, setLocation] = useState<ObserverLocation>(fallback);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [located, setLocated] = useState(false);
  const [label, setLabel] = useState(() => describeLocation(fallback));
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted.current) return;
        const next: ObserverLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          height: pos.coords.altitude ?? 0,
        };
        setLocation(next);
        setLabel(describeLocation(next));
        setLocated(true);
        setStatus("granted");
      },
      () => {
        if (!mounted.current) return;
        setStatus("denied");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
    );
  }, []);

  const reset = useCallback(() => {
    setLocation(fallback);
    setLabel(describeLocation(fallback));
    setLocated(false);
    setStatus("idle");
  }, [fallback]);

  return useMemo(
    () => ({ location, status, located, request, reset, label }),
    [location, status, located, request, reset, label],
  );
}
