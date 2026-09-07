import { site } from "@/content/site";

const statusStyles = {
  live: "border-neon-cyan/50 text-neon-cyan bg-neon-cyan/10",
  soon: "border-neon-purple/40 text-neon-purple bg-neon-purple/10",
} as const;

export function Roadmap() {
  const { roadmap } = site;

  return (
    <section
      id={roadmap.id}
      className="relative mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mb-10 text-center">
        <p className="font-pixel text-[10px] uppercase tracking-[0.3em] text-neon-blue">
          {roadmap.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-wide text-white sm:text-3xl">
          {roadmap.title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">
          {roadmap.subtitle}
        </p>
      </div>

      <ol className="grid gap-4 sm:grid-cols-2">
        {roadmap.items.map((item) => (
          <li key={item.phase} className="neon-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="font-pixel text-xs text-neon-pink">
                {item.phase}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[item.status]}`}
              >
                {item.status === "live" ? "Live" : "Soon"}
              </span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {item.blurb}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
