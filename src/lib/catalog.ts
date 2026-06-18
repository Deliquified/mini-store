import { apps, type App } from "@/data/appCatalog";
import { getAddToGridUrl } from "@/lib/addToGrid";
import { absoluteUrl, siteUrl } from "@/lib/site";

/**
 * A flat, machine-readable view of one store app — built for agents/LLMs and the
 * /api/apps endpoint. Every URL is absolute and ready to use, including the
 * one-click `addToGridUrl` (universaleverything.io add-widget deep link).
 */
export interface SerializedApp {
  id: string;
  name: string;
  developer: string;
  description: string;
  categories: string[];
  tags: string[];
  appUrl: string;
  detailUrl: string;
  iconUrl: string;
  gridSize: { width: number; height: number };
  addToGridUrl: string;
  sourceCode?: string;
}

export function serializeApp(app: App): SerializedApp {
  return {
    id: app.id ?? "",
    name: app.app.name,
    developer: app.developer || app.publisherProfile || "Unknown",
    description:
      `${app.app.name}${app.developer ? ` by ${app.developer}` : ""} — a Mini-App` +
      ` for LUKSO Universal Profiles${
        app.categories.length ? ` (${app.categories.join(", ")})` : ""
      }.`,
    categories: app.categories,
    tags: app.tags ?? [],
    appUrl: app.app.url,
    detailUrl: `${siteUrl}/store/${encodeURIComponent(app.id ?? "")}`,
    iconUrl: app.icon ? absoluteUrl(app.icon) : "",
    gridSize: {
      width: app.app.defaultGridSize.width,
      height: app.app.defaultGridSize.height,
    },
    addToGridUrl: getAddToGridUrl(app),
    sourceCode: app.app.sourceCode,
  };
}

/** Every store app, serialized. Stable insertion order from the catalog. */
export function serializeCatalog(): SerializedApp[] {
  return Object.values(apps).map(serializeApp);
}
