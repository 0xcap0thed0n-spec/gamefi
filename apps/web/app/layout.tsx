import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { AudioProvider } from "@/components/AudioProvider";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
import { FixedBackground } from "@/components/FixedBackground";
import { Footer } from "@/components/Footer";
import { PressStartGate } from "@/components/PressStartGate";
import { site } from "@/content/site";
import "./globals.css";

/** Single pixel face for the whole UI (display / body / pixel aliases). */
const pixel = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400"],
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
    <html lang="en" className={pixel.variable}>
      <body className="flex min-h-screen flex-col bg-transparent font-pixel">
        <style
          id="nf-boot-critical"
          dangerouslySetInnerHTML={{
            __html:
              "html:not(.nf-booted) main,html:not(.nf-booted) footer{visibility:hidden!important;pointer-events:none!important}" +
              "#nf-boot-veil{position:fixed;inset:0;z-index:70;background:#05040a}" +
              "html.nf-booted #nf-boot-veil{display:none}",
          }}
        />
        <div id="nf-boot-veil" aria-hidden />
        <AudioProvider>
          <FixedBackground />
          <ScanlineOverlay />
          <PressStartGate />
          <main className="relative z-10 flex-1">{props.children}</main>
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
