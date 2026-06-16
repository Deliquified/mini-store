"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "../app/components/providers/profileProvider";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Users,
  Brain,
  Gamepad2,
  Landmark,
  Palette,
  Music,
  ShoppingCart,
  Shield,
  Bot,
  Coins,
  Shirt,
  BookOpen,
  Globe,
  Star,
  BadgePercent,
  Store,
  Layers3,
  X,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import {
  categories as appCategories,
  Category,
  App,
  apps,
} from "../data/appCatalog";
import CategoryDetail from "./CategoryDetail";
import { searchApps } from "@/utils/search";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAppLaunch } from "@/hooks/useAppLaunch";
import { useGrid } from "@/app/components/providers/gridProvider";
import GridSelectionDialog from "./GridSelectionDialog";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";

interface SearchPageProps {
  onAppClick: (app: App) => void;
}

// Map category name to a Lucide icon. Color is inherited (currentColor) so the
// icon picks up the brand tint applied on the tile.
const categoryIcons: Record<string, React.ReactNode> = {
  Art: <Palette className="h-5 w-5" />,
  AI: <Brain className="h-5 w-5" />,
  Brands: <Store className="h-5 w-5" />,
  Community: <Users className="h-5 w-5" />,
  DAOs: <Landmark className="h-5 w-5" />,
  DeFi: <Coins className="h-5 w-5" />,
  Exchanges: <BadgePercent className="h-5 w-5" />,
  Fashion: <Shirt className="h-5 w-5" />,
  Gaming: <Gamepad2 className="h-5 w-5" />,
  Infrastructure: <Layers3 className="h-5 w-5" />,
  Marketplaces: <ShoppingCart className="h-5 w-5" />,
  "Mini-Apps": <Bot className="h-5 w-5" />,
  Music: <Music className="h-5 w-5" />,
  NFTs: <Star className="h-5 w-5" />,
  Security: <Shield className="h-5 w-5" />,
  Social: <Globe className="h-5 w-5" />,
  Staking: <BookOpen className="h-5 w-5" />,
};

