/**
 * Nightfall City — all user-facing copy in one place.
 * Swap lore / roadmap / tagline here without hunting through components.
 */

export const site = {
  name: "Nightfall City",
  title: "NIGHTFALL CITY",
  tagline: "Neon streets. Stolen signals. One frequency left open.",
  description:
    "Nightfall City — an 80s retro cyberpunk NFT project. Synthwave nights, hot neon, and a whitelist for those who hear the frequency.",

  hero: {
    badge: "SIGNAL LIVE · WHITELIST OPEN",
    ctaPrimary: "Enter the Frequency",
    ctaPrimaryHref: "#whitelist",
    ctaSecondary: "Read the Lore",
    ctaSecondaryHref: "#lore",
  },

  lore: {
    id: "lore",
    eyebrow: "TRANSMISSION // LORE",
    title: "The city never sleeps. It only flickers.",
    /**
     * PLACEHOLDER — replace with final lore copy when ready.
     * Keep the marker comments so the swap is obvious.
     */
    body: [
      /* === LORE PLACEHOLDER START === */
      "After midnight the grid bleeds pink and cyan. Somewhere under the wet asphalt, a pirate radio still broadcasts coordinates only certain wallets can decode.",
      "Nightfall City is that broadcast made flesh — a retro cyberpunk NFT drop wrapped in Hotline Miami heat and synthwave dread. Collectors don't just mint. They tune in.",
      "Exact story beats, faction names, and drop mechanics are still under blackout. This paragraph is temporary filler — swap it when the real lore lands.",
      /* === LORE PLACEHOLDER END === */
    ],
    note: "PLACEHOLDER COPY — replace body strings in content/site.ts",
  },

  whitelist: {
    id: "whitelist",
    eyebrow: "ACCESS // WHITELIST",
    title: "Enter the Frequency",
    subtitle:
      "Drop your handle, wallet, and a short reason. Client-side only for now — ready to wire to a real backend later.",
    fields: {
      twitter: {
        label: "Twitter / X handle",
        placeholder: "@nightfall",
        name: "twitter",
      },
      wallet: {
        label: "Wallet address",
        placeholder: "0x\u2026",
        name: "wallet",
      },
      reason: {
        label: "Why Nightfall?",
        placeholder: "One short line \u2014 keep it sharp.",
        name: "reason",
      },
    },
    submit: "Transmit Signal",
    submitting: "Transmitting\u2026",
    successTitle: "Signal received.",
    successBody:
      "You're on the local frequency list. When backend wiring lands, this will sync for real. For now we logged your payload to the console.",
    reset: "Send another",
  },

  roadmap: {
    id: "roadmap",
    eyebrow: "TIMELINE // COMING SOON",
    title: "Roadmap teaser",
    subtitle: "Hard dates TBD. Soft promises only \u2014 the city lies until it doesn't.",
    items: [
      {
        phase: "01",
        title: "Frequency open",
        blurb: "Landing page, whitelist signal, aesthetic lock-in.",
        status: "live" as const,
      },
      {
        phase: "02",
        title: "Lore drop",
        blurb: "Full story bible, factions, and city districts revealed.",
        status: "soon" as const,
      },
      {
        phase: "03",
        title: "Art & mint",
        blurb: "Final art, mint UI, and on-chain drop (details TBD).",
        status: "soon" as const,
      },
      {
        phase: "04",
        title: "City utilities",
        blurb: "Holder perks, transmissions, and whatever comes after midnight.",
        status: "soon" as const,
      },
    ],
  },

  footer: {
    blurb: "Nightfall City \u2014 stylish, mysterious, slightly dangerous. Not financial advice.",
    links: [
      { label: "Whitelist", href: "#whitelist" },
      { label: "Lore", href: "#lore" },
      { label: "Roadmap", href: "#roadmap" },
      {
        label: "GitHub",
        href: "https://github.com/0xcap0thed0n-spec/gamefi",
        external: true,
      },
    ],
    credit: "Synthwave nights \u00b7 CRT optional \u00b7 Art & lore placeholders welcome",
  },

  audio: {
    muteLabel: "Unmute ambience",
    unmuteLabel: "Mute ambience",
    hint: "Arcade clicks on \u00b7 ambient off by default",
  },
} as const;

export type SiteContent = typeof site;
export type RoadmapStatus = (typeof site.roadmap.items)[number]["status"];
