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

const siteUrl = "https://nightfallcity.vercel.app";
const shareImage = `${siteUrl}/images/logo.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | Retro Cyberpunk NFT`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} | Retro Cyberpunk NFT`,
    description: site.description,
    images: [
      {
        url: shareImage,
        alt: `${site.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Retro Cyberpunk NFT`,
    description: site.description,
    images: [shareImage],
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className={pixel.variable}>
      <body className="flex min-h-screen flex-col bg-transparent font-pixel">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var q=location.search||'';var oauth=q.indexOf('twitter_error=')!==-1||q.indexOf('twitter=')!==-1||sessionStorage.getItem('nf_oauth_return')==='1';var entered=sessionStorage.getItem('nf_press_start_done')==='1';if(oauth)sessionStorage.removeItem('nf_oauth_return');if(oauth||entered){document.documentElement.classList.add('nf-booted');}}catch(e){}})();",
          }}
        />
        <style
          id="nf-boot-critical"
          dangerouslySetInnerHTML={{
            __html:
              "html:not(.nf-booted) main,html:not(.nf-booted) footer{visibility:hidden!important;pointer-events:none!important}" +
              "#nf-boot-veil{position:fixed;inset:0;z-index:70;background:#05040a}" +
              "html.nf-booted #nf-boot-veil{display:none}" +
              "html.nf-booted .press-start-gate{display:none!important;pointer-events:none!important}",
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
