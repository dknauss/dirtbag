---
created: 2026-06-23T12:00:00.000Z
title: Explore the limits of wptexturize_primes() (feet/inches disambiguation)
area: wordpress-core
todos:
  - docs/repro/wptexturize-18549-review-and-performance.md
---

## Problem

`wptexturize_primes()` decides feet/inches vs. quotes heuristically and has verified warts (this session, against unpatched trunk):

- `5'6"` → `5'6″` — the feet `'` is eaten by the **apostrophe rule** (`digit'digit`) before the prime pass runs, so it becomes a closing apostrophe (`&#8217;`), **not** a prime `′`; only the inches `"` primes correctly.
- The feet/quote call keys off whether a single quote is already "open" (`7'` → prime; `'7'` → the leading `'` opens a quote so the trailing one *closes* it). A genuinely ambiguous lone `7'` is just a guess.

See review doc §10 for the verified table.

## Solution (to explore)

- Characterize the failure set precisely: compound feet-inches (`5'6"`, `7'6"`), primes after an open quote, primes adjacent to inline tags.
- Assess whether the **ordering** in `wptexturize()` can be reworked/guarded so `5'6"` primes the feet — likely needs the prime pass to claim `digit'digit"` *before* the apostrophe rule consumes the inner `'` — without regressing legitimate `digit'digit` apostrophes (e.g. `rock'n'roll` numerics).
- Decide scope: in-scope for #18549/#43810, or a separate Trac ticket (this is orthogonal to the inline-tag context bug).
- Add tests: `5'6"`, `7'6"`, `9"`, `'7'`, `the '7'`, `It is 7' long.`

References: `docs/repro/wptexturize-18549-review-and-performance.md` §10 (primes). Related: [[wptexturize-18549-contribution]].
