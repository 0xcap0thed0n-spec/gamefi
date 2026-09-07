"use client";

import { site } from "@/content/site";
import { MuteToggle, useAudio } from "./AudioProvider";

export function Hero() {
  const { playClick, playHover } = useAudio();

  return (
    <section className="relative isolate overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 hero-grid" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-8 flex w-full items-center justify-between gap-3">
          <span className="badge-neon">{site.hero.badge}</span>
          <MuteToggle />
        </div>

        <p className="font-pixel text-[10px] uppercase tracking-[0.35em] text-neon-blue sm:text-xs">
          80s · cyberpunk · nft
        </p>

        <h1 className="glitch-title mt-4 font-display text-4xl font-bold uppercase leading-none tracking-[0.08em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="glitch-text" data-text={site.title}>
            {site.title}
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {site.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={site.hero.ctaPrimaryHref}
            className="neon-btn"
            onClick={playClick}
            onMouseEnter={playHover}
          >
            {site.hero.ctaPrimary}
          </a>
          <a
            href={site.hero.ctaSecondaryHref}
            className="neon-btn-secondary"
            onClick={playClick}
            onMouseEnter={playHover}
          >
            {site.hero.ctaSecondary}
          </a>
        </div>

        <div
          className="perspective-road mt-16 h-28 w-full max-w-2xl opacity-70 sm:h-36"
          aria-hidden
        >
          <div className="road-grid" />
        </div>
      </div>
    </section>
  );
}
