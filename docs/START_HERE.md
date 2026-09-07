# What you need to start building (no art required)

You can build and test almost everything with **placeholder metadata** and **testnet** funds.

## 1. Decide the chain (blocking)

Pick where contracts live. Strong options given the inspirations:

| Option | Why consider it |
|--------|------------------|
| **Hedera (testnet)** | Closest to DPGC pack/forever-mint success story; cheap fees |
| **EVM L2 (e.g. Base)** | Huge tooling (Foundry/Hardhat, wallets, indexers); easier hiring later |

Until this is decided, we still scaffold the repo; contract code stays chain-flavored stubs.

**Decision tracked in Issues → "Decide target chain + wallet stack".**

## 2. Accounts & wallets

- [ ] GitHub account (done)
- [ ] Dedicated **deployer** wallet (never reuse a daily-driver hot wallet long-term)
- [ ] Testnet faucet access for that chain
- [ ] Optional: second wallet to act as a "player" for integration tests

## 3. Tooling (install when Phase 0 kicks off)

Depends slightly on chain, but typically:

- Node.js LTS + package manager (`pnpm` recommended for a monorepo)
- Contract toolkit (Foundry **or** Hardhat for EVM; Hedera SDK / Hardhat Hedera plugins if Hedera)
- Wallet for testnet (HashPack / Blade on Hedera; MetaMask / Rabby on EVM)

## 4. What we build first (order)

1. **Placeholder collection metadata** (traits + JSON, colored squares as images)
2. **NFT contract** on testnet (555 supply cap for Genesis)
3. **Pack / mint contract** (buy pack → reveal / assign characters)
4. **Minimal dashboard** — connect wallet, list owned token IDs + traits
5. **Thin GameFi stub** — one on-chain or indexed action that proves "utility" (e.g. stake / assign to quest)

## 5. Explicitly not needed yet

- Final artwork or 3D models
- Mainnet deploy
- Full game client
- Token listing / liquidity
- Audit (comes before mainnet, not before testnet learning)
