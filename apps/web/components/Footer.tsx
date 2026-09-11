"use client";

import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

export function Footer() {
  const { footer, name } = site;
  const { playClick, playHover } = useAudio();

  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-void-950/90">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white">{name}</p>
          <p className="mt-3 max-w-sm text-[8px] leading-relaxed text-zinc-500">
            {footer.blurb}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-[8px] uppercase tracking-wider text-zinc-400"
          aria-label="Footer"
        >
          {footer.links.map((link) => {
            const external = "external" in link && link.external;
            return (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-neon-pink"
                onClick={playClick}
                onMouseEnter={playHover}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/5 py-3 text-center text-[7px] text-zinc-600">
        {footer.credit}
      </div>
    </footer>
  );
}
