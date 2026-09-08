# @555-genesis/web - Nightfall City

Next.js App Router single-page site for **Nightfall City** - synthwave aesthetic, lore placeholder, wallet + X-verified whitelist.

## Run locally

From the **repo root** (recommended):

```bash
git pull
pnm install
pnm dev
```

Or from this folder:

```bash
pnm install
pnm dev
```

Open http://localhost:3000

Copy `.env.example` to `.env.local` and fill secrets before enabling X connect or whitelist persistence.

## Structure

| Path | Purpose |
|------|--------|
| `content/site.ts` | Copy + X verify targets (`twitter.targetUsername`, `twitter.targetTweetId`) |
| `components/Hero.tsx` | Title, tagline, CTAs, mute toggle |
| `components/Lore.tsx` | Lore blurb |
| `components/WhitelistForm.tsx` | Wallet, X OAuth, follow/like/retweet verify, submit |
| `components/Teaser.tsx` | Character study grid |
| `components/Footer.tsx` | Footer links from `site.footer` |
| `app/api/twitter/*` | OAuth 2.0 PKCE login/callback + /me + /verify |
| `app/api/whitelist` | Signature-checked whitelist submissions |
| `app/page.tsx` | Composes the single page |

Legacy `/mint` and `/portfolio` redirect to `/`. Roadmap is removed from the page (Roadmap.tsx may remain unused).

## X / Twitter whitelist verify

1. Create an app at https://developer.x.com
2. OAuth 2.0 + PKCE; callback URL must match `TWITTER_CALLBACK_URL`
3. Scopes: `tweet.read users.read follows.read like.read offline.access`
4. Set env vars from `.env.example`
5. Edit `content/site.ts` -> `twitter.targetUsername` and `twitter.targetTweetId`

If env vars are missing, `/api/twitter/*` returns 503 and the UI shows a friendly not-configured message.

## Editing copy

Swap taglane, lore, and X targets in `content/site.ts`.
