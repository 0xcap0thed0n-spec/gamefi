"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/content/site";

type AudioApi = {
  muted: boolean;
  setMuted: (value: boolean) => void;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
};

const NightfallAudioContext = createContext<AudioApi | null>(null);

function createAudioContextOrNull(): globalThis.AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof globalThis.AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  return new AC();
}

/** Tiny retro beep via Web Audio — no sample packs. */
function beep(
  ctx: globalThis.AudioContext,
  opts: {
    freq: number;
    duration: number;
    type?: OscillatorType;
    gain?: number;
    slideTo?: number;
  },
) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type ?? "square";
  osc.frequency.setValueAtTime(opts.freq, now);
  if (opts.slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, opts.slideTo),
      now + opts.duration,
    );
  }
  const g = opts.gain ?? 0.05;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(g, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + opts.duration + 0.02);
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<globalThis.AudioContext | null>(null);
  const themeRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMutedState] = useState(true);
  const hoverThrottle = useRef(0);

  const ensureCtx = useCallback(async () => {
    if (!ctxRef.current) ctxRef.current = createAudioContextOrNull();
    const ctx = ctxRef.current;
    if (!ctx) return null;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        /* ignore autoplay blocks */
      }
    }
    return ctx;
  }, []);

  const ensureTheme = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!themeRef.current) {
      const el = new Audio(site.assets.theme);
      el.loop = true;
      el.preload = "auto";
      el.volume = 0.45;
      themeRef.current = el;
    }
    return themeRef.current;
  }, []);

  const pauseTheme = useCallback(() => {
    const el = themeRef.current;
    if (!el) return;
    try {
      el.pause();
    } catch {
      /* ignore */
    }
  }, []);

  const playTheme = useCallback(async () => {
    const el = ensureTheme();
    if (!el) return;
    try {
      el.volume = 0.45;
      el.loop = true;
      await el.play();
    } catch {
      /* browsers block autoplay — stay muted until user retries */
      setMutedState(true);
    }
  }, [ensureTheme]);

  const setMuted = useCallback(
    (value: boolean) => {
      setMutedState(value);
      if (value) pauseTheme();
      else void playTheme();
    },
    [pauseTheme, playTheme],
  );

  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const playClick = useCallback(() => {
    void (async () => {
      const ctx = await ensureCtx();
      if (!ctx) return;
      beep(ctx, {
        freq: 880,
        slideTo: 440,
        duration: 0.08,
        type: "square",
        gain: 0.06,
      });
      beep(ctx, {
        freq: 220,
        duration: 0.05,
        type: "triangle",
        gain: 0.03,
      });
    })();
  }, [ensureCtx]);

  const playHover = useCallback(() => {
    const now = performance.now();
    if (now - hoverThrottle.current < 80) return;
    hoverThrottle.current = now;
    void (async () => {
      const ctx = await ensureCtx();
      if (!ctx) return;
      beep(ctx, {
        freq: 660,
        duration: 0.04,
        type: "square",
        gain: 0.025,
      });
    })();
  }, [ensureCtx]);

  useEffect(() => {
    return () => {
      pauseTheme();
      if (themeRef.current) {
        themeRef.current.src = "";
        themeRef.current = null;
      }
      void ctxRef.current?.close();
    };
  }, [pauseTheme]);

  const api = useMemo<AudioApi>(
    () => ({
      muted,
      setMuted,
      toggleMute,
      playClick,
      playHover,
    }),
    [muted, setMuted, toggleMute, playClick, playHover],
  );

  return (
    <NightfallAudioContext.Provider value={api}>{children}</NightfallAudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(NightfallAudioContext);
  if (!ctx) {
    return {
      muted: true,
      setMuted: () => {},
      toggleMute: () => {},
      playClick: () => {},
      playHover: () => {},
    } satisfies AudioApi;
  }
  return ctx;
}

export function MuteToggle({ className = "" }: { className?: string }) {
  const { muted, toggleMute, playClick, playHover } = useAudio();
  const label = muted ? site.audio.muteLabel : site.audio.unmuteLabel;

  return (
    <button
      type="button"
      onClick={() => {
        playClick();
        toggleMute();
      }}
      onMouseEnter={playHover}
      className={`neon-btn-ghost inline-flex items-center gap-2 rounded-lg border border-neon-pink/30 bg-void-900/80 px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-neon-cyan backdrop-blur transition hover:border-neon-pink hover:shadow-glow-pink ${className}`}
      aria-pressed={!muted}
      title={site.audio.hint}
    >
      <span aria-hidden className="font-pixel text-[10px]">
        {muted ? "♪×" : "♪"}
      </span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{muted ? "Play" : "Mute"}</span>
    </button>
  );
}