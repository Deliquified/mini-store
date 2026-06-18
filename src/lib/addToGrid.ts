import type { App } from "@/data/appCatalog";

/**
 * Universal Everything "add-widget" flow.
 *
 * Per the LUKSO guide "Add Mini-App to a Grid", any Mini-App can be added to a
 * Universal Profile Grid from ANY external site (desktop included — no iframe /
 * up-provider required) by linking to the `/add-widget` route with a
 * URL-encoded `data` query parameter holding the Grid widget JSON.
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

/** The LSP-28 Grid widget config for a Mini-App (an embedded iframe). */
export function buildGridWidget(app: App): GridWidget {
  return {
    properties: { src: app.app.url },
    type: "IFRAME",
    width: app.app.defaultGridSize.width,
    height: app.app.defaultGridSize.height,
  };
}

/**
 * Deep link that opens the user's Universal Profile add-widget flow with this
 * Mini-App pre-filled. universaleverything.io handles connect → choose Grid →
 * add. Works on desktop and mobile, in or out of the Grid. The `data` JSON MUST
 * be URL-encoded (it contains `:` `/` `{` `}` `"`).
 */
export function getAddToGridUrl(app: App): string {
  const data = encodeURIComponent(JSON.stringify(buildGridWidget(app)));
  return `${ADD_WIDGET_BASE}?data=${data}`;
}
