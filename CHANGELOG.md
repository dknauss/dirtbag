# Changelog

All notable changes to Dirtbag are documented here.

This project follows the spirit of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses version tags such as `v0.1.2`.

## [Unreleased]

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
