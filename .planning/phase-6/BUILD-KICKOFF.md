# Phase 6 build — kickoff plan

**Status: prepped, ON HOLD.** Research and planning are complete and merged to
`main` (PR #28). No lesson content has been written yet — this plan executes only
once the build is green-lit.

The build order below is derived from
[`LEARNING-PATH-STRUCTURE.md`](LEARNING-PATH-STRUCTURE.md); see the other phase-6
deliverables for the personas, surface audit, content-home decision, and writing
rules it depends on.

## Build order

1. **`docs/learn/README.md`** — the path index (Stage 0). Highest leverage: routes
   a learner through existing material with zero new lessons. Closes audit gap #1.
2. **Gap #5 wording fixes** — correct the LO-4 slogans in seed **Field Guide /
   Features / About / Colour Styles**, `readme.txt`, and old posts (a prerequisite
   before any piece is pointed at as canonical). Apply
   [`WRITING-GUIDELINES.md`](WRITING-GUIDELINES.md) here first.
3. **Stage 1 reframes** → `docs/learn/on-the-lot.md` + the LO-1 read.
4. **`docs/learn/read-the-theme.md`** (LO-3, first write-new) → tour into
   `templates/` / `parts/`.
5. **`read-the-flashlight.md`** (LO-7) + **`why-this-is-accessible.md`** (LO-6) —
   annotation.
6. **`build-your-own.md`** (LO-8 capstone) + optional
   `playground/blueprint-learn.json`.
7. **`glossary.md`** grows alongside; final pass last.

## Guardrails

From the planning docs — these hold for every piece:

- Nothing teaching-related ships in the package: no comments added to `patterns/`,
  `templates/`, or `theme.json`.
- Everything lives under `docs/` or `playground/` (both `export-ignore`d).
- Each piece passes `readability-check` before it is linked as canonical.
- `bin/package-check` must stay green.
