# Phase 6 — Teachable-surfaces audit

Research/planning artifact. Not shipped (`.planning/` is export-ignored).
Companion to [PERSONAS-AND-OBJECTIVES.md](PERSONAS-AND-OBJECTIVES.md); objective IDs
(LO-1…LO-8) are defined there.

**Purpose:** inventory everything Dirtbag *already* uses to teach — `docs/`, seeded
pages/posts, patterns, and `bin/package-check` — score how well each serves the learning
objectives, and surface the gaps the structure deliverable must close. Build later; this
is the map, not the build.

## Coverage matrix (objective → strongest existing surfaces)

| Objective | Today's coverage | Strength |
| --- | --- | --- |
| LO-1 `theme.json` not a stylesheet | `style.css` (empty header), `theme.json`, dev guide "What 'no theme stylesheet' means" / "What `theme.json` cannot do", seeded **Typography** & **Colour Styles** pages | **Strong concept, no annotation** |
| LO-2 Core blocks first | Seeded **Field Guide** (needs→blocks table), **Block Sampler**, 16 patterns | **Strong** |
| LO-3 Templates & parts as files | `templates/` + `parts/` on disk, seeded **Glovebox Map** post, dev guide "Repository layout" | **Strong content, not a guided tour** |
| LO-4 OEM Interactivity API | README "JavaScript policy", `philosophy-audit.md`, seeded **OEM parts…** post, **About**, **Field Guide** CSS/JS rule | **Strongest-written area** |
| LO-5 Open web | Open-web patterns (blogroll-xfn, h-card, rel-me, open-web-links, webmention-invitation, now-section), seeded **Links/Feeds/Now/Uses**, `site-root-open-web-files.md` | **Strong, scattered** |
| LO-6 Accessibility default | `accessible-table` + `byline`/`post-meta`/`previous-next` patterns, seeded **Accessibility** page, `docs/captions.md`, README a11y goals, testing-strategy a11y focus | **Strong, not "why"-annotated** |
| LO-7 `package-check` flashlight | `bin/package-check` (single readable Bash file), README "Development", dev guide "No build step means no hidden step" | **Exists, never taught as a lesson** |
| LO-8 Build from `theme.json` up | — nothing end-to-end | **Gap (capstone unbuilt)** |

## Surface-by-surface inventory

### A. `docs/` (maintainer-facing today; teaching-adjacent)

`docs/README.md` explicitly frames the folder as *"for maintainers, reviewers, and anyone
who wants to understand how the theme stays small"* — i.e. **not yet** addressed to Tinker
or Sprout. Reframing is a Phase 6 decision, not a rewrite to assume here.

