"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

type FormState = {
  reason: string;
  referral: string;
};

type XUser = { id: string; username: string; name: string };

type VerifyKey = "follow" | "like" | "retweet";

type VerifyState = {
  status: "idle" | "loading" | "ok" | "fail";
  detail: string;
};

const empty: FormState = { reason: "", referral: "" };

const emptyVerify: Record<VerifyKey, VerifyState> = {
  follow: { status: "idle", detail: "" },
  like: { status: "idle", detail: "" },
  retweet: { status: "idle", detail: "" },
};

export function WhitelistForm() {
  const { whitelist, assets, twitter } = site;
  const { playClick, playHover } = useAudio();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [values, setValues] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [xUser, setXUser] = useState<XUser | null>(null);
  const [xLoading, setXLoading] = useState(true);
  const [xConfigured, setXConfigured] = useState(true);
  const [xError, setXError] = useState("");
  const [verify, setVerify] = useState(emptyVerify);

  const allVerified = useMemo(
    () =>
      verify.follow.status === "ok" &&
      verify.like.status === "ok" &&
      verify.retweet.status === "ok",
    [verify],
  );

  const canSubmit = isConnected && !!xUser && allVerified && status !== "submitting";

  const refreshMe = useCallback(async () => {
    setXLoading(true);
    setXError("");
    try {
      const res = await fetch("/api/twitter/me", { credentials: "include" });
      if (res.status === 503) {
        setXConfigured(false);
        setXUser(null);
        return;
      }
      setXConfigured(true);
      if (!res.ok) {
        setXUser(null);
        return;
      }
      const data = await res.json();
      if (data?.user?.username) {
        setXUser(data.user as XUser);
      } else {
        setXUser(null);
      }
    } catch {
      setXUser(null);
    } finally {
      setXLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("twitter_error");
      if (err) {
        setXError(decodeURIComponent(err));
        params.delete("twitter_error");
        const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash || "#whitelist"}`;
        window.history.replaceState({}, "", next);
      }
    }
  }, [refreshMe]);

  function onChange(key: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function runVerify(action: VerifyKey) {
    playClick();
    setVerify((prev) => ({
      ...prev,
      [action]: { status: "loading", detail: "" },
    }));
    try {
      const res = await fetch("/api/twitter/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) {
        setXConfigured(false);
        setVerify((prev) => ({
          ...prev,
          [action]: { status: "fail", detail: data.error || whitelist.xNotConfigured },
        }));
        return;
      }
      if (!res.ok) {
        setVerify((prev) => ({
          ...prev,
          [action]: {
            status: "fail",
            detail: data.error || data.detail || "Verification failed",
          },
        }));
        return;
      }
      setVerify((prev) => ({
        ...prev,
        [action]: {
          status: data.verified ? "ok" : "fail",
          detail: data.detail || (data.verified ? whitelist.verifiedOk : "Not verified yet"),
        },
      }));
    } catch (err) {
      setVerify((prev) => ({
        ...prev,
        [action]: {
          status: "fail",
          detail: err instanceof Error ? err.message : "Verification failed",
        },
      }));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address || !xUser || !allVerified) return;
    setStatus("submitting");
    setErrorMsg("");
    playClick();

    const timestamp = new Date().toISOString();
    const twitterHandle = `@${xUser.username}`;
    const message = [
      "Nightfall City — Whitelist Application",
      "",
      `Wallet: ${address}`,
      `Twitter: ${twitterHandle}`,
      `Timestamp: ${timestamp}`,
      "",
      "Signing this proves you control this wallet. No transaction, no gas, no cost.",
    ].join("\n");

    try {
      const signature = await signMessageAsync({ message });

      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twitter: twitterHandle,
          wallet: address,
          reason: values.reason,
          referral: values.referral || undefined,
          message,
          signature,
          timestamp,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function reset() {
    playClick();
    setValues(empty);
    setStatus("idle");
    setErrorMsg("");
    setVerify(emptyVerify);
  }

  const followTarget = `@${twitter.targetUsername.replace(/^@/, "")}`;
  const tweetConfigured = Boolean(twitter.targetTweetId);

  const checklist: Array<{ key: VerifyKey; label: string; href?: string }> = [
    {
      key: "follow",
      label: `${whitelist.verifyFollowLabel} ${followTarget}`,
      href: `https://x.com/${twitter.targetUsername.replace(/^@/, "")}`,
    },
    {
      key: "like",
      label: whitelist.verifyLikeLabel,
      href: tweetConfigured ? `https://x.com/i/web/status/${twitter.targetTweetId}` : undefined,
    },
    {
      key: "retweet",
      label: whitelist.verifyRetweetLabel,
      href: tweetConfigured ? `https://x.com/i/web/status/${twitter.targetTweetId}` : undefined,
    },
  ];

  return (
    <section
      id={whitelist.id}
      className="relative mx-auto max-w-xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div
        className="neon-panel-frame neon-card neon-card-pink relative overflow-hidden p-6 sm:p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(8, 6, 18, 0.9), rgba(8, 6, 18, 0.94)), url(${assets.neonPanelWide})`,
        }}
      >
        <div className="relative z-10">
          <p className="font-pixel text-[10px] uppercase tracking-[0.3em] text-neon-cyan">
            {whitelist.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-wide text-white sm:text-3xl">
            {whitelist.title}
          </h2>
          <p className="mt-3 text-sm text-zinc-400">{whitelist.subtitle}</p>

          {status === "success" ? (
            <div className="mt-8 space-y-4 text-center">
              <p className="font-display text-xl text-neon-pink">{whitelist.successTitle}</p>
              <p className="text-sm text-zinc-300">{whitelist.successBody}</p>
              <button
                type="button"
                className="neon-btn-secondary mt-2"
                onClick={reset}
                onMouseEnter={playHover}
              >
                {whitelist.reset}
              </button>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.wallet.label}
                </span>
                <ConnectButton.Custom>
                  {({ account, openConnectModal, mounted }) => {
                    const connected = mounted && !!account;
                    return connected ? (
                      <div className="neon-input flex w-full items-center justify-between font-mono text-sm">
                        <span>{account!.displayName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-neon-cyan">
                          {whitelist.verifiedBadge}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="neon-btn-secondary w-full"
                        onClick={() => {
                          playClick();
                          openConnectModal();
                        }}
                        onMouseEnter={playHover}
                      >
                        {whitelist.connectCta}
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
                <p className="text-[11px] text-zinc-500">{whitelist.signatureHint}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.twitter.label}
                </span>
                {!xConfigured ? (
                  <p className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                    {whitelist.xNotConfigured}
                  </p>
                ) : xLoading ? (
                  <div className="neon-input text-sm text-zinc-500">Checking X session…</div>
                ) : xUser ? (
                  <div className="neon-input flex w-full items-center justify-between gap-3 text-sm">
                    <span className="font-mono text-neon-cyan">@{xUser.username}</span>
                    <span className="text-[10px] uppercase tracking-wider text-neon-cyan">
                      {whitelist.xConnectedBadge}
                    </span>
                  </div>
                ) : (
                  <a
                    href="/api/twitter/login"
                    className="neon-btn-secondary inline-flex w-full items-center justify-center"
                    onClick={playClick}
                    onMouseEnter={playHover}
                  >
                    {whitelist.connectXCta}
                  </a>
                )}
                {xError ? <p className="text-sm text-neon-pink">{xError}</p> : null}
              </div>

              {xUser ? (
                <div className="space-y-3 rounded border border-white/10 bg-black/30 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                    {whitelist.checklistHint}
                  </p>
                  {!tweetConfigured ? (
                    <p className="text-[11px] text-amber-300/90">
                      Target tweet ID is empty in content/site.ts — like/retweet checks will fail until set.
                    </p>
                  ) : null}
                  <ul className="space-y-2">
                    {checklist.map((item) => {
                      const state = verify[item.key];
                      return (
                        <li
                          key={item.key}
                          className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/5 px-2 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-zinc-200 underline-offset-2 hover:text-neon-pink hover:underline"
                                onClick={playClick}
                              >
                                {item.label}
                              </a>
                            ) : (
                              <span className="text-sm text-zinc-200">{item.label}</span>
                            )}
                            {state.detail ? (
                              <p
                                className={`mt-0.5 text-[11px] ${
                                  state.status === "ok" ? "text-neon-cyan" : "text-zinc-500"
                                }`}
                              >
                                {state.detail}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            disabled={state.status === "loading"}
                            className={`shrink-0 px-3 py-1 text-[11px] uppercase tracking-wider ${
                              state.status === "ok"
                                ? "text-neon-cyan"
                                : "neon-btn-secondary disabled:opacity-40"
                            }`}
                            onClick={() => runVerify(item.key)}
                            onMouseEnter={playHover}
                          >
                            {state.status === "loading"
                              ? whitelist.verifyingCta
                              : state.status === "ok"
                                ? whitelist.verifiedOk
                                : whitelist.verifyCta}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.reason.label}
                </span>
                <textarea
                  required
                  disabled={!isConnected}
                  name={whitelist.fields.reason.name}
                  value={values.reason}
                  onChange={(e) => onChange("reason", e.target.value)}
                  placeholder={whitelist.fields.reason.placeholder}
                  className="neon-input min-h-[96px] resize-y disabled:opacity-40"
                  maxLength={280}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.referral.label}
                </span>
                <input
                  disabled={!isConnected}
                  name={whitelist.fields.referral.name}
                  value={values.referral}
                  onChange={(e) => onChange("referral", e.target.value)}
                  placeholder={whitelist.fields.referral.placeholder}
                  className="neon-input disabled:opacity-40"
                />
              </label>

              {errorMsg ? <p className="text-sm text-neon-pink">{errorMsg}</p> : null}
              {!isConnected ? (
                <p className="text-center text-xs text-zinc-500">{whitelist.connectPrompt}</p>
              ) : !canSubmit ? (
                <p className="text-center text-xs text-zinc-500">{whitelist.submitBlocked}</p>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="neon-btn w-full disabled:cursor-not-allowed disabled:opacity-40"
                onMouseEnter={playHover}
              >
                {status === "submitting" ? whitelist.submitting : whitelist.submit}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-zinc-600">
                {whitelist.privacyNote}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
