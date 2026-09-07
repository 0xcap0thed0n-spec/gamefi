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

## Repo layout

```
contracts/          # NFT, pack/mint, game economy (testnet first)
apps/
  dashboard/        # Trading / portfolio UI
  game/             # GameFi client
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
