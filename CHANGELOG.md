# Changelog

All notable changes to Dirtbag are documented here.

This project follows the spirit of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses version tags such as `v0.1.2`.

## [Unreleased]

## [0.1.10] - 2026-06-21

### Changed

- Front page: the masthead is now a wide two-column row — the `<h1>` and an italicised standfirst on the left, a curated "featured posts" link list (bottom-aligned) on the right. The trailing period is dropped from the heading.

## [0.1.9] - 2026-06-20

### Fixed

- `languages/dirtbag.pot`: corrected the Theme URI and Author URI (`danknauss` → `dknauss`, matching `style.css` and the git remote) and refreshed the version metadata.

### Added

- Theme tags for the WordPress.org directory listing: `block-patterns` (17 patterns), `translation-ready` (full `.pot`, patterns use translation functions), `microformats` (h-card / u-url / h-entry markup), and the `blog` subject tag. All verified against Theme Check's allowed-tag list.

### Changed

- Regenerated `languages/dirtbag.pot` after the 0.1.6–0.1.8 content additions, picking up 13 previously-missing translatable strings (the Almanac-card and Byline patterns, the front-page pattern title, the Navigation Overlay template part, and the Archive/Search custom-template names).

### Documentation

- `docs/theme-review.md`: documented the WordPress.org upload-scanner (Theme Check) triage. Scanning the 0.1.8 release zip yields no required or warning notes; the remaining two Recommended notes (`register_block_style` / `register_block_pattern` not found) are block-theme false positives, and the two Info notes (hard-coded blogroll links, single text-domain) are intentional. None require a code change.

## [0.1.8] - 2026-06-20

### Added

- Front-page standfirst line under the masthead ("Rural speed, shed talk, hard chirps…").
- The "We blamed the browser" post's three-screenshot gallery now seeds into the Playground demo. The seed importer gained a small, general token-rewrite step (`__DBSRC_<id>__` / `__DBID_<id>__`) so in-content media is portable across sites.

### Changed

- Front-page masthead: "A Roadside Almanac" → "Roadside Almanac." Gallery images get a 2px `currentColor` frame.

### Fixed

- Accessibility: gallery image captions render below the image in normal flow instead of WordPress core's white-on-image overlay — fixing colour contrast over light images and the `scrollable-region-focusable` overlay (the issue first removed in 0.1.4).

## [0.1.7] - 2026-06-20

### Added

