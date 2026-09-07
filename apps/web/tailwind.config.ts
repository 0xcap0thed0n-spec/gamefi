import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#05040a",
          900: "#0a0814",
          800: "#12101c",
          700: "#1a1628",
        },
        neon: {
          pink: "#ff2d95",
          hot: "#ff006e",
          blue: "#3a86ff",
          cyan: "#00f5ff",
          purple: "#b967ff",
          magenta: "#e84aff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 245, 255, 0.18)",
        "glow-pink": "0 0 40px rgba(255, 45, 149, 0.28)",
        "glow-purple": "0 0 40px rgba(185, 103, 255, 0.22)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(0,245,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,45,149,0.05) 1px, transparent 1px)",
        "hero-radial":
          "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(255,45,149,0.28), transparent 55%), radial-gradient(ellipse 55% 40% at 85% 15%, rgba(0,245,255,0.14), transparent 50%), radial-gradient(ellipse 40% 30% at 10% 40%, rgba(185,103,255,0.12), transparent 50%)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.75" },
          "94%": { opacity: "1" },
          "96%": { opacity: "0.85" },
          "97%": { opacity: "1" },
        },
        "road-scroll": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 80px" },
        },
      },
      animation: {
        flicker: "flicker 4s infinite",
        "road-scroll": "road-scroll 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
