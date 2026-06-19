# Phase 6 — Learner personas & learning objectives

Research/planning artifact. Not shipped. Lives in `.planning/` (export-ignored).
Source intent: [ROADMAP.md](../ROADMAP.md) Phase 6 — "turn the tinker intent into a
deliberate learning vehicle for block-theme basics, the open web, and accessible,
build-free WordPress."

## How Dirtbag already pitches its learner

The existing copy is already aimed at a teacher's audience, not just a user's:

- README: *"for people who want to learn about WordPress theme design and front-end
  development by stripping down to fundamentals and building up from there… a gateway
  drug to tinkering."*
- README "What it is": *"for people who want to get under the hood to tinker… All you
  need is a little HTML, curiosity, and a DIY independent streak."*
- PROJECT core value: *readable, navigable, and understandable with WordPress core
  blocks, native browser behaviour, and minimal theme machinery.*

So the personas below are a sharpening of an audience the theme already addresses, not a
new direction.

## Primary personas (the two we design for)

### P1 — "Tinker" — the curious DIY site owner who wants to look under the hood

The center of gravity. Already named first in the README.

- **Who:** Runs (or wants to run) a small personal/blog/portfolio WordPress site. Comfortable
  in the Site Editor and with a little HTML. Not a professional developer; learns by
  poking at a real thing that works.
- **Starting knowledge:** Knows posts/pages, basic blocks, "Appearance → Editor." Has
  never opened a `theme.json`, doesn't know what a template part is on disk, thinks "the
  theme" is a black box you pick and live with.
- **Goal:** Understand *why* their site looks and behaves the way it does, and gain the
  confidence to change it deliberately instead of installing another plugin.
- **Motivation/identity:** The "dirtbag" ethos — durable, low-dependency, DIY, anti-bloat,
  view-source nostalgia. Wants self-reliance, not a build pipeline.
- **Failure mode to avoid:** Material that assumes a terminal, Node, or a Git clone before
  any payoff. Tinker meets Dirtbag *inside WordPress first*, on a live demo site.
- **Success looks like:** Opens a style variation, reads the annotated `theme.json`, changes
  one token, sees it land — and understands the whole chain.

### P2 — "Wrench" — the developer-curious learner exploring no-build / no-framework WordPress

The README's *"developers curious about no-build / no-framework WordPress."* The reader who
will actually read the source and `bin/package-check`.

- **Who:** Has built sites; maybe knows React/Tailwind/a bundler from JS-land, or is a
  classic-PHP WordPresser meeting full-site editing. Skeptical that "no build step" and
  "no theme JS" can produce something real.
- **Starting knowledge:** Reads code fluently. Doesn't yet have a clear mental model of
  block-theme file structure, `theme.json` as the styling layer, or where core ends and
  the theme begins.
- **Goal:** A defensible mental model of how far native WordPress + the browser can go
  before you reach for tooling — and a worked example proving it.
- **Motivation/identity:** Craft, restraint, "delete code by default," honest engineering.
  The `philosophy-audit.md` voice ("name the job first, pick the tool last") is written
  *for* this reader.
- **Failure mode to avoid:** Hand-waving. Wrench will call out any slogan ("no JavaScript")
  that a browser disproves in ten seconds — the audit already flags exactly these.
- **Success looks like:** Reads the "build it from `theme.json` up" tutorial, agrees the
  abstraction earns its cost, and can articulate the OEM-vs-aftermarket rule to someone else.

## Secondary personas (serve where cheap; don't bend the plan around them)

- **S1 — "Beacon" — the IndieWeb newcomer.** Wants feeds, OPML, h-card, rel=me, XFN, now
  pages, webmentions — the open-web affordances Dirtbag already ships patterns and pages
  for. Overlaps heavily with Tinker. Served mostly by making the open-web surfaces explicit
  and explained, not by separate tracks.
