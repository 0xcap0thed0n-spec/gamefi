"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./ConnectButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/mint", label: "Mint" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-magenta to-neon-cyan font-display text-sm font-bold text-void-950 shadow-glow">
            555
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-wide text-white sm:inline">
            Genesis{" "}
            <span className="text-zinc-500 group-hover:text-neon-cyan">GameFi</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main">
          {links.map(function (link) {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const className = active
              ? "btn-ghost bg-white/10 text-neon-cyan"
              : "btn-ghost";
            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <ConnectButton />
      </div>
    </header>
  );
}
