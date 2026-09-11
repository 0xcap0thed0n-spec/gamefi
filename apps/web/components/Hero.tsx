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

        <div className="mb-6 flex flex-col items-center sm:mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.assets.logo}
            alt={`${site.name} logo`}
            className="neon-logo neon-logo-flicker h-auto w-56 bg-transparent object-contain sm:w-72 md:w-80 lg:w-[22rem]"
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        <p className="mt-2 max-w-xl text-[9px] leading-relaxed text-zinc-300 sm:text-[10px]">
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
