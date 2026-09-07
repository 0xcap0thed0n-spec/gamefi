import type { Metadata } from "next";
import { PackCard } from "@/components/PackCard";

export const metadata: Metadata = {
  title: "Mint",
  description: "Pack and forever-mint UI for 555 Genesis — coming soon on Base testnet.",
};

const packs = [
  {
    name: "Starter Pack",
    priceLabel: "TBD · testnet",
    description:
      "A simple pack for newcomers. Opens into one Genesis character once mint goes live.",
    perks: [
      "1 character reveal",
      "Beginner-friendly odds copy",
      "Works with placeholder art",
    ],
    featured: false,
  },
  {
    name: "Genesis Pack",
    priceLabel: "TBD · testnet",
    description:
      "The main pack players will chase. Inspired by forever-mint / pack loops — still a stub.",
    perks: [
      "3 character reveals (planned)",
      "Better chance at rare roles",
      "Feeds portfolio + GameFi later",
    ],
    featured: true,
  },
  {
    name: "Forever Mint",
    priceLabel: "TBD · open mint",
    description:
      "A always-on mint lane so the collection can keep growing toward the 5,555 cap after Genesis.",
    perks: [
      "Single-mint style",
      "Fair public access (planned)",
      "Same collection, later waves",
    ],
    featured: false,
  },
];

export default function MintPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <span className="badge">Mint · stub</span>
        <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
          Packs &amp; forever mint
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
          This page shows how minting will feel. Buttons are disabled on purpose
          — we have not connected contracts or MetaMask yet. When Base testnet
          is ready, you will buy packs here and open characters into your
          portfolio.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-neon-gold/25 bg-neon-gold/5 px-4 py-3 text-sm text-neon-gold">
        Coming soon — testnet. No wallet spend, no gas, no NFTs minted from this
        UI yet.
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {packs.map(function (pack) {
          return (
            <PackCard
              key={pack.name}
              name={pack.name}
              priceLabel={pack.priceLabel}
              description={pack.description}
              perks={pack.perks}
              featured={pack.featured}
            />
          );
        })}
      </div>

      <section className="panel mt-12 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          How minting will work (plain English)
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>Connect a wallet on Base testnet (MetaMask later).</li>
          <li>Pick a pack or forever-mint option.</li>
          <li>Pay with testnet tokens (fake money for learning).</li>
          <li>Your new character IDs show up in Portfolio.</li>
        </ol>
      </section>
    </div>
  );
}
