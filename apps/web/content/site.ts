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
    title: "Nightfall City",
    body: [
      "The city never left the 80s.",
      "Neon still bleeds across wet streets. The radio still spits static and coded jobs. When the frequency opens, freelancers answer.",
      "No names. No loyalties. Just the contract, the risk, and whatever's left when the night ends. Welcome to Nightfall City.",
    ],
    note: "",
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
        placeholder: "0x…",
        name: "wallet",
      },
      reason: {
        label: "Why Nightfall?",
        placeholder: "One short line — keep it sharp.",
        name: "reason",
      },
    },
    submit: "Transmit Signal",
    submitting: "Transmitting…",
    successTitle: "Signal received.",
    successBody:
      "You're on the local frequency list. When backend wiring lands, this will sync for real. For now we logged your payload to the console.",
    reset: "Send another",
  },

  roadmap: {
    id: "roadmap",
    eyebrow: "TIMELINE // COMING SOON",
    title: "Roadmap teaser",
    subtitle: "Hard dates TBD. Soft promises only — the city lies until it doesn't.",
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
    blurb: "Nightfall City — stylish, mysterious, slightly dangerous. Not financial advice.",
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
    credit: "Synthwave nights · CRT optional · Art & lore placeholders welcome",
  },

  audio: {
    muteLabel: "Play theme",
    unmuteLabel: "Mute theme",
    hint: "Ninjatheme3 · click play (browsers block autoplay)",
  },

  assets: {
    logo: "/images/logo.jpg",
    theme: "/audio/ninjatheme3.wav",
    neonButton: "/images/neon-button-cyan.png",
    neonPanel: "/images/neon-panel-pink.png",
    neonPanelAlt: "/images/neon-panel-pink-alt.png",
    neonPanelWide: "/images/neon-panel-pink-wide.png",
  },
} as const;

export type SiteContent = typeof site;
export type RoadmapStatus = (typeof site.roadmap.items)[number]["status"];
