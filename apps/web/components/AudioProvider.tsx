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

/** Soft arcade-plastic UI tick: brief noise + gentle sine/triangle, warm envelope. */
function softTick(
  ctx: globalThis.AudioContext,
  opts: {
    freq: number;
    duration: number;
    type?: OscillatorType;
    gain?: number;
    noiseGain?: number;
    noiseMs?: number;
    slideTo?: number;
  },
) {
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.connect(ctx.destination);

  const peak = opts.gain ?? 0.06;
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(peak, now + 0.006);
  master.gain.exponentialRampToValueAtTime(peak * 0.45, now + opts.duration * 0.35);
  master.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, now);
  if (opts.slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(40, opts.slideTo),
      now + opts.duration * 0.7,
    );
  }
  oscGain.gain.setValueAtTime(1, now);
  osc.connect(oscGain);
  oscGain.connect(master);
  osc.start(now);
  osc.stop(now + opts.duration + 0.02);

  const noiseMs = opts.noiseMs ?? 0.012;
  const noiseGainAmt = opts.noiseGain ?? 0;
  if (noiseGainAmt > 0 && noiseMs > 0) {
    const sampleRate = ctx.sampleRate;
    const frames = Math.max(1, Math.floor(sampleRate * noiseMs));
    const buffer = ctx.createBuffer(1, frames, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const t = i / frames;
      data[i] = (Math.random() * 2 - 1) * (1 - t);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const ng = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = opts.freq * 1.4;
    filter.Q.value = 0.9;
    ng.gain.setValueAtTime(noiseGainAmt, now);
    ng.gain.exponentialRampToValueAtTime(0.0001, now + noiseMs);
    noise.connect(filter);
    filter.connect(ng);
    ng.connect(master);
    noise.start(now);
    noise.stop(now + noiseMs + 0.01);
  }
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
      softTick(ctx, {
        freq: 920,
        slideTo: 620,
        duration: 0.055,
        type: "triangle",
        gain: 0.07,
        noiseGain: 0.045,
        noiseMs: 0.014,
      });
      softTick(ctx, {
        freq: 280,
        duration: 0.07,
        type: "sine",
        gain: 0.045,
        noiseGain: 0.02,
        noiseMs: 0.01,
      });
    })();
  }, [ensureCtx]);

  const playHover = useCallback(() => {
    const now = performance.now();
    if (now - hoverThrottle.current < 140) return;
    hoverThrottle.current = now;
    void (async () => {
      const ctx = await ensureCtx();
      if (!ctx) return;
      softTick(ctx, {
        freq: 1400,
        duration: 0.028,
        type: "sine",
        gain: 0.035,
        noiseGain: 0.018,
        noiseMs: 0.008,
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
        {muted ? "OFF" : "ON"}
      </span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{muted ? "Play" : "Mute"}</span>
    </button>
  );
}
