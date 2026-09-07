const rows = [
  {
    drop: "Genesis characters",
    supply: "555",
    note: "First drop — rare founding set",
    highlight: true,
  },
  {
    drop: "Full release",
    supply: "5,000",
    note: "Expansion toward the cap",
    highlight: false,
  },
  {
    drop: "Total capped supply",
    supply: "5,555",
    note: "Hard ceiling — no more after",
    highlight: true,
  },
];

export function SupplyTable() {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-white">
          Supply at a glance
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Easy numbers: start with 555 heroes, then grow to 5,555 total.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-3 font-medium">Drop</th>
              <th className="px-5 py-3 font-medium">Supply</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">
                What it means
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(function (row) {
              const supplyClass = row.highlight
                ? "font-display text-base font-bold text-neon-gold"
                : "font-display text-base font-bold text-neon-cyan";
              return (
                <tr
                  key={row.drop}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-5 py-4 font-medium text-zinc-200">
                    {row.drop}
                  </td>
                  <td className="px-5 py-4">
                    <span className={supplyClass}>{row.supply}</span>
                  </td>
                  <td className="hidden px-5 py-4 text-zinc-400 sm:table-cell">
                    {row.note}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
