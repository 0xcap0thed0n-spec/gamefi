import { createHash, randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { site } from "@/content/site";

/** Required X API OAuth 2.0 scopes (configure at developer.x.com). */
export const TWITTER_SCOPES =
  "tweet.read users.read follows.read like.read offline.access";

export const TWITTER_PKCE_COOKIE = "nf_tw_pkce";
export const TWITTER_SESSION_COOKIE = "nf_tw_session";

export type TwitterUser = { id: string; username: string; name: string };

export type TwitterSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: TwitterUser;
};

export type PkceCookie = { verifier: string; state: string };

export function twitterConfigured(): boolean {
  return Boolean(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CALLBACK_URL);
}

/** App-only bearer for handle-based verify (no user OAuth). */
export function twitterBearerConfigured(): boolean {
  return Boolean((process.env.TWITTER_BEARER_TOKEN || "").trim());
}

export function twitterBearer(): string {
  let t = (process.env.TWITTER_BEARER_TOKEN || "").trim();
  // Users sometimes paste "Bearer xxxx" — Authorization header already adds Bearer.
  if (/^bearer\s+/i.test(t)) t = t.replace(/^bearer\s+/i, "").trim();
  return t;
}


export function twitterNotConfiguredResponse() {
  return {
    ok: false as const,
    error: "Twitter not configured — add TWITTER_CLIENT_ID and TWITTER_CALLBACK_URL (see .env.example).",
  };
}

function sessionSecret(): string {
  return (
    process.env.TWITTER_SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    process.env.TWITTER_CLIENT_SECRET ||
    "dev-insecure-nightfall-session-change-me"
  );
}

export function generatePKCE(): PkceCookie & { challenge: string } {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const state = randomBytes(16).toString("base64url");
  return { verifier, challenge, state };
}

