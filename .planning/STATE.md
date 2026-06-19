# Dirtbag State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-06-18)

**Core value:** A Dirtbag site must remain readable, navigable, and understandable with WordPress core blocks, native browser behaviour, and minimal theme machinery.
**Current focus:** Phase 1 — Repository, package checks, and publishing.

## Current Status

- Theme exists locally and is active in the Studio test site.
- Stable icon handling is committed.
- Backlog and site-root open-web docs are present.
- Next work: add package check script, CI, publish public GitHub repo.

## Last Known Good Checks

- JSON validation passed.
- Pattern PHP syntax passed.
- Rendered frontend had no stale state-layer or random colour CSS.
- Studio DB backup exists for locked good style state.
## Accumulated Context

### Phase 6 — Educational research (planning complete)

All five research/planning deliverables are done. Build is a later phase.

- `.planning/phase-6/PERSONAS-AND-OBJECTIVES.md` — two primary personas (Tinker, Wrench), two secondary (Beacon, Sprout), and learning objectives LO-1…LO-8.
- `.planning/phase-6/TEACHABLE-SURFACES-AUDIT.md` — docs/seed/patterns/package-check mapped to objectives, with the gap analysis.
- `.planning/phase-6/CONTENT-HOME-DECISION.md` — decided: hybrid `docs/` + seed demo surfaced via a Playground blueprint; nothing new ships in the package; patterns stay silent in-package and get annotated in `docs/`.
- `.planning/phase-6/LEARNING-PATH-STRUCTURE.md` — the "Garage" path: four stages (On the lot → Under the hood → The honest machine → Build your own), every LO assigned a home + disposition (reframe/annotate/point-at/write-new), a `docs/learn/` tree, and a build order.
- `.planning/phase-6/WRITING-GUIDELINES.md` — plain-language + accessibility rules tied to `readability-check` (nine categories, Flesch 60–70 target for path prose), per-persona altitude map, canonical-terms table, and the authoring gate.
- Next: Phase 6 build (later) — start with `docs/learn/README.md` (the path index) and the gap #5 wording fixes; reconcile with `docs/backlog.md`.

### Pending Todos

- 1 pending todo: `.planning/todos/pending/2026-06-18-private-note-tool.md`

