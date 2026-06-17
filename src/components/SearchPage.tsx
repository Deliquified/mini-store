"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import {
  BadgePercent,
  Bot,
  BookOpen,
  Brain,
  Coins,
  ExternalLink,
  Gamepad2,
  Globe,
  Landmark,
  Layers3,
  Loader2,
  Music,
  Palette,
  PlusCircle,
  Search,
  Shield,
  Shirt,
  ShoppingCart,
  Star,
  Store,
  Users,
  X,
} from "lucide-react";

import { useGrid } from "@/app/components/providers/gridProvider";
import { Button } from "@/components/ui/button";
import GridSelectionDialog from "@/components/GridSelectionDialog";
import { useAppLaunch } from "@/hooks/useAppLaunch";
import { cn } from "@/lib/utils";
import { searchApps } from "@/utils/search";
import { useHydrated } from "@/hooks/useHydrated";
import {
  categories as appCategories,
  type App,
  apps,
  shuffle,
} from "@/data/appCatalog";

interface SearchPageProps {
  onAppClick: (app: App) => void;
}

type CategoryFilter = "all" | string;

const categoryIcons: Record<string, ReactNode> = {
  Art: <Palette className="h-4 w-4" />,
  AI: <Brain className="h-4 w-4" />,
  Brands: <Store className="h-4 w-4" />,
  Community: <Users className="h-4 w-4" />,
  DAOs: <Landmark className="h-4 w-4" />,
  DeFi: <Coins className="h-4 w-4" />,
  Exchanges: <BadgePercent className="h-4 w-4" />,
  Fashion: <Shirt className="h-4 w-4" />,
  Gaming: <Gamepad2 className="h-4 w-4" />,
  Infrastructure: <Layers3 className="h-4 w-4" />,
  Marketplaces: <ShoppingCart className="h-4 w-4" />,
  "Mini-Apps": <Bot className="h-4 w-4" />,
  Music: <Music className="h-4 w-4" />,
  NFTs: <Star className="h-4 w-4" />,
  Security: <Shield className="h-4 w-4" />,
  Social: <Globe className="h-4 w-4" />,
  Staking: <BookOpen className="h-4 w-4" />,
};

