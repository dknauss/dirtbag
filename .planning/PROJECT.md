# Dirtbag

## What This Is

Dirtbag is a hyper-simple WordPress block theme for people who want good bones, readable templates, old/open-web affordances, and no theme-authored JavaScript by default. It ships standard block templates, style variations, web-safe typography, local icon assets, and a small release-check workflow.

## Core Value

A Dirtbag site must remain readable, navigable, and understandable with WordPress core blocks, native browser behaviour, and minimal theme machinery.

## Requirements

### Validated

- ✓ Block theme scaffold exists with `theme.json`, `style.css`, template parts, templates, patterns, screenshot, licence, and readme — existing
- ✓ No theme-authored frontend JavaScript runtime is bundled — existing
- ✓ Style variations exist for Brutalist/default, Minimalist, Newspaper, Hi-vis, Amber CRT, Terminal, and Blueprint — existing
- ✓ Truck icon colour is controlled through one stable theme.json variable to avoid sticky Site Editor CSS — existing
- ✓ Theme review preparation removed site-root text files from the theme package and documented them separately — existing

### Active

- [ ] Keep package checks repeatable with `bin/package-check` and CI.
- [ ] Verify Site Editor style switching in a browser-capable session before release.
- [ ] Run official Theme Check before WordPress.org submission.
- [ ] Keep accessibility, translation, security, and performance checks boring and repeatable.

### Out of Scope

- Bundled JavaScript frameworks — Dirtbag v1 does not need Alpine, Reef, VanJS, or a build step.
- Theme-owned crawler/security/plain-text site-root policy files — keep those as site-kit docs/templates, not theme package files.
- Remote fonts, analytics, tracking, or third-party runtime assets — not needed for the theme’s core value.

## Context

- Local theme root: `/Users/danknauss/Developer/GitHub/dirtbag` (kept out of iCloud / cloud-synced folders).
- Local Studio site: `/Users/danknauss/Studio/dirtbag` (the theme folder symlinks the repo).
- Theme package should remain WordPress.org-review friendly: no hidden package files, no root `robots.txt`, no root `.well-known`, no bundled JS/fonts, and complete resource credits.
- Testing is a **calibrated pyramid, not test-first TDD** — the theme is mostly declarative. The static gate (`bin/package-check` + CI) owns "green"; render/accessibility E2E, Theme Check, and manual browser QA cover behaviour; TDD is reserved for the small islands of real logic. See `docs/testing-strategy.md`.

## Constraints

- **WordPress**: Modern block theme behaviour, currently tested locally against the Studio site.
- **Packaging**: WordPress.org theme zip must use a lowercase `dirtbag/` folder and exclude repo-only files such as `.git`, `.github`, `.planning`, and `.gitignore`.
- **JavaScript**: No theme-authored frontend JavaScript in v1.
- **CSS**: No enqueued theme stylesheet; required `style.css` contains header metadata only. Visual rules live in `theme.json` and style variations.
- **Accessibility**: Preserve skip link, semantic templates, readable link states, keyboard navigation, comments, and form usability.
- **Translation**: Text domain is `dirtbag`; PHP pattern strings stay translation-ready; POT lives in `languages/dirtbag.pot`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use `theme.json` custom variable for truck icon colour | Prevents sticky accumulated selector CSS in the Site Editor style picker | ✓ Good |
| Keep site-root text/OPML files out of theme package | They are site policy/content files and can trip theme review | ✓ Good |
| Add `bin/package-check` instead of a build step | Tests the package without changing the no-build philosophy | ✓ Good — implemented and runs in CI |
| Track GSD planning docs in git | Project decisions should travel with the repo | ✓ Good |
| Calibrated test pyramid over test-first TDD | Theme is mostly declarative; static checks + render/a11y + Theme Check + manual QA fit better, TDD only for real logic | ✓ Good — see `docs/testing-strategy.md` |
| Studio site is the authoring workbench; `seed-content.php` is derived from it | Reseeding Studio from the seed file runs the export backwards and destroys live content; clear DB overrides (not content) to match the theme, and reserve full wipe+reseed for throwaway/Playground clean-install checks | ✓ Good |

---
*Last updated: 2026-06-19 — corrected repo path, added the calibrated testing strategy, marked package-check/GSD-docs decisions done.*
