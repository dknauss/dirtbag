# Phase 6 — Where educational content lives (decision)

Research/planning artifact. Not shipped (`.planning/` is export-ignored).
Companion to [PERSONAS-AND-OBJECTIVES.md](PERSONAS-AND-OBJECTIVES.md) (LO IDs) and
[TEACHABLE-SURFACES-AUDIT.md](TEACHABLE-SURFACES-AUDIT.md) (gap #7 — this decision gates the
learning-path structure).

Roadmap deliverable: *"A decision on where educational content lives (docs + seed demo vs. an
external companion) that keeps the WordPress.org package minimal."* Success criterion:
*"No educational assets bloat the WordPress.org package — everything teachable is
`export-ignore`d or external."*

## The constraint is already mostly satisfied

`.gitattributes` `export-ignore`s `docs/`, `.planning/`, `playground/`, `tests/`,
`.github/`, `.githooks/`. So **anything placed in `docs/` or `playground/` is already absent
from the release archive.** The package-minimal goal does not force content *out* of the
repo — it forces it out of the *zip*, which the existing rules handle. `bin/package-check`
even gates the `playground/** export-ignore` line, so this can't silently regress.

What ships in the package and could bloat it: `style.css`, `theme.json`, `templates/`,
`parts/`, `patterns/`, `styles/`, `languages/`, `readme.txt`, `screenshot.png`. **Patterns
are the only teachable surface inside the package** (per the audit) — so they are the one
place where "teaching material" and "shipped weight" genuinely collide.

## The external companion already exists (key finding)

The audit treated "external companion (Playground blueprint / site)" as a thing to build.
It is mostly already here:

- `playground/blueprint-stable.json` / `blueprint-main.json` install the theme **and run
  `seed-content.php` from a blank install on every load** (`importStarterContent` +
  `runPHP`). The README links both as live previews.
- `docs/development.md` states it plainly: *"The free pristine demo already exists: the
  Playground links run `seed-content.php` from a blank install on every load."*

So the seeded pages/posts — the audit's richest, best-voiced teaching surface — are **already
reachable by anyone, hosted, with zero install**, via a URL. The "external companion" is not a
separate site to stand up and maintain; it's a *blueprint variant* pointed at the same seed.

## Three candidate homes, and what each is good for

| Home | In release zip? | Best for | Cost / risk |
| --- | --- | --- | --- |
| **A. `docs/`** | No (export-ignored) | Prose lessons, annotated walkthroughs, glossary, the LO-8 capstone tutorial, the learning-path index | Maintainer-altitude today (audit gap #3); free to grow; versioned with the theme |
| **B. Seed demo** (`playground/seed-content.json`) | No | Lessons *by living example* — Tinker reads/edits real blocks in a real Site Editor | Demo-only; edits must round-trip through Studio (dev guide reseed rules); not a place for long prose |
| **C. Playground blueprint** (`playground/blueprint-*.json`) | No | The zero-install hosted "open the textbook" link; an optional **education** variant landing on the Field Guide | Already exists; an extra variant is ~1 small JSON file + a README badge |
| **(In-package) patterns** | **Yes** | Worked-example markup the learner inserts | Comments here add shipped bytes — keep minimal; annotate in `docs/` instead |

## Decision

**Hybrid: `docs/` + seed demo, surfaced through a dedicated education Playground blueprint.
Nothing new ships in the WordPress.org package.**

Concretely:

1. **Prose and structure → `docs/`.** The learning-path index, the "read the theme" tour,
   annotated-code walkthroughs (LO-3/LO-7), the glossary, and the LO-8 capstone tutorial all
   live as Markdown in `docs/`. Export-ignored, versioned with the theme, free to grow.
2. **Lessons-by-example → the seed demo (as-is).** The seeded **Field Guide / Block Sampler /
   Typography / Colour Styles / Glovebox Map / open-web pages** stay the in-WordPress textbook
   for Tinker. The wording-precision debt (audit gap #5) is fixed *in place* in
   `seed-content.json`; no new seed pages required to start.
3. **The "open the textbook" door → a Playground blueprint.** Add one
   `blueprint-learn.json` (or reuse stable) whose `landingPage` is `/field-guide`, linked
   from the README and the docs learning-path index. This is the "external companion" — built
   on infrastructure that already exists, not a hosted site to operate.
4. **Patterns stay silent in-package; annotated in `docs/`.** Because patterns ship, do **not**
   add teaching comments to `patterns/*.php`. Document the "why" of each pattern in a `docs/`
   walkthrough that points at the pattern file. Keeps the zip minimal (success criterion).

### Why this over the alternatives

- **Pure `docs/`-only** would duplicate, in prose, the living Site-Editor experience the seed
  already delivers better — and strand Tinker (who starts in WordPress, not in a Markdown file).
- **A separate hosted companion site** adds an operational surface (hosting, deploys, drift
  from the theme) for no benefit the Playground blueprint doesn't already provide for free.
- **Teaching comments inside shipped files** (patterns, templates) is the one option that
  *violates* the package-minimal success criterion. Explicitly rejected.

## Consequences for the next deliverable (learning-path structure)

With homes settled, each LO maps to a concrete home — this unblocks the structure deliverable:

- LO-1/LO-2/LO-5/LO-6 → mostly **reframe/annotate existing** (seed pages + a docs index).
- LO-3/LO-7 → **new `docs/` walkthroughs** pointing into `templates/`, `parts/`,
  `patterns/`, `bin/package-check`.
- LO-4 → **point at** `philosophy-audit.md` + the OEM posts (after the wording fixes).
- LO-8 → **new `docs/` capstone tutorial**, optionally paired with `blueprint-learn.json`.

## Open items (not blocking)

- **Reframe `docs/README.md`?** It currently says docs are "for maintainers, reviewers."
  Adding a learner-facing learning-path entry is part of the structure deliverable, not this
  decision. Likely a `docs/learn/` subdir or a top "Start learning here" section so maintainer
  and learner docs coexist without one altitude swamping the other.
- **Glossary placement** — `docs/learn/glossary.md` vs a seeded **Glossary** page. Lean docs
  (searchable in-repo, no reseed cost); revisit if Sprout testing wants it in-WordPress.
- **`blueprint-learn.json` vs reusing `blueprint-stable.json`** with a different landing page —
  decide during build; trivial either way.
