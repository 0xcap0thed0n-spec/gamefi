type PackCardProps = {
  name: string;
  priceLabel: string;
  description: string;
  perks: string[];
  featured?: boolean;
};

export function PackCard(props: PackCardProps) {
  const featured = props.featured || false;
  const panelClass = featured
    ? "panel flex flex-col p-5 border-neon-magenta/40 shadow-glow-magenta"
    : "panel flex flex-col p-5";

  return (
    <article className={panelClass}>
      {featured ? (
        <span className="badge mb-3 w-fit">Most popular (later)</span>
      ) : null}
      <h3 className="font-display text-xl font-semibold text-white">
        {props.name}
      </h3>
      <p className="mt-1 font-display text-2xl font-bold text-neon-cyan">
        {props.priceLabel}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {props.description}
      </p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-zinc-300">
        {props.perks.map(function (perk) {
          return (
            <li key={perk} className="flex gap-2">
              <span className="text-neon-lime" aria-hidden>
                ✓
              </span>
              {perk}
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn-primary mt-6 w-full" disabled>
        Coming soon — testnet
      </button>
    </article>
  );
}
