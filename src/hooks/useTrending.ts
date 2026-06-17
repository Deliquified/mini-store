"use client";

import { useEffect, useState } from "react";

/**
 * Fetches the global app-open counts ({ [appId]: count }) once after mount.
 *
 * Returns {} on the server and the first client render so any consumer that
 * orders by it produces SSR-stable markup; the real counts arrive post-mount
 * and trigger a re-sort. Failures resolve to {} (Trending then keeps its
 * fallback order) — the UI never blocks on this.
 */
export function useTrending(): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    fetch("/api/trending")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { counts?: Record<string, number> } | null) => {
        if (!cancelled && data?.counts) setCounts(data.counts);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}
