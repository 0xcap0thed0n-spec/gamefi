import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  TWITTER_PKCE_COOKIE,
  TWITTER_SESSION_COOKIE,
  cookieSecure,
  exchangeCode,
  fetchMe,
  seal,
  twitterConfigured,
  unseal,
  type PkceCookie,
} from "@/lib/twitter";

function redirectHome(req: NextRequest, hash = "whitelist", error?: string) {
  const origin = new URL(req.url).origin;
  const q = error ? `?twitter_error=${encodeURIComponent(error)}` : "";
  return NextResponse.redirect(`${origin}/${q}#${hash}`);
}

export async function GET(req: NextRequest) {
  if (!twitterConfigured()) {
    return redirectHome(req, "whitelist", "Twitter not configured");
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return redirectHome(req, "whitelist", oauthError);
  }
  if (!code || !state) {
    return redirectHome(req, "whitelist", "Missing OAuth code");
  }

  const jar = await cookies();
  const raw = jar.get(TWITTER_PKCE_COOKIE)?.value;
  const pkce = raw ? unseal<PkceCookie>(raw) : null;
  if (!pkce?.verifier || !pkce.state || pkce.state !== state) {
    return redirectHome(req, "whitelist", "Invalid OAuth state");
  }

  try {
    const tokens = await exchangeCode(code, pkce.verifier);
    const user = await fetchMe(tokens.access_token);
    const session = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expires_in
        ? Date.now() + tokens.expires_in * 1000
        : undefined,
      user,
    };

    const res = redirectHome(req, "whitelist");
    res.cookies.set(TWITTER_PKCE_COOKIE, "", {
      httpOnly: true,
      secure: cookieSecure(),
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    res.cookies.set(TWITTER_SESSION_COOKIE, seal(session), {
      httpOnly: true,
      secure: cookieSecure(),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "OAuth failed";
    return redirectHome(req, "whitelist", msg);
  }
}
