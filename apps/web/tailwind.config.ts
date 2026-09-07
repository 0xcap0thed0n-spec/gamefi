import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#07060b",
          900: "#0c0a12",
          800: "#14101f",
          700: "#1c1629",
        },
        neon: {
          cyan: "#2ee6d6",
          magenta: "#e84aff",
          gold: "#f5c542",
          lime: "#a8ff60",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(46, 230, 214, 0.15)",
        "glow-magenta": "0 0 40px rgba(232, 74, 255, 0.18)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(46,230,214,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,230,214,0.06) 1px, transparent 1px)",
        "hero-radial":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,74,255,0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(46,230,214,0.12), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
