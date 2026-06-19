# Phase 6 — Learning-path structure (the Garage)

Research/planning artifact. Not shipped (`.planning/` is export-ignored).
Companion to [PERSONAS-AND-OBJECTIVES.md](PERSONAS-AND-OBJECTIVES.md) (personas, LO IDs,
the four-stage path), [TEACHABLE-SURFACES-AUDIT.md](TEACHABLE-SURFACES-AUDIT.md) (what
exists, gap list), and [CONTENT-HOME-DECISION.md](CONTENT-HOME-DECISION.md) (every piece
gets a home; nothing new ships in the package).

Roadmap deliverable: *"A proposed structure — e.g. a Field Guide / Garage learning path,
annotated-code walkthroughs, a glossary, and a 'build it yourself from `theme.json` up'
tutorial."* This turns the LO list + content-home decision into a concrete outline with a
disposition for every piece (**reframe**, **annotate**, **point-at**, or **write-new**) and
a build order. Still planning — this is the blueprint, not the build.

## The shape: one path, four stages, two exit points

The path is **the Garage** — you pull a working theme in off the road, look it over on the
lot, get under the hood, learn the honest machine, then build your own. Stage names are the
ones already committed in the personas doc (§"Objective → difficulty → suggested path"); this
deliverable makes each stage concrete and assigns homes.

| Stage | Garage name | Objectives | Reader starts | Reader ends |
| --- | --- | --- | --- | --- |
| 0 | **Pull in** (entry) | — | a README link | knows the route + opens the live demo |
| 1 | **On the lot** (on-ramp, in WordPress, no terminal) | LO-2, LO-1 *(read-only)*, LO-6 *(awareness)* | clicks blocks in the Site Editor | composes a page from core blocks; knows styling is somewhere called `theme.json` |
| 2 | **Under the hood** (read the theme) | LO-3, LO-1 *(edit a token)*, LO-5 | "the theme is a black box" | maps `templates/`+`parts/` to what renders; changes one token; uses the open web |
| 3 | **The honest machine** | LO-4, LO-6 *(fallbacks/keyboard)*, LO-7 | "no JS" is a slogan | states the OEM rule precisely; owns a fallback; reads `bin/package-check` |
| 4 | **Build your own** (capstone) | LO-8 | has read Dirtbag | builds a Dirtbag-shaped theme from an empty `style.css` up |

**Two exit points (from the personas doc):** **Tinker** can stop after Stage 2 with real,
durable value (understands and can change their own site). **Wrench** is pulled through
Stages 3–4 (the precise rule, the readable gate, the capstone proof). No content forks per
persona — same path, different natural stopping points, signposted at each stage end.

## Per-piece disposition (every LO → home + action + source)

Homes follow [CONTENT-HOME-DECISION.md](CONTENT-HOME-DECISION.md): prose in `docs/`,
lessons-by-example in the seed demo, the door is a Playground blueprint, patterns stay
silent in-package and are annotated *in `docs/`*.

| LO | Stage | Persona | Home | Disposition | Concrete artifact | Built from |
| --- | --- | --- | --- | --- | --- | --- |
| **LO-2** core blocks first | 1 | Tinker | seed + docs index | **reframe** | seed **Field Guide** as the canonical Stage 1; index entry in `docs/learn/` | seed Field Guide, Block Sampler, 16 patterns |
| **LO-1** `theme.json` not a stylesheet | 1→2 | Tinker, Wrench | seed + docs | **reframe** (read) → **annotate** (edit) | seed Typography/Colour Styles for read; `docs/learn/change-a-token.md` for the edit | `theme.json`, `styles/*.json`, `style-variations.md`, dev guide |
| **LO-3** templates & parts as files | 2 | Tinker, Wrench | docs (new) | **write-new** | `docs/learn/read-the-theme.md` — a guided tour pointing into `templates/`, `parts/` | seed **Glovebox Map**, dev guide "Repository layout" |
| **LO-5** open web as a feature | 2 | Beacon, Tinker | seed + docs | **reframe** | seed Links/Feeds/Now/Uses as live examples; index entry pointing at `site-root-open-web-files.md` | open-web patterns, seed pages, `site-root-open-web-files.md` |
| **LO-6** accessibility default | 1→3 | all | docs (annotate) | **annotate** | `docs/learn/why-this-is-accessible.md` pointing at `accessible-table`, `byline`, skip link, captions | accessible patterns, `captions.md`, seed **Accessibility** page |
| **LO-4** OEM Interactivity API | 3 | Wrench | docs (point-at) | **point-at** *(after wording fixes)* | `docs/learn/` index entry → `philosophy-audit.md` + OEM posts; the precise four-tier rule | `philosophy-audit.md`, README JS policy, seed OEM posts |
| **LO-7** `package-check` flashlight | 3 | Wrench, Tinker | docs (new) | **write-new** | `docs/learn/read-the-flashlight.md` — annotated walkthrough of the one Bash file | `bin/package-check`, dev guide "No build step means no hidden step" |
| **LO-8** build from `theme.json` up | 4 | Wrench, adv. Tinker | docs (new) + blueprint | **write-new** | `docs/learn/build-your-own.md` capstone; optional `playground/blueprint-learn.json` landing on `/field-guide` | the whole theme as worked example |

