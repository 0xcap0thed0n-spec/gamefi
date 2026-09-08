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

  /**
   * X / Twitter whitelist verification targets.
   * Required OAuth 2.0 scopes (set at developer.x.com, NOT here):
   *   tweet.read  users.read  follows.read  like.read  offline.access
   * Secrets live in env: TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET (optional),
   * TWITTER_CALLBACK_URL, TWITTER_SESSION_SECRET (optional).
   */
  twitter: {
    targetUsername: "NightfallCity", // placeholder — change to your real @handle (no @)
    targetTweetId: "", // placeholder — paste the tweet ID users must like + retweet
  },

  whitelist: {
    id: "whitelist",
    eyebrow: "ACCESS // WHITELIST",
    title: "Enter the Frequency",
    subtitle:
      "Connect your wallet and X account, verify the checklist, then send a short reason. Every application is signature-verified and reviewed by hand.",
    fields: {
      wallet: {
        label: "Wallet",
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
      referral: {
        label: "Referral (optional)",
        placeholder: "Who sent you?",
        name: "referral",
      },
    },
    connectPrompt: "Connect a wallet to apply.",
    connectCta: "Connect Wallet",
    connectXCta: "Connect X",
    reconnectXCta: "Reconnect X",
    xConnectedBadge: "Connected",
    xNotConfigured: "Twitter not configured — add keys in .env.local (see .env.example).",
    verifyFollowLabel: "Follow",
    verifyLikeLabel: "Like the announcement tweet",
    verifyRetweetLabel: "Retweet the announcement tweet",
    verifyCta: "Verify",
    verifyingCta: "Checking…",
    verifiedOk: "Verified",
    checklistHint: "Complete all three checks after connecting X.",
    verifiedBadge: "Connected",
    signatureHint: "We verify wallet ownership with a free signature — no transaction, no gas.",
    submit: "Transmit Signal",
    submitting: "Transmitting…",
    submitBlocked: "Connect X and verify follow, like, and retweet to submit.",
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
    blurb: "Nightfall City — stylish, mysterious, slightly dangerous. Not financial advice.",
    links: [
      { label: "Whitelist", href: "#whitelist" },
      { label: "Lore", href: "#lore" },
    ],
    credit: "Synthwave nights · CRT optional · Art & lore placeholders welcome",
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
    neonButton: "/images/neon-button-cyan.png",
    neonPanel: "/images/neon-panel-pink.png",
    neonPanelAlt: "/images/neon-panel-pink-alt.png",
    neonPanelWide: "/images/neon-panel-pink-wide.png",
    teaserGrid: "/images/teaser-grid.jpg",
  },
} as const;

export type SiteContent = typeof site;
export type RoadmapStatus = (typeof site.roadmap.items)[number]["status"];
