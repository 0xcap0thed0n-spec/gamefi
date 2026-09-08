import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { robinhoodTestnet, robinhoodMainnet } from "./chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Nightfall City",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "REPLACE_ME",
  chains: [robinhoodTestnet, robinhoodMainnet],
  ssr: true,
});
