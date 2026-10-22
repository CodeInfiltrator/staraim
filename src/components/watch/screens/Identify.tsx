"use client";

import { Cube3D, ProgressRing, WatchReticle, WatchScreen, WatchButton } from "../ui";
import { Jupiter } from "../celestial/Jupiter";

/* ---------------------------------------------------------- choose object */

const CANDIDATES = [
  { name: "Jupiter", detail: "Gas giant · Taurus", selected: true },
  { name: "Saturn", detail: "Ringed planet · Aquarius", selected: false },
];

export function ChooseObjectScreen({
  onConfirm,
  selected,
  onSelect,
}: {
  onConfirm: () => void;
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-5">
        <h2 className="text-center text-[16px] leading-tight font-medium text-mist">
          Two nearby objects
        </h2>
        <p className="mt-1.5 text-center text-[12px] text-fog">
          Tap to choose, then confirm
        </p>

        <div className="mt-5 space-y-2">
          {CANDIDATES.map((c, i) => {
            const active = i === selected;
            return (
              <button
                key={c.name}
                onClick={() => onSelect(i)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                  active
                    ? "border-sage/50 bg-sage/12"
                    : "border-line bg-surface-2"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-sage bg-sage" : "border-dim"
                  }`}
                >
                  {active ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
                      <path
                        d="M1 4.2 3.6 6.8 9 1.2"
                        stroke="#3A3A3A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-mist">
                    {c.name}
                  </span>
                  <span className="block truncate font-mono text-[9px] tracking-[0.12em] text-dim uppercase">
                    {c.detail}
                  </span>
                </span>
                {active ? (
                  <span className="font-mono text-[9px] tracking-[0.14em] text-sage uppercase">
                    selected
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-5">
          <WatchButton onClick={onConfirm}>
            Confirm {CANDIDATES[selected].name}
          </WatchButton>
        </div>
      </div>
    </WatchScreen>
  );
}

/* ---------------------------------------------------------------- object */

export function ObjectScreen({
  onDetails,
  onChoose,
  name = "Jupiter",
  kind = "Gas giant",
}: {
  onDetails: () => void;
  onChoose: () => void;
  name?: string;
  kind?: string;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-5">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <Cube3D size={104} />
          </div>
          <h2 className="mt-6 text-center text-[19px] leading-tight font-medium text-mist">
            {name}
          </h2>
          <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-sage uppercase">
            {kind}
          </p>
        </div>

        <div className="space-y-2.5">
          <WatchButton onClick={onDetails}>Details</WatchButton>
          <WatchButton onClick={onChoose} tone="outline">
            Choose another
          </WatchButton>
        </div>
      </div>
    </WatchScreen>
  );
}

/* --------------------------------------------------------- object details */

export function ObjectDetailsScreen({
  onBack,
  onExplore,
}: {
  onBack: () => void;
  onExplore: () => void;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-5">
        <h2 className="text-center text-[20px] leading-tight font-medium text-mist">
          Jupiter
        </h2>
        <p className="mt-1 text-center font-mono text-[10px] tracking-[0.18em] text-sage uppercase">
          Gas giant
        </p>

        <div className="mt-5 flex items-center justify-center gap-4">
          <Jupiter size={74} />
          <dl className="space-y-2 text-[11px]">
            <Row label="Direction" value="Eastern sky" />
            <Row label="Altitude" value="42°" />
            <Row label="Magnitude" value="−2.2" />
          </dl>
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-fog">
          The largest planet in our solar system, wrapped in turbulent bands of
          cloud and storm.
        </p>

        <div className="mt-auto space-y-2.5 pt-5">
          <WatchButton onClick={onExplore}>Explore the sky</WatchButton>
          <WatchButton onClick={onBack} tone="outline">
            Back
          </WatchButton>
        </div>
      </div>
    </WatchScreen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="font-mono text-[9px] tracking-[0.12em] text-dim uppercase">
        {label}
      </dt>
      <dd className="text-mist tabular-nums">{value}</dd>
    </div>
  );
}

/* -------------------------------------------------------------- no match */

export function NoMatchScreen({
  onRetry,
  onHome,
}: {
  onRetry: () => void;
  onHome: () => void;
}) {
  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-8 pb-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <WatchReticle size={104} color="#666666" opacity={0.85} />
            <span className="absolute font-mono text-[26px] text-dim">?</span>
          </div>
          <h2 className="mt-6 text-center text-[18px] leading-tight font-medium text-mist">
            No clear match
          </h2>
          <p className="mt-2 max-w-[165px] text-center text-[12px] leading-snug text-fog">
            Nothing in the catalogue lines up with where you are pointing.
          </p>
        </div>

        <div className="space-y-2.5">
          <WatchButton onClick={onRetry}>Try again</WatchButton>
          <WatchButton onClick={onHome} tone="outline">
            Back to start
          </WatchButton>
        </div>
      </div>
    </WatchScreen>
  );
}

/* ------------------------------------------------------- object lock timer */

export function ObjectLockTimerScreen({
  remaining,
  total,
  name,
}: {
  remaining: number;
  total: number;
  name: string;
}) {
  const progress = total === 0 ? 0 : 1 - remaining / total;

  return (
    <WatchScreen>
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-6 pb-6">
        <h2 className="text-center text-[17px] leading-tight font-medium text-mist">
          Hold steady…
        </h2>
        <p className="mt-1.5 text-center text-[12px] text-fog">
          Locking onto {name}
        </p>

        <div className="flex flex-1 items-center justify-center">
          <ProgressRing progress={progress} size={124} stroke={4}>
            <span className="font-mono text-[20px] font-medium text-mist tabular-nums">
              {remaining.toFixed(1)}s
            </span>
          </ProgressRing>
        </div>

        <p className="text-center font-mono text-[10px] leading-relaxed tracking-[0.12em] text-dim uppercase">
          Keep the target inside
          <br />
          the reticle
        </p>
      </div>
    </WatchScreen>
  );
}
