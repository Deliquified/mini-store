"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Wordmark } from "@/components/Wordmark";

interface LoadingSplashProps {
  active?: boolean;
  minDurationMs?: number;
  maxDurationMs?: number;
}

export function LoadingSplash({
  active = true,
  minDurationMs = 650,
  maxDurationMs = 1800,
}: LoadingSplashProps) {
  const [visible, setVisible] = useState(true);
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  useEffect(() => {
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
  }, [maxDurationMs, minDurationMs]);

  useEffect(() => {
    if (!active && minimumElapsed) {
      setVisible(false);
    }
  }, [active, minimumElapsed]);

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
