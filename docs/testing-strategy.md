# Testing strategy

Dirtbag is a deliberately small, mostly *declarative* block theme: `theme.json`,
templates, template parts, patterns, and style variations. There is no
`functions.php` and almost no imperative logic. That shapes how we test.

## Focus: accessibility and UX

Dirtbag's quality bar is **accessibility and user experience**, verified in a real
browser. The static gate (`package-check`) keeps the package *valid*, but it cannot
tell you whether the page is *usable* — that is what the Playwright + browser layer
is for, and it is where the testing effort concentrates:

- **Accessibility** — axe (WCAG 2.1 A/AA) across page types *and* across every style
  variation (the dark themes — Terminal, Amber CRT, Blueprint — need contrast
  checks), heading order, landmarks, the skip link, and the navigation overlay's
  focus behaviour.
- **UX** — keyboard reachability and visible focus, the mobile overlay (open / close
  / Esc / focus trap), the search and comment forms, and that the core enhancements
  (pagination, lightbox) degrade to a usable document with JavaScript off.

Everything below supports that focus.

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

## Implementation plan (Playwright + browser)

Built on the existing `tests/` harness (Playwright + `@axe-core/playwright`, booting
Playground via `tests/blueprint.json`). Specs are authored to run in a
browser-capable session (e.g. `claude-playwright`) or CI; a plain CLI session can't
execute browsers, so authored specs are validated when first run there.

**Spec files**

- `tests/e2e/site.spec.js` *(exists)* — smoke: page types return 200, the 404
  template, front-page sticky feature, archive lists, search form.
- `tests/e2e/accessibility.spec.js` *(new)* — axe (`wcag2a`, `wcag2aa`) on `/`, a
  single post, a page, an archive, search, and 404; one `<h1>` with ordered
  headings; `header` / `main` / `footer` landmarks and a labelled `nav`; skip-link
  target.
- `tests/e2e/ux-keyboard.spec.js` *(new)* — Tab order reaches skip link → nav →
  main; the mobile navigation overlay opens from the menu button, closes via its
  close button and `Esc`, and traps focus while open; search and comment forms are
  keyboard-operable; focus is visible.
- `tests/e2e/js-off.spec.js` *(new)* — a `javaScriptEnabled: false` project: query
  pagination still navigates (real links), images stay plain `<img>` (lightbox
  absent, no dead control), and the nav menu is still reachable.

**axe gating policy** — findings are report-only today. Graduate to **failing**
rule-by-rule as the baseline clears, starting with the high-confidence set already
exercised: `image-alt`, `link-name`, `label`, `heading-order`, `landmark-unique`,
`region`, `skip-link`, and `color-contrast`. Track the gated set here as it grows.

**Per-style accessibility sweep** — contrast and focus visibility differ per
variation. Run axe against all seven styles by applying each variation, then
scanning (the variation-applier + headless approach used for the README gallery).
Gate `color-contrast` only once every style passes.

**Viewports** — run the keyboard/overlay specs at a mobile width (360×640) and a
desktop width; add small-viewport screenshot review (240×320, 320×240, 360×640) to
the manual checklist.

**Manual gate (release)** — screen-reader spot checks, a real-keyboard pass, and the
style-switcher regression (no sticky CSS) stay human-run; see `backlog.md` Release
QA.

**Verification discipline** — when these run against a seeded site, treat the
seed/export with suspicion: a raw Site-Editor export can reintroduce artifacts the
reconcile strips, so `package-check` (seed integrity + reconcile guardrails) runs
*first* and the e2e suite second.

## Principles

- The deterministic gate (package-check + CI) owns "green"; reviewers and humans own
  judgment — correctness, accessibility, design, and voice.
- Scale effort to the change: a doc typo is not a test event; a new core enhancement
  needs a JavaScript-off fallback test.
- Keep the test tooling dependency-free and no-build wherever possible, matching the
  theme's ethos.

See also: [Testing guide](testing.md) (how to run things) and
[Backlog](backlog.md) (the manual Release QA checklist).
