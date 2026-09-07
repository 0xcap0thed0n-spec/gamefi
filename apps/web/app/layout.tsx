import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "555 Genesis | GameFi NFT",
    template: "%s | 555 Genesis",
  },
  description:
    "555 Genesis characters with GameFi utility. Mint packs, view your portfolio, and play — starting on Base testnet.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable + " " + body.variable}>
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}
