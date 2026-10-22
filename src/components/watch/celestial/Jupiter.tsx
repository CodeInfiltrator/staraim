import type { SVGProps } from "react";

/**
 * A procedurally drawn Jupiter: banded atmosphere, the Great Red Spot and a
 * faint polar haze.
 */
export function Jupiter({
  size = 96,
  ...rest
}: { size?: number } & SVGProps<SVGSVGElement>) {
  const bands = [
    { y: 20, h: 6, c: "#c8a074", o: 0.85 },
    { y: 27, h: 5, c: "#e3cba6", o: 0.9 },
    { y: 33, h: 4, c: "#9a6f4e", o: 0.7 },
    { y: 38, h: 8, c: "#dcbb92", o: 0.95 },
    { y: 47, h: 4, c: "#8f6349", o: 0.65 },
    { y: 52, h: 9, c: "#e6cfa9", o: 0.95 },
    { y: 62, h: 4, c: "#a2764f", o: 0.7 },
    { y: 67, h: 6, c: "#d9bb92", o: 0.9 },
    { y: 74, h: 4, c: "#8d6449", o: 0.6 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      {...rest}
    >
      <defs>
        <clipPath id="jup-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <radialGradient id="jup-shade" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      <g clipPath="url(#jup-clip)">
        <rect x="0" y="0" width="100" height="100" fill="#c9a679" />
        {bands.map((b, i) => (
          <rect
            key={i}
            x="0"
            y={b.y}
            width="100"
            height={b.h}
            fill={b.c}
            opacity={b.o}
          />
        ))}

        {/* Great Red Spot */}
        <ellipse cx="63" cy="58" rx="12" ry="7" fill="#b45c3c" opacity="0.9" />
        <ellipse cx="63" cy="57" rx="8.5" ry="4.6" fill="#c97a52" opacity="0.95" />

        {/* Wisps */}
        <path
          d="M6 43c14 3 30 3 44 1s26-3 44-1"
          stroke="#f0d9b4"
          strokeWidth="1.4"
          opacity="0.35"
          fill="none"
        />
        <path
          d="M4 66c18 4 34 4 50 1s30-4 42-2"
          stroke="#8d6449"
          strokeWidth="1.2"
          opacity="0.3"
          fill="none"
        />

        <circle cx="50" cy="50" r="48" fill="url(#jup-shade)" />
      </g>

      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="#ffffff"
        strokeOpacity="0.14"
        strokeWidth="1"
      />
    </svg>
  );
}
