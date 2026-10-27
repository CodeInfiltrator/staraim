"use client";

import type { ReactNode } from "react";

/* ------------------------------------------------------------- status bar */

/** The tiny watchOS status bar: time on the left, glyphs on the right. */
export function StatusBar({
  time = "10:09",
  battery = 0.72,
}: {
  time?: string;
  battery?: number;
}) {
  return (
    <div className="flex items-center justify-between px-[13px] pt-[13px]">
      <span className="text-[9px] font-medium tracking-[0.01em] text-[#F3F1E8] tabular-nums">
        {time}
      </span>
      <span className="flex items-center gap-[5px]">
        {/* Signal */}
        <svg width="11" height="9" viewBox="0 0 11 9" aria-hidden>
          <rect x="0" y="6" width="2" height="3" rx="0.5" fill="#D0342C" />
          <rect x="3" y="4" width="2" height="5" rx="0.5" fill="#D0342C" />
          <rect x="6" y="2" width="2" height="7" rx="0.5" fill="#D0342C" />
          <rect x="9" y="0" width="2" height="9" rx="0.5" fill="#D0342C" opacity="0.35" />
        </svg>
        {/* Battery */}
        <svg width="18" height="9" viewBox="0 0 18 9" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="14"
            height="8"
            rx="2.2"
            stroke="#D0342C"
            strokeOpacity="0.5"
          />
          <rect x="16" y="3" width="1.5" height="3" rx="0.75" fill="#D0342C" opacity="0.5" />
          <rect x="2" y="2" width={10 * battery} height="5" rx="1.2" fill="#D0342C" />
        </svg>
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- screen */

/** A watchOS screen: black canvas, status bar, and a content column. */
export function WatchScreen({
  children,
  time,
  className = "",
}: {
  children: ReactNode;
  time?: string;
  className?: string;
}) {
  return (
    <div className={`flex h-full w-full flex-col bg-[#000000] ${className}`}>
      <StatusBar time={time} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/* --------------------------------------------------------------- buttons */

/** Filled pill button — the primary action on a watch screen. */
export function WatchButton({
  children,
  onClick,
  tone = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "primary" | "outline" | "plain";
  className?: string;
}) {
  const tones = {
    primary: "bg-[#D0342C] text-white",
    outline: "border border-[#D0342C]/60 bg-[#1a0a0a] text-[#F3F1E8]",
    plain: "text-[#D0342C]",
  } as const;

  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer rounded-[21.5px] py-[12px] text-[12px] font-medium transition-opacity active:opacity-70 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- reticle */

/** The four-bracket reticle the watch uses to frame a target. */
export function WatchReticle({
  size = 92,
  color = "#D0342C",
  opacity = 1,
  className = "",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const s = size;
  const arm = s * 0.3;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <g stroke={color} strokeWidth="2.2" strokeLinecap="round">
        <path d={`M2 2 h${arm}`} />
        <path d={`M2 2 v${arm}`} />
        <path d={`M${s - 2} 2 h-${arm}`} />
        <path d={`M${s - 2} 2 v-${arm}`} />
        <path d={`M2 ${s - 2} h${arm}`} />
        <path d={`M2 ${s - 2} v-${arm}`} />
        <path d={`M${s - 2} ${s - 2} h-${arm}`} />
        <path d={`M${s - 2} ${s - 2} v-${arm}`} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ progress ring */

/** A circular progress ring used for the calibration and lock timers. */
export function ProgressRing({
  progress,
  size = 108,
  stroke = 5,
  color = "#D0342C",
  track = "rgba(255,255,255,0.12)",
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- 3d cube */

/** The wireframe cube used for the generic "object" screen. */
export function Cube3D({
  size = 108,
  rotation = 0,
  color = "#D0342C",
}: {
  size?: number;
  rotation?: number;
  color?: string;
}) {
  const r = size / 2;
  const h = r * 0.42;

  // Three axes projected at the given rotation about the vertical.
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const project = (x: number, y: number, z: number): [number, number] => [
    r + (x * cos - z * sin) * 1.0,
    r + (y - (x * sin + z * cos) * 0.42),
  ];

  const V = {
    a: project(-h, -h, -h),
    b: project(h, -h, -h),
    c: project(h, -h, h),
    d: project(-h, -h, h),
    e: project(-h, h, -h),
    f: project(h, h, -h),
    g: project(h, h, h),
    h2: project(-h, h, h),
  };

  const edges: [string, string][] = [
    ["a", "b"], ["b", "c"], ["c", "d"], ["d", "a"],
    ["e", "f"], ["f", "g"], ["g", "h2"], ["h2", "e"],
    ["a", "e"], ["b", "f"], ["c", "g"], ["d", "h2"],
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      {edges.map(([p, q], i) => (
        <line
          key={i}
          x1={V[p as keyof typeof V][0]}
          y1={V[p as keyof typeof V][1]}
          x2={V[q as keyof typeof V][0]}
          y2={V[q as keyof typeof V][1]}
          stroke={color}
          strokeWidth="1.3"
          strokeOpacity="0.9"
        />
      ))}
      {/* Axes */}
      <line
        x1={V.a[0]}
        y1={V.a[1]}
        x2={V.e[0]}
        y2={V.e[1]}
        stroke="#D0342C"
        strokeWidth="1.6"
      />
      <circle cx={V.e[0]} cy={V.e[1]} r="2.4" fill="#D0342C" />
    </svg>
  );
}
