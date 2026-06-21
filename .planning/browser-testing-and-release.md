# Browser testing & release — plan + two-agent reconciliation

Status: **planning only.** Two agents have worked this in parallel; everything is
uncommitted in the working tree until the in-flight work settles. This doc
reconciles both and lists the open decisions.

## Current working-tree state (all uncommitted)
- **Agent 2** produced `tests/styles/truck-icon.spec.js` (style-picker / truck-icon
  regression) and a *draft* capability-detecting handoff rule (for the global
  `~/.claude/CLAUDE.md` rewrite — not written to disk, not applied).
- **Codex** has older WIP: `M docs/README.md`, deleted `docs/blog-drafts/*`,
  deleted `docs/repro/gutenberg-…caption…`.
- This doc (`.planning/browser-testing-and-release.md`).
- (Separately, on Studio only: the faithful texturize plugin is swapped in and a
  `texturize-demo` page exists — see Part C.)

---

## Reconciliation with Agent 2's work

### B1 — style-picker regression → DONE by Agent 2 (adopt)
`tests/styles/truck-icon.spec.js` slots into the existing **per-style** harness
(`DIRTBAG_STYLE` + the `a11y-styles.spec.js` driver model, picked up by
`playwright.styles.config.js` / `axe-styles.sh` / `npm run test:styles`).
Per active style it asserts the masthead logo's
`--wp--custom--dirtbag--truck-icon-filter` equals the value read **from
`theme.json` / `styles/<slug>.json`** (no hardcoded parallel table), and that the
property is actually wired to `filter` (none-vs-not-none).

This **resolves the design fork my plan flagged** (per-instance vs in-session
switching). Agent 2 chose per-instance + a *source-of-truth* assertion: if a value
from a prior style "stuck," it would mismatch the current style's declared value and
fail. Good fit for the existing harness, and the no-hardcoded-table approach is the
right call.

- **Residual gap (minor):** the test applies each style then restores default, so a
  pure *cross-switch* leftover (A→B→A without a default reset) isn't directly
  exercised. The source-of-truth match catches *wrong-per-style* values, which is the
  real-world failure mode. **Decision:** is per-instance source-of-truth enough, or do
  we want a small in-session A→B→A switch test on top? (My read: source-of-truth is
  enough; add the switch test only if true cross-switch sticking ever recurs.)

### Capability-detecting handoff → Agent 2's draft is the base (adopt + one add)
Agent 2's 4-tier draft (scripted/headless → in-session browser MCP → computer-use
read-tier → handoff) is **more complete than my 3-tier sketch** — it enumerates the
actual MCP/computer-use tools and encodes the **localhost-sandbox caveat** (scripted
CLI may be blocked on `localhost`; run unsandboxed or via a browser MCP). Adopt it for
the **global** `~/.claude/CLAUDE.md`.

- **One addition to fold in — the "headless-negative" caveat:** some cases *cannot* be
  reproduced headless (the Chrome float-bug repro — headless can't trigger it). Those
  must use tier 2 (a *visible*-browser MCP) or tier 4 (handoff), **never** tier 1, or
  an agent will headless-run them and get a false negative. Agent 2's ordering handles
  this implicitly (headless fails → falls through), but naming it prevents the
  false-negative trap.
- **Layering:** the *global* rule = Agent 2's tiers. A *project* note (Dirtbag) maps
  which backlog items are headless-scriptable vs visible-Chrome, plus the harness
  commands — see Part A.

### Agreed anchor
`tests/` and `docs/` are **export-ignored** → none of this ships in the theme zip.
Both agents agree: **no theme version bump for the browser-testing work.** (See Part C.)

---

## Part A — project browser-testing note (Dirtbag)
There is **no project `CLAUDE.md`** today. Two options (decision needed):
- create a small project `CLAUDE.md` carrying the project tier-map + harness commands, **or**
- add it as a section in `docs/testing.md`.

Content (either way): the global tiers (Agent 2's rule) + a Dirtbag mapping:
- **Headless-scriptable (tier 1):** axe sweeps (`npm run test:styles` / `axe-styles.sh`),
  e2e smoke, **truck-icon regression** (`truck-icon.spec.js`), per-style screenshots (B2),
  viewport checks.
- **Needs visible Chrome (tier 2/4):** the float-bug repro (`docs/repro/…`).
- **Interactive (tier 2 MCP):** one-off visual debugging, the caption-style repros.
- Note the localhost-sandbox caveat for any CLI/curl against the Studio site.

---

## Part B — scripts
- **B1 — DONE:** `tests/styles/truck-icon.spec.js` (Agent 2). Uncommitted; `tests/` export-ignored.
- **B2 — OPEN:** per-style screenshots. No existing convention (no `tests/screenshots/`).
  Approach: a `tests/styles/screenshots.spec.js` in the same `DIRTBAG_STYLE` per-style
  harness that captures the front page → `tests/screenshots/<slug>.png` (or Playwright
  `toHaveScreenshot` snapshots). Feeds the backlog's "screenshots for every style variation."
  Headless-friendly. **Owner: TBD** — complements truck-icon.spec.js, no conflict.

---

## Part C — release / cleanup / zip
### C0 — release trigger (load-bearing)
Browser-testing work is entirely under export-ignored paths (`docs/`, `tests/`, a
project `CLAUDE.md`) → **no version bump, no new versioned release** for it. A 0.1.14 is
justified **only** if a *shipped* file changes (`style.css`, `templates/`, `parts/`,
`patterns/`, `theme.json`, `functions.php`, `readme.txt`, `languages/`, `screenshot.png`).

### C1 — cleanup (the substantive part)
- **`v0.1.13` tag:** points to off-main `79b60bc` (byte-identical to main `71dd58e`,
  so the released content is correct, but the tag isn't on main's history). Re-point to
  the canonical main commit + force-push. **Needs Dan's OK (force op).**
- **Codex WIP** (`docs/README.md` + deletions): commit (if Codex is done) / keep stashed /
  discard. Don't commit someone else's WIP unprompted.
- **Stale local branches:** prune merged `chore/blueprint-*`, `feat/default-logo-fallback`,
  `feat/opaque-favicon*`, `docs/*`; force-delete the tangled `feat/opaque-favicon-decouple`.
- **Tag drift:** `git fetch` flagged local-vs-remote divergence on `v0.1.3` (maybe others) — reconcile.
- **Studio state:** faithful texturize plugin is swapped in + `texturize-demo` page exists.
  Decide: keep faithful or revert to post-process; keep / seed / delete the demo page.

### C2 — zip
- Rebuild with `git archive` from the **corrected** canonical `v0.1.13` (current Desktop
  zip is content-correct but built from the off-main tag — rebuild for provenance). Verify
  version 0.1.13 + opaque icon + `shouldSyncIcon:false` + no export-ignored leakage.
- A 0.1.14 zip only if C0 is triggered.

### Sequencing
A + B → C1 cleanup (tag re-point needs approval) → C0 bump only if a shipped file changed → C2 zip.
C1/C2 concern the existing 0.1.13 and can run independently of the browser work.

---

## Decisions needed from Dan
1. **`v0.1.13` tag re-point** (force-push) — go / no.
2. **Codex docs WIP** — commit / keep / discard.
3. **Cross-switch sticking test** — per-instance source-of-truth enough, or add an in-session A→B→A test?
4. **B2 owner** — me, Agent 2, or skip for now.
5. **Project tier note** — new project `CLAUDE.md` or a `docs/testing.md` section.
6. **Studio** — keep faithful plugin + demo page, or revert/clean.
