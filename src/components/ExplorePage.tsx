"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import FeaturedBanner from "./FeaturedBanner";
import AppSlider from "./AppSlider";
import TopChartsSlider from "./TopChartsSlider";
import {
  getAppsByCategory,
  apps,
  featuredApps,
  shuffle,
  App,
} from "@/data/appCatalog";
import { useHydrated } from "@/hooks/useHydrated";
import { useTrending } from "@/hooks/useTrending";
import { cn } from "@/lib/utils";

interface ExplorePageProps {
  onAppClick: (app: App) => void;
}

/**
 * Section wrapper: provides the discover-home rhythm (eyebrow overline + H2 +
 * one-line intro) and a tasteful, reduced-motion-gated entrance. Composes the
 * existing child sliders without inlining them.
 */
interface DiscoverSectionProps {
  eyebrow: string;
  /**
   * Optional section title. When omitted, the composed child renders its own
   * heading (e.g. TopChartsSlider / FeaturedBanner) and we only show the
   * eyebrow + intro so the headers never visually double up.
   */
  title?: string;
  intro?: string;
  /**
   * AppSlider always renders its own <h2>. When we own the heading we pass it
   * an empty title; this flag hides that now-empty child heading so it does not
   * leave a dead gap above the rail.
   */
  collapseChildHeading?: boolean;
  children: React.ReactNode;
}

function DiscoverSection({
  eyebrow,
  title,
  intro,
  collapseChildHeading = false,
  children,
}: DiscoverSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.section
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className="scroll-mt-24"
    >
      {/* Section intro */}
      <header className="mb-4 md:mb-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-brand-text">
          {eyebrow}
        </p>
        {title && (
          <h2 className="mt-1 font-display text-[22px] font-semibold leading-tight text-foreground md:text-[28px]">
            {title}
          </h2>
        )}
        {intro && (
          <p className="mt-1.5 max-w-prose text-[15px] leading-relaxed text-text-secondary">
            {intro}
          </p>
        )}
      </header>
      <div className={cn(collapseChildHeading && "[&_h2:empty]:hidden")}>
        {children}
      </div>
    </motion.section>
  );
}

export default function ExplorePage({ onAppClick }: ExplorePageProps) {
  // Stable, deterministic base lists — identical on the server and the first
  // client render so hydration matches.
  const base = useMemo(() => {
    const recommendedPool = [
      ...getAppsByCategory("Social"),
      ...getAppsByCategory("DeFi"),
    ].filter(
      (app, index, self) => index === self.findIndex((a) => a.id === app.id)
    );

    return {
      defi: getAppsByCategory("DeFi"),
      nfts: getAppsByCategory("NFTs"),
      featured: featuredApps,
      recommendedPool,
      all: Object.values(apps),
    };
  }, []);

  // Global open counts — drives the popularity ranking in Trending. Loads
  // post-mount; {} until then so SSR/first render stays stable.
  const trendingCounts = useTrending();

  // After mount we re-randomize the order once. A fresh mount happens on every
  // full page load, so the store reshuffles on every reload (see useHydrated).
  const hydrated = useHydrated();
  const { defiApps, featuredSlides, recommendedApps, nftApps, allApps } = useMemo(
    () => {
      const order = <T,>(list: T[]) => (hydrated ? shuffle(list) : list);

      return {
        defiApps: order(base.defi),
        nftApps: order(base.nfts),
        // Rotate a handful of featured apps each reload without changing SSR output.
        featuredSlides: order(base.featured).slice(0, 6),
        // Shuffle the pool first, then cap at 6 so which six surface also varies.
        recommendedApps: order(base.recommendedPool).slice(0, 6),
        allApps: order(base.all),
      };
    },
    [hydrated, base]
  );

  return (
    <div className="flex flex-col gap-12 pb-4 md:gap-16">
      {/* Lead-in headline — the editorial top of the discover home */}
      <div className="-mb-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-tertiary">
          LUKSO UP!Store
        </p>
        <h1 className="mt-1.5 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[40px]">
          Discover apps for your{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            Universal Profile
          </span>
        </h1>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-text-secondary md:text-[16px]">
          Hand-picked mini-apps built on LUKSO — open any of them instantly, or
          add them to your grid when you are signed in.
        </p>
      </div>

      {/* Featured — the single focal band. FeaturedBanner owns its own visual,
          so DiscoverSection contributes only the eyebrow + intro. */}
      <DiscoverSection
        eyebrow="Featured"
        intro="A rotating mix of standout apps, front and center."
      >
        <FeaturedBanner apps={featuredSlides} onAppClick={onAppClick} />
      </DiscoverSection>

      {/* DeFi rail — DiscoverSection owns the heading; AppSlider title is
          suppressed (empty) to avoid a duplicate header. */}
      <DiscoverSection
        eyebrow="Finance"
        title="DeFi apps"
        intro="Swap, send and stake LYX without leaving your profile."
        collapseChildHeading
      >
        <AppSlider title="" apps={defiApps} onAppClick={onAppClick} />
      </DiscoverSection>

      {/* Top charts — data-dense, solid surface. TopChartsSlider renders its own
          "Top charts" heading and filter tabs, so we add only the eyebrow + intro. */}
      <DiscoverSection
        eyebrow="Trending"
        intro="What the LUKSO community is opening most right now."
      >
        <TopChartsSlider
          apps={allApps}
          onAppClick={onAppClick}
          trendingCounts={trendingCounts}
        />
      </DiscoverSection>

      {/* NFTs rail */}
      <DiscoverSection
        eyebrow="Collect"
        title="NFTs & collectibles"
        intro="Mint, swipe and showcase digital assets."
        collapseChildHeading
      >
        <AppSlider title="" apps={nftApps} onAppClick={onAppClick} />
      </DiscoverSection>

      {/* Recommended rail */}
      <DiscoverSection
        eyebrow="For you"
        title="Recommended"
        intro="A mix of social and finance apps worth a look."
        collapseChildHeading
      >
        <AppSlider title="" apps={recommendedApps} onAppClick={onAppClick} />
      </DiscoverSection>
    </div>
  );
}
