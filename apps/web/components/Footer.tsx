import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-void-900/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-semibold text-white">
            555 Genesis
          </p>
          <p className="mt-1 max-w-md text-xs text-zinc-500">
            GameFi NFT characters with real utility. Genesis 555 then full drop
            5,555. Testnet first — no mainnet yet.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
          <Link href="/mint" className="hover:text-neon-cyan">
            Mint
          </Link>
          <Link href="/portfolio" className="hover:text-neon-cyan">
            Portfolio
          </Link>
          <a
            href="https://github.com/0xcap0thed0n-spec/gamefi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-cyan"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-3 text-center text-[11px] text-zinc-600">
        Built for learning on Base testnet · Placeholder UI · Not financial advice
      </div>
    </footer>
  );
}
