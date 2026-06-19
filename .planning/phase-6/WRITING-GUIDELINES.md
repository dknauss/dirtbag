# Phase 6 — Plain-language & accessibility guidelines for educational writing

Research/planning artifact. Not shipped (`.planning/` is export-ignored).
Companion to [PERSONAS-AND-OBJECTIVES.md](PERSONAS-AND-OBJECTIVES.md) (who reads this),
[LEARNING-PATH-STRUCTURE.md](LEARNING-PATH-STRUCTURE.md) (what gets written), and
[CONTENT-HOME-DECISION.md](CONTENT-HOME-DECISION.md) (where it lives).

Roadmap deliverable: *"Plain-language and accessibility guidelines for the educational
writing (tie in `readability-check`)."* These rules apply to every piece the learning path
adds or reframes: the `docs/learn/` prose **and** any seed pages/posts edited for the path.
They do not force a rewrite of maintainer docs (`development.md`, `testing.md`, etc.), though
those are welcome to borrow them.

## Audience calibration (write to the reader, not to yourself)

The `readability-check` skill is **calibrated for readers who read English as a second
language** — that is the floor for all path prose, and it is the right floor: Sprout (student)
and many Tinkers benefit from exactly what helps an ESL reader. Calibrate altitude per stage:

| Reader | Where they read | Calibration |
| --- | --- | --- |
| **Sprout** (student) | glossary, Stage 1 | gentlest; define every term on first use; shortest sentences |
| **Tinker** (DIY owner) | Stages 1–2 | plain, concrete, in-WordPress framing; little HTML assumed |
| **Beacon** (IndieWeb) | LO-5 prose | plain; can assume interest, not jargon |
| **Wrench** (developer) | Stages 3–4 | may use precise technical terms, but still earns clarity — no hand-waving (persona failure mode) |

Rule of thumb: **write the path prose for Tinker/Sprout; let only the LO-4/LO-7/LO-8 deep
sections rise to Wrench's altitude**, and even there keep sentences short and claims exact.

## Voice: keep the Dirtbag diction, never at clarity's expense

The seed "Dirtbag diction" (automotive/dirtbag metaphor, dry humour — *glovebox, the shoulder,
OEM vs aftermarket, gravel pit, diagnostic cart*) is an asset and the audit's best-written
material. Keep it, with one rule: **the metaphor serves the lesson; the lesson never serves the
metaphor.** Gloss a metaphor the first time it carries technical weight ("OEM — the parts
WordPress core already ships"). If a sentence would be clearer plain, write it plain.

## Readability targets — the nine `readability-check` categories

Run `readability-check` (the global skill) on each path doc before it is linked as canonical.
Treat its nine categories as the checklist, with these Dirtbag-specific rules:

1. **Paragraph structure** — short paragraphs; one idea each. Break the long "favours…" style
   run-ons (the kind we just split in the README) rather than ship a wall.
2. **Opening paragraph** — every lesson opens by saying what the reader will be able to *do*
   (mirror the LO phrasing), not with throat-clearing or metaphor.
3. **Tiered sentence length** — vary; lead with a short sentence. No three long sentences in a
   row in Tinker/Sprout prose.
4. **Passive voice** — prefer active ("WordPress prints the global styles", not "the global
   styles are printed"). Active voice teaches *who does what*, which is the whole point.
5. **Difficult words** — gloss or link unavoidable jargon to the glossary on first use; replace
   avoidable jargon with plain words.
6. **Filler & hedging** — cut "simply", "just", "of course", "obviously". They shame the
   learner who didn't find it simple. (Note: "simple" is fine in the README *tagline*; the ban
   is on dismissive filler inside lessons.)
7. **Transitions** — connect steps ("once that lands…", "with the token changed…") so a tour
   reads as a path, not a list of facts.
8. **Variation** — don't start five sentences with "Dirtbag" or "The theme".
9. **Heading hierarchy** — see accessibility below; this category overlaps directly.

**Flesch Reading Ease target:** aim **60–70** ("plain English") for Stage 0–2 prose and the
glossary. The deep Wrench sections (LO-4/7/8) may legitimately land lower (more technical
nouns); when they do, that is acceptable **only if** every other category still passes — record
the score and the reason in the PR, don't silently ship a wall of jargon.

## Accessibility of the writing itself (not just of the theme it teaches)

The docs teach accessibility (LO-6); they must model it. These are authoring rules for the
Markdown:

- **Heading hierarchy:** exactly one `#` H1 per file; nest `##`→`###` with no skipped levels.
  (Same rule readability-check checks; same rule the theme's templates follow.)
- **Descriptive link text:** link the destination's name ("the `theme.json` reference"), never
  "click here" or a bare URL. Screen-reader users navigate by link list.
- **Alt text on every image/screenshot:** describe what the screenshot *shows the reader to do*,
  not "screenshot". Decorative images get empty alt.
- **Code blocks:** language-tag every fence (```` ```json ````, ```` ```bash ````,
  ```` ```html ````). **Never put backslash escapes inside a fence** — content between fences
  is literal (this is a repo-wide rule; escapes corrupt shell/JSON examples).
- **Never rely on colour alone** to carry meaning — especially relevant since the path teaches
  colour style variations. Name the colour/state in text too.
- **Tables:** real header rows; a one-line intro before the table saying what it compares.
  Never tables for layout.
- **Keyboard & screen-reader notes:** where a lesson covers a core enhancement (overlay,
  lightbox, enhanced pagination — LO-4/LO-6), state the keyboard behaviour and the plain-HTML
  fallback. Owning the fallback *is* the lesson.

## Terminology: one canonical word per concept

A glossary only helps if the prose is consistent. Canonical terms (also the glossary's
headwords):

| Use | Not |
| --- | --- |
| `theme.json` | "the theme JSON", "the config" |
| block / core block / custom block | "Gutenberg block" (avoid in learner prose) |
| pattern | "block pattern" on first use, then "pattern" |
| template / template part | "part file", "the HTML" |
| Site Editor | "the editor", "FSE editor" |
| full-site editing (FSE) | spell out first use, then FSE |
| global styles / style variation | "the styles", "skins", "themes" |
| the Interactivity API | "Interactivity", "the JS" |
| OEM vs aftermarket | define once (per voice rule), then use freely |
| package check (`bin/package-check`) | "the build", "the script" — it is *not* a build |

The last row matters: a recurring Dirtbag lesson is that the check is **not a build step**.
Never call it one, even loosely.

## The gate

- Run `readability-check` on each `docs/learn/` file and each edited seed page **before** the
  learning-path index links it as canonical.
- A piece is canonical-ready when: all nine categories pass, Flesch is in band (or the
  out-of-band reason is recorded for a Wrench-deep section), terminology matches the table,
  and the accessibility authoring rules above are met.
- This is judgment-plus-tool: `readability-check` scores the prose; a human confirms the
  *lesson* is correct and at the right altitude (the tool can't tell whether the explanation
  is right, only whether it's readable).

## Reconciliation notes

- These guidelines **extend**, not replace, the global Markdown rule (no backslash escapes in
  fences) and the global `readability-check` skill — they add the Dirtbag terminology table,
  the persona altitude map, and the package-minimal authoring constraints.
- The wording-precision debt the audit catalogued (gap #5: LO-4 slogans in seed **Features/
  About/Colour Styles**, `readme.txt`, old posts) should be fixed *to these rules* — that fix
  is the first real application of this deliverable.
