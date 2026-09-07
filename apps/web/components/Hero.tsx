"use client";

import Image from "next/image";
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

        <div className="mb-6 flex flex-col items-center gap-4 sm:mb-8 sm:flex-row sm:gap-6">
          <Image
            src={site.assets.logo}
            alt={`${site.name} logo`}
            width={128}
            height={128}
            priority
            className="neon-logo h-24 w-24 rounded-2xl object-cover sm:h-28 sm:w-28"
          />
          <div className="flex flex-col items-center sm:items-start sm:text-left">
            <p className="font-pixel text-[10px] uppercase tracking-[0.35em] text-neon-blue sm:text-xs">
              80s · cyberpunk · nft
            </p>
            <h1 className="glitch-title mt-3 font-display text-4xl font-bold uppercase leading-none tracking-[0.08em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="glitch-text" data-text={site.title}>
                {site.title}
              </span>
            </h1>
          </div>
        </div>

        <p className="mt-2 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {site.tagline}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={site.hero.ctaPrimaryHref}
            className="neon-btn neon-btn-cyan-art"
            style={{
              backgroundImage: `url(${site.assets.neonButton})`,
            }}
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
