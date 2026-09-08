import type { Metadata } from "next";
import { Orbitron, Press_Start_2P, Inter } from "next/font/google";
import { Providers } from "./providers";
import { AudioProvider } from "@/components/AudioProvider";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { FixedBackground } from "@/components/FixedBackground";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import "./globals.css";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const pixel = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Retro Cyberpunk NFT`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${pixel.variable} ${body.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-transparent">
        <Providers>
          <AudioProvider>
            <FixedBackground />
            <ScanlineOverlay />
            <main className="relative z-10 flex-1">{props.children}</main>
            <Footer />
          </AudioProvider>
        </Providers>
      </body>
    </html>
  );
}