- Front-page sidebar can render two ways, toggled by one class on `.sidebar-content`: a magazine **float** (title/date/excerpt wrap beside and under the thumbnail; the default) or a media-object **grid** (`.is-grid`; thumbnail column + text column).
- Posts "The price of a pun" and "We blamed the browser".
- `docs/repro/`: a WordPress-free reproduction and write-up of the Post Title float interaction, filed upstream as [WordPress/gutenberg#79372](https://github.com/WordPress/gutenberg/issues/79372).

### Changed

- Every post now uses a distinct featured image.
- Baseline-aligned the two front-page section headings; the sidebar's first thumbnail top is flush with the wide column's first image.
- Pinned the stable Playground blueprint to the current release; ignore `.DS_Store`.

### Fixed

- Front-page sidebar float: WordPress core styles the Post Title link `display: inline-block`, an atomic box that drops below the float when it can't fit beside it (longest titles first). A scoped `display: inline` override restores the wrap. It is not lazy-loading, DPR, subgrid, or a browser bug — see [docs/sidebar-thumbnail-layout.md](docs/sidebar-thumbnail-layout.md).

## [0.1.6] - 2026-06-20

### Added

- Front page: a "Used Cars & Unused Plans" sidebar — a compact secondary feed of non-featured posts with square thumbnails — and a small "The Almanac" card. The masthead gains an `<h1>`, "A Roadside Almanac".
- Published "The build sheet" post.
- `docs/sidebar-thumbnail-layout.md`: the full investigation of a Chrome below-the-fold float bug and the layout shipped in response.

### Changed

- Front page: shorter tagline ("Good bones and road grit."); a CSS subgrid aligns the two section columns so their first post rows start on the same line, and the sidebar heading is baseline-aligned to the taller wide-column heading.
- Sidebar thumbnails use a CSS grid (fixed thumbnail track + text column). A `float` wrap-under was the goal but proved unreliable in Chrome for below-the-fold entries on narrow/scaled viewports; the float is kept as a documented one-block alternative.
- Every post now has a distinct featured image — "The build sheet" gets its own (a rusty Ford pickup), no longer sharing the Datsun with "Tools that earn their keep".

## [0.1.5] - 2026-06-19

### Added

- Per-style accessibility sweep: axe runs against every global style variation with `color-contrast` gated, in CI and via a local `npm run test:styles` runner. All seven styles (including the dark Terminal, Amber CRT, and Blueprint themes) are contrast-clean.
- Commit attribution: a `commit-msg` hook (`.githooks/`) requires a `Co-Authored-By` trailer on every commit.

### Changed

- Accessibility test suite graduated to **gating**: the confirmed-clean axe rule set (`image-alt`, `link-name`, `label`, `heading-order`, `landmark-unique`, `region`, `color-contrast`, `button-name`) now fails the build on regression, with coverage widened to a single post and the 404 template. The scan includes the `best-practice` tag so the heading/landmark rules are actually evaluated.
- Photo-free package: removed the bundled CC-licensed photographs and refreshed the theme screenshot.
- README overview and JavaScript-policy wording.

### Fixed

- Accessibility: the decorative h-card avatar (a 96px icon, `alt=""`) inherited the theme-wide image lightbox, so core rendered an unnamed "enlarge" control (axe `button-name`, critical). Disabled the lightbox on that block.

## [0.1.4] - 2026-06-19

### Fixed

- Accessibility: removed the scrollable overlay captions from the front-page gallery (axe `scrollable-region-focusable`); alt text retained and CC credits remain in `readme.txt`.

### Changed

- WordPress.org Theme Check cleanup: removed the invalid `block-theme` tag, added a GPL copyright notice to `readme.txt`, and externalized the Playground seed so no `base64_decode` remains in the source.
- Expanded the README overview and aligned the JavaScript policy wording with the core-Interactivity-first doctrine.
- Repointed the stable and theme-test Playground blueprints at the release; added a theme-unit-test blueprint.

## [0.1.3] - 2026-06-18

### Added

- Archive (master index) and Search page templates.
- Core WordPress 7.0 Breadcrumbs block in the header.
- Core progressive enhancements — navigation overlay, enhanced (no-reload) query pagination, and image lightbox — each with a plain-HTML fallback.
- Playground demo content (CC0 imagery and seed posts) and a Playwright end-to-end/accessibility harness with CI.
- `bin/package-check` coverage for seed-content integrity, reconcile guardrails, the i18n text domain, and the image inventory.

### Changed

- Stated the JavaScript policy honestly: Dirtbag ships no theme-authored or bundled JavaScript, but WordPress core may load its own (the Interactivity API) when core blocks need it. Where a runtime is ever warranted the order is native HTML → core Interactivity API (the OEM part) → tiny vanilla JavaScript → aftermarket frameworks (Alpine/Reef/VanJS) as an approved exception.
- Collapsed the style variations to their deltas over `theme.json`.
- Documented the editor-controls policy, the CSS and i18n boundaries, and the Studio-versus-demo reseed policy.
- Required WordPress 7.0 and PHP 7.2+.

### Fixed

- Microformats: h-card profile icon path, front-page post date binding, and `u-url`.
- Made the post byline translatable via a pattern.
- Corrected the GitHub (dknauss) and WordPress.org (dpknauss) usernames.
- Accessibility: underlined links and post titles sized by heading level.

## [0.1.2] - 2026-06-18

### Changed

- Applied the barebones Playground export for the header and front page.

## [0.1.1] - 2026-06-18

### Changed

- Refined header layout.
- Added Playground demo content.

## [0.1.0] - 2026-06-18

### Added

- Initial Dirtbag block theme release.

[Unreleased]: https://github.com/dknauss/dirtbag/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/dknauss/dirtbag/releases/tag/v0.1.4
[0.1.3]: https://github.com/dknauss/dirtbag/releases/tag/v0.1.3
[0.1.2]: https://github.com/dknauss/dirtbag/releases/tag/v0.1.2
[0.1.1]: https://github.com/dknauss/dirtbag/releases/tag/v0.1.1
[0.1.0]: https://github.com/dknauss/dirtbag/releases/tag/v0.1.0
