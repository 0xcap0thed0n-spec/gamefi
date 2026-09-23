/**
 * Nightfall City — all user-facing copy in one place.
 * Swap lore / tagline / twitter targets here without hunting through components.
 */

export const site = {
  name: "Nightfall City",
  title: "NIGHTFALL CITY",
  tagline: "Neon streets. Stolen signals. One frequency left open.",
  description:
    "Nightfall City — an 80s retro cyberpunk NFT project. Synthwave nights, hot neon, and a whitelist for those who hear the frequency.",

  pressStart: {
    eyebrow: "NIGHTFALL CITY",
    title: "PRESS START",
    loadingLabel: "TUNING FREQUENCY",
    loadingSub: "SIGNAL LOCK…",
  },

  hero: {
    badge: "SIGNAL LIVE · WHITELIST OPEN",
    ctaPrimary: "",
    ctaPrimaryHref: "#whitelist",
    ctaSecondary: "Read the Lore",
    ctaSecondaryHref: "#lore",
  },

  lore: {
    id: "lore",
    eyebrow: "TRANSMISSION // LORE",
    title: "Nightfall City",
    image: "/images/lore-radio.jpg",
    imageAlt: "Gloved hand tuning a weathered radio under neon pink blinds",
    body: [
      "Nightfall City runs on corporate money and a government that stopped pretending to care. Underneath it, something else took root.",
      "Nobody agreed to call it the Syndicate. Nobody remembers when it started answering to the Don.",
      "Jobs go out over a frequency nobody else controls: the Relay, built from stolen tech and pointed back at the people who built it. Tune in at the right moment and you'll hear one. No names. No signature. Whoever answers takes what they can carry and vanishes before anyone official even hears about it.",
      "The money goes back into the blocks it was taken from.",
      "Nobody's seen the Don's face. Doesn't matter. Everybody knows the sound: static, a job, silence.",
      "The frequency's live. Are you listening?",
    ],
    note: "",
  },

  /**
   * X / Twitter OAuth targets for follow / like / retweet checks.
   * Leave empty until project @ + announcement tweet exist — UI shows placeholders.
   * OAuth secrets live in env: TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET (optional),
   * TWITTER_CALLBACK_URL, TWITTER_SESSION_SECRET (optional).
   */
  twitter: {
    targetUsername: "D_Render", // test account
    targetTweetId: "2098928097764483189", // https://x.com/D_Render/status/2098928097764483189
  },

  whitelist: {
    id: "whitelist",
    eyebrow: "ACCESS // WHITELIST",
    title: "",
    subtitle:
      "Drop your X handle, tell us why Nightfall, then paste your wallet. Applications are reviewed by hand.",
    fields: {
      wallet: {
        label: "Wallet address",
        placeholder: "0x…",
        name: "wallet",
      },
      twitter: {
        label: "X / Twitter",
        placeholder: "@nightfall",
        name: "twitter",
      },
      reason: {
        label: "Why Nightfall?",
        placeholder: "One short line — keep it sharp.",
        name: "reason",
      },
    },
    walletHint: "Paste a standard EVM address (0x + 40 hex). No wallet extension required.",
    walletInvalid: "Enter a valid 0x wallet address (40 hex characters).",
    handleHint: "Your public X username — with or without @.",
    handleInvalid: "Enter a valid X handle (letters, numbers, underscore).",
    connectXCta: "Connect X",
    xConnectedBadge: "Connected",
    social: {
      eyebrow: "SIGNAL // TASKS",
      title: "Boost the frequency",
      subtitle:
        "Enter your X handle, then Follow / Repost / Like + Comment.",
      comingSoon:
        "Project X + announcement tweet go live after art is locked. Open links light up here when targets are set.",
      followLabel: "Follow",
      likeLabel: "Like + Comment",
      retweetLabel: "Retweet",
      openCta: "Open",
      verifyCta: "Verify",
      verifyingCta: "Checking…",
      verifiedBadge: "Verified",
      needHandle: "Enter your X handle above first.",
      openedHint: "Opened",
      likeOpenOnlyHint: "On that post: like it, reply in the thread, then Verify.",
    },
    stepTasksNext: "Next",
    stepTasksNextBlocked: "Enter your handle and verify Follow, Repost, and Like + Comment first.",
    stepDetailsBack: "Back",
    stepDetailsEyebrow: "DETAILS // WALLET",
    submit: "Transmit Signal",
    submitting: "Transmitting...",
    submitBlocked: "Paste a valid wallet, X handle, and reason to submit.",
    successTitle: "Signal received.",
    successBody:
      "You're in the review queue. Applications are read by hand — if it's a match, you'll hear from us on the frequency you gave.",
    reset: "Send another",
    privacyNote:
      "We store your X handle, wallet, and message only to review whitelist applications. Never sold, never spammed.",
  },

  // Kept for optional future use / unused Roadmap.tsx — not rendered on the home page.
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

  teaser: {
    id: "teaser",
    eyebrow: "EARLY TRANSMISSION // CHARACTER STUDIES",
    title: "Some of them already made it out",
    caption: "Early character studies. Final art may differ.",
  },

  footer: {
    blurb: "",
    links: [
      { label: "Whitelist", href: "#whitelist" },
      { label: "Lore", href: "#lore" },
    ],
    credit: "Synthwave nights · CRT optional · Art & lore placeholders welcome",
  },

  menu: {
    openLabel: "MENU",
    closeLabel: "CLOSE",
    items: [
      { label: "Trait Forge", href: "/tools/trait-forge.html" },
      { label: "Whitelist", href: "#whitelist" },
      { label: "Lore", href: "#lore" },
    ],
  },

  audio: {
    muteLabel: "Play theme",
    unmuteLabel: "Mute theme",
    hint: "Ninjatheme3 · click play (browsers block autoplay)",
  },

  assets: {
    logo: "/images/logo-transparent.png",
    background: "/images/background-art-v2.jpeg",
    theme: "/audio/ninjatheme3.wav",
    loreRadio: "/images/lore-radio.jpg",
    neonButton: "/images/neon-button-cyan.png",
    neonPanel: "/images/neon-panel-pink.png",
    neonPanelAlt: "/images/neon-panel-pink-alt.png",
    neonPanelWide: "/images/neon-panel-pink-wide.png",
    teaserGrid: "/images/teaser-grid.jpg",
  },
} as const;

export type SiteContent = typeof site;
export type RoadmapStatus = (typeof site.roadmap.items)[number]["status"];
