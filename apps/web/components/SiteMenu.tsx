"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { playClick, playBack } = useAudio();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        playBack();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        playBack();
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, playBack]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="neon-btn-ghost inline-flex items-center gap-2 rounded-sm border border-neon-cyan/35 bg-void-900/80 px-3 py-2 text-[8px] uppercase tracking-widest text-neon-cyan backdrop-blur transition hover:border-neon-cyan hover:shadow-glow"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          if (open) {
            playBack();
            setOpen(false);
          } else {
            playClick();
            setOpen(true);
          }
        }}
      >
        {open ? site.menu.closeLabel : site.menu.openLabel}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 min-w-[11rem] overflow-hidden rounded-sm border border-neon-pink/35 bg-void-950/95 shadow-glow-pink backdrop-blur"
        >
          {site.menu.items.map((item) => (
              <a
                key={item.href}
                role="menuitem"
                href={item.href}
                className="block border-b border-white/5 px-3 py-2.5 text-left text-[8px] uppercase tracking-wider text-zinc-200 transition last:border-b-0 hover:bg-neon-pink/10 hover:text-neon-pink"
                onClick={() => {
                  playClick();
                  setOpen(false);
                }}
              >
                {item.label}
              </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
