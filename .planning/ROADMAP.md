# Dirtbag Roadmap

## Phase 1 — Repository, package checks, and publishing

Goal: make Dirtbag a public GitHub repository with repeatable no-build package checks.

Deliverables:

- `bin/package-check` validates package hygiene, JSON, PHP syntax, block nesting, screenshot dimensions, and stale root file risks.
- GitHub Actions runs the same package check on push and pull request.
- Public GitHub repository exists and `main` is pushed.

Success criteria:

- `bin/package-check` passes locally.
- GitHub repo is public.
- Working tree is clean after publishing.

## Phase 2 — Browser and WordPress.org review validation

Goal: verify the parts that need a real browser or WordPress admin UI.

Deliverables:

- Browser-mode style switcher regression: each style variation is selected repeatedly and icon colour does not stick.
- Official Theme Check plugin pass.
- Keyboard/focus pass for skip link, navigation overlay, comments, search, forms, buttons, and links.
- Optional W3C/Nu HTML validation for key rendered pages.
- Optional axe/pa11y accessibility scan in a browser-capable session.

Success criteria:

- No stale global-style CSS returns after style switching.
- Theme Check has no required blockers.
- Accessibility issues are documented or fixed before release.

## Phase 3 — Release packaging

Goal: prepare a clean release zip for WordPress.org or GitHub Releases.

Deliverables:

- Lowercase `dirtbag/` package zip generated without repo-only files.
- POT refreshed only when strings change.
- Resource credits verified in `readme.txt`.
- Release notes written.
- Clean-install verification on a throwaway/Playground site (theme files + seeded demo, no DB overrides). The authoring Studio site is never reset for this; `seed-content.php` is re-exported from Studio before any reseed. See `docs/development.md` and `docs/backlog.md`.

Success criteria:

- Package passes `bin/package-check`.
- Zip contents match theme-review expectations.
- Release tag can be created from a clean `main` branch.
- Theme renders correctly from a clean install with no Site-Editor database overrides.

## Phase 4 — Interactivity API (Preact) explorations

Goal: use WordPress's native Interactivity API (Preact + signals) for progressive enhancements before reaching for any third-party framework — OEM (core) parts over aftermarket ones (Alpine/Reef/VanJS). The runtime is already on the page via core blocks (navigation overlay, accordion), so these cost almost nothing.

Done (zero theme JavaScript, all graceful fallbacks):

- Enhanced (no-reload) pagination on the home, archive, and master-archive feeds (`enhancedPagination`). Falls back to normal pagination links.
- Image lightbox on galleries and unlinked images via `theme.json` (`settings.blocks.core/image.lightbox.enabled`).

Ongoing principle:

- Lean on the core interactive blocks already in play — navigation overlay, accordion, search — rather than re-implementing their behaviour.

Future (v2, only if a real need justifies crossing the no-`functions.php` / no-theme-JS line):

- Custom Interactivity directives/stores for small progressive enhancements (e.g. a Field Notes / blogroll filter, copy-permalink, a webmention facepile), authored to work without JavaScript first. Needs a script module + enqueue (a block's `viewScriptModule` or `functions.php`) — no bundler required, but a deliberate decision.

Success criteria:

- Every enhancement degrades gracefully with JavaScript disabled.
- No theme-authored JavaScript files and no third-party framework added.

## Phase 5 — SEO and site structure (Joost de Valk's guidance)

Goal: apply Joost de Valk's well-worn SEO advice on taxonomies and structure, scoped to what a no-`functions.php` block theme can do, and pair with an SEO plugin (Yoast/Rank Math) for the rest.

Theme-side (in scope):

- Every archive template leads with the term/query title as the single H1 and renders the term description as an intro (category, tag, and date already do — verify author and search). Encourage real descriptions on every category and tag.
- Favour few meaningful categories over many overlapping tags; document a "one primary category per post" editorial rule and avoid category/tag duplication that creates thin, near-duplicate archives.
- Keep breadcrumbs (core block) site-wide for orientation and structured-data eligibility; confirm the core breadcrumbs block emits `BreadcrumbList` schema, or let the SEO plugin supply it.
- Strengthen internal linking: blogroll/XFN, the master Archive index, related/recent lists, and cornerstone pages (Field Guide, Colophon) so important pages stay well-linked.
- Keep clean, readable permalinks and the visible feeds + `wp-sitemap.xml` link for discoverability.

Plugin territory (out of theme scope — document the handoff):

- Per-page titles, meta descriptions, canonical URLs, Open Graph / Twitter cards.
- `noindex` for thin or duplicate archives (date archives, paginated subpages, the author archive on a single-author site) and other robots directives.
- Schema/structured data beyond what core blocks emit.

These need `wp_robots` / `document_title` / `<head>` output a no-`functions.php` theme will not add. Recommend pairing Dirtbag with an SEO plugin and keeping the theme's structure clean so the plugin has good bones to work with.

Success criteria:

- Each archive has a clear H1 + description and no near-duplicate thin archives the theme can prevent.
- Breadcrumbs present site-wide; internal linking connects cornerstone pages.
- The SEO-plugin handoff (meta, noindex, schema) is documented for site owners.

## Phase 6 — Educational aspects (research and planning)

Goal: research and plan how Dirtbag and its docs can *teach*. The theme is already pitched at people who want to get under the hood, tinker, and "build up from the fundamentals" — this phase turns that intent into a deliberate learning vehicle for block-theme basics, the open web, and accessible, build-free WordPress. Research and planning only; build later.

Research questions:

- **Who is the learner?** DIY site owners, students new to block themes, developers curious about no-build / no-framework WordPress, and IndieWeb newcomers. Define one or two primary personas and their goals.
- **What does Dirtbag already teach implicitly that should be made explicit?** `theme.json` instead of a stylesheet file; core blocks over custom; the OEM Interactivity API over aftermarket frameworks; microformats, feeds, OPML, and XFN; accessible patterns; and `bin/package-check` as a dependency-free "flashlight."
- **What formats fit a no-build ethos?** Annotated theme files, the existing in-theme pages/posts written in "Dirtbag diction," a guided "read the theme" tour, commented patterns, a glossary, and short focused docs — nothing that needs a bundler.
- **How do we teach without bloating the shipped theme?** Keep teaching material in `docs/` and the seeded demo content (both `export-ignore`d from the package) or external (a companion Playground blueprint / site).

Deliverables (to scope, not yet build):

- A learner persona + learning-objectives outline.
- An audit of existing teachable surfaces (`docs/`, seeded pages/posts, patterns, `package-check`) mapped to those objectives.
- A proposed structure — e.g. a Field Guide / Garage learning path, annotated-code walkthroughs, a glossary, and a "build it yourself from `theme.json` up" tutorial.
- A decision on where educational content lives (docs + seed demo vs. an external companion) that keeps the WordPress.org package minimal.
- Plain-language and accessibility guidelines for the educational writing (tie in `readability-check`).

Success criteria:

- Audience and learning objectives are documented.
- A concrete content plan exists, with each piece assigned a home (docs, seed, or external) so the shipped theme stays minimal.
- No educational assets bloat the WordPress.org package — everything teachable is `export-ignore`d or external.
