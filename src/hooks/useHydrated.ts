import { useEffect, useState } from "react";

/**
 * Returns `false` on the server and the first client render, then flips to
 * `true` after mount. Gate any non-deterministic, client-only derivation
 * (e.g. randomized ordering) on this so the initial markup matches the SSR
 * output and React does not report a hydration mismatch.
 *
 * Because a fresh mount happens on every full page load, anything keyed on the
 * returned value is recomputed once per reload — exactly the cadence we want
 * for "randomize on every reload".
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
