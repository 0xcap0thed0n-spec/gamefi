import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  TWITTER_SESSION_COOKIE,
  getTwitterTargets,
  twitterConfigured,
  twitterNotConfiguredResponse,
  unseal,
  verifyFollow,
  verifyLike,
  verifyRetweet,
  type TwitterSession,
} from "@/lib/twitter";

type Action = "follow" | "like" | "retweet";

export async function POST(req: Request) {
  if (!twitterConfigured()) {
    return NextResponse.json(twitterNotConfiguredResponse(), { status: 503 });
  }

  const jar = await cookies();
  const raw = jar.get(TWITTER_SESSION_COOKIE)?.value;
  const session = raw ? unseal<TwitterSession>(raw) : null;
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ ok: false, error: "Not connected to X" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const action = body?.action as Action | undefined;
  if (action !== "follow" && action !== "like" && action !== "retweet") {
    return NextResponse.json(
      { ok: false, error: 'Invalid action — use "follow" | "like" | "retweet"' },
      { status: 400 },
    );
  }

  const { targetUsername, targetTweetId } = getTwitterTargets();

  try {
    let result: { verified: boolean; detail: string };
    if (action === "follow") {
      result = await verifyFollow(session.accessToken, session.user.id, targetUsername);
    } else if (action === "like") {
      result = await verifyLike(session.accessToken, session.user.id, targetTweetId);
    } else {
      result = await verifyRetweet(session.accessToken, session.user.id, targetTweetId);
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
