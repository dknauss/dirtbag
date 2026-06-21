# Site logos, site icons, and favicons

WordPress treats the "brand mark" as **three separate things**, displayed in
different places by different machinery. Confusing them is what caused the
dark-truck-on-a-dark-tab bug, so this note pins down what each one is, where it
shows up, and which ones CSS can recolour.

For the per-style _colouring_ of the in-page logo, see
[style-variations.md](style-variations.md). This doc is about the _plumbing_.

## The three marks

| Mark | Stored as | Output by | Rendered as | CSS reaches it? |
| --- | --- | --- | --- | --- |
| **Site Logo** | `custom_logo` theme mod (an attachment ID) | `core/site-logo` block / `the_custom_logo()` | an `<img>` in the page body | **Yes** |
| **Site Icon** | `site_icon` option (an attachment ID) | `wp_site_icon()` in `<head>` + WP-admin | raw raster `<link rel="icon">` etc. | **No** |
| **Legacy favicon** | `favicon.ico` file at the site root | the browser, by convention | raw raster | **No** |

### 1. Site Logo — the in-page mark (CSS-stylable)

The Site Logo is a normal image in the document body. The `core/site-logo`
block (or `the_custom_logo()`) prints an `<img class="custom-logo">`, so
**anything CSS can do to an `<img>` applies**: `filter`, `width`, dark-mode
swaps, the lot.

This is the only mark Dirtbag recolours per style variation. The
`--wp--custom--dirtbag--truck-icon-filter` custom property inverts/tints the
truck for the Terminal, Amber CRT, and Blueprint backgrounds. Because it works
by CSS `filter`, the source asset must stay **transparent** — a baked-in
background would show as a box behind the logo on coloured variations.

Surfaces: the site header (and anywhere a Site Logo block is placed).

### 2. Site Icon — the favicon and app icon (NOT CSS-stylable)

The Site Icon is what most people call "the favicon," but it is broader. From a
single source image (WordPress wants **512×512**), `wp_site_icon()` generates and
emits a family of tags into `<head>`:

- `<link rel="icon" sizes="32x32">` and `512x512` — browser tab + bookmarks
- `<link rel="apple-touch-icon" sizes="180x180">` — iOS home-screen icon
- `<meta name="msapplication-TileImage">` — Windows tile
- It also feeds the **WP-admin site icon** (top-left of the admin bar / "My
  Sites") and the favicon in the block editor.

Crucially, **none of these are in the page body** — they are `<head>` links and
chrome painted by the browser or by WP-admin. **CSS filters never touch them.**
A `prefers-color-scheme` swap is unreliable for PNG favicons across browsers and
admin contexts, so the robust fix is an **opaque, contrast-safe** source image
rather than a transparent one. (An SVG favicon with an internal
`@media (prefers-color-scheme)` is a partial alternative, but support is weaker
in some admin surfaces — see "Alternatives" below.)

Surfaces: browser tab, bookmarks/history, OS home-screen / PWA, WP-admin bar,
editor tab.

### 3. Legacy `favicon.ico`

A `favicon.ico` physically at the **site root** (not in the theme) is still
requested by some browsers as a fallback. Dirtbag does not ship one; the Site
Icon `<link>` tags supersede it. Note that `favicon.ico` is on
`bin/package-check`'s _disallowed_ list — it must never end up inside the theme
zip.

## `shouldSyncIcon` — the knob that ties logo and icon together

The `core/site-logo` block has a `shouldSyncIcon` attribute:

- **`true`** — uploading a Site Logo also sets it as the Site Icon, and if no
  logo is set the block will render the _Site Icon_ as the logo. One asset, two
  jobs. Convenient, but it forces the favicon and the in-page logo to be the
  **same image** — which cannot be both "transparent for CSS recolouring" and
  "opaque for dark tabs."
- **`false`** — the two are independent. The block renders only `custom_logo`;
  the Site Icon is whatever `site_icon` points at.

Dirtbag sets **`shouldSyncIcon:false`** on both header Site Logo blocks
(`parts/header.html`) precisely so the two marks can diverge:

- `custom_logo` → **transparent** truck → recoloured in-page per style.
- `site_icon` → **opaque** manila-backed truck → visible on any tab.

The Playground seed (`playground/seed-content.php`,
`dirtbag_playground_seed_site_icon()`) imports both assets and wires them up
this way. Both source images live under `playground/media/` (export-ignored),
not in `assets/`, because the **shipped theme never references them** — a real
install lets the owner set their own logo and favicon. Studio does **not** run
that seed — set the two in the Customizer / Site Editor (or via WP-CLI) on a
Studio site to reproduce it.

## The theme fallback (no logo set at all)

A fresh install — or the WordPress.org directory preview, which never runs the
demo seed — has neither a `custom_logo` nor a `site_icon`. The
`core/site-logo` block then renders nothing. `dirtbag_site_logo_fallback()` in
`functions.php` fills that gap: when no logo (and, with sync on, no synced
icon) is present, it injects the bundled transparent truck SVG
(`assets/icons/pickup-truck-header.svg`) wrapped in core's markup, so the
existing icon-filter CSS still applies. This is in-page only; it does not give
the site a favicon.

## Asset inventory

Only assets the **shipped** theme references live in `assets/` (and go into the
wp.org zip). Demo-only icons live in `playground/media/` (export-ignored).

| File | Location | Background | Used for |
| --- | --- | --- | --- |
| `pickup-truck-header.svg` | `assets/icons/` (ships) | transparent | in-page logo fallback (`functions.php`) |
| `pickup-truck.svg` | `assets/icons/` (ships) | transparent | `.h-card` profile photo (`patterns/`) |
| `dirtbag-site-icon.png` | `playground/media/` (demo) | transparent | seeded `custom_logo` (in-page) |
| `dirtbag-site-icon-opaque.png` | `playground/media/` (demo) | opaque manila | seeded `site_icon` (favicon/admin) |

The opaque PNG is generated from
`docs/images/dirtbag-site-icon-opaque.svg` (export-ignored) via:

```sh
inkscape docs/images/dirtbag-site-icon-opaque.svg \
  --export-type=png \
  --export-filename=playground/media/dirtbag-site-icon-opaque.png \
  -w 512 -h 512
```

`bin/package-check` allowlists images in **both** trees separately: assets that
ship (`allowed_theme_images`) and Playground demo media
(`allowed_playground_images`). Adding or renaming an image in either without
updating its allowlist fails the image-inventory check.

Earlier unused `-white` variants (`pickup-truck-header-white.svg`,
`pickup-truck-white.svg`, `dirtbag-site-icon-white.png`) were referenced by
nothing and have been removed from the repo; copies are parked in the adjacent
local `dirtbag-asset-archive/` store, outside the theme.

## Alternatives considered

- **A `-white` favicon + `prefers-color-scheme`** — browsers do not reliably
  swap PNG favicons by colour scheme, and WP-admin ignores it. Rejected.
- **An SVG favicon with an internal media query** — works in modern browsers via
  `<link rel="icon" type="image/svg+xml">`, but WordPress's Site Icon pipeline
  rasterises to PNG and several admin surfaces don't use the SVG, so it would
  not fix the admin icon. An opaque raster is the portable answer.
