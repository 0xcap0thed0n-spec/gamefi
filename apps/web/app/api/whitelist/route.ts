import { NextResponse } from "next/server";
import { appendWhitelistSubmission } from "@/lib/whitelistStore";

const MAX_REASON_LEN = 280;
const MAX_TWITTER_LEN = 100;
const MAX_REFERRAL_LEN = 100;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { twitter, wallet, reason, referral } = body as Record<string, unknown>;

    if (
      typeof twitter !== "string" ||
      typeof wallet !== "string" ||
      typeof reason !== "string" ||
      !twitter.trim() ||
      !wallet.trim() ||
      !reason.trim()
    ) {
      return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
    }

    if (reason.length > MAX_REASON_LEN) {
      return NextResponse.json({ error: "Reason is too long." }, { status: 400 });
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet.trim())) {
      return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
    }

    try {
      await appendWhitelistSubmission({
        twitter: twitter.trim().slice(0, MAX_TWITTER_LEN),
        wallet: wallet.trim(),
        reason: reason.trim().slice(0, MAX_REASON_LEN),
        referral:
          typeof referral === "string" && referral.trim()
            ? referral.trim().slice(0, MAX_REFERRAL_LEN)
            : null,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "DUPLICATE_WALLET") {
        return NextResponse.json({ error: "This wallet already applied." }, { status: 409 });
      }
      throw err;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[whitelist] unexpected error", err);
    return NextResponse.json({ error: "Unexpected error - please try again." }, { status: 500 });
  }
}
