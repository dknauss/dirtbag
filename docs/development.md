# Development guide

Dirtbag is intentionally low machinery. The theme should be understandable by reading the files in the repo.

## Repository layout

| Path | Purpose |
| --- | --- |
| `style.css` | WordPress theme header only. No theme CSS rules. |
| `theme.json` | Global settings, default style values, font families, spacing, and shared custom variables. |
| `styles/` | WordPress global style variations. |
| `templates/` | Block theme templates. |
| `parts/` | Header and footer template parts. |
| `patterns/` | PHP block patterns with translation-ready strings. |
| `languages/` | Translation template files. |
| `docs/` | Maintainer and release documentation. |
| `playground/` | WordPress Playground blueprints for stable-tag and main-branch previews. |
| `.planning/` | Local GSD planning state. Not part of release packages. |
| `bin/package-check` | Small local verification script. |

## Rules of the road

- Keep `style.css` as a header-only file.
- Do not add theme-authored front-end JavaScript in v1.
- Do not add a package manager or build step unless the project explicitly changes direction.
- Prefer `theme.json`, core block markup, template parts, and patterns.
- Prefer native HTML and WordPress core behaviour before custom behaviour.
- Keep copy changes intentional. Do not rewrite existing demo content unless that is the task.
- Keep site-root files such as `robots.txt`, `llms.txt`, and `blogroll.opml` out of the theme package.

## What "no theme stylesheet" means

Dirtbag ships **no enqueued or bundled CSS file**: `style.css` is header-only, and there are no other `.css` files in the package. That is the rule the package check enforces.

It does not mean the theme authors zero CSS. Theme styling is expressed the WordPress-native way, through `theme.json`:

- **Global styles.** Typography, spacing, colour, and per-block/element rules in `theme.json` (and the style variations) compile to WordPress's inline global-styles output. This is theme-authored styling — it just isn't a separate stylesheet.
- **A small custom-CSS block.** `theme.json` → `styles.css` is the theme's one sanctioned home for hand-written CSS — the deliberate exception, for rules core settings cannot express declaratively. Keep it short and justified; every rule here ships inline on every page. It currently carries four:
  1. A `byline` gap/margin reset so the author byline reads as one line.
  2. The truck-icon `filter` rule that reads the `--wp--custom--dirtbag--truck-icon-filter` variable (see [style variations](style-variations.md)).
  3. The `.front-grid` column alignment. The front page's two section columns each lead with a heading; in styles whose heading font wraps the narrow (33%) column's heading to two lines, its first post drops ~one line below the wide column's. `theme.json`'s structured layout cannot align rows across sibling columns, so a CSS **subgrid** rule shares the heading/content row tracks between the two columns. It is wrapped in `@supports (grid-template-rows: subgrid)` and a `min-width: 782px` query, so browsers without subgrid — and all mobile widths — keep the default flex columns and stack normally. Headings stay nested in their columns, preserving reading order.
  4. The `.sidebar-thumb` responsive size. The front page's sidebar post images are a fixed 150px square in markup, so as the screen narrows they stop scaling and end up matching or beating the main grid images. The block layout has no responsive width control, so a CSS rule makes the figure `flex: 0 0 auto` with a `clamp(56px, 9vw, 88px)` width — capped well below the main images and scaling down on narrow screens.

So the accurate claim is: **no CSS files, no enqueued theme stylesheet, no front-end JavaScript** — not "no CSS at all." WordPress core may additionally print block, layout, and global-style assets required by the active blocks.

## Internationalization

Translatable UI strings live in **pattern PHP** (`patterns/*.php`) using the `dirtbag` text domain, and are collected in `languages/dirtbag.pot`.

Block template and template-part HTML files (`templates/*.html`, `parts/*.html`) **cannot contain translation calls** — they are static HTML. Any prose written directly into those files is therefore untranslatable by WordPress design. Two consequences:

- Repeated, translatable UI prose is routed through patterns instead of being inlined. The post byline ("From … 's dashboard") lives in `patterns/byline.php` and is referenced from the feed and single templates via `wp:pattern`, so it is translatable.
  - The byline is two `esc_html_e()` fragments — `'From'` and `'’s dashboard'` — wrapped around the `post-author-name` block. Both land in `dirtbag.pot`, so the possessive "'s" can be translated or replaced. The trade-off: it is a split string around a variable, so languages with different word order or no possessive "'s" may need to rephrase rather than translate literally (e.g. render the suffix as "(dashboard)" or similar). If you ever want word-order-proof i18n, a single concept like "By [author]" is cleaner — at the cost of the dashboard pun.
  - **Keeping the "'s" attached (and off its own line).** The byline group is `flex-wrap: nowrap` with a `theme.json` `.byline { flex-shrink: 0 }` rule, so "From [author]'s dashboard" behaves as one unit: flexbox collapses the whitespace between the `post-author-name` block and the `'s dashboard` paragraph (the apostrophe sits flush on the name), and the whole byline drops to its own line — instead of orphaning `'s dashboard` — when the single-post meta row (now `flex-wrap: wrap`) runs out of room on narrow screens. **What it costs:** the split i18n string above, plus one CSS escape (`flex-shrink` alongside the existing `.byline` gap/margin reset, both `!important`), a reliance on flexbox's whitespace-collapse behaviour, and a `nowrap` that can overflow below ~340px of content width with a long author name. **Dirtbag-defensible?** Within the theme's means — core blocks + a translatable pattern + one small `theme.json` rule, no JavaScript and no `functions.php` — yes. But it is the theme's most indulgent flourish: a possessive pun paid for with a split string and a flexbox quirk. The honest, cheaper alternative is still `By [author]`.
