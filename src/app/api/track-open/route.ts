import { NextResponse, type NextRequest } from "next/server";

import { apps } from "@/data/appCatalog";
import { recordOpen } from "@/lib/openCounts";

// Counters are read/written at request time — never statically optimized.
export const dynamic = "force-dynamic";

// Only known catalog ids may be recorded, so a stray client cannot pollute the
// leaderboard with arbitrary keys. Built once per server instance.
const KNOWN_APP_IDS = new Set(Object.keys(apps));

const clientIp = (request: NextRequest): string => {
  // Prefer x-real-ip: on Vercel it is set from the actual connection and is not
  // client-spoofable. x-forwarded-for is attacker-controllable (its first entry
  // can be forged to rotate "IPs" and bypass the cooldown), so it is only a
  // fallback for non-Vercel hosting.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
};

export async function POST(request: NextRequest) {
  try {
    // Accepts both fetch JSON and navigator.sendBeacon (Blob) bodies.
    const body = (await request.json().catch(() => null)) as
      | { appId?: unknown }
      | null;
    const appId = typeof body?.appId === "string" ? body.appId : "";

    if (!appId || !KNOWN_APP_IDS.has(appId)) {
      return NextResponse.json({ ok: false, counted: false }, { status: 400 });
    }

    const { counted } = await recordOpen(appId, clientIp(request));
    return NextResponse.json({ ok: true, counted }, { status: 200 });
  } catch (error) {
    // Tracking is best-effort: a failure must never surface to the user.
    console.error("[track-open] failed", error);
    return NextResponse.json({ ok: false, counted: false }, { status: 200 });
  }
}
