"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

/** Boot load after Start — theme starts when this finishes (same beat as the handoff). */
const LOAD_MS = 2400;
const FADE_MS = 900;

type Phase = "idle" | "loading" | "out";

/** Match the stepped CSS bar curve roughly for the % readout. */
function loadEase(t: number): number {
  if (t < 0.15) return (t / 0.15) * 18;
  if (t < 0.4) return 18 + ((t - 0.15) / 0.25) * 24;
  if (t < 0.55) return 42 + ((t - 0.4) / 0.15) * 6;
  if (t < 0.78) return 48 + ((t - 0.55) / 0.23) * 40;
  return 88 + ((t - 0.78) / 0.22) * 12;
}

export function PressStartGate() {
  const { pressStart } = site;
  const { playClick, startImmersiveTheme } = useAudio();
  // open starts true so SSR + first paint cover the site (no flash before hydrate).
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [percent, setPercent] = useState(0);

  const beginBoot = useCallback(() => {
    if (phase !== "idle") return;
    playClick();
    setPercent(0);
    setPhase("loading");
  }, [phase, playClick]);

  useEffect(() => {
    if (phase !== "loading") return;
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / LOAD_MS);
      setPercent(Math.min(100, Math.round(loadEase(t))));
      if (t < 1) raf = window.requestAnimationFrame(tick);
      else setPercent(100);
    };
    raf = window.requestAnimationFrame(tick);
    // Theme waits for the full boot bar — same length as the Start transition.
    const toOut = window.setTimeout(() => {
      startImmersiveTheme();
      setPhase("out");
    }, LOAD_MS);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(toOut);
    };
  }, [phase, startImmersiveTheme]);

  useEffect(() => {
    if (phase !== "out") return;
    const done = window.setTimeout(() => {
      setOpen(false);
      setPhase("idle");
      setPercent(0);
    }, FADE_MS);
    return () => window.clearTimeout(done);
  }, [phase]);

  useEffect(() => {
    if (!open || phase !== "idle") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        beginBoot();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, phase, beginBoot]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pressStart.title}
      className={`press-start-gate fixed inset-0 z-[80] flex flex-col items-center justify-center px-6 ${
        phase === "idle" ? "cursor-pointer" : "cursor-default"
      } ${phase === "out" ? "press-start-gate--out" : ""} ${
        phase === "loading" ? "press-start-gate--loading" : ""
      }`}
      onClick={phase === "idle" ? beginBoot : undefined}
    >
      <div className="press-start-veil" aria-hidden />
      <div className="press-start-scan" aria-hidden />
      <div className="press-start-noise" aria-hidden />
      <div className="press-start-tear press-start-tear--a" aria-hidden />
      <div className="press-start-tear press-start-tear--b" aria-hidden />
      <div className="press-start-rgb" aria-hidden />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {phase === "idle" ? (
          <>
            <p className="font-pixel text-[8px] uppercase tracking-[0.35em] text-neon-cyan/80 sm:text-[9px]">
              {pressStart.eyebrow}
            </p>
            <p
              className="press-start-blink press-start-title-glitch mt-8 font-pixel text-base leading-relaxed text-neon-pink sm:text-xl md:text-2xl"
              data-text={pressStart.title}
            >
              {pressStart.title}
            </p>
          </>
        ) : (
          <>
            <p className="font-pixel text-[8px] uppercase tracking-[0.3em] text-neon-cyan sm:text-[9px]">
              {pressStart.loadingLabel}
            </p>
            <div className="mt-8 flex w-full max-w-xs items-center gap-3">
              <div
                className="press-start-bar min-w-0 flex-1"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={pressStart.loadingLabel}
              >
                <div className="press-start-bar__fill" />
              </div>
              <span className="shrink-0 font-pixel text-[9px] tabular-nums text-neon-pink sm:text-[10px]">
                {percent}%
              </span>
            </div>
            <p className="mt-4 font-pixel text-[7px] uppercase tracking-[0.25em] text-zinc-500">
              {pressStart.loadingSub}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