- Some static chrome remains in template/part HTML and is **not** translatable: the skip link, footer text and menu labels, list-page headings ("Notebook", "Latest posts"), the no-results message, and the previous/next labels. This is a WordPress limitation, not a Dirtbag omission. Move a string into a pattern if it must be translatable.

Refresh `languages/dirtbag.pot` before release only when pattern strings change; avoid timestamp-only churn.

## Editor design controls

`appearanceTools: false` (our setting, and also the WordPress default) is **not** a lockdown. It only suppresses one bundle of controls: borders, link colour, spacing (margin/padding/`blockGap`), line height, min-height, and sticky position. Everything else stays at WordPress defaults, which is why the editor still shows plenty of controls (text/background colour, font size, drop shadow, and so on).

On top of that default, Dirtbag explicitly disables two more controls in `theme.json`:

- **Custom colour** — `settings.color.custom: false`. Editors pick from the palette swatches; there is no arbitrary hex picker.
- **Drop shadow** — `settings.shadow` with `defaultPresets: false` and no presets. No box-shadow control.

**Kept on, deliberately:** the colour palette, font family, font size, and style variations (**Appearance → Editor → Styles**).

### What `theme.json` cannot do

Important so the "brutalist" claim is not oversold. `theme.json` controls *which UI controls appear*; it does not lock the site down. It cannot:

- disable JavaScript, or stop a core block from loading its own scripts — the accordion and navigation blocks ship core view JS via the Interactivity API regardless of theme settings;
- unregister or block-list a block;
- remove the Site Editor's Additional CSS panel (that is a user capability, not a theme setting).

"No theme CSS/JS" means the theme ships none. It cannot subtract what WordPress core brings.

### Optional further lockdowns

`theme.json`-only levers, to weigh against usefulness:

- Disable custom font sizes: `typography.customFontSize: false` (keeps the named size presets only).
- Disable text/background colour entirely: `color.text: false`, `color.background: false`.
- Default palette is already locked out (`color.defaultPalette: false`).
- Scope any of the above to a single block via `settings.blocks["core/accordion"]` (etc.).
- Anything beyond `theme.json` — unregistering blocks, stopping core block JS, gating Additional CSS — needs `functions.php`/a plugin and breaks the no-PHP-runtime rule, so it stays out of scope for v1.

## Local workflow

Make the smallest useful change, then run:

```sh
bin/package-check
```

If the change affects rendered output, also check the local Studio site manually or in a browser-capable Codex session.

## Versioning

Theme version metadata currently lives in:

- `style.css`
- `readme.txt`

Update both together before a tagged release.

## No build step means no hidden step

Dirtbag should not require `npm install`, `composer install`, asset compilation, minification, transpilation, or generated CSS/JS to be usable. If a future tool is added for validation, it should be optional and documented as a check, not as a required build.

## Playground previews

Dirtbag keeps two small browser preview blueprints:

- `playground/blueprint-stable.json` installs the commit for the current stable tag. It uses the commit SHA rather than the annotated tag ref because Playground/isomorphic-git can fail on annotated tag pack resolution.
- `playground/blueprint-main.json` installs the main branch.

Both blueprints force the theme folder to `dirtbag` so theme asset paths resolve, and both seed the site logo from the bundled truck icon. Update the stable blueprint ref when cutting a new stable tag.

## Studio site, demo content, and reseeding

The local Studio site is the **authoring workbench**, not a demo to be reset. Its theme folder is a symlink to this repo, so the site renders whatever branch is checked out. Content and Site-Editor edits happen here first, then get exported into theme files and into `playground/seed-content.php`.

Directionality matters: `seed-content.php` is **derived from** the Studio site (Studio → seed file), not the other way around. Re-running the seed *into* Studio runs that backwards — it bulldozes live working content and imports a frozen, possibly older snapshot.

Two distinct "make it match the theme" operations:

- **Clear overrides only (routine, safe).** When the Studio site renders stale because Site-Editor template/template-part customizations in the database shadow the theme files, delete just those overrides so the committed files take over. Content (posts, pages, media, menus) is preserved. Back up `wp-content/database/.ht.sqlite` first; restore by copying the backup back over it. This is the normal way to make Studio reflect the committed theme.
- **Full wipe + reseed (rare, throwaway only).** Deleting all content *and* overrides and re-running `seed-content.php` produces a pristine canonical demo (theme files + seeded content). Do this on a **throwaway** Studio site, never the main workbench, and only to validate the brand-new-user experience before a tag/release. Before reseeding anywhere for real, first **re-export current Studio content back into `seed-content.php`** so you are not restoring an older draft.

The free pristine demo already exists: the Playground links run `seed-content.php` from a blank install on every load. Use those for a clean-room view instead of resetting Studio.
