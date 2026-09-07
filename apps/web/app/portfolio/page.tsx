import type { Metadata } from "next";
import { ConnectButton } from "@/components/ConnectButton";
import { NftCard } from "@/components/NftCard";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View your 555 Genesis holdings — placeholder cards until wallet connect.",
};

const placeholders = [
  {
    id: 7,
    name: "Vex Runner",
    rarity: "Rare",
    role: "Scout",
    accent: "#2ee6d6",
  },
  {
    id: 42,
    name: "Nyx Blade",
    rarity: "Epic",
    role: "Assassin",
    accent: "#e84aff",
  },
  {
    id: 108,
    name: "Orbit Medic",
    rarity: "Uncommon",
    role: "Support",
    accent: "#a8ff60",
  },
  {
    id: 255,
    name: "Goldline Tank",
    rarity: "Legendary",
    role: "Guardian",
    accent: "#f5c542",
  },
  {
    id: 301,
    name: "Drift Hacker",
    rarity: "Rare",
    role: "Tech",
    accent: "#60a5fa",
  },
  {
    id: 555,
    name: "Genesis Prime",
    rarity: "Genesis",
    role: "Founder",
    accent: "#fb7185",
  },
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="badge">Portfolio · stub</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Your holdings
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            After you mint, your characters will list here. Right now these are
            fake placeholder cards so we can design the layout before wallets
            and contracts are live.
          </p>
        </div>
        <ConnectButton />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Owned</p>
          <p className="mt-1 font-display text-2xl font-bold text-neon-cyan">
            6
          </p>
          <p className="text-xs text-zinc-500">placeholder NFTs</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            Floor (demo)
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-neon-gold">
            —
          </p>
          <p className="text-xs text-zinc-500">no market yet</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500">Network</p>
          <p className="mt-1 font-display text-2xl font-bold text-neon-magenta">
            Base
          </p>
          <p className="text-xs text-zinc-500">testnet (planned)</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map(function (nft) {
          return (
            <NftCard
              key={nft.id}
              id={nft.id}
              name={nft.name}
              rarity={nft.rarity}
              role={nft.role}
              accent={nft.accent}
            />
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Connect wallet is a stub. Real ownership reads will use your NFT
        contract address from env once deployed.
      </p>
    </div>
  );
}
