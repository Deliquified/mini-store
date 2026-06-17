/*
 * App catalog.
 *
 * To ADD AN APP you only edit `apps.json` and drop images into
 * `public/apps/<slug>/` — see docs/adding-apps.md. This file is just the loader
 * that expands that plain data into the shape the UI consumes; you should not
 * need to touch it when adding apps.
 */

import appsManifest from "./apps.json";

// Shape of a single entry in apps.json
interface AppManifestEntry {
  name: string;
  url: string;
  developer: string;
  publisher: string;
  categories: string[];
  gridSize: number[]; // [width, height]
  screenshots: number; // count of screenshot-N.png in public/apps/<slug>/
  sourceCode?: string;
  tags?: string[];
  featured?: boolean;
  featuredTitle?: string; // when present, the app appears in the featured hero
}

// App Types and Interfaces (unchanged — the rest of the app relies on this shape)
export interface App {
  categories: string[];
  publisherProfile: string;
  app: {
    profile: string;
    name: string;
    url: string;
    sourceCode?: string;
    defaultGridSize: {
      width: number;
      height: number;
    };
    previewImages: string[];
  };

  // Derived convenience fields used throughout the UI
  id?: string;
  icon?: string;
  banner?: string;
  developer?: string;
  tags?: string[];
  featured?: boolean;
}

export interface FeaturedApp extends App {
  title: string;
  banner: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
}

const manifest = appsManifest as Record<string, AppManifestEntry>;

// Build the public asset path for an app's image by folder convention.
const assetBase = (slug: string) => `/apps/${slug}`;

// Expand one manifest entry into the full App shape.
function toApp(slug: string, entry: AppManifestEntry): App {
  const base = assetBase(slug);
  const [width, height] = entry.gridSize;
  const previewImages = Array.from(
    { length: Math.max(0, entry.screenshots) },
    (_, i) => `${base}/screenshot-${i + 1}.png`
  );

  return {
    categories: entry.categories,
    publisherProfile: entry.publisher,
    app: {
      profile: entry.publisher,
      name: entry.name,
      url: entry.url,
      sourceCode: entry.sourceCode,
      defaultGridSize: { width, height },
      previewImages,
    },
    id: slug,
    icon: `${base}/logo.png`,
    banner: `${base}/banner.png`,
    developer: entry.developer,
    tags: entry.tags,
    featured: entry.featured ?? false,
  };
}

// All apps in the store (insertion order preserved from apps.json)
const manifestApps: Record<string, App> = Object.fromEntries(
  Object.entries(manifest).map(([slug, entry]) => [slug, toApp(slug, entry)])
);

const uniqueValues = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter(Boolean) as string[]));

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/https?:\/\//, "")
    .replace(/\/$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getProductFamily = (app: App) => {
  const [family] = app.app.name.split(":");
  return family.trim() || app.app.name;
};

const getDeduplicationKey = (app: App) => {
  const owner = app.publisherProfile || app.developer || "";
  return `${normalizeKey(owner)}:${normalizeKey(getProductFamily(app))}`;
};

const mergeDuplicateApps = (canonical: App, duplicate: App): App => {
  return {
    ...canonical,
    categories: uniqueValues([...canonical.categories, ...duplicate.categories]),
    tags: uniqueValues([
      ...(canonical.tags ?? []),
      ...(duplicate.tags ?? []),
      duplicate.app.name,
      getProductFamily(duplicate),
    ]),
    featured: canonical.featured || duplicate.featured,
  };
};

// Public app list with product-family duplicates collapsed. This keeps variants
// like several "Stakingverse: ..." widgets from showing as separate store apps.
export const apps: Record<string, App> = Object.fromEntries(
  Object.entries(manifestApps).reduce<Array<[string, App]>>((deduped, [slug, app]) => {
    const key = getDeduplicationKey(app);
    const existingIndex = deduped.findIndex(([, existingApp]) => {
      return getDeduplicationKey(existingApp) === key;
    });

    if (existingIndex === -1) {
      deduped.push([slug, app]);
      return deduped;
    }

    const [existingSlug, existingApp] = deduped[existingIndex];
    deduped[existingIndex] = [existingSlug, mergeDuplicateApps(existingApp, app)];
    return deduped;
  }, [])
);

// Categories definition (taxonomy — edit here to add a new category)
export const categories: Record<string, Category> = {
  Art: { id: "Art", name: "Art", displayName: "Art" },
  AI: { id: "AI", name: "AI", displayName: "AI" },
  Brands: { id: "Brands", name: "Brands", displayName: "Brands" },
  Community: { id: "Community", name: "Community", displayName: "Community" },
  DAOs: { id: "DAOs", name: "DAOs", displayName: "DAOs" },
  DeFi: { id: "DeFi", name: "DeFi", displayName: "DeFi" },
  Exchanges: { id: "Exchanges", name: "Exchanges", displayName: "Exchanges" },
  Fashion: { id: "Fashion", name: "Fashion", displayName: "Fashion" },
  Gaming: { id: "Gaming", name: "Gaming", displayName: "Gaming" },
  Infrastructure: { id: "Infrastructure", name: "Infrastructure", displayName: "Infrastructure" },
  Marketplaces: { id: "Marketplaces", name: "Marketplaces", displayName: "Marketplaces" },
  Music: { id: "Music", name: "Music", displayName: "Music" },
  NFTs: { id: "NFTs", name: "NFTs", displayName: "NFTs" },
  Security: { id: "Security", name: "Security", displayName: "Security" },
  Social: { id: "Social", name: "Social", displayName: "Social" },
  Staking: { id: "Staking", name: "Staking", displayName: "Staking" },
};

// Featured apps (hero carousel) — built from any entry with a `featuredTitle`
export const featuredApps: FeaturedApp[] = Object.entries(manifest)
  .flatMap(([slug, entry]) => {
    const app = apps[slug];
    if (!entry.featuredTitle || !app) return [];

    return [
      {
        ...app,
        title: entry.featuredTitle,
        banner: app.banner || "",
      },
    ];
  });

// Sample categories for display
export const sampleCategories = ["Social", "AI", "Gaming", "DeFi", "NFTs"];

// Helper functions to retrieve data
export const getAppsByCategory = (categoryId: string): App[] => {
  return Object.values(apps).filter((app) => app.categories.includes(categoryId));
};

// Get the primary category (first in the array) of an app
export const getPrimaryCategory = (app: App): string => {
  return app.categories[0] || "";
};

export const getFeaturedApps = (): FeaturedApp[] => {
  return featuredApps;
};

export const getTopCategories = (): Category[] => {
  return sampleCategories.map((id) => categories[id]).filter(Boolean);
};

// Fisher–Yates shuffle — returns a new array, leaves the input untouched.
// Used to randomize the store rails on each reload (see useHydrated()).
export const shuffle = <T>(items: readonly T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
