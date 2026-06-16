"use client";

import { App, getAppsByCategory, getPrimaryCategory } from "@/data/appCatalog";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TopChartsSliderProps {
  apps: App[];
  onAppClick: (app: App) => void;
}

type ChartFilter = "defi" | "staking" | "nfts";

const FILTERS: { id: ChartFilter; label: string; category: string }[] = [
  { id: "defi", label: "DeFi", category: "DeFi" },
  { id: "staking", label: "Staking", category: "Staking" },
  { id: "nfts", label: "NFTs", category: "NFTs" },
];

export default function TopChartsSlider({ apps, onAppClick }: TopChartsSliderProps) {
  const [activeFilter, setActiveFilter] = useState<ChartFilter>("defi");
  const reduceMotion = useReducedMotion();

  if (!apps || apps.length === 0) {
    return null;
  }

  // ---- Filtering logic preserved exactly from the original implementation ----
  const getFilteredApps = (): App[] => {
    const category =
      activeFilter === "defi" ? "DeFi" : activeFilter === "staking" ? "Staking" : "NFTs";

    const categoryApps = getAppsByCategory(category);

    // Staking de-dupes anything already surfaced under DeFi.
    if (category === "Staking") {
      const defiApps = getAppsByCategory("DeFi");
      return categoryApps.filter(
        (app) => !defiApps.some((defiApp) => defiApp.id === app.id)
      );
    }

    return categoryApps;
  };

  const filteredApps = getFilteredApps();

  return (
    <section className="mb-10" aria-labelledby="top-charts-heading">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-secondary">
            Top Charts
          </p>
          <h2
            id="top-charts-heading"
            className="font-display text-[22px] font-semibold leading-tight text-foreground"
          >
            Trending now
          </h2>
        </div>
      </div>

      {/* Glass segmented filter control */}
      <div
        className="seg-track mb-5"
        role="tablist"
        aria-label="Filter top charts by category"
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative min-h-[44px] min-w-[88px] rounded-full px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive ? "text-brand-text" : "text-text-secondary hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="top-charts-pill"
                  className="absolute inset-0 rounded-full bg-card shadow-rest"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              <span className="relative z-10">{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ranked rows — solid content card, no glass (data-dense) */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-rest">
        {filteredApps.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-text-secondary">
            No apps in this category yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredApps.map((app, index) => {
              const rank = index + 1;
              const isTop = rank === 1;
              return (
                <motion.li
                  key={app.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.28,
                          delay: Math.min(index, 11) * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                >
                  <button
                    type="button"
                    onClick={() => onAppClick(app)}
                    aria-label={`View ${app.app.name}, ranked number ${rank} in ${
                      FILTERS.find((f) => f.id === activeFilter)?.label
                    }`}
                    className="group relative flex w-full min-h-[44px] items-center gap-3 px-4 py-3 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:gap-4 sm:px-5"
                  >
                    {/* Pink accent bar on #1 */}
                    {isTop && (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-1 rounded-full bg-brand-gradient-soft"
                      />
                    )}

                    {/* Rank numeral */}
                    <span
                      aria-hidden
                      className={`w-7 flex-shrink-0 text-center font-display text-lg font-bold tabular-nums sm:w-8 sm:text-xl ${
                        isTop ? "text-brand-text" : "text-text-tertiary"
                      }`}
                    >
                      {rank}
                    </span>

                    {/* Squircle icon */}
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
                      <Image
                        src={app.icon || ""}
                        alt={`${app.app.name} icon`}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>

                    {/* Name + category */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="truncate text-[15px] font-medium text-foreground">
                        {app.app.name}
                      </h3>
                      <p className="truncate text-[13px] text-text-secondary">
                        {getPrimaryCategory(app)}
                      </p>
                    </div>

                    {/* Chevron affordance */}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 flex-shrink-0 text-text-tertiary transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-text-secondary"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