export function seal(data: object): string {
  const key = createHash("sha256").update(sessionSecret()).digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(data), "utf8");
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function unseal<T>(token: string): T | null {
  try {
    const buf = Buffer.from(token, "base64url");
    if (buf.length < 29) return null;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const key = createHash("sha256").update(sessionSecret()).digest();
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return JSON.parse(dec.toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function cookieSecure(): boolean {
  return process.env.NODE_ENV === "production";
}

export function buildAuthorizeUrl(challenge: string, state: string): string {
  const clientId = process.env.TWITTER_CLIENT_ID!;
  const redirectUri = process.env.TWITTER_CALLBACK_URL!;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: TWITTER_SCOPES,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCode(code: string, verifier: string) {
  const clientId = (process.env.TWITTER_CLIENT_ID || "").trim();
  const redirectUri = (process.env.TWITTER_CALLBACK_URL || "").trim();
  // Prefer public PKCE (Native App / no secret). Confidential Basic auth is optional
  // and only used when TWITTER_CLIENT_SECRET is set — wrong secrets cause
  // "Missing valid authorization header".
  const secret = (process.env.TWITTER_CLIENT_SECRET || "").trim().replace(/^-+/, "");
  const body = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (secret) {
    // RFC 6749: form-urlencoded then Basic
    const user = encodeURIComponent(clientId);
    const pass = encodeURIComponent(secret);
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`, "utf8").toString("base64")}`;
  }

  const res = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers,
    body,
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const detail =
      typeof json.error_description === "string"
        ? json.error_description
        : typeof json.error === "string"
          ? json.error
          : "Token exchange failed";
    throw new Error(detail);
  }
  return json as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type: string;
    scope?: string;
  };
}

async function xGet(path: string, accessToken: string) {
  const res = await fetch(`https://api.x.com/2${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, json };
}

function xErrorDetail(json: Record<string, unknown>, status: number): string {
  const title = typeof json.title === "string" ? json.title : "";
  const detail = typeof json.detail === "string" ? json.detail : "";
  const type = typeof json.type === "string" ? json.type : "";
  const errors = Array.isArray(json.errors) ? json.errors : [];
  const first =
    errors[0] && typeof errors[0] === "object" && errors[0] !== null
      ? (errors[0] as Record<string, unknown>)
      : null;
  const msg =
    (typeof first?.message === "string" && first.message) ||
    detail ||
    title ||
    (typeof json.error === "string" ? json.error : "") ||
    type ||
    `HTTP ${status}`;
  return msg.slice(0, 160);
}

export async function fetchMe(accessToken: string): Promise<TwitterUser> {
  const { ok, status, json } = await xGet("/users/me?user.fields=name,username", accessToken);
  if (!ok) {
    throw new Error(`Could not load X profile (${status}): ${xErrorDetail(json, status)}`);
  }
  const data = json.data as { id: string; username: string; name: string } | undefined;
  if (!data?.id || !data.username) {
    throw new Error("X profile missing id/username.");
  }
  return { id: data.id, username: data.username, name: data.name || data.username };
}

export async function resolveUsername(username: string, accessToken: string): Promise<string | null> {
  const result = await resolveUsernameDetailed(username, accessToken);
  return result.id;
}

export async function resolveUsernameDetailed(
  username: string,
  accessToken: string,
): Promise<{ id: string | null; error?: string }> {
  const clean = username.replace(/^@/, "").trim();
  if (!clean) return { id: null, error: "Empty handle" };
  const { ok, status, json } = await xGet(
    `/users/by/username/${encodeURIComponent(clean)}`,
    accessToken,
  );
  if (!ok) {
    return {
      id: null,
      error: `Handle lookup failed (${status}): ${xErrorDetail(json, status)}`,
    };
  }
  const data = json.data as { id?: string } | undefined;
  if (!data?.id) return { id: null, error: `No X user found for @${clean}` };
  return { id: data.id };
}

async function userInPaginatedList(
  firstPath: string,
  accessToken: string,
  userId: string,
  maxPages = 10,
): Promise<{ found: boolean; error?: string; scanned: number }> {
  let path: string | null = firstPath;
  let pages = 0;
  let scanned = 0;
  while (path && pages < maxPages) {
    const { ok, status, json } = await xGet(path, accessToken);
    if (!ok) {
      return {
        found: false,
        scanned,
        error: `List failed (${status}): ${xErrorDetail(json, status)}`,
      };
    }
    const data = (json.data as Array<{ id: string }> | undefined) || [];
    scanned += data.length;
    if (data.some((u) => String(u.id) === String(userId))) {
      return { found: true, scanned };
    }
    const next = (json.meta as { next_token?: string } | undefined)?.next_token;
    if (!next) break;
    const base = firstPath.split("?")[0];
    const params = new URLSearchParams(firstPath.includes("?") ? firstPath.split("?")[1] : "");
    params.set("pagination_token", next);
    path = `${base}?${params.toString()}`;
    pages += 1;
  }
  return { found: false, scanned };
}

export async function verifyFollow(
  accessToken: string,
  sourceUserId: string,
  targetUsername: string,
): Promise<{ verified: boolean; detail: string }> {
  const clean = targetUsername.replace(/^@/, "");
  if (!clean) {
    return { verified: false, detail: "Target @username not configured in content/site.ts" };
  }
  const targetId = await resolveUsername(clean, accessToken);
  if (!targetId) {
    return { verified: false, detail: `Could not resolve @${clean}` };
  }

  // Direct relationship lookup — some app tiers return 405 Method Not Allowed.
  const { ok, json, status } = await xGet(
    `/users/${sourceUserId}/following/${targetId}`,
    accessToken,
  );
  if (ok) {
    const data = json.data as { following?: boolean } | undefined;
    const following = Boolean(data?.following);
    return {
      verified: following,
      detail: following ? `Following @${clean}` : `Not following @${clean} yet`,
    };
  }

  // Fallback: page the applicant's following list (works with app bearer on pay-per-use).
  if (status === 404 || status === 403 || status === 405) {
    const listed = await userInPaginatedList(
      `/users/${sourceUserId}/following?max_results=1000`,
      accessToken,
      targetId,
    );
    if (listed.error) {
      return { verified: false, detail: listed.error };
    }
    return {
      verified: listed.found,
      detail: listed.found ? `Following @${clean}` : `Not following @${clean} yet`,
    };
  }

  return {
    verified: false,
    detail: `Follow check failed (${status}): ${xErrorDetail(json, status)}`,
  };
}

export async function verifyLike(
  accessToken: string,
  userId: string,
  tweetId: string,
): Promise<{ verified: boolean; detail: string }> {
  if (!tweetId) {
    return { verified: false, detail: "Target tweet ID not configured in content/site.ts" };
  }
  // Prefer liked_tweets (OAuth user context). App-only bearer is forbidden on liking_users.
  let path: string | null = `/users/${userId}/liked_tweets?max_results=100`;
  let pages = 0;
  let scanned = 0;
  let lastError = "";
  while (path && pages < 10) {
    const { ok, status, json } = await xGet(path, accessToken);
    if (!ok) {
      lastError = `Like check failed (${status}): ${xErrorDetail(json, status)}`;
      break;
    }
    const data = (json.data as Array<{ id: string }> | undefined) || [];
    scanned += data.length;
    if (data.some((t) => String(t.id) === String(tweetId))) {
      return { verified: true, detail: "Liked the target tweet" };
    }
    const next = (json.meta as { next_token?: string } | undefined)?.next_token;
    if (!next) break;
    path = `/users/${userId}/liked_tweets?max_results=100&pagination_token=${encodeURIComponent(next)}`;
    pages += 1;
  }
  if (lastError) return { verified: false, detail: lastError };
  return {
    verified: false,
    detail: `Have not liked the target tweet yet (scanned ${scanned} liked posts)`,
  };
}

/** Like verify for pasted handle — X forbids app-only on like endpoints. */
export async function verifyLikeNeedsUserAuth(): Promise<{ verified: boolean; detail: string }> {
  return {
    verified: false,
    detail: "Connect X to verify likes (X blocks app-only like checks).",
  };
}

export async function verifyRetweet(
  accessToken: string,
  userId: string,
  tweetId: string,
): Promise<{ verified: boolean; detail: string }> {
  if (!tweetId) {
    return { verified: false, detail: "Target tweet ID not configured in content/site.ts" };
  }
  const listed = await userInPaginatedList(
    `/tweets/${tweetId}/retweeted_by?max_results=100`,
    accessToken,
    userId,
  );
  if (listed.error) {
    return { verified: false, detail: listed.error };
  }
  if (listed.found) return { verified: true, detail: "Retweeted the target tweet" };
  return {
    verified: false,
    detail: `Have not retweeted the target tweet yet (scanned ${listed.scanned} reposts). Quote-posts do not count — use Repost.`,
  };
}


/** Resolve username → id with app bearer (or user token). */
export async function resolveUsernameWithToken(
  username: string,
  accessToken: string,
): Promise<string | null> {
  return resolveUsername(username, accessToken);
}

async function resolveApplicantOrError(applicantHandle: string, bearer: string) {
  const looked = await resolveUsernameDetailed(applicantHandle, bearer);
  if (!looked.id) {
    return { error: looked.error || "Could not find that X handle" } as const;
  }
  return { id: looked.id } as const;
}

export async function verifyFollowByHandle(
  applicantHandle: string,
  targetUsername: string,
): Promise<{ verified: boolean; detail: string }> {
  const bearer = twitterBearer();
  if (!bearer) return { verified: false, detail: "TWITTER_BEARER_TOKEN not set on server" };
  const looked = await resolveApplicantOrError(applicantHandle, bearer);
  if ("error" in looked) return { verified: false, detail: looked.error ?? "Could not find that X handle" };
  return verifyFollow(bearer, looked.id, targetUsername);
}

export async function verifyLikeByHandle(
  _applicantHandle: string,
  _tweetId: string,
): Promise<{ verified: boolean; detail: string }> {
  return verifyLikeNeedsUserAuth();
}

export async function verifyRetweetByHandle(
  applicantHandle: string,
  tweetId: string,
): Promise<{ verified: boolean; detail: string }> {
  const bearer = twitterBearer();
  if (!bearer) return { verified: false, detail: "TWITTER_BEARER_TOKEN not set on server" };
  const looked = await resolveApplicantOrError(applicantHandle, bearer);
  if ("error" in looked) return { verified: false, detail: looked.error ?? "Could not find that X handle" };
  return verifyRetweet(bearer, looked.id, tweetId);
}

export function getTwitterTargets() {
  return {
    targetUsername: site.twitter.targetUsername,
    targetTweetId: site.twitter.targetTweetId,
  };
}
