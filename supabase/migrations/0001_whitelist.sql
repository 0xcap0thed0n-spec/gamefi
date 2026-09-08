-- Nightfall City whitelist applications
-- Run this once in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).

create extension if not exists pgcrypto;

create table if not exists whitelist_submissions (
  id uuid primary key default gen_random_uuid(),
  twitter text not null,
  wallet text not null,
  reason text not null,
  referral text,
  signature text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- One application per wallet.
create unique index if not exists whitelist_wallet_unique
  on whitelist_submissions (lower(wallet));

-- Row Level Security is ON with NO policies defined below, which means:
-- the anon/public key can neither read nor write this table at all.
-- Only the service_role key (used server-side in apps/web/lib/supabaseAdmin.ts,
-- never exposed to the browser) can touch it. This is deliberate -- submissions
-- go through /api/whitelist (which verifies the wallet signature first), never
-- directly from the browser to Supabase.
alter table whitelist_submissions enable row level security;
