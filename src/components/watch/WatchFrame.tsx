"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Outer case dimensions in design pixels. */
export const CASE_W = 244;
export const CASE_H = 292;
/** The screen itself. */
export const SCREEN_W = 208;
export const SCREEN_H = 248;

interface WatchFrameProps {
  children: ReactNode;
  /** Crown rotation, 0..1 — used to signal a scroll. */
  crown?: number;
  className?: string;
}

/**
 * The physical watch: titanium case, screen, digital crown and side button.
 *
 * The internals are laid out at a fixed design size and scaled to fit, so
 * every screen keeps its proportions on any display.
 */
export function WatchFrame({
  children,
  crown = 0,
  className = "",
}: WatchFrameProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const measure = () => {
      const w = outer.clientWidth;
      if (!w) return;
      setScale(w / CASE_W);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className={`relative w-full ${className}`}
      style={{ aspectRatio: `${CASE_W} / ${CASE_H}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CASE_W, height: CASE_H, transform: `scale(${scale})` }}
      >
        {/* ------------------------------------------------------- the band */}
        <div className="absolute -top-10 left-1/2 h-12 w-[128px] -translate-x-1/2 rounded-t-2xl bg-[#17181c] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
        <div className="absolute -bottom-10 left-1/2 h-12 w-[128px] -translate-x-1/2 rounded-b-2xl bg-[#17181c] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]" />

        {/* -------------------------------------------------------- the case */}
        <div
          className="absolute inset-0 rounded-[54px] bg-[linear-gradient(150deg,#3a3d44_0%,#1b1d21_28%,#0e0f12_62%,#26282d_100%)] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-1px_1px_rgba(0,0,0,0.8)]"
        />
        <div className="absolute inset-[3px] rounded-[51px] border border-white/8" />

        {/* ---------------------------------------------------- digital crown */}
        <div className="absolute top-[74px] -right-[9px] h-[26px] w-[11px] rounded-r-[5px] bg-[linear-gradient(90deg,#33363c,#4a4e55_40%,#24262b)] shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          <div
            className="absolute inset-y-1 left-[3px] w-[6px] rounded-sm bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.45)_0_1px,transparent_1px_3px)]"
            style={{
              transform: `rotate(${crown * 40}deg)`,
              transformOrigin: "50% 50%",
            }}
          />
        </div>

        {/* ------------------------------------------------------- side button */}
        <div className="absolute top-[128px] -right-[5px] h-[38px] w-[6px] rounded-r-[3px] bg-[linear-gradient(90deg,#2b2e33,#3c4046)]" />

        {/* --------------------------------------------------------- the screen */}
        <div
          className="absolute overflow-hidden rounded-[44px] bg-[#090C0A]"
          style={{
            left: (CASE_W - SCREEN_W) / 2,
            top: (CASE_H - SCREEN_H) / 2,
            width: SCREEN_W,
            height: SCREEN_H,
          }}
        >
          {children}
        </div>

        {/* screen glare */}
        <div
          className="pointer-events-none absolute rounded-[44px]"
          style={{
            left: (CASE_W - SCREEN_W) / 2,
            top: (CASE_H - SCREEN_H) / 2,
            width: SCREEN_W,
            height: SCREEN_H,
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 26%, transparent 44%)",
          }}
        />
      </div>
    </div>
  );
}