- **S2 — "Sprout" — the student new to block themes** (bootcamp, classroom, self-taught).
  Needs the glossary and the gentlest on-ramp. Mostly a subset of Tinker with less site
  experience; the glossary + plain-language guidelines (Phase 6's later deliverables) carry
  most of their weight.

Personas explicitly *out of scope:* agency teams shipping client sites at scale, and anyone
who needs a build pipeline. Dirtbag can mention them but should not design lessons for them.

## Learning objectives

Derived from the roadmap's "what Dirtbag already teaches implicitly that should be made
explicit." Each objective is phrased as something a learner can *do*, tagged with primary
persona(s) and a rough difficulty tier so later sequencing has a backbone.

### LO-1 — Styling lives in `theme.json`, not a stylesheet file  *(Tinker, Wrench — core)*
Explain why `style.css` is empty, read the settings/styles split in `theme.json`, change a
color/typography token, and predict the result. Distinguish *theme-owned* output from the
CSS WordPress core prints.

### LO-2 — Compose with core blocks before reaching for custom  *(Tinker — core)*
Build a page from headings, paragraphs, lists, quotes, tables, Group/Row/Columns. Pick the
right template shape (plain/wide/centred/no-title). Recognize when a pattern beats a custom
block. (The seeded **Field Guide** "common publishing needs → matching blocks" table is the
seed of this.)

### LO-3 — Templates & template parts as real files  *(Tinker, Wrench — intermediate)*
Map the on-disk `templates/` + `parts/` structure to what renders. Take the "read the theme"
tour (the seeded **Glovebox Map** already drafts this). Understand the front-page / index /
single / archive / 404 chain.

### LO-4 — OEM Interactivity API over aftermarket frameworks  *(Wrench — intermediate)*
State the no-theme-JS rule *precisely* (the audit's distinction: theme-owned vs WordPress-owned
vs browser-owned vs third-party). Explain the OEM ladder (native HTML → core Interactivity API
→ tiny vanilla → aftermarket) and why each core enhancement (overlay, enhanced pagination,
lightbox) must degrade to a useful document.

### LO-5 — The open web is a feature, not nostalgia  *(Beacon, Tinker — intermediate)*
Use feeds, OPML, XFN/blogroll, h-card, rel=me, now/uses pages, and plain-text site-root files.
Understand microformats as "machine-readable HTML you already wrote." (Maps to the open-web
patterns + the `links`/`feeds`/`now`/`uses` page templates + `site-root-open-web-files.md`.)

### LO-6 — Accessibility is the default, and how to keep it  *(all — core→intermediate)*
Read the accessible patterns (accessible table, captions, landmarks, skip link, keyboard/focus)
and understand *why* each choice is accessible. Know that opting into a core enhancement means
owning its fallback and its keyboard behavior.

### LO-7 — `bin/package-check` as a dependency-free flashlight  *(Wrench, Tinker — intermediate)*
Run the check, read its output, understand each thing it verifies (required files, JSON,
screenshot dims, block nesting, hygiene, PHP syntax) and *why* a no-build theme still wants a
gate. Reframes "tooling" as something you can read in one Bash file, not a pipeline.

### LO-8 — Build a Dirtbag-shaped theme from `theme.json` up  *(Wrench, advanced Tinker — capstone)*
The synthesizing tutorial: start from an empty `style.css` header + minimal `theme.json`, add
settings, a template, a part, a pattern, run `package-check`, ship. Ties LO-1…LO-7 together and
is the roadmap's "build it yourself" deliverable.

## Objective → difficulty → suggested path

A first cut at the "Field Guide / Garage learning path" the roadmap asks for (to validate in
the structure deliverable, not lock now):

1. **On-ramp (in WordPress, no terminal):** LO-2, LO-1 (read-only), LO-6 awareness.
2. **Under the hood (read the theme):** LO-3, LO-1 (edit a token), LO-5.
3. **The honest machine:** LO-4, LO-6 (fallbacks/keyboard), LO-7.
4. **Capstone:** LO-8.

Tinker can stop after path 2 and have real value. Wrench is pulled toward 3–4.

## Open questions to resolve in later Phase 6 deliverables

- One primary persona or two? This outline commits to **two** (Tinker + Wrench) because the
  README already addresses both and they need different on-ramps (in-WP vs read-the-source).
  The structure deliverable should confirm we can serve both without forking every doc.
- Does the capstone (LO-8) live in `docs/` or as an external companion Playground blueprint?
  Deferred to the "where does content live" decision.
- Glossary scope (S2/Sprout) — minimal viable term list vs comprehensive. Deferred to the
  plain-language/accessibility-guidelines deliverable.

See companion: [TEACHABLE-SURFACES-AUDIT.md](TEACHABLE-SURFACES-AUDIT.md) for how today's
material maps onto LO-1…LO-8 and where the gaps are.
