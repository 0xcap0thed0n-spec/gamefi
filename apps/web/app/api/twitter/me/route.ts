import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  TWITTER_SESSION_COOKIE,
  twitterConfigured,
  twitterNotConfiguredResponse,
  unseal,
  type TwitterSession,
} from "@/lib/twitter";

export async function GET() {
  if (!twitterConfigured()) {
    return NextResponse.json(twitterNotConfiguredResponse(), { status: 503 });
  }

  const jar = await cookies();
  const raw = jar.get(TWITTER_SESSION_COOKIE)?.value;
  const session = raw ? unseal<TwitterSession>(raw) : null;
  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json({ ok: false, error: "Not connected" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: session.user.id,
      username: session.user.username,
      name: session.user.name,
    },
  });
}
