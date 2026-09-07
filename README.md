# Nightfall City

80s retro cyberpunk NFT project monorepo — Hotline Miami / synthwave aesthetic, whitelist-first public site, contracts and tooling around it.

| Drop | Status |
|------|--------|
| Whitelist signal | **Live on site** |
| Lore / art | Placeholders — swap in `apps/web/content/site.ts` |
| Mint | Coming soon |

## What we are building

1. **Nightfall City public site** — single-page synthwave landing: hero, lore, whitelist form, roadmap teaser.
2. **NFT drop + mint** — art and on-chain mint come after the frequency is locked.
3. **City utilities** — holder perks / transmissions (TBD).

Art and final lore can land later. The site shell is SPA-first.

## Website (apps/web)

The public site lives in `apps/web/` (Next.js 15 App Router + TypeScript + Tailwind).

| Route | What it is |
|-------|------------|
| `/` | Nightfall City single page — hero, lore, whitelist, roadmap, footer |
| `/mint` | Redirects to `/` (legacy GameFi route) |
| `/portfolio` | Redirects to `/` (legacy GameFi route) |

Whitelist is **client-side only** for now (`console.log` + success UI). Structure is ready for a real backend later.

Copy, roadmap items, and lore placeholders live in `apps/web/content/site.ts`.

### Run the site locally

You need **Node.js 20+** and [pnpm](https://pnpm.io/installation).

```bash
# from the repo root (e.g. E:\\Projects\\555-genesis)
git pull
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
contracts/          # NFT / mint / economy (testnet first)
apps/
  web/              # Nightfall City public site (Next.js SPA landing)
  dashboard/        # Future
  game/             # Future
packages/
  shared/           # Types, ABIs, shared config
metadata/
  placeholders/     # Temporary traits / JSON (no final art)
docs/               # Vision, references, start checklist
```

## Phases

| Phase | Focus |
|-------|--------|
| **0** | Site shell + whitelist signal (this) |
| **1** | Final lore + art direction |
| **2** | Mint / contracts on testnet |
| **3** | Drop + holder utilities |

See open [Issues](../../issues) for the working backlog.

## Start here

Read [`docs/START_HERE.md`](docs/START_HERE.md) for what you need before writing code.
More vision detail: [`docs/VISION.md`](docs/VISION.md).
