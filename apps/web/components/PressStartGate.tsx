"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

/** Session flag so whitelist testing isn’t blocked every refresh. Clear to re-show. */
const STORAGE_KEY = "nf_press_start_done";

export function PressStartGate() {
  const { pressStart } = site;
  const { playClick } = useAudio();
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      const done = sessionStorage.getItem(STORAGE_KEY) === "1";
      setOpen(!done);
    } catch {
      setOpen(true);
    }
    setHydrated(true);
  }, []);

  const dismiss = useCallback(() => {
    if (exiting) return;
    playClick();
    setExiting(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => {
      setOpen(false);
      setExiting(false);
    }, 420);
  }, [exiting, playClick]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

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
      className={`press-start-gate fixed inset-0 z-[80] flex cursor-pointer flex-col items-center justify-center px-6 ${
        exiting ? "press-start-gate--out" : ""
      }`}
      onClick={dismiss}
    >
      <div className="press-start-veil" aria-hidden />
      <div className="press-start-scan" aria-hidden />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <p className="font-pixel text-[8px] uppercase tracking-[0.35em] text-neon-cyan/80 sm:text-[9px]">
          {pressStart.eyebrow}
        </p>
        <p
          className="press-start-blink mt-6 font-pixel text-base leading-relaxed text-neon-pink sm:text-xl md:text-2xl"
          style={{ textShadow: "0 0 18px rgba(255, 45, 149, 0.75), 0 0 36px rgba(0, 245, 255, 0.35)" }}
        >
          {pressStart.title}
        </p>
        <p className="mt-5 font-pixel text-[8px] uppercase tracking-[0.28em] text-zinc-400 sm:text-[9px]">
          {pressStart.hint}
        </p>
      </div>
    </div>
  );
}
