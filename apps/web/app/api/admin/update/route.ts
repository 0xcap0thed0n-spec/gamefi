import { NextResponse } from "next/server";
import { updateWhitelistStatus } from "@/lib/whitelistStore";

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.id !== "string" || (body.status !== "approved" && body.status !== "rejected")) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const ok = await updateWhitelistStatus(body.id, body.status);
    if (!ok) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/update]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
