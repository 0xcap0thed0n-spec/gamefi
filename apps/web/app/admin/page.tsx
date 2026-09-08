import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminTable } from "./AdminTable";

// Always hit Supabase fresh -- this page should never serve a cached list of applicants.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("whitelist_submissions")
    .select("id, twitter, wallet, reason, referral, status, created_at")
    .order("created_at", { ascending: false });

  const pendingCount = (data ?? []).filter((r) => r.status === "pending").length;

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-white">Whitelist applications</h1>
      <p className="mt-2 text-sm text-zinc-400">
        {data?.length ?? 0} total · {pendingCount} pending review · signature-verified wallets only
      </p>

      {error ? (
        <p className="mt-6 text-sm text-neon-pink">
          Could not load applications: {error.message}
        </p>
      ) : (
        <AdminTable submissions={data ?? []} />
      )}
    </main>
  );
}
