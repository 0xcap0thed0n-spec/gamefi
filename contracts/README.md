# Contracts

On-chain pieces for 555 Genesis.

## Planned modules

| Module | Role |
|--------|------|
| `Nft` | Genesis character collection (cap 555 for v1; path to 5,555) |
| `PackMint` | Pack purchase / forever-mint style distribution |
| `Game` (stub) | Minimal utility hook (quest assign, stake, or similar) |

## Status

Scaffold only. Chain + toolkit choice lives in Phase 0.

## Testnet-first rules

- No mainnet keys in this repo
- Use `.env.example` for required vars; never commit secrets
- Prefer deterministic tests with placeholder metadata
