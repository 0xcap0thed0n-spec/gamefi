import { NextResponse } from "next/server";
import { recoverMessageAddress } from "viem";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_REASON_LEN = 280;
const MAX_TWITTER_LEN = 100;
const MAX_REFERRAL_LEN = 100;
const SIGNATURE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes -- blocks replaying an old signature

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { twitter, wallet, reason, referral, message, signature, timestamp } = body as Record<
      string,
      unknown
    >;

    if (
      typeof twitter !== "string" ||
      typeof wallet !== "string" ||
      typeof reason !== "string" ||
      typeof message !== "string" ||
      typeof signature !== "string" ||
      typeof timestamp !== "string" ||
      !twitter.trim() ||
      !wallet.trim() ||
      !reason.trim()
    ) {
      return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
    }

    if (reason.length > MAX_REASON_LEN) {
      return NextResponse.json({ error: "Reason is too long." }, { status: 400 });
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
    }

    // Reject stale or replayed signatures.
    const signedAt = Date.parse(timestamp);
    if (!signedAt || Math.abs(Date.now() - signedAt) > SIGNATURE_WINDOW_MS) {
      return NextResponse.json(
        { error: "Signature expired -- please try again." },
        { status: 400 },
      );
    }
    // The signed message must actually reference this wallet + timestamp, so a
    // signature captured for one submission can't be replayed against another.
    if (!message.includes(wallet) || !message.includes(timestamp)) {
      return NextResponse.json({ error: "Signed message does not match submission." }, { status: 400 });
    }

    // Pure signature recovery -- no RPC call needed for a standard EOA wallet.
    const recovered = await recoverMessageAddress({
      message,
      signature: signature as `0x${string}`,
    });
    if (recovered.toLowerCase() !== wallet.toLowerCase()) {
      return NextResponse.json({ error: "Signature verification failed." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("whitelist_submissions").insert({
      twitter: twitter.trim().slice(0, MAX_TWITTER_LEN),
      wallet: wallet.toLowerCase(),
      reason: reason.trim().slice(0, MAX_REASON_LEN),
      referral:
        typeof referral === "string" && referral.trim()
          ? referral.trim().slice(0, MAX_REFERRAL_LEN)
          : null,
      signature,
      message,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "This wallet already applied." }, { status: 409 });
      }
      console.error("[whitelist] supabase insert error", error);
      return NextResponse.json({ error: "Could not save your application." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[whitelist] unexpected error", err);
    return NextResponse.json({ error: "Unexpected error -- please try again." }, { status: 500 });
  }
}
