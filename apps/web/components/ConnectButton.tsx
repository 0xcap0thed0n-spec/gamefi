"use client";

import { useState } from "react";

/** Stub wallet connect — MetaMask + Base testnet will land later. */
export function ConnectButton(props: { className?: string }) {
  const className = props.className || "";
  const [clicked, setClicked] = useState(false);

  return (
    <div className={"relative " + className}>
      <button
        type="button"
        className="btn-secondary text-xs sm:text-sm"
        onClick={function () {
          setClicked(true);
        }}
        aria-describedby={clicked ? "connect-stub-hint" : undefined}
      >
        <span className="h-2 w-2 rounded-full bg-neon-gold/80" aria-hidden />
        Connect wallet
      </button>
      {clicked ? (
        <p
          id="connect-stub-hint"
          className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-neon-gold/30 bg-void-800 p-3 text-xs leading-relaxed text-zinc-300 shadow-lg"
          role="status"
        >
          Wallet connect is coming soon on Base testnet with MetaMask. This
          button is a placeholder — nothing is connected yet.
          <button
            type="button"
            className="mt-2 block text-neon-cyan hover:underline"
            onClick={function () {
              setClicked(false);
            }}
          >
            Got it
          </button>
        </p>
      ) : null}
    </div>
  );
}
