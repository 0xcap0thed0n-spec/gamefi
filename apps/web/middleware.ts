import { NextResponse, type NextRequest } from "next/server";

async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// These two paths must stay reachable without a valid session cookie --
// they're how you get one in the first place.
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

/**
 * Lightweight password gate for /admin (the whitelist review page) and its
 * /api/admin/* routes. This is a shared-secret gate appropriate for a single
 * operator reviewing applications -- not a full auth system. Swap for real
 * auth (e.g. Supabase Auth) before handing admin access to more than one person.
 */
export async function middleware(req: NextRequest) {
  if (PUBLIC_PATHS.has(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  const cookie = req.cookies.get("nightfall_admin")?.value;
  const expectedCookie = expectedPassword ? await sha256Hex(expectedPassword) : null;

  if (!expectedCookie || cookie !== expectedCookie) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
