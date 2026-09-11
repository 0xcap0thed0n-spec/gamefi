import { site } from "@/content/site";

export function Lore() {
  const { lore, assets } = site;
  const note = (lore.note ?? "").trim();

  return (
    <section
      id={lore.id}
      className="relative mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div
        className="neon-panel-frame neon-card relative overflow-hidden p-6 sm:p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(8, 6, 18, 0.88), rgba(8, 6, 18, 0.92)), url(${assets.neonPanel})`,
        }}
      >
        <div className="relative z-10">
          <p className="text-[8px] uppercase tracking-[0.3em] text-neon-pink">
            {lore.eyebrow}
          </p>
          <h2 className="mt-4 text-sm uppercase tracking-wide text-white sm:text-base">
            {lore.title}
          </h2>
          <div className="mt-6 space-y-4 text-[9px] leading-relaxed text-zinc-300 sm:text-[10px]">
            {lore.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {note ? (
            <p className="mt-6 rounded-sm border border-dashed border-neon-purple/40 bg-neon-purple/5 px-3 py-2 text-[8px] text-neon-purple">
              {note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
