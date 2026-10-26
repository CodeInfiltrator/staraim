"use client";

import { WatchReticle, WatchScreen, WatchButton } from "../ui";
import { Moon } from "../celestial/Moon";

/* ------------------------------------------------------------------ home */

export function HomeScreen({
  onCalibrate,
  onPoint,
  calibrated,
}: {
  onCalibrate: () => void;
  onPoint: () => void;
  calibrated: boolean;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-4 pb-5">
        <span className="font-mono text-[10px] tracking-[0.22em] text-mint uppercase">
          Staraim
        </span>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <WatchReticle size={104} opacity={0.95} />
            <div className="absolute">
              <Moon size={44} phase={0.72} />
            </div>
          </div>

          <h2 className="mt-6 text-center text-[19px] leading-tight font-medium tracking-[-0.01em] text-mist">
            Point at the Moon
          </h2>
          <p className="mt-2 max-w-[150px] text-center text-[12px] leading-snug text-fog">
            Hold it in the reticle to calibrate the watch.
          </p>
        </div>

        {calibrated ? (
          <div className="flex items-center gap-2 pb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            <span className="font-mono text-[10px] tracking-[0.14em] text-mint uppercase">
              Calibrated · ready to identify
            </span>
          </div>
        ) : null}

        <WatchButton onClick={calibrated ? onPoint : onCalibrate}>
          {calibrated ? "Point at the sky" : "Calibrate"}
        </WatchButton>
      </div>
    </WatchScreen>
  );
}

/* ----------------------------------------------------------- calibration */

export function CalibrationScreen({ onStart }: { onStart: () => void }) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-4 pb-5">
        <h2 className="text-center text-[17px] leading-tight font-medium text-mist">
          Point at the Moon
        </h2>
        <p className="mt-1.5 text-center text-[12px] text-fog">
          Centre it in the reticle
        </p>

        <button
          onClick={onStart}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-5"
        >
          <div className="relative flex items-center justify-center">
            <WatchReticle size={118} opacity={0.95} />
            <div className="absolute">
              <Moon size={52} phase={0.72} />
            </div>
          </div>

          <span className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
            Hold steady · tap to start
          </span>
        </button>

        <p className="text-center font-mono text-[10px] leading-relaxed tracking-[0.12em] text-dim uppercase">
          The watch learns the offset between
          <br />
          your wrist and the sky
        </p>
      </div>
    </WatchScreen>
  );
}

/* ------------------------------------------------------ timer calibration */

export function TimerCalibrationScreen({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) {
  const progress = total === 0 ? 0 : 1 - remaining / total;

  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-6 pb-6">
        <h2 className="text-center text-[17px] leading-tight font-medium text-mist">
          Aligning…
        </h2>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex items-center justify-center">
            <ProgressRingOuter progress={progress}>
              <Moon size={40} phase={0.72} />
            </ProgressRingOuter>
          </div>
        </div>

        <p className="text-center font-mono text-[13px] tracking-[0.12em] text-mint tabular-nums">
          {remaining.toFixed(1)} seconds left
        </p>
        <p className="mt-2 text-center text-[11px] text-dim">
          Keep the Moon inside the reticle
        </p>
      </div>
    </WatchScreen>
  );
}

function ProgressRingOuter({
  progress,
  children,
}: {
  progress: number;
  children: React.ReactNode;
}) {
  const size = 124;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#D0342C"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, progress)))}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- calibration done */

export function CalibrationDoneScreen({
  onFinish,
  onAgain,
}: {
  onFinish: () => void;
  onAgain: () => void;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-8 pb-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <CheckCircle />
          <h2 className="mt-6 text-center text-[18px] leading-tight font-medium text-mist">
            Calibration done
          </h2>
          <p className="mt-2 max-w-[160px] text-center text-[12px] leading-snug text-fog">
            Your watch now knows where it is pointing.
          </p>
        </div>

        <div className="space-y-2.5">
          <WatchButton onClick={onFinish}>Finish</WatchButton>
          <WatchButton onClick={onAgain} tone="outline">
            Calibrate again
          </WatchButton>
        </div>
      </div>
    </WatchScreen>
  );
}

function CheckCircle() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle
        cx="32"
        cy="32"
        r="29"
        stroke="#D0342C"
        strokeWidth="2.4"
        strokeOpacity="0.85"
      />
      <path
        d="M21 33.5 28.5 41 43.5 24"
        stroke="#D0342C"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
