"use client";

import { useState } from "react";

type Submission = {
  id: string;
  twitter: string;
  wallet: string;
  reason: string;
  referral: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const statusColor: Record<Submission["status"], string> = {
  pending: "text-neon-purple",
  approved: "text-neon-cyan",
  rejected: "text-zinc-600 line-through",
};

export function AdminTable({ submissions }: { submissions: Submission[] }) {
  const [rows, setRows] = useState(submissions);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setPendingId(id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch("/api/admin/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } finally {
      setPendingId(null);
    }
  }

  if (rows.length === 0) {
    return <p className="mt-8 text-sm text-zinc-500">No applications yet.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
            <th className="py-2 pr-4">Twitter</th>
            <th className="py-2 pr-4">Wallet</th>
            <th className="py-2 pr-4">Reason</th>
            <th className="py-2 pr-4">Referral</th>
            <th className="py-2 pr-4">Applied</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-white/5 align-top">
              <td className="py-3 pr-4 text-zinc-200">{row.twitter}</td>
              <td className="py-3 pr-4 font-mono text-xs text-zinc-400">
                {row.wallet.slice(0, 6)}...{row.wallet.slice(-4)}
              </td>
              <td className="max-w-xs py-3 pr-4 text-zinc-300">{row.reason}</td>
              <td className="py-3 pr-4 text-zinc-400">{row.referral || "-"}</td>
              <td className="py-3 pr-4 whitespace-nowrap text-zinc-500">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className={`py-3 pr-4 font-medium ${statusColor[row.status]}`}>{row.status}</td>
              <td className="py-3 pr-4">
                <div className="flex gap-2">
                  <button
                    disabled={pendingId === row.id}
                    className="rounded border border-neon-cyan/40 px-2 py-1 text-xs text-neon-cyan transition hover:bg-neon-cyan/10 disabled:opacity-40"
                    onClick={() => updateStatus(row.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    disabled={pendingId === row.id}
                    className="rounded border border-neon-pink/40 px-2 py-1 text-xs text-neon-pink transition hover:bg-neon-pink/10 disabled:opacity-40"
                    onClick={() => updateStatus(row.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
