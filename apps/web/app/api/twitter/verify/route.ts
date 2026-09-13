import { NextResponse } from "next/server";
import {
  getTwitterTargets,
  twitterBearerConfigured,
  verifyFollowByHandle,
  verifyLikeByHandle,
  verifyRetweetByHandle,
} from "@/lib/twitter";

type Action = "follow" | "like" | "retweet";

function normalizeHandle(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/^@+/, "");
}

export async function POST(req: Request) {
  if (!twitterBearerConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "X verify not configured — add TWITTER_BEARER_TOKEN (App Bearer Token from console.x.com Keys).",
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const action = body?.action as Action | undefined;
  const handle = normalizeHandle(body?.handle);
  if (action !== "follow" && action !== "like" && action !== "retweet") {
    return NextResponse.json(
      { ok: false, error: 'Invalid action — use "follow" | "like" | "retweet"' },
      { status: 400 },
    );
  }
  if (!handle || !/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    return NextResponse.json({ ok: false, error: "Valid X handle required" }, { status: 400 });
  }

  const { targetUsername, targetTweetId } = getTwitterTargets();
  if (action === "follow" && !targetUsername) {
    return NextResponse.json({ ok: false, error: "Follow target not configured" }, { status: 400 });
  }
  if ((action === "like" || action === "retweet") && !targetTweetId) {
    return NextResponse.json({ ok: false, error: "Tweet target not configured" }, { status: 400 });
  }

  try {
    let result: { verified: boolean; detail: string };
    if (action === "follow") {
      result = await verifyFollowByHandle(handle, targetUsername);
    } else if (action === "like") {
      result = await verifyLikeByHandle(handle, targetTweetId);
    } else {
      result = await verifyRetweetByHandle(handle, targetTweetId);
    }

    return NextResponse.json({
      ok: true,
      action,
      verified: result.verified,
      detail: result.detail,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ ok: false, verified: false, detail }, { status: 500 });
  }
}
