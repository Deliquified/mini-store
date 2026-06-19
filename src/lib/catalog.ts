import { apps, type App } from "@/data/appCatalog";
import { getAddToGridUrl, getWidgetAddToGridUrl } from "@/lib/addToGrid";
import { absoluteUrl, siteUrl } from "@/lib/site";

export interface SerializedWidget {
  name: string;
  url: string;
  gridSize: { width: number; height: number };
  description?: string;
  addToGridUrl: string;
}

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
  /** All addable widgets: the primary surface first, then any extra widgets. */
  widgets: SerializedWidget[];
}

export function serializeApp(app: App): SerializedApp {
  const widgets: SerializedWidget[] = [
    {
      name: app.app.name,
      url: app.app.url,
      gridSize: {
        width: app.app.defaultGridSize.width,
        height: app.app.defaultGridSize.height,
      },
      addToGridUrl: getAddToGridUrl(app),
    },
    ...(app.widgets ?? []).map((w) => ({
      name: w.name,
      url: w.url,
      gridSize: w.gridSize,
      description: w.description,
      addToGridUrl: getWidgetAddToGridUrl(w),
    })),
  ];

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
    widgets,
  };
}

/** Every store app, serialized. Stable insertion order from the catalog. */
export function serializeCatalog(): SerializedApp[] {
  return Object.values(apps).map(serializeApp);
}
