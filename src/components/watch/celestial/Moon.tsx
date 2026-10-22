import type { SVGProps } from "react";

/**
 * A procedurally drawn Moon.
 *
 * The disc is lit from the upper left; craters are scattered deterministically
 * so the same face always renders the same way.
 */
export function Moon({
  phase = 0.72,
  size = 96,
  ...rest
}: { phase?: number; size?: number } & SVGProps<SVGSVGElement>) {
  const craters = [
    { x: 34, y: 30, r: 8.5 },
    { x: 52, y: 24, r: 5 },
    { x: 62, y: 42, r: 6.5 },
    { x: 40, y: 48, r: 4.2 },
    { x: 25, y: 52, r: 5.6 },
    { x: 55, y: 60, r: 3.6 },
    { x: 33, y: 68, r: 4.8 },
    { x: 46, y: 72, r: 2.8 },
    { x: 70, y: 56, r: 3.2 },
    { x: 20, y: 38, r: 3 },
  ];

  // Terminator: an ellipse that carves the shadowed limb.
  const k = 2 * phase - 1;
  const rx = Math.abs(k) * 100;
  const shadowX = 50 - k * 50;

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
        <radialGradient id="moon-lit" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f4f4ef" />
          <stop offset="55%" stopColor="#d3d3cc" />
          <stop offset="100%" stopColor="#8e8e88" />
        </radialGradient>
        <radialGradient id="moon-dark" cx="55%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#14161b" />
          <stop offset="100%" stopColor="#05060a" />
        </radialGradient>
        <clipPath id="moon-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>

      {/* Dark side */}
      <circle cx="50" cy="50" r="48" fill="url(#moon-dark)" />

      {/* Lit limb */}
      <g clipPath="url(#moon-clip)">
        <path
          d={`M50 2 a48 48 0 0 1 0 96 a${rx} ${48} 0 0 ${
            k >= 0 ? 0 : 1
          } 0 -96 z`}
          fill="url(#moon-lit)"
        />
        {craters.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={c.r}
            fill="#b7b7b0"
            opacity={0.5}
          />
        ))}
        {craters.map((c, i) => (
          <circle
            key={`s-${i}`}
            cx={c.x - c.r * 0.18}
            cy={c.y - c.r * 0.22}
            r={c.r * 0.82}
            fill="#e8e8e2"
            opacity={0.35}
          />
        ))}
        {/* Maria */}
        <ellipse cx="62" cy="58" rx="13" ry="10" fill="#9c9c96" opacity="0.45" />
        <ellipse cx="30" cy="60" rx="8" ry="11" fill="#9c9c96" opacity="0.4" />
      </g>

      {/* Terminator shadow */}
      {phase < 0.98 ? (
        <ellipse
          cx={shadowX}
          cy="50"
          rx={Math.max(0.5, rx)}
          ry="48"
          fill="#05060a"
          opacity="0.55"
          clipPath="url(#moon-clip)"
        />
      ) : null}

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
