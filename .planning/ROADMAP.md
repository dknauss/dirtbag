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
