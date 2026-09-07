"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { useAudio } from "./AudioProvider";

type FormState = {
  twitter: string;
  wallet: string;
  reason: string;
};

const empty: FormState = { twitter: "", wallet: "", reason: "" };

export function WhitelistForm() {
  const { whitelist, assets } = site;
  const { playClick, playHover } = useAudio();
  const [values, setValues] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  function onChange(
    key: keyof FormState,
    value: string,
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    playClick();

    const payload = {
      ...values,
      submittedAt: new Date().toISOString(),
      // Ready for a real backend: POST /api/whitelist later
    };
    console.log("[Nightfall City whitelist]", payload);

    // Simulate a beat so the success UI feels intentional
    await new Promise((r) => setTimeout(r, 450));
    setStatus("success");
  }

  function reset() {
    playClick();
    setValues(empty);
    setStatus("idle");
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
              <p className="font-display text-xl text-neon-pink">
                {whitelist.successTitle}
              </p>
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
                  {whitelist.fields.twitter.label}
                </span>
                <input
                  required
                  name={whitelist.fields.twitter.name}
                  value={values.twitter}
                  onChange={(e) => onChange("twitter", e.target.value)}
                  placeholder={whitelist.fields.twitter.placeholder}
                  className="neon-input"
                  autoComplete="username"
                />
              </label>

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
              </label>

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

              <button
                type="submit"
                disabled={status === "submitting"}
                className="neon-btn w-full"
                onMouseEnter={playHover}
              >
                {status === "submitting"
                  ? whitelist.submitting
                  : whitelist.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}