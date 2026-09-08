import { site } from "@/content/site";

/** Early character-study grid — light "coming soon" teaser, not the final art. */
export function Teaser() {
  const { teaser, assets } = site;

  return (
    <section
      id={teaser.id}
      className="relative mx-auto max-w-2xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mb-8 text-center">
        <p className="font-pixel text-[10px] uppercase tracking-[0.3em] text-neon-purple">
          {teaser.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-wide text-white sm:text-3xl">
          {teaser.title}
        </h2>
      </div>

      <div className="neon-panel-frame neon-card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assets.teaserGrid}
          alt="Nightfall City early character studies"
          className="block w-full"
        />
      </div>
      <p className="mt-4 text-center text-xs text-zinc-500">{teaser.caption}</p>
    </section>
  );
}
