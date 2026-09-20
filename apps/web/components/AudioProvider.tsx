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
import { playSound } from "@/lib/sound-engine";
import { back001Sound } from "@/sounds/back-001";
import { back002Sound } from "@/sounds/back-002";
import { back003Sound } from "@/sounds/back-003";

const UI_SOUNDS = [back001Sound, back002Sound, back003Sound] as const;

function pickUiSound() {
  return UI_SOUNDS[Math.floor(Math.random() * UI_SOUNDS.length)]!;
}

type AudioApi = {
  muted: boolean;
  setMuted: (value: boolean) => void;
  toggleMute: () => void;
  /** Start looping theme from a user gesture (Press Start / first tap). */
  startImmersiveTheme: () => void;
  playClick: () => void;
  playHover: () => void;
  playBack: () => void;
};

const NightfallAudioContext = createContext<AudioApi | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const themeRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMutedState] = useState(true);
  const hoverThrottle = useRef(0);

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

  const startImmersiveTheme = useCallback(() => {
    setMutedState(false);
    void playTheme();
  }, [playTheme]);

  /** UI clicks — random soundcn back-001 / back-002 / back-003 */
  const playClick = useCallback(() => {
    void playSound(pickUiSound().dataUri, { volume: 0.55 });
  }, []);

  /** Soft hover tick — quieter random pick from the same pool */
  const playHover = useCallback(() => {
    const now = performance.now();
    if (now - hoverThrottle.current < 160) return;
    hoverThrottle.current = now;
    void playSound(pickUiSound().dataUri, { volume: 0.22 });
  }, []);

  /** Back / close — also randomized from the same three */
  const playBack = useCallback(() => {
    void playSound(pickUiSound().dataUri, { volume: 0.5 });
  }, []);

  useEffect(() => {
    return () => {
      pauseTheme();
      if (themeRef.current) {
        themeRef.current.src = "";
        themeRef.current = null;
      }
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
      playBack,
    }),
    [muted, setMuted, toggleMute, startImmersiveTheme, playClick, playHover, playBack],
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
      playBack: () => {},
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