export default function SearchPage({ onAppClick }: SearchPageProps) {
  const { sections } = useGrid();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const allApps = useMemo(() => Object.values(apps), []);
  const allCategories = useMemo(() => Object.values(appCategories), []);

  // Randomize the browse order once per page load (mount). Gated on hydration
  // so SSR markup matches the first client render. While searching we keep the
  // relevance order from searchApps() instead of reshuffling.
  const hydrated = useHydrated();
  const browseApps = useMemo(
    () => (hydrated ? shuffle(allApps) : allApps),
    [hydrated, allApps]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allApps.forEach((app) => {
      app.categories.forEach((category) => {
        counts.set(category, (counts.get(category) ?? 0) + 1);
      });
    });

    return allCategories
      .map((category) => ({
        ...category,
        count: counts.get(category.id) ?? 0,
      }))
      .filter((category) => category.count > 0);
  }, [allApps, allCategories]);

  const activeCategory = useMemo(
    () =>
      selectedCategory === "all"
        ? null
        : categoryCounts.find((category) => category.id === selectedCategory) ?? null,
    [categoryCounts, selectedCategory]
  );

  const visibleApps = useMemo(() => {
    const searched = deferredSearchTerm.trim()
      ? searchApps(allApps, deferredSearchTerm)
      : browseApps;

    if (selectedCategory === "all") return searched;
    return searched.filter((app) => app.categories.includes(selectedCategory));
  }, [allApps, browseApps, deferredSearchTerm, selectedCategory]);

  const {
    getPrimaryAction,
    isInstalling,
    pendingApp,
    showGridSelection,
    setShowGridSelection,
    handleGridSelect,
    handleGridSelectionCancel,
  } = useAppLaunch();

  const resultLabel =
    visibleApps.length === 1 ? "1 app" : `${visibleApps.length} apps`;

  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-[calc(121px+env(safe-area-inset-top))] z-30 border-b border-border bg-background/95 backdrop-blur-xl md:top-[calc(64px+env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-[1100px] px-3 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <label htmlFor="store-search" className="sr-only">
              Search apps
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
              />
              <input
                id="store-search"
                type="search"
                inputMode="search"
                placeholder="Search apps"
                autoComplete="off"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-full border border-border-strong bg-card pl-10 pr-11 text-[16px] text-foreground shadow-rest outline-none placeholder:text-text-tertiary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-12 sm:text-[15px]"
              />
              {searchTerm ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>

          </div>

          <nav
            aria-label="Filter apps by category"
            className="-mx-3 mt-3 overflow-x-auto px-3 py-1 sm:-mx-6 sm:px-6"
          >
            <div className="flex min-w-max gap-2">
              <CategoryChip
                label="All"
                count={allApps.length}
                active={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              />
              {categoryCounts.map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.displayName}
                  count={category.count}
                  icon={categoryIcons[category.name] || <Star className="h-4 w-4" />}
                  active={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-3 pb-safe-content pt-3 sm:px-6 sm:pt-5">
        <div className="mb-3 flex min-h-7 items-center justify-between gap-3 px-1">
          <p className="truncate text-[13px] font-medium text-text-secondary">
            {activeCategory ? `${activeCategory.displayName} - ${resultLabel}` : resultLabel}
          </p>
          {selectedCategory !== "all" || searchTerm ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="shrink-0 text-[13px] font-medium text-brand-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Reset
            </button>
          ) : null}
        </div>

        {visibleApps.length > 0 ? (
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleApps.map((app, index) => (
              <DirectoryAppRow
                key={app.id ?? app.app.name}
                app={app}
                index={index}
                onAppClick={onAppClick}
                getPrimaryAction={getPrimaryAction}
                isInstalling={isInstalling}
                pendingApp={pendingApp}
              />
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-12 max-w-sm rounded-lg border border-border bg-card px-5 py-10 text-center shadow-rest">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-text-tertiary">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-foreground">No apps found</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Try another search term or switch category.
            </p>
          </div>
        )}
      </main>

      <GridSelectionDialog
        open={showGridSelection}
        onOpenChange={setShowGridSelection}
        sections={sections}
        appName={pendingApp?.app.name ?? "App"}
        onGridSelect={handleGridSelect}
        onCancel={handleGridSelectionCancel}
      />
    </div>
  );
}

interface CategoryChipProps {
  label: string;
  count: number;
  active: boolean;
  icon?: ReactNode;
  onClick: () => void;
}

function CategoryChip({ label, count, active, icon, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 min-w-fit items-center gap-1.5 rounded-full border px-3 text-sm font-medium shadow-glass backdrop-blur-xl transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-white/80 bg-white/50 text-brand-text ring-1 ring-inset ring-white/55 hover:bg-white/60 dark:border-white/15 dark:bg-white/15 dark:text-white dark:hover:bg-white/20"
          : "border-white/65 bg-white/30 text-foreground ring-1 ring-inset ring-white/35 hover:bg-white/45 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
      )}
    >
      {icon ? (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[11px] leading-none",
          active
            ? "bg-brand/10 text-brand-text dark:bg-white/15 dark:text-white"
            : "bg-white/35 text-text-secondary dark:bg-white/10 dark:text-white/70"
        )}
      >
        {count}
      </span>
    </button>
  );
}

interface DirectoryAppRowProps {
  app: App;
  index: number;
  onAppClick: (app: App) => void;
  getPrimaryAction: ReturnType<typeof useAppLaunch>["getPrimaryAction"];
  isInstalling: boolean;
  pendingApp: App | null;
}

function DirectoryAppRow({
  app,
  index,
  onAppClick,
  getPrimaryAction,
  isInstalling,
  pendingApp,
}: DirectoryAppRowProps) {
  const action = getPrimaryAction(app);
  const isBusy =
    isInstalling &&
    (pendingApp ? (pendingApp.id ?? pendingApp.app.name) === (app.id ?? app.app.name) : true);
  const developer = app.developer || app.publisherProfile;

  return (
    <li className="rounded-lg border border-border bg-card shadow-rest transition hover:shadow-hover">
      <div className="grid min-h-[76px] grid-cols-[52px_minmax(0,1fr)_40px] items-center gap-3 p-2.5 sm:grid-cols-[52px_minmax(0,1fr)_auto]">
        <button
          type="button"
          onClick={() => onAppClick(app)}
          className="relative flex h-[52px] w-[52px] overflow-hidden rounded-2xl border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`View ${app.app.name}`}
        >
          {app.icon ? (
            <Image
              src={app.icon}
              alt={`${app.app.name} icon`}
              fill
              sizes="52px"
              priority={index < 8}
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-brand-gradient-soft text-base font-semibold text-white">
              {app.app.name.charAt(0)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onAppClick(app)}
          className="min-w-0 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`View ${app.app.name}`}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold leading-snug text-foreground">
              {app.app.name}
            </span>
            <span className="block truncate text-[13px] leading-5 text-text-secondary">
              {developer}
            </span>
            <span className="mt-1 flex min-h-5 flex-wrap gap-1">
              {app.categories.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium leading-4 text-text-secondary"
                >
                  {category}
                </span>
              ))}
            </span>
          </span>
        </button>

        <Button
          type="button"
          variant={action.kind === "install" ? "brand" : "ghost-outline"}
          size="pill"
          className="h-10 min-h-10 w-10 shrink-0 px-0 text-[13px] sm:w-auto sm:px-3"
          disabled={isBusy}
          aria-label={`${action.label}: ${app.app.name}`}
          onClick={(event) => {
            event.stopPropagation();
            action.run(app);
          }}
        >
          {isBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="hidden sm:inline">Adding</span>
            </>
          ) : (
            <>
              {action.kind === "install" ? (
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{action.label}</span>
            </>
          )}
        </Button>
      </div>
    </li>
  );
}
