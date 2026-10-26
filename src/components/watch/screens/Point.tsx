"use client";

import { useEffect, useRef, useState } from "react";
import { Cube3D, WatchReticle, WatchScreen, WatchButton } from "../ui";
import { Orion } from "../celestial/Orion";

/* ---------------------------------------------------------- press to point */

export function PressToPointScreen({ onPoint }: { onPoint: () => void }) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-6 pb-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <ArmGlyph />
          <h2 className="mt-6 text-center text-[18px] leading-tight font-medium text-mist">
            Press to point
          </h2>
          <p className="mt-2 max-w-[160px] text-center text-[12px] leading-snug text-fog">
            Move your arm naturally. The watch reads the motion, not the clock.
          </p>
        </div>

        <WatchButton onClick={onPoint}>Point</WatchButton>
      </div>
    </WatchScreen>
  );
}

function ArmGlyph() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden>
      <circle cx="48" cy="48" r="44" stroke="#232833" strokeWidth="1" />
      {/* Dashed circle suggesting motion */}
      <circle
        cx="48"
        cy="48"
        r="33"
        stroke="#D0342C"
        strokeWidth="1.2"
        strokeDasharray="3 7"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Forearm and hand */}
      <path
        d="M48 74V44"
        stroke="#3A3A3A"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M48 74V44"
        stroke="#D0342C"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="48" cy="36" r="8" stroke="#D0342C" strokeWidth="2" />
      <path d="M48 22v6M33 31l4 4M63 31l-4 4" stroke="#D0342C" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------- explore sky */

export function ExploreSkyScreen({
  onOpen3D,
  onBack,
}: {
  onOpen3D: () => void;
  onBack: () => void;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-5">
        <h2 className="text-center text-[18px] leading-tight font-medium text-mist">
          Orion
        </h2>
        <p className="mt-1 text-center font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
          Crown to zoom
        </p>

        <div className="mt-4 flex flex-1 items-center justify-center">
          <div className="relative flex items-center justify-center">
            <WatchReticle size={126} opacity={0.5} />
            <Orion size={110} />
          </div>
        </div>

        <div className="space-y-2.5">
          <WatchButton onClick={onOpen3D}>View in 3D</WatchButton>
          <WatchButton onClick={onBack} tone="outline">
            Back
          </WatchButton>
        </div>
      </div>
    </WatchScreen>
  );
}

/* -------------------------------------------------------------------- 3D */

export function ThreeDScreen({ onBack }: { onBack: () => void }) {
  const [rotation, setRotation] = useState(0.6);
  const drag = useRef<{ x: number; rot: number } | null>(null);

  useEffect(() => {
    if (drag.current) return;
    let raf = 0;
    const spin = () => {
      setRotation((r) => r + 0.006);
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-5">
        <h2 className="text-center text-[17px] leading-tight font-medium text-mist">
          Jupiter
        </h2>
        <p className="mt-1 text-center font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
          Drag to rotate
        </p>

        <div
          className="mt-3 flex flex-1 cursor-grab items-center justify-center active:cursor-grabbing"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, rot: rotation };
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            setRotation(drag.current.rot + (e.clientX - drag.current.x) * 0.014);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          <Cube3D size={124} rotation={rotation} />
        </div>

        <WatchButton onClick={onBack} tone="outline">
          Done
        </WatchButton>
      </div>
    </WatchScreen>
  );
}
