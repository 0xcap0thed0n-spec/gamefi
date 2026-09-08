"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

type FormState = {
  wallet: string;
  reason: string;
  referral: string;
};

type XUser = { id: string; username: string; name: string };

const empty: FormState = { wallet: "", reason: "", referral: "" };

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export function WhitelistForm() {
  const { whitelist, assets } = site;
  const { playClick, playHover } = useAudio();

  const [values, setValues] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [xUser, setXUser] = useState<XUser | null>(null);
  const [xLoading, setXLoading] = useState(true);
  const [xConfigured, setXConfigured] = useState(true);
  const [xError, setXError] = useState("");

  const walletOk = WALLET_RE.test(values.wallet.trim());
  const canSubmit =
    walletOk && !!xUser && values.reason.trim().length > 0 && status !== "submitting";

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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!walletOk || !xUser || !values.reason.trim()) return;
    setStatus("submitting");
    setErrorMsg("");
    playClick();

    const twitterHandle = `@${xUser.username}`;

    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twitter: twitterHandle,
          wallet: values.wallet.trim(),
          reason: values.reason,
          referral: values.referral || undefined,
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
  }

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
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.wallet.label}
                </span>
                <input
                  required
                  name={whitelist.fields.wallet.name}
                  value={values.wallet}
                  onChange={(e) => onChange("wallet", e.target.value)}
                  placeholder={whitelist.fields.wallet.placeholder}
                  className="neon-input font-mono text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
                {values.wallet && !walletOk ? (
                  <p className="text-[11px] text-neon-pink">{whitelist.walletInvalid}</p>
                ) : (
                  <p className="text-[11px] text-zinc-500">{whitelist.walletHint}</p>
                )}
              </label>

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

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.reason.label}
                </span>
                <textarea
                  required
                  name={whitelist.fields.reason.name}
                  value={values.reason}
                  onChange={(e) => onChange("reason", e.target.value)}
                  placeholder={whitelist.fields.reason.placeholder}
                  className="neon-input min-h-[96px] resize-y"
                  maxLength={280}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.referral.label}
                </span>
                <input
                  name={whitelist.fields.referral.name}
                  value={values.referral}
                  onChange={(e) => onChange("referral", e.target.value)}
                  placeholder={whitelist.fields.referral.placeholder}
                  className="neon-input"
                />
              </label>

              {errorMsg ? <p className="text-sm text-neon-pink">{errorMsg}</p> : null}
              {!canSubmit && status !== "submitting" ? (
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
