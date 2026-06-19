"server only";

import { Redis } from "@upstash/redis";

/**
 * Persistent app-open counters backed by Upstash Redis.
 *
 * Why Redis: opens are recorded with an atomic HINCRBY (no read-modify-write
 * race across concurrent serverless invocations), and the whole leaderboard is
 * read back with a single HGETALL. The data lives in Upstash, not in the Vercel
 * deployment, so counts survive both a browser refresh and a redeploy/upgrade.
 *
 * Graceful degradation: if the Upstash env vars are not configured (local dev,
 * or a deploy before the Marketplace integration is added), every function here
 * no-ops and reads return {}. The store keeps working — Trending simply falls
 * back to its shuffled order until real counts exist.
 *
 * Env: the Upstash Vercel Marketplace integration injects KV_REST_API_URL /
 * KV_REST_API_TOKEN; a manual Upstash setup uses UPSTASH_REDIS_REST_URL /
 * UPSTASH_REDIS_REST_TOKEN. Both naming schemes are accepted.
 */

const OPENS_KEY = "app:opens"; // hash: field = appId, value = open count
const COOLDOWN_PREFIX = "open:cooldown"; // per-ip+app dedup window
const COOLDOWN_SECONDS = 600; // 10 minutes

const url =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

let client: Redis | null = null;
if (url && token) {
  client = new Redis({ url, token });
}

export const isOpenTrackingEnabled = (): boolean => client !== null;

/**
 * Record one open of `appId` from `ip`. A short per-ip+app cooldown collapses
 * repeated opens from the same source so the ranking reflects real popularity
 * rather than how often someone clicks. Returns whether the open was counted.
 * Never throws — a tracking failure must not affect launching the app.
 */
export const recordOpen = async (
  appId: string,
  ip: string
): Promise<{ counted: boolean }> => {
  if (!client) return { counted: false };
  try {
    const cooldownKey = `${COOLDOWN_PREFIX}:${ip}:${appId}`;
    const fresh = await client.set(cooldownKey, 1, {
      nx: true,
      ex: COOLDOWN_SECONDS,
    });
    // `set` returns "OK" when the key was newly set, null when it already
    // existed (i.e. still within the cooldown window) — skip the increment.
    if (!fresh) return { counted: false };

    await client.hincrby(OPENS_KEY, appId, 1);
    return { counted: true };
  } catch (error) {
    console.error("[openCounts] recordOpen failed", error);
    return { counted: false };
  }
};

/** Read every app's open count as a plain map. Empty when disabled/unset. */
export const getOpenCounts = async (): Promise<Record<string, number>> => {
  if (!client) return {};
  try {
    const raw = await client.hgetall<Record<string, unknown>>(OPENS_KEY);
    if (!raw) return {};

    const counts: Record<string, number> = {};
    for (const [appId, value] of Object.entries(raw)) {
      const n = Number(value);
      if (Number.isFinite(n)) counts[appId] = n;
    }
    return counts;
  } catch (error) {
    console.error("[openCounts] getOpenCounts failed", error);
    return {};
  }
};
