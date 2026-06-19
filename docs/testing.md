# Testing guide

Dirtbag testing should stay small, repeatable, and honest. Static checks catch packaging mistakes; browser checks catch editor and front-end behaviour.

## Static package check

Run from the repo root:

```sh
bin/package-check
```

The script checks:

- Required theme files.
- Valid `theme.json` and style variation JSON.
- `screenshot.png` dimensions.
- Template and template-part block nesting.
- Package hygiene.
- No suspicious raw front-end code patterns.
- No bundled JavaScript, font files, or extra CSS files.
- PHP syntax for pattern files.
- **Seed/demo content integrity** — reads `playground/seed-content.json` (the seed data, loaded by `seed-content.php`) and checks each post for malformed block delimiters, balanced block nesting, and reconcile artifacts (`core/post-data`, hardcoded theme slug, dev URLs).
- **No `base64_decode`** in any pattern or Playground PHP file (WordPress.org Theme Check disallows it).
- **Reconcile guardrails** across shipped block files (same artifacts), so a raw Site-Editor export cannot silently reintroduce them.
- **i18n** — pattern translation calls use the `dirtbag` text domain.

## Automated end-to-end and accessibility tests

A dev-only Playwright harness lives in `tests/` (export-ignored, not shipped). It runs smoke checks (key pages return, the 404 template loads, the front page features posts, archive/search render) and accessibility checks (axe WCAG 2 A/AA, the skip link, the mobile navigation overlay) against a running site.

Run it against the local Studio site or any URL — see [`tests/README.md`](../tests/README.md). Browser automation requires a browser-capable session (`claude-playwright`).

In CI, `.github/workflows/e2e.yml` boots WordPress 7.0 in WordPress Playground with the theme and seeded demo content, then runs the suite. (First-run note: the Playground boot and the axe baseline may need tuning, since the harness was authored without a local Node/browser environment.)

## Manual WordPress checks

Before release, verify in WordPress:

- Theme appears in **Appearance → Themes**.
- Theme activates without errors.
- Site Editor opens without template errors.
- Front page, home, single, page, archive, search, 404, comments, and footer render correctly.
- Style variations appear under **Appearance → Editor → Styles**.
- Default/brutalist mode does not load theme-authored CSS or JavaScript files.

## Browser regression checks

Use a browser-capable session, such as `codex-browser` or `codex-browser-handoff`, for these checks. Browser mode must be started in a fresh session; it cannot be enabled from inside a non-browser session.

Check:

- Switch through Default, Minimalist, Newspaper, Hi-vis, Amber CRT, Terminal, and Blueprint repeatedly.
- Confirm truck icon colours do not stick between styles.
- Confirm no stale hover colours, active-nav colours, or random global-style CSS returns.
- Test mobile navigation and the skip link.
- Capture small viewport screenshots at `240×320`, `320×240`, and `360×640`.

## Accessibility checks

Run manual and automated checks:

- Keyboard-only navigation.
- Visible focus on links, buttons, forms, navigation, comments, and search.
- Skip link reaches main content.
- Heading order is sensible on key templates.
- Images have useful alt text when they convey information.
- Form labels are visible or programmatically available.
- Axe or pa11y pass in a browser-capable session.

## Optional external checks

Before a formal public release:

- WordPress Theme Check plugin.
- W3C/Nu HTML validation on rendered pages.
- Feed validation for RSS feeds.
- Link check for docs, credits, and site demo content.
