"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

/** Session flag so whitelist testing isn’t blocked every refresh. Clear to re-show. */
const STORAGE_KEY = "nf_press_start_done";

/** Fake boot load after Start — keep long enough to feel like a CRT handoff. */
const LOAD_MS = 2400;
const FADE_MS = 900;

type Phase = "idle" | "loading" | "out";

export function PressStartGate() {
  const { pressStart } = site;
  const { playClick } = useAudio();
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    try {
      const done = sessionStorage.getItem(STORAGE_KEY) === "1";
      setOpen(!done);
    } catch {
      setOpen(true);
    }
    setHydrated(true);
  }, []);

  const beginBoot = useCallback(() => {
    if (phase !== "idle") return;
    playClick();
    setPhase("loading");
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [phase, playClick]);

  useEffect(() => {
    if (phase !== "loading") return;
    const toOut = window.setTimeout(() => setPhase("out"), LOAD_MS);
    return () => window.clearTimeout(toOut);
  }, [phase]);

  useEffect(() => {
    if (phase !== "out") return;
    const done = window.setTimeout(() => {
      setOpen(false);
      setPhase("idle");
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

  if (!hydrated || !open) return null;

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
            <div
              className="press-start-bar mt-8 w-full max-w-xs"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={pressStart.loadingLabel}
            >
              <div className="press-start-bar__fill" />
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
