"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { useUpProvider } from "@/app/components/providers/upProvider";
import { Wordmark } from "@/components/Wordmark";

interface LoadingSplashProps {
  minDurationMs?: number;
  maxDurationMs?: number;
  refreshDurationMs?: number;
}

// Persisted per browser session so the full splash only appears on the very
// first view. It survives client-side navigation (the component is mounted once
// at the provider level, so it never remounts on navigation) and full reloads
// within the same tab; it resets for a brand new session/tab.
const SESSION_FLAG = "up-store:splash-shown";

// Tracks, within a single JS runtime, whether *we* set the session flag. This
// keeps React StrictMode's dev-only mount → unmount → remount from mistaking the
// flag we just wrote for one left by a previous page load.
let splashShownThisRuntime = false;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LoadingSplash({
  minDurationMs = 650,
  maxDurationMs = 1800,
  refreshDurationMs = 500,
}: LoadingSplashProps) {
  const { isLoading } = useUpProvider();
  const [visible, setVisible] = useState(true);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const skipped = useRef(false);

  // Decide once, before paint, how this mount should behave:
  //  - first view of the session  -> full splash, gated on load completion
  //  - reload within the session   -> a brief flash for feedback, then hide
  //  - client-side navigation      -> never reaches here (mounted once globally)
  useIsomorphicLayoutEffect(() => {
    let shownPreviously = false;
    try {
      shownPreviously = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      // sessionStorage can be unavailable (sandboxed iframe / privacy mode);
      // fall back to showing the splash for this mount.
    }

    // Reload within the same session. (splashShownThisRuntime guards against
    // React StrictMode's dev remount writing the flag and then mistaking this
    // mount for a reload — we intentionally do not set it in this branch so the
    // remount stays classified as a reload too.)
    if (shownPreviously && !splashShownThisRuntime) {
      skipped.current = true; // fixed-duration flash; ignore the isLoading gate
      const refreshTimer = window.setTimeout(() => {
        setVisible(false);
      }, refreshDurationMs);

      return () => window.clearTimeout(refreshTimer);
    }

    // First view of the session.
    splashShownThisRuntime = true;
    try {
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // ignore — best effort
    }

    const minimumTimer = window.setTimeout(() => {
      setMinimumElapsed(true);
    }, minDurationMs);

    const fallbackTimer = window.setTimeout(() => {
      setVisible(false);
    }, maxDurationMs);

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [maxDurationMs, minDurationMs, refreshDurationMs]);

  useEffect(() => {
    if (skipped.current) return;
    if (!isLoading && minimumElapsed) {
      setVisible(false);
    }
  }, [isLoading, minimumElapsed]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-background bg-glow-ambient"
    >
      <div className="flex flex-col items-center gap-4">
        <Wordmark size="lg" />
        <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden="true" />
      </div>
    </div>
  );
}

export default LoadingSplash;
