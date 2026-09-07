# 555 Genesis

GameFi NFT collection with on-chain utility.

| Drop | Supply |
|------|--------|
| Genesis characters | **555** |
| Full release | **5,000** |
| **Total** | **5,555** |

## What we're building

1. **NFT + pack / forever-mint mechanics** — inspired by Dead Pixels Ghost Club packs, with GameFi DNA from DeFi Kingdoms and The Remnants / The Heist.
2. **Trading / portfolio dashboard** — holdings, activity, and portfolio view for collectors.
3. **GameFi utility** — the characters actually do something in-game (economy + gameplay loop).

Art can come later. Utility and contracts start on **testnet** first.

## Website (apps/web)

The first site shell lives in `apps/web/` (Next.js App Router + TypeScript + Tailwind).

| Route | What it is |
|-------|------------|
| `/` | Landing — pitch, supply table, CTAs |
| `/mint` | Pack / forever-mint UI (**Coming soon — testnet**) |
| `/portfolio` | Holdings UI with placeholder NFT cards |

Wallet **Connect** is a stub. MetaMask + Base testnet wiring comes later.

### Run the site locally

You need **Node.js 20+** and [pnpm](https://pnpm.io/installation).

```bash
# from the repo root
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful scripts:

```bash
pnpm build      # production build for apps/web
pnpm start      # serve the production build
pnpm web:dev    # same as pnpm dev
```

Copy env examples when you start wiring chain config:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
```

## Repo layout

```
contracts/          # NFT, pack/mint, game economy (testnet first)
apps/
  web/              # Public site — landing, mint, portfolio (Next.js)
  dashboard/        # Trading / portfolio UI (future)
  game/             # GameFi client (future)
packages/
  shared/           # Types, ABIs, shared config
metadata/
  placeholders/     # Temporary traits / JSON (no final art)
docs/               # Vision, references, start checklist
```

## Phases

| Phase | Focus |
|-------|--------|
| **0** | Foundations — chain, wallets, testnet, tooling |
| **1** | NFT + pack / mint contracts |
| **2** | Portfolio / trading dashboard |
| **3** | GameFi gameplay loop |
| **4** | Genesis 555 drop |
| **5** | Expansion toward 5,555 |

See open [Issues](../../issues) for the working backlog.

## Start here

Read [`docs/START_HERE.md`](docs/START_HERE.md) for what you need before writing code.
More vision detail: [`docs/VISION.md`](docs/VISION.md).
