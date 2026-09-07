import Link from "next/link";
import { SupplyTable } from "@/components/SupplyTable";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-hero-radial"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-fade bg-[size:48px_48px] opacity-40"
        aria-hidden
      />

      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="max-w-2xl">
          <span className="badge">Phase 0 · Website shell</span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            555 Genesis
            <span className="block bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent">
              characters that play
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
            A beginner-friendly GameFi NFT project. First we drop{" "}
            <strong className="text-neon-gold">555</strong> Genesis characters,
            then expand toward a hard cap of{" "}
            <strong className="text-neon-cyan">5,555</strong>. Mint packs, track
            your portfolio, and unlock in-game utility — all starting on{" "}
            <strong className="text-white">Base testnet</strong> (no real money
            yet).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/mint" className="btn-primary">
              Go to Mint
            </Link>
            <Link href="/portfolio" className="btn-secondary">
              View Portfolio
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Wallet connect is a stub for now. MetaMask wiring comes later.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <SupplyTable />

          <div className="panel space-y-5 p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              What you can do here
            </h2>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neon-cyan/15 text-xs font-bold text-neon-cyan">
                  1
                </span>
                <span>
                  <strong className="text-white">Mint / packs</strong> — buy
                  pack stubs and forever-mint UI (disabled until testnet).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neon-magenta/15 text-xs font-bold text-neon-magenta">
                  2
                </span>
                <span>
                  <strong className="text-white">Portfolio</strong> — see
                  placeholder holdings so the UI is ready before contracts.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neon-gold/15 text-xs font-bold text-neon-gold">
                  3
                </span>
                <span>
                  <strong className="text-white">GameFi later</strong> —
                  characters will do something in-game (economy + loop).
                </span>
              </li>
            </ul>
            <div className="rounded-xl border border-white/10 bg-void-900/60 p-4 text-xs leading-relaxed text-zinc-400">
              Inspired by DeFi Kingdoms (utility), Dead Pixels Ghost Club
              (packs), and The Remnants / The Heist (adventure framing). Art can
              wait — utility and contracts ship on testnet first.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
