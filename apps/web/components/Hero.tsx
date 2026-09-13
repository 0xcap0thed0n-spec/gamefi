"use client";

import { site } from "@/content/site";
import { MuteToggle, useAudio } from "./AudioProvider";

export function Hero() {
  const { playClick, playHover } = useAudio();

  return (
    <section className="relative isolate overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-36 sm:pt-16 md:pb-44">
      <div className="pointer-events-none absolute inset-0 hero-grid" aria-hidden />
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-8 flex w-full items-center justify-between gap-3">
          <span
            className="badge-neon neon-logo-flicker"
            style={{ animationDelay: "0.35s" }}
          >
            {site.hero.badge}
          </span>
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
            className="neon-btn neon-btn-cyan-art neon-logo-flicker"
            style={{
              backgroundImage: `url(${site.assets.neonButton})`,
              animationDelay: "0.7s",
            }}
            onClick={playClick}
            onMouseEnter={playHover}
          >
            {site.hero.ctaPrimary}
          </a>
          <a
            href={site.hero.ctaSecondaryHref}
            className="neon-btn-secondary neon-logo-flicker"
            style={{ animationDelay: "1.1s" }}
            onClick={playClick}
            onMouseEnter={playHover}
          >
            {site.hero.ctaSecondary}
          </a>
        </div>

        <div
          className="perspective-road relative mt-16 mb-4 h-28 w-full max-w-2xl opacity-80 sm:mb-10 sm:h-36 md:mb-16"
          aria-hidden
        >
          <div className="road-grid" />
          <div className="road-static" />
          <div className="road-waves">
            <svg
              className="road-wave-svg"
              viewBox="0 0 640 80"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="road-wave-path road-wave-path--cyan"
                d="M0 40 C40 18 60 62 100 40 S160 18 200 40 260 62 300 40 360 18 400 40 460 62 500 40 560 18 600 40 640 55 640 40"
                fill="none"
              />
              <path
                className="road-wave-path road-wave-path--pink"
                d="M0 44 C35 28 70 58 105 44 S175 28 210 44 280 58 315 44 385 28 420 44 490 58 525 44 595 28 640 44"
                fill="none"
              />
              <path
                className="road-wave-path road-wave-path--dim"
                d="M0 48 Q80 36 160 48 T320 48 T480 48 T640 48"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
