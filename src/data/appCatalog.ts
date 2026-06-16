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
export const apps: Record<string, App> = Object.fromEntries(
  Object.entries(manifest).map(([slug, entry]) => [slug, toApp(slug, entry)])
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
  .filter(([, entry]) => Boolean(entry.featuredTitle))
  .map(([slug, entry]) => ({
    ...apps[slug],
    title: entry.featuredTitle as string,
    banner: apps[slug].banner || "",
  }));

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
