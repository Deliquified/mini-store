# Adding apps to the LUKSO App Store catalog

Adding an app is **two steps**: drop in some images, add one JSON object.
No TypeScript edits, no imports, no duplicated fields. An agent should be able to
complete the task using only this file.

## Where things live

- **Catalog data (the only file you edit):** `src/data/apps.json`
- **Images (by folder convention):** `public/apps/<slug>/`
- You do **not** edit `src/data/appCatalog.ts` — it's just the loader that turns the
  JSON + images into what the UI renders.

`<slug>` is a lowercase, hyphenated id, e.g. `awesome-swap`, `stakingverse-staking`.

---

## Step 1 — Add the images

Create `public/apps/<slug>/` and add **PNG** files with these exact names:

```
public/apps/<slug>/
  logo.png          # square app icon                 (required)
  banner.png        # wide banner, ~16:9              (required)
  screenshot-1.png  # first screenshot                (at least one required)
  screenshot-2.png  # numbered sequentially, no gaps
  ...
```

- Files **must be `.png`** and use these exact names (`logo`, `banner`, `screenshot-N`).
- `logo` should be square; screenshots look best tall/portrait (shown in a phone-style carousel).
- Number screenshots starting at `1` with no gaps. The count goes in the JSON (`screenshots`).
- If you only have `.jpg`/`.webp`, convert first. On macOS:
  `sips -s format png input.webp --out logo.png`

---

## Step 2 — Add an entry to `src/data/apps.json`

The file is one big JSON object keyed by `<slug>`. Add your app:

```jsonc
"awesome-swap": {
  "name": "Awesome Swap: Trade on LUKSO",   // display name
  "url": "https://awesome-swap.example.com/", // the LIVE app — what "Open" launches
  "developer": "Awesome Labs",               // shown under the app name
  "publisher": "0x1234…",                    // publisher's Universal Profile address
  "categories": ["DeFi", "Exchanges"],       // 1+ from the valid list below
  "gridSize": [1, 2],                        // [width, height] when added to a UP grid
  "screenshots": 2,                          // how many screenshot-N.png you added
  "featured": true,                          // optional; eligibility flag
  "sourceCode": "https://github.com/…",      // optional
  "featuredTitle": "Trade Anything"          // optional; if set, shows in the home hero
}
```

That's it. The slug in the JSON key must match the image folder name in `public/apps/`.

---

## Field reference

| Field | Required? | Notes |
|---|---|---|
| `name` | yes | Display name |
| `url` | yes | Live app URL — what the **Open** button launches |
| `developer` | yes | Shown under the app name |
| `publisher` | yes | Publisher's Universal Profile address `0x…` |
| `categories` | yes | Array of 1+ valid category names (below) |
| `gridSize` | yes | `[width, height]` in grid units, e.g. `[1,1]`, `[1,2]`, `[2,2]` |
| `screenshots` | yes | Integer count of `screenshot-N.png` files you added |
| `featured` | optional | Eligibility flag (default `false`) |
| `sourceCode` | optional | "View source" link |
| `tags` | optional | Extra search keywords (array of strings) |
| `featuredTitle` | optional | If present, the app appears in the home **hero carousel** with this title |

---

## Valid categories (must match exactly)

```
Art, AI, Brands, Community, DAOs, DeFi, Exchanges, Fashion, Gaming,
Infrastructure, Marketplaces, Music, NFTs, Security, Social, Staking
```

To introduce a **new** category, add it to the `categories` object in
`src/data/appCatalog.ts` (this is the one case that needs a code edit):

```ts
Lending: { id: "Lending", name: "Lending", displayName: "Lending" },
```

---

## Common mistakes to avoid

- **Slug mismatch.** The JSON key and the `public/apps/<slug>/` folder name must be identical.
- **Wrong image names/format.** Must be `logo.png`, `banner.png`, `screenshot-1.png`, … (PNG only).
- **`screenshots` count wrong.** It must equal the number of `screenshot-N.png` files, numbered with no gaps — a too-high count produces broken images.
- **Invented category names.** Use the list above, or register the category first.
- **Wrong `url`.** This is the real app users open — verify it loads.
- **Invalid JSON.** No trailing commas, no comments in the actual file (the examples above use `//` only for explanation).

---

## Verify before committing

```bash
npx tsc --noEmit   # validates the catalog shape
npm run build      # confirms it compiles and images resolve
```

Both must pass. Don't use `npm run dev` for verification (it's a long-running server).
