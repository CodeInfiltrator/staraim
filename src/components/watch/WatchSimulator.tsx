"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WatchFrame } from "./WatchFrame";
import {
  CalibrationDoneScreen,
  CalibrationScreen,
  HomeScreen,
  TimerCalibrationScreen,
} from "./screens/Calibration";
import {
  ChooseObjectScreen,
  NoMatchScreen,
  ObjectDetailsScreen,
  ObjectLockTimerScreen,
  ObjectScreen,
} from "./screens/Identify";
import {
  ExploreSkyScreen,
  PressToPointScreen,
  ThreeDScreen,
} from "./screens/Point";

export type WatchStep =
  | "home"
  | "calibration"
  | "calibrating"
  | "calibrated"
  | "locking"
  | "object"
  | "details"
  | "choosing"
  | "noMatch"
  | "pressToPoint"
  | "explore"
  | "threeD";

const STEPS: { id: WatchStep; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "calibration", label: "Calibrate" },
  { id: "calibrating", label: "Aligning" },
  { id: "calibrated", label: "Done" },
  { id: "locking", label: "Lock" },
  { id: "object", label: "Object" },
  { id: "choosing", label: "Choose" },
  { id: "details", label: "Details" },
  { id: "noMatch", label: "No match" },
  { id: "pressToPoint", label: "Point" },
  { id: "explore", label: "Explore" },
  { id: "threeD", label: "3D" },
];

const CALIBRATION_SECONDS = 3;
const LOCK_SECONDS = 2.1;

export function WatchSimulator({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const [step, setStep] = useState<WatchStep>("home");
  const [calibrated, setCalibrated] = useState(false);
  const [remaining, setRemaining] = useState(CALIBRATION_SECONDS);
  const [candidate, setCandidate] = useState(0);
  const [crown, setCrown] = useState(0);
  const timer = useRef<number | null>(null);

  const go = useCallback((next: WatchStep) => {
    setStep(next);
    setCrown((c) => (c + 1) % 4);
  }, []);

  /* ------------------------------------------------------------- timers */

  useEffect(() => {
    if (step !== "calibrating" && step !== "locking") return;
    const total = step === "calibrating" ? CALIBRATION_SECONDS : LOCK_SECONDS;
    const started = performance.now();
    setRemaining(total);

    let raf = 0;
    const tick = (t: number) => {
      const left = Math.max(0, total - (t - started) / 1000);
      setRemaining(left);
      if (left > 0) {
        raf = requestAnimationFrame(tick);
      } else if (step === "calibrating") {
        setCalibrated(true);
        go("calibrated");
      } else {
        go("object");
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [step, go]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  /* -------------------------------------------------------------- render */

  const screen = (() => {
    switch (step) {
      case "home":
        return (
          <HomeScreen
            calibrated={calibrated}
            onCalibrate={() => go("calibration")}
            onPoint={() => go("locking")}
          />
        );
      case "calibration":
        return <CalibrationScreen onStart={() => go("calibrating")} />;
      case "calibrating":
        return (
          <TimerCalibrationScreen
            remaining={remaining}
            total={CALIBRATION_SECONDS}
          />
        );
      case "calibrated":
        return (
          <CalibrationDoneScreen
            onFinish={() => go("home")}
            onAgain={() => go("calibration")}
          />
        );
      case "locking":
        return (
          <ObjectLockTimerScreen
            remaining={remaining}
            total={LOCK_SECONDS}
            name="Jupiter"
          />
        );
      case "object":
        return (
          <ObjectScreen
            onDetails={() => go("details")}
            onChoose={() => go("choosing")}
          />
        );
      case "choosing":
        return (
          <ChooseObjectScreen
            selected={candidate}
            onSelect={setCandidate}
            onConfirm={() => go("object")}
          />
        );
      case "details":
        return (
          <ObjectDetailsScreen
            onBack={() => go("object")}
            onExplore={() => go("explore")}
          />
        );
      case "noMatch":
        return (
          <NoMatchScreen onRetry={() => go("locking")} onHome={() => go("home")} />
        );
      case "pressToPoint":
        return <PressToPointScreen onPoint={() => go("explore")} />;
      case "explore":
        return (
          <ExploreSkyScreen
            onOpen3D={() => go("threeD")}
            onBack={() => go("details")}
          />
        );
      case "threeD":
        return <ThreeDScreen onBack={() => go("explore")} />;
      default:
        return null;
    }
  })();

  return (
    <div className={className}>
      <div className="relative">
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(207,224,160,0.12),transparent_65%)]" />
        <WatchFrame crown={crown} className="relative mx-auto max-w-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              {screen}
            </motion.div>
          </AnimatePresence>
        </WatchFrame>
      </div>

      {!compact ? (
        <div className="mt-8">
          <p className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
            Walk the flow
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`cursor-pointer rounded-pill border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
                  step === s.id
                    ? "border-sage/60 bg-sage/15 text-sage"
                    : "border-line text-dim hover:border-sage/30 hover:text-fog"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
