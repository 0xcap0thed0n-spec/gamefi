import { NextResponse } from "next/server";
import {
  TWITTER_PKCE_COOKIE,
  buildAuthorizeUrl,
  cookieSecure,
  generatePKCE,
  seal,
  twitterConfigured,
  twitterNotConfiguredResponse,
} from "@/lib/twitter";

export async function GET() {
  if (!twitterConfigured()) {
    return NextResponse.json(twitterNotConfiguredResponse(), { status: 503 });
  }

  const { verifier, challenge, state } = generatePKCE();
  const url = buildAuthorizeUrl(challenge, state);

  const res = NextResponse.redirect(url);
  res.cookies.set(TWITTER_PKCE_COOKIE, seal({ verifier, state }), {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
  return res;
}
