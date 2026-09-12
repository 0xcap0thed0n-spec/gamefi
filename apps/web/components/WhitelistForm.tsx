"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

type FormState = {
  wallet: string;
  reason: string;
  referral: string;
};

type XUser = { id: string; username: string; name: string };

type SocialAction = "follow" | "retweet" | "like";

type TaskState = {
  verified: boolean;
  detail: string;
  busy: boolean;
  opened: boolean;
};

const empty: FormState = { wallet: "", reason: "", referral: "" };

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

const emptyTask = (): TaskState => ({
  verified: false,
  detail: "",
  busy: false,
  opened: false,
});

export function WhitelistForm() {
  const { whitelist, assets, twitter } = site;
  const { playClick, playHover } = useAudio();

  const [values, setValues] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [xUser, setXUser] = useState<XUser | null>(null);
  const [xLoading, setXLoading] = useState(true);
  const [xConfigured, setXConfigured] = useState(true);
  const [xError, setXError] = useState("");

  const [tasks, setTasks] = useState<Record<SocialAction, TaskState>>({
    follow: emptyTask(),
    retweet: emptyTask(),
    like: emptyTask(),
  });

  const targetUsername = twitter.targetUsername.replace(/^@/, "");
  const targetTweetId = twitter.targetTweetId.trim();
  const followReady = Boolean(targetUsername);
  const tweetReady = Boolean(targetTweetId);
  const socialLive = followReady || tweetReady;

  const walletOk = WALLET_RE.test(values.wallet.trim());
  const canSubmit =
    walletOk && !!xUser && values.reason.trim().length > 0 && status !== "submitting";

  const socialRows = useMemo(
    () =>
      [
        {
          action: "follow" as const,
          label: whitelist.social.followLabel,
          ready: followReady,
          openHref: followReady
            ? `https://x.com/intent/follow?screen_name=${encodeURIComponent(targetUsername)}`
            : null,
          hint: followReady ? `@${targetUsername}` : "@…",
        },
        {
          action: "retweet" as const,
          label: whitelist.social.retweetLabel,
          ready: tweetReady,
          openHref: tweetReady
            ? `https://x.com/intent/retweet?tweet_id=${encodeURIComponent(targetTweetId)}`
            : null,
          hint: "post",
        },
        {
          action: "like" as const,
          label: whitelist.social.likeLabel,
          ready: tweetReady,
          openHref: tweetReady
            ? `https://x.com/intent/like?tweet_id=${encodeURIComponent(targetTweetId)}`
            : null,
          hint: "post",
        },
      ] as const,
    [followReady, targetTweetId, targetUsername, tweetReady, whitelist.social],
  );

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

  function markOpened(action: SocialAction) {
    playClick();
    setTasks((prev) => ({ ...prev, [action]: { ...prev[action], opened: true } }));
  }

  async function verifyAction(action: SocialAction) {
    if (!xUser) {
      setXError(whitelist.social.needConnect);
      return;
    }
    playClick();
    setTasks((prev) => ({
      ...prev,
      [action]: { ...prev[action], busy: true, detail: "" },
    }));
    try {
      const res = await fetch("/api/twitter/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      const payload = await res.json().catch(() => ({}));
      const detail =
        (typeof payload.detail === "string" && payload.detail) ||
        (typeof payload.error === "string" && payload.error) ||
        (res.ok ? "Done" : "Verification failed");
      const verified = Boolean(payload.verified);
      setTasks((prev) => ({
        ...prev,
        [action]: {
          ...prev[action],
          busy: false,
          verified,
          detail,
        },
      }));
    } catch (err) {
      setTasks((prev) => ({
        ...prev,
        [action]: {
          ...prev[action],
          busy: false,
          verified: false,
          detail: err instanceof Error ? err.message : "Verification failed",
        },
      }));
    }
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
    setTasks({
      follow: emptyTask(),
      retweet: emptyTask(),
      like: emptyTask(),
    });
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
          <p className="text-[8px] uppercase tracking-[0.3em] text-neon-cyan">
            {whitelist.eyebrow}
          </p>
          <h2 className="mt-4 text-sm uppercase tracking-wide text-white sm:text-base">
            {whitelist.title}
          </h2>
          <p className="mt-3 text-[8px] leading-relaxed text-zinc-400 sm:text-[9px]">
            {whitelist.subtitle}
          </p>

          {status === "success" ? (
            <div className="mt-8 space-y-4 text-center">
              <p className="text-sm text-neon-pink">{whitelist.successTitle}</p>
              <p className="text-[8px] leading-relaxed text-zinc-300 sm:text-[9px]">
                {whitelist.successBody}
              </p>
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
                <span className="text-[8px] uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.wallet.label}
                </span>
                <input
                  required
                  name={whitelist.fields.wallet.name}
                  value={values.wallet}
                  onChange={(e) => onChange("wallet", e.target.value)}
                  placeholder={whitelist.fields.wallet.placeholder}
                  className="neon-input"
                  autoComplete="off"
                  spellCheck={false}
                />
                {values.wallet && !walletOk ? (
                  <p className="text-[8px] text-neon-pink">{whitelist.walletInvalid}</p>
                ) : (
                  <p className="text-[7px] leading-relaxed text-zinc-500">{whitelist.walletHint}</p>
                )}
              </label>

              <div className="space-y-2">
                <span className="text-[8px] uppercase tracking-wider text-zinc-400">
                  {whitelist.fields.twitter.label}
                </span>
                {!xConfigured ? (
                  <p className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[8px] text-amber-200">
                    {whitelist.xNotConfigured}
                  </p>
                ) : xLoading ? (
                  <div className="neon-input text-zinc-500">Checking X session...</div>
                ) : xUser ? (
                  <div className="neon-input flex w-full items-center justify-between gap-3">
                    <span className="text-neon-cyan">@{xUser.username}</span>
                    <span className="text-[7px] uppercase tracking-wider text-neon-cyan">
                      {whitelist.xConnectedBadge}
                    </span>
                  </div>
                ) : (
                  <a
                    href="/api/twitter/login"
                    onClick={() => {
                      try {
                        sessionStorage.setItem("nf_oauth_return", "1");
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="neon-btn-secondary inline-flex w-full items-center justify-center"
                    onClick={playClick}
                    onMouseEnter={playHover}
                  >
                    {whitelist.connectXCta}
                  </a>
                )}
                {xError ? <p className="text-[8px] text-neon-pink">{xError}</p> : null}
              </div>

              <div className="space-y-3 rounded-sm border border-neon-cyan/20 bg-black/30 p-3 sm:p-4">
                <div>
                  <p className="text-[7px] uppercase tracking-[0.28em] text-neon-cyan">
                    {whitelist.social.eyebrow}
                  </p>
                  <p className="mt-2 text-[9px] uppercase text-white">{whitelist.social.title}</p>
                  <p className="mt-2 text-[7px] leading-relaxed text-zinc-500">
                    {whitelist.social.subtitle}
                  </p>
                </div>

                {!socialLive ? (
                  <p className="rounded-sm border border-zinc-700/60 bg-zinc-900/50 px-3 py-2 text-[7px] leading-relaxed text-zinc-400">
                    {whitelist.social.comingSoon}
                  </p>
                ) : null}

                <ul className="space-y-2">
                  {socialRows.map((row) => {
                    const state = tasks[row.action];
                    const canVerify = Boolean(xUser) && row.ready && !state.busy;
                    return (
                      <li
                        key={row.action}
                        className="rounded-sm border border-zinc-700/50 bg-zinc-950/40 px-3 py-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[8px] uppercase tracking-wider text-zinc-200">
                              {row.label}{" "}
                              <span className="normal-case tracking-normal text-neon-cyan">
                                {row.hint}
                              </span>
                            </p>
                            {state.verified ? (
                              <p className="mt-1 text-[7px] uppercase tracking-wider text-neon-cyan">
                                {whitelist.social.verifiedBadge}
                              </p>
                            ) : state.detail ? (
                              <p className="mt-1 text-[7px] text-neon-pink">{state.detail}</p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {row.openHref ? (
                              <a
                                href={row.openHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="neon-btn-secondary px-3 py-1.5 text-[7px]"
                                onClick={() => markOpened(row.action)}
                                onMouseEnter={playHover}
                              >
                                {whitelist.social.openCta}
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="neon-btn-secondary px-3 py-1.5 text-[7px] opacity-40"
                              >
                                {whitelist.social.openCta}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={!canVerify || state.verified}
                              className="neon-btn px-3 py-1.5 text-[7px] disabled:cursor-not-allowed disabled:opacity-40"
                              onClick={() => void verifyAction(row.action)}
                              onMouseEnter={playHover}
                            >
                              {state.busy
                                ? whitelist.social.verifyingCta
                                : state.verified
                                  ? whitelist.social.verifiedBadge
                                  : whitelist.social.verifyCta}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <label className="block space-y-2">
                <span className="text-[8px] uppercase tracking-wider text-zinc-400">
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
                <span className="text-[8px] uppercase tracking-wider text-zinc-400">
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

              {errorMsg ? <p className="text-[8px] text-neon-pink">{errorMsg}</p> : null}
              {!canSubmit && status !== "submitting" ? (
                <p className="text-center text-[7px] text-zinc-500">{whitelist.submitBlocked}</p>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="neon-btn w-full disabled:cursor-not-allowed disabled:opacity-40"
                onMouseEnter={playHover}
              >
                {status === "submitting" ? whitelist.submitting : whitelist.submit}
              </button>

              <p className="text-center text-[7px] leading-relaxed text-zinc-600">
                {whitelist.privacyNote}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
