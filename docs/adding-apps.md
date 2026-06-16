# Adding apps to the LUKSO App Store catalog

This is the canonical instruction set for adding (or editing) apps in the store.
An agent should be able to complete the task using **only** this file.

## Where everything lives

- **Catalog file (the only code you edit):** `src/data/appCatalog.ts`
- **Image assets:** `src/data/icons/<app-slug>/`

Adding one app = drop in some images + 3 small edits to `appCatalog.ts`
(an `import` block, an entry in the `apps` record, and — optionally — a featured entry).

---

## Step 1 — Add the image assets

Create a folder named after the app's slug and add the art:

```
src/data/icons/<app-slug>/
  logo.png        # square app icon            (required)
  banner.png      # wide banner, ~16:9         (required)
  image_1.png     # screenshot 1               (at least one required)
  image_2.png     # screenshot 2 (optional)
  ...
```

- Formats: `.png`, `.jpg`, or `.webp` all work.
- `logo` should be **square**; screenshots are shown in a phone-style carousel (tall/portrait looks best).
- The `<app-slug>` is a lowercase, hyphenated id, e.g. `stakingverse-staking`, `aratta-labs-pigmint`.

> Images are imported as **static assets** (see Step 2). Do not reference them as
> raw `https://` URL strings — a remote URL would also require adding its host to
> `images.domains` in `next.config.js`.

---

## Step 2 — Import the assets at the top of `appCatalog.ts`

Follow the existing pattern. Each asset is imported, then used via `.src`:

```ts
// <App Name>
import myappLogo from "./icons/<app-slug>/logo.png";
import myappBanner from "./icons/<app-slug>/banner.png";
import myappShot1 from "./icons/<app-slug>/image_1.png";
import myappShot2 from "./icons/<app-slug>/image_2.png";
```

---

## Step 3 — Add an entry to the `apps` record

The **object key MUST equal the `id` field** (both are the slug). Use this template:

```ts
"<app-slug>": {
  categories: ["DeFi", "Staking"],            // 1+ values, each from the valid list below
  publisherProfile: "0x...",                  // publisher's Universal Profile address
  app: {
    profile: "0x...",                         // usually the same as publisherProfile
    name: "App Name: Short Tagline",          // display name shown across the store
    url: "https://your-app.example.com/",     // the LIVE app — this is what "Open" launches
    sourceCode: "https://github.com/...",     // optional
    defaultGridSize: { width: 1, height: 2 }, // size when installed into a UP grid (1x1, 1x2, 2x2…)
    previewImages: [                          // screenshots, in display order
      myappShot1.src,
      myappShot2.src,
    ],
  },

  // Typed as "legacy / optional" but the UI actively uses them — always include:
  id: "<app-slug>",                           // MUST match the object key above
  icon: myappLogo.src,                        // square icon (cards, lists, detail page)
  banner: myappBanner.src,                    // featured / hero banner
  developer: "Publisher Name",                // shown under the app name
  featured: true,                             // optional; marks it eligible for featured surfaces
},
```

### (Optional) feature it on the home hero

To show an app in the big featured carousel, also add it to the `featuredApps`
array in the same file:

```ts
export const featuredApps: FeaturedApp[] = [
  {
    ...apps["<app-slug>"],
    title: "Catchy Hero Title",
    banner: apps["<app-slug>"].banner || "",
  },
];
```

---

## Worked example (copy-paste reference)

```ts
// --- top of file: imports ---
// Awesome Swap
import awesomeswapLogo from "./icons/awesome-swap/logo.png";
import awesomeswapBanner from "./icons/awesome-swap/banner.png";
import awesomeswapShot1 from "./icons/awesome-swap/image_1.png";
import awesomeswapShot2 from "./icons/awesome-swap/image_2.png";

// --- inside the `apps` record ---
"awesome-swap": {
  categories: ["DeFi", "Exchanges"],
  publisherProfile: "0x1234567890abcdef1234567890abcdef12345678",
  app: {
    profile: "0x1234567890abcdef1234567890abcdef12345678",
    name: "Awesome Swap: Trade on LUKSO",
    url: "https://awesome-swap.example.com/",
    sourceCode: "https://github.com/awesome/swap",
    defaultGridSize: { width: 1, height: 2 },
    previewImages: [awesomeswapShot1.src, awesomeswapShot2.src],
  },
  id: "awesome-swap",
  icon: awesomeswapLogo.src,
  banner: awesomeswapBanner.src,
  developer: "Awesome Labs",
  featured: false,
},
```

---

## Field reference

| Field | Required? | Notes |
|---|---|---|
| `categories` | yes | Array of 1+ valid category keys (see below) |
| `publisherProfile` | yes | Universal Profile address `0x…` |
| `app.profile` | yes | UP address (usually same as `publisherProfile`) |
| `app.name` | yes | Display name |
| `app.url` | yes | Live app URL — what the **Open** button launches |
| `app.defaultGridSize` | yes | `{ width, height }` in grid units (e.g. `1x1`, `1x2`, `2x2`) |
| `app.previewImages` | yes | At least one screenshot, via `<import>.src` |
| `id` | yes (in practice) | Must equal the record key |
| `icon` | yes (in practice) | Without it, cards/lists render blank |
| `banner` | yes (in practice) | Needed for featured/hero surfaces |
| `developer` | yes (in practice) | Shown under the app name |
| `app.sourceCode` | optional | "View source" link |
| `tags` | optional | Extra search keywords |
| `featured` | optional | Eligibility flag |

> `id` / `icon` / `banner` / `developer` are declared optional in the `App` type
> ("legacy fields"), but the components depend on them. Treat them as required.

---

## Valid categories (must match exactly)

```
Art, AI, Brands, Community, DAOs, DeFi, Exchanges, Fashion, Gaming,
Infrastructure, Marketplaces, Music, NFTs, Security, Social, Staking
```

To introduce a **new** category, also add it to the `categories` record in the
same file, or the category-browse view won't list it:

```ts
"Lending": { id: "Lending", name: "Lending", displayName: "Lending" },
```

---

## Common mistakes to avoid

- **Object key ≠ `id`.** They must be identical; lookup/install logic relies on both.
- **Pasting image URLs** instead of importing assets. Always `import x from "./icons/<slug>/logo.png"` then use `x.src`.
- **Invented category names.** Use the list above, or register the new category first.
- **Missing `icon`/`banner`/`developer`.** Cards/hero will look broken without them.
- **Wrong `app.url`.** This is the real app users open — double-check it loads.

---

## Verify before committing

After editing, run both checks (must both pass):

```bash
npx tsc --noEmit
npm run build
```

`tsc` catches type/shape mistakes; `npm run build` confirms the catalog and images
compile. Do **not** rely on `npm run dev` for CI (it's a long-running server).
