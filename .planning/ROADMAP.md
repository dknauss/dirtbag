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
