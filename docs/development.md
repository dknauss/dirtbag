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
- **A small custom-CSS block.** `theme.json` → `styles.css` carries two rules that core settings cannot express declaratively:
  1. A `byline` gap/margin reset so the author byline reads as one line.
  2. The truck-icon `filter` rule that reads the `--wp--custom--dirtbag--truck-icon-filter` variable (see [style variations](style-variations.md)).

So the accurate claim is: **no CSS files, no enqueued theme stylesheet, no front-end JavaScript** — not "no CSS at all." WordPress core may additionally print block, layout, and global-style assets required by the active blocks.

## Internationalization

Translatable UI strings live in **pattern PHP** (`patterns/*.php`) using the `dirtbag` text domain, and are collected in `languages/dirtbag.pot`.

Block template and template-part HTML files (`templates/*.html`, `parts/*.html`) **cannot contain translation calls** — they are static HTML. Any prose written directly into those files is therefore untranslatable by WordPress design. Two consequences:

- Repeated, translatable UI prose is routed through patterns instead of being inlined. The post byline ("From … 's dashboard") lives in `patterns/byline.php` and is referenced from the feed and single templates via `wp:pattern`, so it is translatable.
- Some static chrome remains in template/part HTML and is **not** translatable: the skip link, footer text and menu labels, list-page headings ("Notebook", "Latest posts"), the no-results message, and the previous/next labels. This is a WordPress limitation, not a Dirtbag omission. Move a string into a pattern if it must be translatable.

Refresh `languages/dirtbag.pot` before release only when pattern strings change; avoid timestamp-only churn.

## Editor design controls

Dirtbag turns `appearanceTools` off in `theme.json` and does not re-enable it in any style variation. That hides the block editor's per-block controls for borders, margin, padding, `blockGap`, line height, min-height, and sticky position, plus the link-colour control — so editors cannot nudge individual blocks away from the theme's layout or accumulate sticky overrides.

What stays available (enabled explicitly in `theme.json` settings): choosing colours from the palette or a custom colour, font family, font size, and switching style variations under **Appearance → Editor → Styles**.

The trade is deliberate: fewer knobs keep the brutalist defaults consistent while leaving the genuinely useful, low-risk choices intact.

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