| Doc | Lines | Serves | Notes |
| --- | --- | --- | --- |
| `README.md` (docs index) | 21 | navigation | Maintainer-framed; no learning path entry point. |
| `development.md` | 130 | LO-1, LO-3, LO-7 | Best raw material for "read the theme." Sections "What 'no theme stylesheet' means", "What `theme.json` cannot do", "No build step means no hidden step" are near-lesson quality already. |
| `philosophy-audit.md` | 77 | LO-4 | The doctrine source. Honest, precise, Wrench-pitched. Not a learner doc yet (it's an audit *of* copy) but it's the canonical wording for LO-4. |
| `style-variations.md` | 53 | LO-1 | How global styles + truck-icon token work. Directly feeds the "change a token" exercise. |
| `site-root-open-web-files.md` | 200 | LO-5 | Deepest open-web reference; lives outside the theme zip by design. Good Beacon material. |
| `testing-strategy.md` | 149 | LO-6, LO-7 | Explains the calibrated pyramid + a11y focus. Teaches *why we test this way*; useful for Wrench. |
| `testing.md` | 78 | LO-6 | Manual/browser/a11y checks. |
| `theme-review.md` | 74 | LO-7 | Packaging/credits/translatability/security — WordPress.org literacy. |
| `captions.md` | 58 | LO-6 | Image-caption accessibility guidance — concrete a11y lesson. |
| `backlog.md` | 83 | meta | "Documentation improvements" section is a pre-existing TODO bucket to reconcile with this audit. |

**docs/ verdict:** rich, accurate, and almost entirely **maintainer-altitude**. The teaching
content is *present but addressed to the wrong reader* and not sequenced. Biggest lever: a
learner-facing entry doc + a "read the theme" tour that *points into* development.md rather
than duplicating it.

### B. Seeded pages/posts (the "Dirtbag diction" content — `playground/seed-content.json`)

13 pages + 10 posts, export-ignored, only present on the demo/Studio site. This is the
single richest teaching surface and the one Tinker actually meets first (inside WordPress).

Pages (chars): **Features** 9.7k · **About** 5.2k · **Typography** 5.4k · **Colour Styles**
4.8k · **Block Sampler** 4.6k · **Field Guide** 4.1k · **Accessibility** 2.7k · **Feeds**
1.6k · **Colophon** 1.3k · **Links** 1.1k · **Now** 0.8k · **Contact** 0.7k · **Uses** 0.3k
(+ thin **Archive**/**Search** landing pages).

Posts: **What the shoulder taught us** 5.4k · **OEM parts, not aftermarket chrome** 5.3k ·
**Field notes from the shoulder** 3.3k · **The Glovebox Map** 2.3k · **Idling near the
gravel pit** 1.6k · **No Build Step, Just Keep Driving** 1.1k · **A Table, a Caption…** 1.1k
· **Tools that earn their keep** 0.8k · **The feed is the campfire** 0.8k · **Plain HTML
still just works** 0.5k.

| Seeded piece | Primary objective | Role in a learning path |
| --- | --- | --- |
| **Field Guide** | LO-2, LO-4 | Already the natural "start here" — write/publish guidance + needs→blocks table + the CSS/JS rule. Strongest single on-ramp candidate. |
| **Block Sampler** | LO-2 | Live catalog of core blocks. Pairs with LO-2 exercises. |
| **Typography** | LO-1 | Web-safe stacks; concrete `theme.json` typography lesson. |
| **Colour Styles** | LO-1 | The style switchboard. Note audit flag: "no-JavaScript switchboard" wording needs the LO-4 footnote. |
| **The Glovebox Map** | LO-3 | The drafted "read the theme / off-route templates" tour. Closest thing to LO-3's guided walk. |
| **OEM parts…** / **About** / **No Build Step…** / **Idling…** | LO-4 | The doctrine, in narrative voice. `philosophy-audit.md` already flags wording drift to fix (Alpine-as-next-step, "JS in the glovebox", "no dependencies" owner). |
| **Links / Feeds / Now / Uses** | LO-5 | Open-web pages rendered live; Beacon's home turf. |
| **Accessibility** | LO-6 | States the a11y stance for readers (vs testing docs for maintainers). |
| **What the shoulder taught us** / **Field notes…** / **Tools that earn their keep** | meta/voice | Carry ethos and the human+AI process story; lower direct-LO value but set tone. |

**Seed verdict:** this is where teaching *already happens at the learner's altitude and in
the right voice.* Two structural issues: (1) it's only visible on the demo site, so the
"where does content live" decision directly governs whether it can anchor the learning path;
(2) several pieces carry the wording imprecisions `philosophy-audit.md` already catalogued —
those fixes are a prerequisite to promoting any of them to canonical lessons.

### C. Patterns (`patterns/` — 16 PHP files)

Registered block patterns, shipped in the package (NOT export-ignored). Teaching value is
**by example**: a learner inserts one and reads the resulting block markup.

- **Open-web (LO-5):** `blogroll-xfn`, `h-card-profile`, `rel-me-links`, `open-web-links`,
  `now-section`, `webmention-invitation`.
- **Accessibility/structure (LO-6, LO-2):** `accessible-table`, `byline`, `post-meta`,
  `previous-next`, `comments`, `field-note`, `roadside-notice`.
- **Composition/demo (LO-1, LO-2):** `front-page`, `colophon`, `color-style-demo-panel`.

**Patterns verdict:** strong *worked examples* but they teach silently — no inline comments
explaining *why* the markup is shaped this way (the roadmap explicitly lists "commented
patterns" as a desired format). Because patterns ship in the package, any teaching comments
here are the one teaching surface that is **not** free to bloat — keep them minimal or rely
on docs to annotate them. This tension is a real decision for the structure deliverable.

### D. `bin/package-check` (LO-7)

A single ~10 KB Bash + inline-Python file. Verifies required files, `.gitattributes`
export-ignore rules, JSON validity, screenshot dimensions (1200×900), block-comment nesting,
hygiene, and PHP syntax. README and dev guide reference it operationally.

**Verdict:** the perfect embodiment of "tooling you can read in one file," but it is
presented as a *chore to run*, never as a *lesson to read*. LO-7 is almost entirely a
framing/annotation job, not new material — an annotated walkthrough of this one file
delivers most of the objective.

## Gap analysis — what the structure deliverable must add

1. **No learner-facing entry point / sequenced path.** Every objective has material; nothing
   orders it for Tinker or Wrench. The roadmap's "Field Guide / Garage learning path" is
   unbuilt. *(Highest-leverage gap.)*
2. **LO-8 capstone missing entirely.** No end-to-end "build from `theme.json` up" walkthrough.
3. **Audience mismatch in `docs/`.** Content is maintainer-altitude; needs either a learner
   layer on top or explicit reframing of the index.
4. **Silent patterns.** No annotated/commented versions; and annotating ships in-package —
   needs the docs-vs-inline decision.
5. **Wording precision debt.** `philosophy-audit.md` already lists the LO-4 slogans to fix in
   seeded **Features/About/Colour Styles**, `readme.txt`, and old posts. These must be
   reconciled *before* promoting any piece to a canonical lesson.
6. **Glossary absent.** Nothing serves Sprout's term-by-term on-ramp (a named Phase 6 format).
7. **Distribution dependency.** The best learner content (seed pages/posts) is demo-only and
   export-ignored; whether it can anchor the path depends on the unmade "where does content
   live" decision (docs + seed vs external companion Playground/site).

## What is genuinely strong already (don't rebuild)

- The **doctrine and its voice** (LO-4) — `philosophy-audit.md` + the OEM posts are the best
  writing in the project; the job is to *point to* them, not redo them.
- The **open-web surface** (LO-5) — patterns + pages + the site-root doc already cover Beacon.
- The **`theme.json`-as-styling** concept (LO-1) — established across dev guide, style-variations,
  Typography/Colour Styles; needs annotation, not invention.
- The **demo content** as a living, in-WordPress textbook for Tinker.

## Suggested next steps within Phase 6 (still planning, per roadmap)

1. **Proposed structure deliverable** — turn the LO path (PERSONAS doc §"Objective → path")
   into a concrete Field Guide / Garage outline, deciding per piece: reframe-existing,
   annotate, or write-new.
2. **"Where content lives" decision** — docs + seed vs external companion; gates gaps #1 and #7.
3. **Plain-language + accessibility guidelines** — wire in `readability-check`; covers Sprout
   and the glossary (gap #6).
4. **Reconcile** with `docs/backlog.md` "Documentation improvements" so the two TODO sources
   don't drift.
