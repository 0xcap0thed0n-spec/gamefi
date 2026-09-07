# @555-genesis/web — Nightfall City

Next.js App Router single-page site for **Nightfall City** — synthwave / Hotline Miami aesthetic, lore placeholder, whitelist form, roadmap teaser.

## Run locally

From the **repo root** (recommended):

```bash
git pull
pnpm install
pnpm dev
```

Or from this folder:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

| Path | Purpose |
|------|---------|
| `content/site.ts` | All user-facing strings, lore placeholder, roadmap |
| `components/Hero.tsx` | Title, tagline, CTAs, mute toggle |
| `components/Lore.tsx` | Lore blurb (placeholder marked) |
| `components/WhitelistForm.tsx` | Client-side whitelist form |
| `components/Roadmap.tsx` | Coming-soon teaser cards |
| `components/Footer.tsx` | Simple footer |
| `components/ScanlineOverlay.tsx` | CRT scanlines / grain / vignette |
| `components/AudioProvider.tsx` | Web Audio beeps + optional ambient |
| `app/page.tsx` | Composes the single page |
| `app/layout.tsx` | Metadata, fonts, providers |

Legacy `/mint` and `/portfolio` redirect to `/`.

## Editing copy

Swap tagline, lore, and roadmap in `content/site.ts` — look for `LORE PLACEHOLDER` markers.
