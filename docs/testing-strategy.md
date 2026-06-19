# Testing strategy

Dirtbag is a deliberately small, mostly *declarative* block theme: `theme.json`,
templates, template parts, patterns, and style variations. There is no
`functions.php` and almost no imperative logic. That shapes how we test.

## Is TDD overkill here? Mostly yes.

Test-Driven Development (red → green → refactor) is the right default for business
logic, parsing, formatting, validation, and data transformations. Dirtbag has
almost none of that on the front end — the artifact is configuration and markup,
not functions. You cannot meaningfully write `expect(fn(input)).toBe(output)` for a
`theme.json` colour or a template's block markup.

So Dirtbag does **not** practise test-first TDD for its declarative core. Instead it
uses a **calibrated pyramid** weighted toward fast static/structural checks and
real-render verification. TDD is reserved for the small islands of actual logic
(Level 6).

## The pyramid

### 1. Static / structural checks — `bin/package-check` (primary gate)
Dependency-free, fast, runs locally and in CI on every push/PR. Validates required
files, JSON validity (`theme.json`, styles, blueprints), block-nesting and
delimiter integrity, screenshot dimensions, package hygiene, a suspicious-code
scan, bundled-asset rules, PHP `-l` syntax, the `dirtbag` i18n text domain,
reconcile guardrails, and seed-content integrity. This is the **source of truth for
"green"** and the right primary layer for a declarative theme — it checks
structure, not behaviour.

### 2. Schema validation
`theme.json` and each `styles/*.json` declare a `$schema` and must parse and match
the targeted WordPress version. (Covered today by package-check's JSON validity;
tighten toward full schema validation as needed.)

### 3. Render + accessibility (Playwright E2E)
Boot WordPress (Playground or Studio), assert key page types return 200, that
landmarks / headings / skip link exist, and run axe against seeded content. Lives in
`tests/`. Axe findings are report-only today; graduate the agreed rule set to
**gating** as they are cleared.

### 4. Theme Check (WordPress.org)
The domain-specific linter, run against the **release zip** — not the dev tree,
which contains `export-ignore`d dev directories. Release gate: **0 required**.
Recommended / Info items are triaged and documented.

### 5. Manual browser QA (release gate)
Human judgment automation can't cheaply cover, from a browser-capable session:
keyboard / focus order, the mobile navigation overlay (open / close / focus trap /
Esc), JavaScript-off fallbacks for the core enhancements (overlay, pagination,
lightbox), style-variation switching (no sticky CSS), small-viewport screenshots,
and screen-reader spot checks. Checklist lives in `docs/backlog.md` (Release QA).

### 6. TDD — only the islands of real logic
When actual logic is added, write the failing test first:

- changes to `playground/seed-content.php` (the importer),
- new `bin/package-check` checks,
- any future Interactivity API directive or tiny vanilla JavaScript (Phase 4 v2).

Because the pre-commit gate rejects failing commits, the RED step lives in the
working tree and the test + implementation land as one GREEN commit (per the global
TDD-with-gates rule).

## What each roadmap phase leans on

| Phase | Primary verification |
|---|---|
| 1 — Repo & package checks | Levels 1–2 (package-check + CI) |
| 2 — Browser & .org review | Levels 3–5 (E2E, Theme Check, manual QA) |
| 3 — Release packaging | Level 1 on the zip + Level 4 + clean-install (Playground / throwaway Studio) |
| 4 — Interactivity (Preact) | Level 6 (TDD for any directive/JS) + Level 3 (JS-off fallback E2E) |
| 5 — SEO & structure | Levels 3 + 5 (render/structure assertions + manual) |
| 6 — Educational | Plain-language / readability review of docs; Level 1 keeps assets export-ignored |

## Principles

- The deterministic gate (package-check + CI) owns "green"; reviewers and humans own
  judgment — correctness, accessibility, design, and voice.
- Scale effort to the change: a doc typo is not a test event; a new core enhancement
  needs a JavaScript-off fallback test.
- Keep the test tooling dependency-free and no-build wherever possible, matching the
  theme's ethos.

See also: [Testing guide](testing.md) (how to run things) and
[Backlog](backlog.md) (the manual Release QA checklist).
