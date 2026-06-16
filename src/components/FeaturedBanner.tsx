"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, PlusCircle, Sparkles } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  FeaturedApp,
  featuredApps,
  getPrimaryCategory,
} from "@/data/appCatalog";
import { useAppLaunch } from "@/hooks/useAppLaunch";
import { useGrid } from "@/app/components/providers/gridProvider";
import { cn } from "@/lib/utils";
import GridSelectionDialog from "./GridSelectionDialog";

interface FeaturedBannerProps {
  onAppClick: (app: FeaturedApp) => void;
}

export default function FeaturedBanner({ onAppClick }: FeaturedBannerProps) {
  const reduceMotion = useReducedMotion();
  const { sections } = useGrid();
  const {
    canInstallToGrid,
    getPrimaryAction,
    openApp,
    isInstalling,
    pendingApp,
    showGridSelection,
    setShowGridSelection,
    handleGridSelect,
    handleGridSelectionCancel,
  } = useAppLaunch();

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(featuredApps.length);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    setSlideCount(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleDotClick = useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  );

  return (
    <section className="mb-10" aria-label="Featured apps">
      <Carousel className="w-full" opts={{ align: "start", loop: true }} setApi={setApi}>
        <CarouselContent>
          {featuredApps.map((app, index) => {
            const primary = getPrimaryAction(app);
            const category = getPrimaryCategory(app);
            const installingThis =
              isInstalling && pendingApp?.id === app.id;

            return (
              <CarouselItem key={app.id ?? index}>
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative isolate overflow-hidden rounded-xl"
                >
                  {/* Catalog art backdrop */}
                  <div className="absolute inset-0 -z-10">
                    <Image
                      src={app.banner}
                      alt=""
                      aria-hidden="true"
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      className={cn(
                        "object-cover transition-transform duration-700 ease-out",
                        !reduceMotion && "group-hover:scale-[1.04]"
                      )}
                    />
                    {/* Brand wash + legibility scrim layered over art */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand/35 via-transparent to-brand-2/25 mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-foreground/10 dark:from-background/90 dark:via-background/55 dark:to-background/10" />
                  </div>

                  {/* Ambient brand glow */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3 bg-glow-ambient",
                      !reduceMotion && "animate-glow-drift"
                    )}
                  />

                  {/* Clickable hero surface */}
                  <button
                    type="button"
                    onClick={() => onAppClick(app)}
                    aria-label={`View details for ${app.title}`}
                    className="relative flex min-h-[16rem] w-full flex-col justify-end gap-5 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-inset sm:min-h-[18rem] sm:p-8"
                  >
                    {/* Eyebrow */}
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-white backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Featured
                    </span>

                    {/* Identity row: icon + name + category */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-glass backdrop-blur-md sm:h-20 sm:w-20">
                          <Image
                            src={app.icon ?? ""}
                            alt={`${app.app.name} icon`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl">
                            {app.title}
                          </h2>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-white/85">
                            <span className="font-medium">{app.app.name}</span>
                            <span aria-hidden="true" className="text-white/40">
                              &middot;
                            </span>
                            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium">
                              {category}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Context-aware actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {primary.kind === "install" ? (
                        <>
                          <ActionButton
                            label={installingThis ? "Adding…" : primary.label}
                            icon={<PlusCircle className="h-4 w-4" aria-hidden="true" />}
                            loading={installingThis}
                            reduceMotion={!!reduceMotion}
                            onClick={(e) => {
                              e.stopPropagation();
                              primary.run(app);
                            }}
                            ariaLabel={`${primary.label}: ${app.title}`}
                            variant="gradient"
                          />
                          {/* Secondary Open while in grid context */}
                          <ActionButton
                            label="Open"
                            icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                            reduceMotion={!!reduceMotion}
                            onClick={(e) => {
                              e.stopPropagation();
                              openApp(app);
                            }}
                            ariaLabel={`Open ${app.title}`}
                            variant="glass-light"
                          />
                        </>
                      ) : (
                        <ActionButton
                          label={primary.label}
                          icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                          reduceMotion={!!reduceMotion}
                          onClick={(e) => {
                            e.stopPropagation();
                            primary.run(app);
                          }}
                          ariaLabel={`${primary.label} ${app.title}`}
                          variant="gradient"
                        />
                      )}
                    </div>
                  </button>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Carousel dots */}
      {slideCount > 1 && (
        <div
          className="mt-4 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Choose featured app"
        >
          {Array.from({ length: slideCount }).map((_, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Go to featured app ${i + 1}`}
                onClick={() => handleDotClick(i)}
                className="flex h-11 min-h-[44px] w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    active
                      ? "h-2 w-6 bg-brand"
                      : "h-2 w-2 bg-border-strong hover:bg-text-tertiary"
                  )}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Grid Selection Dialog (grid install path) */}
      {canInstallToGrid && (
        <GridSelectionDialog
          open={showGridSelection}
          onOpenChange={setShowGridSelection}
          sections={sections}
          appName={pendingApp?.app?.name ?? "App"}
          onGridSelect={handleGridSelect}
          onCancel={handleGridSelectionCancel}
        />
      )}
    </section>
  );
}

/* ---- Local hero action button with tasteful press motion ---- */

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  ariaLabel: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  reduceMotion: boolean;
  loading?: boolean;
  variant: "gradient" | "glass-light";
}

function ActionButton({
  label,
  icon,
  ariaLabel,
  onClick,
  reduceMotion,
  loading = false,
  variant,
}: ActionButtonProps) {
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="inline-flex"
    >
      <Button
        type="button"
        size="pill"
        variant={variant === "gradient" ? "gradient" : "glass"}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        disabled={loading}
        onClick={onClick}
        className={cn(
          "font-semibold focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          variant === "glass-light" &&
            "border border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
        )}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          icon
        )}
        <span>{label}</span>
      </Button>
    </motion.div>
  );
}
