import type { SVGProps } from "react";

/**
 * Orion, drawn from its brightest stars.
 *
 * Coordinates are in a 0..100 box; the belt sits across the middle.
 */
const STARS: { x: number; y: number; r: number; name?: string }[] = [
  { x: 26, y: 16, r: 2.4, name: "Betelgeuse" },
  { x: 70, y: 20, r: 2.1, name: "Bellatrix" },
  { x: 50, y: 42, r: 1.5, name: "Alnitak" },
  { x: 50, y: 50, r: 1.5, name: "Alnilam" },
  { x: 50, y: 58, r: 1.4, name: "Mintaka" },
  { x: 22, y: 64, r: 2.0, name: "Rigel" },
  { x: 34, y: 78, r: 1.6, name: "Saiph" },
  { x: 76, y: 76, r: 1.7 },
];

const LINES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [5, 7], [4, 6],
];

export function Orion({ size = 110, ...rest }: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      {...rest}
    >
      <g stroke="#6f7ea8" strokeWidth="0.9" strokeOpacity="0.75">
        {LINES.map(([a, b], i) => (
          <line
            key={i}
            x1={STARS[a].x}
            y1={STARS[a].y}
            x2={STARS[b].x}
            y2={STARS[b].y}
          />
        ))}
      </g>
      {STARS.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.r * 2.4} fill="#D0342C" opacity="0.12" />
          <circle cx={s.x} cy={s.y} r={s.r} fill="#eef0f6" />
        </g>
      ))}
    </svg>
  );
}
