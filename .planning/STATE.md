# Dirtbag State

_Last refreshed: 2026-06-20._

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-06-18)

**Core value:** A Dirtbag site must remain readable, navigable, and understandable with WordPress core blocks, native browser behaviour, and minimal theme machinery.
**Current focus:** Phase 6 — Educational aspects. Research/planning is complete and merged (PR #28); the build is prepped and **on hold** pending go-ahead — see [`phase-6/BUILD-KICKOFF.md`](phase-6/BUILD-KICKOFF.md).

## Current Status

- **Published and released.** Submitted to the WordPress.org theme directory at 0.1.8; current release is **0.1.9** (git tag `v0.1.9` + GitHub release, latest). The stable Playground blueprint is pinned to 0.1.9 (PR #53).
- **CI-gated.** Every PR runs `package-check`, `e2e`, and the per-style `e2e-styles` axe sweep (7 style variations); `bin/package-check` runs locally. Playground stable/main blueprints are live.
- **WordPress.org review notes triaged.** The 0.1.9 upload scan (Theme Check) has no required or warning notes; the remaining Recommended/Info notes are block-theme false positives or intentional — documented in [`docs/theme-review.md`](../docs/theme-review.md).
- **Upstream contribution in flight.** A Gallery caption accessibility repro is published under `docs/repro/` and linked from Gutenberg [#56587](https://github.com/WordPress/gutenberg/issues/56587) (PR #52). A follow-up e2e seed-readiness flake fix is open in PR #54.
- **Phase 6 build is prepped but HELD** — no lesson content written yet. Build order and guardrails in [`phase-6/BUILD-KICKOFF.md`](phase-6/BUILD-KICKOFF.md).

## Last Known Good Checks

- `bin/package-check` green (required files, release-archive exclusions, JSON, screenshot dimensions, block nesting, package hygiene, image inventory, i18n text domain, PHP syntax).
- `e2e` and `e2e-styles` Playwright + axe suites green on `main`.
- Theme Check on the 0.1.9 release zip: no required/warning notes.

## Accumulated Context

### Phase 6 — Educational research (planning complete)

All five research/planning deliverables are done and merged (PR #28). Build is held — see [`phase-6/BUILD-KICKOFF.md`](phase-6/BUILD-KICKOFF.md).

- `.planning/phase-6/PERSONAS-AND-OBJECTIVES.md` — two primary personas (Tinker, Wrench), two secondary (Beacon, Sprout), and learning objectives LO-1…LO-8.
- `.planning/phase-6/TEACHABLE-SURFACES-AUDIT.md` — docs/seed/patterns/package-check mapped to objectives, with the gap analysis.
- `.planning/phase-6/CONTENT-HOME-DECISION.md` — decided: hybrid `docs/` + seed demo surfaced via a Playground blueprint; nothing new ships in the package; patterns stay silent in-package and get annotated in `docs/`.
- `.planning/phase-6/LEARNING-PATH-STRUCTURE.md` — the "Garage" path: four stages (On the lot → Under the hood → The honest machine → Build your own), every LO assigned a home + disposition (reframe/annotate/point-at/write-new), a `docs/learn/` tree, and a build order.
- `.planning/phase-6/WRITING-GUIDELINES.md` — plain-language + accessibility rules tied to `readability-check` (nine categories, Flesch 60–70 target for path prose), per-persona altitude map, canonical-terms table, and the authoring gate.

### Pending Todos

- 1 pending todo: `.planning/todos/pending/2026-06-18-private-note-tool.md`
