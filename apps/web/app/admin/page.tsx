import { listWhitelistSubmissions } from "@/lib/whitelistStore";
import { AdminTable } from "./AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await listWhitelistSubmissions();
  const pendingCount = data.filter((r) => r.status === "pending").length;

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-white">Whitelist applications</h1>
      <p className="mt-2 text-sm text-zinc-400">
        {data.length} total · {pendingCount} pending review · stored locally (no Supabase)
      </p>
      <AdminTable submissions={data} />
    </main>
  );
}
