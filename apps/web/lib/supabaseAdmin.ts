import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY client using the Supabase service role key, which bypasses
 * Row Level Security. Never import this file from a "use client" component --
 * SUPABASE_SERVICE_ROLE_KEY must never reach the browser bundle. It's only
 * ever used inside app/api/** route handlers and Server Components.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars -- set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see apps/web/.env.example).",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
