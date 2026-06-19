import type { App, AppWidget } from "@/data/appCatalog";

/**
 * Universal Everything "add-widget" flow.
 *
 * Per the LUKSO guide "Add Mini-App to a Grid", any Mini-App (or one of an app's
 * individual widgets) can be added to a Universal Profile Grid from ANY external
 * site (desktop included — no iframe / up-provider required) by linking to the
 * `/add-widget` route with a URL-encoded `data` query parameter holding the Grid
 * widget JSON.
 *
 * See: https://docs.lukso.tech/learn/mini-apps/add-mini-app-to-grid
 */
export const ADD_WIDGET_BASE = "https://universaleverything.io/add-widget";

export interface GridWidget {
  properties: { src: string };
  type: "IFRAME";
  width: number;
  height: number;
}

export interface GridWidgetInput {
  url: string;
  width: number;
  height: number;
}

/** The LSP-28 Grid widget config (an embedded iframe) for a URL + footprint. */
export function buildGridWidget({ url, width, height }: GridWidgetInput): GridWidget {
  return { properties: { src: url }, type: "IFRAME", width, height };
}

/**
 * Deep link that opens the user's Universal Profile add-widget flow with this
 * widget pre-filled. universaleverything.io handles connect → choose Grid → add.
 * Works on desktop and mobile, in or out of the Grid. The `data` JSON MUST be
 * URL-encoded (it contains `:` `/` `{` `}` `"`).
 */
export function gridWidgetUrl(input: GridWidgetInput): string {
  const data = encodeURIComponent(JSON.stringify(buildGridWidget(input)));
  return `${ADD_WIDGET_BASE}?data=${data}`;
}

/** Add-widget deep link for an app's primary surface. */
export function getAddToGridUrl(app: App): string {
  return gridWidgetUrl({
    url: app.app.url,
    width: app.app.defaultGridSize.width,
    height: app.app.defaultGridSize.height,
  });
}

/** Add-widget deep link for one of an app's individual widgets. */
export function getWidgetAddToGridUrl(widget: AppWidget): string {
  return gridWidgetUrl({
    url: widget.url,
    width: widget.gridSize.width,
    height: widget.gridSize.height,
  });
}
