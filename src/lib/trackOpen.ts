/**
 * Fire-and-forget "this app was opened" signal to /api/track-open.
 *
 * - Dedup: one count per app per browser session (sessionStorage), so a user
 *   re-opening the same app in one visit does not inflate the ranking. The
 *   server adds a second per-ip+app cooldown layer (see openCounts.ts).
 * - Delivery: navigator.sendBeacon survives the open (which spawns a new tab),
 *   with a keepalive fetch fallback. Wrapped so it can never break launching.
 */
export function trackOpen(appId?: string): void {
  if (!appId || typeof window === "undefined") return;

  try {
    const dedupKey = `upstore:opened:${appId}`;
    if (window.sessionStorage.getItem(dedupKey)) return;
    window.sessionStorage.setItem(dedupKey, "1");

    const body = JSON.stringify({ appId });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track-open", blob);
      return;
    }

    void fetch("/api/track-open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Best-effort: sessionStorage blocked, etc. — silently ignore.
  }
}