export default function SearchPage({ onAppClick }: SearchPageProps) {
  const { profileData } = useProfile();
  const { sections } = useGrid();
  const reduceMotion = useReducedMotion();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchResults, setSearchResults] = useState<App[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    canInstallToGrid,
    getPrimaryAction,
    isInstalling,
    pendingApp,
    showGridSelection,
    setShowGridSelection,
    handleGridSelect,
    handleGridSelectionCancel,
  } = useAppLaunch();

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const results = searchApps(Object.values(apps), searchTerm);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchTerm]);

  const allCategories = useMemo(() => Object.values(appCategories), []);

  const handleCategoryClick = (category: Category) => {
    window.scrollTo(0, 0);
    setSelectedCategory(category);
  };

  // ---- Motion variants (gated on prefers-reduced-motion) ----
  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.04 },
    },
  };
  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (selectedCategory) {
    return (
      <CategoryDetail
        category={selectedCategory}
        onBack={() => {
          window.scrollTo(0, 0);
          setSelectedCategory(null);
        }}
        onAppClick={onAppClick}
      />
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      {/* Ambient brand glow behind the search header (decorative) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-glow-ambient ${
          reduceMotion ? "" : "animate-glow-drift"
        }`}
      />

      {/* Search header — frosted glass chrome */}
      <header className="glass-nav pt-safe sticky top-0 z-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <label htmlFor="store-search" className="sr-only">
              Search apps
            </label>
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
              />
              <input
                id="store-search"
                type="search"
                inputMode="search"
                placeholder="Search apps"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass h-12 w-full rounded-full border-0 pl-12 pr-12 text-[15px] text-foreground placeholder:text-text-tertiary transition-[width,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Avatar className="h-11 w-11 shrink-0 ring-1 ring-border-strong">
              <AvatarImage
                src={profileData?.profileImages?.[0]?.url || ""}
                alt={profileData?.name ? `${profileData.name} profile` : "Your profile"}
              />
              <AvatarFallback className="bg-muted text-xs font-medium text-text-secondary">
                UP
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-safe-content relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          {!isSearching ? (
            <motion.section
              key="browse"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={reduceMotion ? undefined : { opacity: 0 }}
              aria-label="Browse categories"
            >
              <motion.div variants={itemVariants} className="mb-1.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-tertiary">
                  Browse
                </p>
                <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] text-foreground">
                  Explore apps
                </h1>
              </motion.div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {allCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    type="button"
                    variants={itemVariants}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => handleCategoryClick(category)}
                    className="group flex min-h-[64px] items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-left shadow-rest transition-shadow hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {category.displayName}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand/15">
                      {categoryIcons[category.name] || <Star className="h-5 w-5" />}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={reduceMotion ? undefined : { opacity: 0 }}
              aria-label="Search results"
              aria-live="polite"
            >
              <motion.h2
                variants={itemVariants}
                className="mb-4 text-[13px] font-medium text-text-secondary"
              >
                {searchResults.length}{" "}
                {searchResults.length === 1 ? "result" : "results"}
                {searchTerm.trim() ? ` for “${searchTerm.trim()}”` : ""}
              </motion.h2>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((app) => (
                    <ResultRow
                      key={app.id ?? app.app.name}
                      app={app}
                      variants={itemVariants}
                      reduceMotion={reduceMotion}
                      onAppClick={onAppClick}
                      canInstallToGrid={canInstallToGrid}
                      getPrimaryAction={getPrimaryAction}
                      isInstalling={isInstalling}
                      pendingApp={pendingApp}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="content-card mx-auto mt-6 max-w-md text-center hover:translate-y-0 hover:shadow-rest"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-text-tertiary">
                    <Search className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    No apps found
                  </h3>
                  <p className="mt-1 text-[15px] text-text-secondary">
                    Nothing matched “{searchTerm.trim()}”. Try a different term or
                    browse by category.
                  </p>
                  <Button
                    variant="ghost-outline"
                    size="pill"
                    className="mt-5"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear search
                  </Button>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Grid Selection Dialog (only ever reached when canInstallToGrid) */}
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

// ---- Result row: context-aware action via the launch hook ----
interface ResultRowProps {
  app: App;
  variants: Variants;
  reduceMotion: boolean | null;
  onAppClick: (app: App) => void;
  canInstallToGrid: boolean;
  getPrimaryAction: ReturnType<typeof useAppLaunch>["getPrimaryAction"];
  isInstalling: boolean;
  pendingApp: App | null;
}

function ResultRow({
  app,
  variants,
  reduceMotion,
  onAppClick,
  canInstallToGrid,
  getPrimaryAction,
  isInstalling,
  pendingApp,
}: ResultRowProps) {
  const action = getPrimaryAction(app);
  // Show the spinner only on the row whose install is actually pending.
  const isBusy =
    canInstallToGrid &&
    isInstalling &&
    (pendingApp ? (pendingApp.id ?? pendingApp.app.name) === (app.id ?? app.app.name) : true);

  return (
    <motion.div
      variants={variants}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="button"
      tabIndex={0}
      onClick={() => onAppClick(app)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAppClick(app);
        }
      }}
      className="flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-rest transition-shadow hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
        {app.icon ? (
          <Image
            src={app.icon}
            alt={`${app.app.name} icon`}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-medium text-foreground">
          {app.app.name}
        </h3>
        {app.developer ? (
          <p className="truncate text-[13px] text-text-secondary">
            {app.developer}
          </p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {app.categories.slice(0, 2).map((category, idx) => (
            <span key={idx} className="chip">
              {category}
            </span>
          ))}
        </div>
      </div>

      <Button
        variant={action.kind === "install" ? "brand" : "ghost-outline"}
        size="pill"
        className="shrink-0"
        disabled={isBusy}
        aria-label={`${action.label}: ${app.app.name}`}
        onClick={(e) => {
          e.stopPropagation();
          action.run(app);
        }}
      >
        {isBusy ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span>Adding…</span>
          </>
        ) : (
          <>
            {action.kind === "install" ? (
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{action.label}</span>
          </>
        )}
      </Button>
    </motion.div>
  );
}
