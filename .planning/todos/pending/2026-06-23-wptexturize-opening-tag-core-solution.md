---
created: 2026-06-23T12:00:00.000Z
title: Explore a core solution for the opening-tag quote-context gap (#18549/#43810)
area: wordpress-core
todos:
  - docs/repro/wptexturize-18549-review-and-performance.md
---

## Problem

The landed fix (#18549 / PR [#12249](https://github.com/WordPress/wordpress-develop/pull/12249)) and **both** compat plugins only handle the apostrophe/quote *after* a **closing** inline tag (`</em>'s`). The symmetric **opening-tag** case is still wrong: emphasizing the start of a contraction — `I<strong>'ve been</strong>` — leaves `wptexturize()` treating the `'` as an opening quote (`'ve`) instead of an apostrophe. Verified this session. This is the #43810 "both directions" consolidation territory.

## Solution (to explore)

Fix it at the source in `wptexturize()`'s quote-context logic, **not** in the plugins (they are prototypes — see the review doc §11). Open questions:

- `wptexturize()` processes text in token chunks split on tags; the opening-tag case needs the context helper to look at the **next** text token after an opening inline tag, mirroring the closing-tag look-behind already added in PR #12249.
- Decide whether this folds into PR #12249 or a follow-up tied to #43810 (the both-quotes consolidation).
- Cover both `'` and `"`, and the prime intersection (`<sup>7</sup>'`).
- Add historic-compat tests: `I<strong>'ve been</strong>`, `un<em>'</em>`-style fragments, both-quote variants.

References: `docs/repro/wptexturize-18549-review-and-performance.md` §6 (opening-tag follow-up) and §11 (plugin defects). Related: [[wptexturize-18549-contribution]].
