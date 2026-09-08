import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type WhitelistSubmission = {
  id: string;
  twitter: string;
  wallet: string;
  reason: string;
  referral: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "whitelist-submissions.jsonl");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "", "utf8");
  }
}

export async function appendWhitelistSubmission(input: {
  twitter: string;
  wallet: string;
  reason: string;
  referral: string | null;
}): Promise<WhitelistSubmission> {
  await ensureDataFile();
  const existing = await listWhitelistSubmissions();
  if (existing.some((r) => r.wallet.toLowerCase() === input.wallet.toLowerCase())) {
    const err = new Error("DUPLICATE_WALLET");
    throw err;
  }

  const row: WhitelistSubmission = {
    id: randomUUID(),
    twitter: input.twitter,
    wallet: input.wallet.toLowerCase(),
    reason: input.reason,
    referral: input.referral,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  await fs.appendFile(DATA_FILE, `${JSON.stringify(row)}\n`, "utf8");
  return row;
}

export async function listWhitelistSubmissions(): Promise<WhitelistSubmission[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  if (!raw.trim()) return [];
  const rows: WhitelistSubmission[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rows.push(JSON.parse(trimmed) as WhitelistSubmission);
    } catch {
      // skip corrupt lines
    }
  }
  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateWhitelistStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  const rows = await listWhitelistSubmissions();
  let found = false;
  const next = rows.map((r) => {
    if (r.id === id) {
      found = true;
      return { ...r, status };
    }
    return r;
  });
  if (!found) return false;
  // Rewrite newest-first for stable file order matching list sort preference
  const body = next
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((r) => JSON.stringify(r))
    .join("\n");
  await fs.writeFile(DATA_FILE, body ? `${body}\n` : "", "utf8");
  return true;
}