**Reframe (3)**, **annotate (2)**, **point-at (1)**, **write-new (3 + glossary + index)** —
most of the path is *pointing and reframing existing strong material*, exactly what the audit
recommended. Only LO-3, LO-7, LO-8 are genuinely new prose.

## Proposed `docs/` tree

A `docs/learn/` subdir keeps learner-altitude prose from swamping the maintainer docs
(content-home open item). The maintainer `docs/README.md` gets one "Start learning here"
pointer at the top; it is not rewritten.

```
docs/
  README.md                      # +1 line: "New here? Start learning → learn/"
  learn/
    README.md                    # the path index (Stage 0): the route, the live-demo door, the two exits
    on-the-lot.md                # Stage 1 wrapper → seed Field Guide / Block Sampler (reframe)
    change-a-token.md            # Stage 1→2 LO-1 edit exercise (annotate theme.json + styles/)
    read-the-theme.md            # Stage 2 LO-3 guided tour (write-new) → templates/ parts/
    the-open-web.md              # Stage 2 LO-5 wrapper → seed open-web pages + site-root doc (reframe)
    why-this-is-accessible.md    # LO-6 annotation (write-new, points at patterns; never edits them)
    the-honest-machine.md        # Stage 3 LO-4 wrapper → philosophy-audit.md + OEM posts (point-at)
    read-the-flashlight.md       # Stage 3 LO-7 annotated bin/package-check walkthrough (write-new)
    build-your-own.md            # Stage 4 LO-8 capstone (write-new)
    glossary.md                  # the term list (Sprout's on-ramp)
```

Everything under `docs/` is already `export-ignore`d, so none of this touches the package.
The optional `playground/blueprint-learn.json` is also `export-ignore`d (the audit confirms
`bin/package-check` gates the `playground/** export-ignore` line).

## The glossary (Sprout)

`docs/learn/glossary.md`, linked from every Stage's prose on first use of a term (see the
writing guidelines deliverable for the "define on first use → link to glossary" rule).
Minimum viable term set, drawn from the LOs: *block, pattern, template, template part,
Site Editor, full-site editing, `theme.json`, global styles / style variation, core block vs
custom block, the Interactivity API, OEM vs aftermarket, microformats, feed/OPML/XFN,
`export-ignore`, package check.* Lives in docs (searchable in-repo, no reseed cost); revisit
a seeded in-WordPress Glossary page only if Sprout testing asks for it.

## Build order (what to write first, and why)

Sequenced by leverage (audit gap #1 = "no sequenced entry point" is the highest), and so each
step unblocks the next:

1. **`docs/learn/README.md` — the path index.** Closes the highest-leverage gap immediately:
   even with zero new lessons, a learner now has a *route* through material that already
   exists. Cheapest, highest-value.
2. **The wording-precision fixes (audit gap #5)** in seed **Field Guide / Features / About /
   Colour Styles**, `readme.txt`, and old posts — the prerequisite to promoting any seed piece
   or pointing at LO-4. Must land before Stage 1/Stage 3 prose calls them canonical.
3. **Stage 1 reframes** (`on-the-lot.md`, the LO-1 read) — turns the strongest existing
   surface (seed demo) into a guided first lesson. Tinker gets value here.
4. **`read-the-theme.md` (LO-3)** — the first write-new; the "read the theme" tour the roadmap
   names explicitly and the Glovebox Map already drafts.
5. **`read-the-flashlight.md` (LO-7)** and **`why-this-is-accessible.md` (LO-6)** — annotation
   jobs, mostly framing not invention.
6. **`build-your-own.md` (LO-8) capstone** + optional `blueprint-learn.json` — last, because it
   ties LO-1…LO-7 together and is only honest once they exist.
7. **`glossary.md`** grows alongside 1–6 (add each term the first time a lesson uses it), then
   gets a final pass.

## How the two personas traverse it

- **Tinker:** Pull in → On the lot → Under the hood, then *may* stop. Never required to open a
  terminal or clone anything; meets Dirtbag inside WordPress via the live demo first
  (persona failure-mode guard). Stages 1–2 are deliberately terminal-free.
- **Wrench:** skims Stage 1, slows at Stage 2, lives in Stage 3 (the precise OEM rule, the
  readable gate) and Stage 4 (the capstone proof). The path signposts "Wrench, start here →
  Stage 3" from the index so a code-fluent reader isn't walked through inserting a heading.

## Acceptance criteria (for the eventual build)

- A learner can start from one README link and reach a deliberate first lesson without a
  terminal (Stage 0→1).
- Every LO-1…LO-8 has exactly one canonical home and is reachable from `docs/learn/README.md`.
- No teaching content is added to shipped files (`patterns/`, `templates/`, `parts/`,
  `theme.json`); `bin/package-check` still passes and the package stays minimal.
- Each new/edited prose piece passes the writing guidelines (deliverable #5) before it is
  linked from the index as canonical.

## Open items (defer to build, not blocking)

- **`blueprint-learn.json` vs reuse `blueprint-stable.json`** with a `/field-guide` landing —
  trivial, decide at build (per content-home doc).
- **Reconcile with `docs/backlog.md` "Documentation improvements"** so the backlog and this
  path don't drift into two TODO sources (audit next-step #4).
- **Stage 1 "edit a token" safety** — whether the LO-1 edit exercise runs against the live
  Playground demo (ephemeral, safe) or a local Studio site; lean Playground for zero-risk.
