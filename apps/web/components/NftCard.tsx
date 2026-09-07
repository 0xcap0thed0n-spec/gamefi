type NftCardProps = {
  id: number;
  name: string;
  rarity: string;
  role: string;
  accent: string;
};

export function NftCard(props: NftCardProps) {
  const gradient =
    "linear-gradient(145deg, " +
    props.accent +
    "33, transparent 60%), radial-gradient(circle at 30% 30%, " +
    props.accent +
    "55, transparent 50%)";

  return (
    <article className="panel group overflow-hidden transition hover:border-white/20">
      <div
        className="relative aspect-square bg-void-900"
        style={{ backgroundImage: gradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-5xl font-bold opacity-40 transition group-hover:opacity-70"
            style={{ color: props.accent }}
          >
            #{""}{props.id}
          </span>
        </div>
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-void-950/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-300">
          Placeholder
        </span>
      </div>
      <div className="space-y-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-white">{props.name}</h3>
          <span className="shrink-0 text-xs text-zinc-500">#{props.id}</span>
        </div>
        <p className="text-xs text-zinc-400">
          <span className="text-neon-gold">{props.rarity}</span>
          {" · "}
          {props.role}
        </p>
      </div>
    </article>
  );
}
