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
  /** Start looping theme from a user gesture (Press Start / first tap). */
  startImmersiveTheme: () => void;
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

export function AudioProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<globalThis.AudioContext | null>(null);
  const themeRef = useRef<HTMLAudioElement | null>(null);
  const sfxBufferRef = useRef<AudioBuffer | null>(null);
  const sfxLoadRef = useRef<Promise<AudioBuffer | null> | null>(null);
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

  const ensureSfxBuffer = useCallback(async () => {
    if (sfxBufferRef.current) return sfxBufferRef.current;
    if (sfxLoadRef.current) return sfxLoadRef.current;

    sfxLoadRef.current = (async () => {
      const ctx = await ensureCtx();
      if (!ctx) return null;
      try {
        const res = await fetch(site.assets.sfxClick);
        if (!res.ok) return null;
        const raw = await res.arrayBuffer();
        const buffer = await ctx.decodeAudioData(raw.slice(0));
        sfxBufferRef.current = buffer;
        return buffer;
      } catch {
        return null;
      }
    })();

    return sfxLoadRef.current;
  }, [ensureCtx]);

  const playSfx = useCallback(
    async (gain: number) => {
      const ctx = await ensureCtx();
      if (!ctx) return;
      const buffer = await ensureSfxBuffer();
      if (!buffer) return;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const g = ctx.createGain();
      g.gain.value = gain;
      src.connect(g);
      g.connect(ctx.destination);
      src.start(0);
    },
    [ensureCtx, ensureSfxBuffer],
  );

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

  /** Call from a click/key gesture so browsers allow audio. */
  const startImmersiveTheme = useCallback(() => {
    setMutedState(false);
    void (async () => {
      await ensureCtx();
      void ensureSfxBuffer();
      await playTheme();
    })();
  }, [ensureCtx, ensureSfxBuffer, playTheme]);

  /** Select / confirm — blipSelect.wav */
  const playClick = useCallback(() => {
    void playSfx(0.55);
  }, [playSfx]);

  /** Softer cursor tick — same sample, quieter + throttled */
  const playHover = useCallback(() => {
    const now = performance.now();
    if (now - hoverThrottle.current < 160) return;
    hoverThrottle.current = now;
    void playSfx(0.22);
  }, [playSfx]);

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
      startImmersiveTheme,
      playClick,
      playHover,
    }),
    [muted, setMuted, toggleMute, startImmersiveTheme, playClick, playHover],
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
      startImmersiveTheme: () => {},
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
      className={`neon-btn-ghost inline-flex items-center gap-2 rounded-sm border border-neon-pink/30 bg-void-900/80 px-3 py-2 text-[8px] uppercase tracking-widest text-neon-cyan backdrop-blur transition hover:border-neon-pink hover:shadow-glow-pink ${className}`}
      aria-pressed={!muted}
      title={site.audio.hint}
    >
      <span aria-hidden className="text-[8px]">
        {muted ? "OFF" : "ON"}
      </span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{muted ? "Play" : "Mute"}</span>
    </button>
  );
}
