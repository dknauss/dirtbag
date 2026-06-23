# Trac #18549 — review, attachment dig, and performance analysis

Companion to:

- [`wptexturize-18549-7.0-compat.patch`](wptexturize-18549-7.0-compat.patch) (minimal)
- [`wptexturize-18549-compat-plugin.php`](wptexturize-18549-compat-plugin.php) (minimal plugin)
- [`wptexturize-18549-historic-compat.patch`](wptexturize-18549-historic-compat.patch) (comprehensive)
- [`wptexturize-18549-historic-compat-plugin.php`](wptexturize-18549-historic-compat-plugin.php) (comprehensive plugin)
- [`wptexturize-18549-historic-inventory.md`](wptexturize-18549-historic-inventory.md) (attachment inventory)

This document records the independent review, the verification of the attachment
inventory against the raw Trac attachments, the edge-case analysis, and the
performance measurements. It is meant to feed the eventual Trac revival comment.

**Terminology.** We settled on the naming convention of referring to the two candidate
patches by **scope**: the **minimal** patch fixes only the
apostrophe-after-closing-inline-tag case; the **comprehensive** patch also handles
double quotes and the original quote-around-link cases, and is a strict superset.
"Historic" / "historical" below refers only to the source material — the old Trac
attachment series and its 4.7-era replacement engine — not to either candidate.
File names keep the `historic-compat` slug for the comprehensive artifacts (they
were reconstructed from that historic material).

Method: empirical checks were run against a live WordPress 7.0 install (the local
Studio site) via `wp eval-file`, calling `wptexturize()` directly and, for the
plugins, replicating their `preg_replace` post-processing. No WordPress core files
or the candidate artifacts were edited during this analysis.

## 1. Bug confirmation (WP 7.0)

`wptexturize()` curls a straight quote/apostrophe to an *opening* quote when it
immediately follows a closing inline HTML tag:

| Input | WP 7.0 output | Desired |
| --- | --- | --- |
| `<strong>He</strong>'s here.` | `<strong>He</strong>&#8216;s here.` (wrong) | `&#8217;s` |
| `<em>It</em>'s fine.` | `<em>It</em>&#8216;s fine.` (wrong) | `&#8217;s` |
| `<a ...>Dan</a>'s truck` | `&#8216;s` (wrong) | `&#8217;s` |
| `<strong>He</strong> 'go'` (space) | `&#8216;go&#8217;` (correct) | unchanged |
| `It's ...` (no tag) | `It&#8217;s ...` (correct) | unchanged |

The space-adjacency case and the no-tag case are already correct; only the
immediately-adjacent case is wrong. This matches the ticket's diagnosis: context
loss across an HTML boundary.

## 2. Candidate validation

Both compat plugins were validated by replicating their post-processing on top of
live `wptexturize()` output:

- Minimal plugin (mark / unmark around `wptexturize`): 6/6 target cases.
- Comprehensive plugin (single post-process pass): 12/12 target cases, later 15/15 once
  the quote-wrapped-content and block-tag cases were added (see §4).

The patches themselves are validated upstream against a fresh `wordpress-develop`
trunk checkout (`e269998`) running the full `Tests_Formatting_wpTexturize` class:

- Minimal patch: `OK (359 tests, 447 assertions)`.
- Comprehensive patch: `OK (361 tests, 469 assertions)`.
- WPCS/PHPCS on the comprehensive patch touched files (`src/wp-includes/formatting.php`
  and `tests/phpunit/tests/formatting/wpTexturize.php`): clean after applying
  `phpcbf` assignment-alignment fixes.

## 3. Attachment dig — inventory verified

The eight raw Trac attachments archived in [`trac-18549-historic/`](trac-18549-historic/)
were cross-checked against the inventory's claims. The mapping is accurate:

- **Test-only diffs** (`18549.diff`, `18549.2.diff`, `18549.3.diff`,
  `18549_tests.diff`) touch only `tests/phpunit/.../WPTexturize.php` and progressively
  comment out, then restore, the quote-around-inline-HTML assertions; `18549_tests.diff`
  adds `data_inline_end_tags` (a data provider) and the engine-level `test_wptexturize_replace`.
- **Implementation diffs** (`18549_wptexturize.diff`, `.2`, `.3`, `.4`) all define the
  replacement engine — `wptexturize_replace_init` / `_str` / `_regex` / `_final` plus
  `wptexturize_primes`. The `.4` diff is the WordPress 4.7 refresh (rev 38586) carrying
  both implementation and tests.
- The comprehensive patch **does not** port the replacement engine, and correctly
  drops the engine-specific `test_wptexturize_replace`.

### Replacement engine = the historical performance blocker

`wptexturize_replace_init()` strips every matched element/shortcode out of the
string (recording byte offsets via `preg_match_all` + `PREG_OFFSET_CAPTURE`),
formats the text-only remainder, then reinserts everything at the recorded offsets
using module-level globals. That is multiple full-string passes plus copies and
offset bookkeeping per call. The `.2` ("individual static variables") and `.3`
("performance revision") revisions were attempts to claw that cost back. This is why
the engine never merged, and it is the central fact for the performance argument
below.

## 4. Edge cases from `data_inline_end_tags` (WP 4.7 set)

The WP 4.7 provider included three cases beyond the obvious ones. Behaviour observed
on live WP 7.0:

| Case | Old 4.7 engine | New approach (before the latest update) | New approach (after) |
| --- | --- | --- | --- |
| `<em>"John"</em>'s` | wrong (`&#8216;s`, marked "should be but…") | plugin fixed; patch did **not** (context guard saw `&#8221;` tail) | both fix → `&#8217;s` |
| `<em>'John'</em>'s` | wrong (mangled) | plugin fixed; patch did not | both fix → `&#8217;s` |
| `<strong>Read more: </strong>"<a>Something (else)</a>"</p>` | right (`&#8221;`) | both **missed** (patch: `)` failed context; plugin: trailing `<` failed lookahead) | both fix → `&#8221;` |

Two findings came out of this:

1. **Patch and plugin were not behaviorally equivalent.** On quote-wrapped content
   (`<em>"John"</em>'s`) the post-process plugin fixed cases the in-tokenizer patch
   skipped — and both beat the old engine, which had documented these as unfixable.
2. **One real regression vs. the old engine** existed on the `Read more … </p>` case
   (closing quote before a block tag, inline content ending in `)`).

### The latest patch update resolves both

The current comprehensive patch broadens the context guard from
`(?:[\p{L}\p{N}]|[.!?])$` to `(?:[\p{L}\p{N}]|[.!?\)]|&#(?:8217|8221);)$` — i.e. a
closing paren and trailing closing-quote entities now count as valid context — and
adds `\p{Po}\p{Pf}` to the fix character classes. The comprehensive plugin's lookahead
gained a closing-tag alternative (`<\/[a-z][a-z0-9]*\s*>`). All three cases above are
now covered by both artifacts and pinned with assertions; the suite is green at
`361 tests, 469 assertions`.

## 5. Performance

Measured on a deliberately tag/quote-dense 94,500-byte body (≈9,500 tokens), per
`wptexturize()` call, on the Studio WP 7.0 PHP runtime. Microbenchmark numbers are
baseline-subtracted (bare token loop ≈ 0.19 ms).

| Approach | Added cost / call | Overhead vs. `wptexturize` (10.8 ms) | Mechanism |
| --- | --- | --- | --- |
| Historic replacement engine | — | (the original blocker) | strip → format → reinsert; multiple passes, globals, offset math |
| Comprehensive patch before fast-path | ~5.5 ms | ~51% | thousands of per-token `preg_match` calls — cost is PHP per-call overhead |
| Comprehensive patch with end-char fast-path (current) | ~2.0 ms | ~18% | cheap last-char test; narrow regex for entity tails; `/u` regex only for multibyte endings |
| Comprehensive plugin | ~2.5 ms | ~23% | two C-level `preg_replace` scans over the whole content |

### Counterintuitive results

- **"Integrated" is not automatically cheaper.** The patch's many small per-token
  `preg_match` calls (PHP call overhead × token count) can cost *more* than the
  plugin's two C-level full-content scans. On this body the raw patch (~51%) is worse
  than the plugin (~23%).
- **Caveat keeping the number honest:** the patch short-circuits
  `_wptexturize_is_inline_closing_tag()` behind `$last_text_ends_with_quote_context`
  (via `&&`), so the realistic figure is below 51% — the always-on cost is the
  per-text-token context regex. The 94 KB blob is also intentionally tag-dense;
  typical prose has far fewer tags, so real-world overhead is lower. The *shape* of
  the cost (per-call regex overhead) is the durable finding.
- The plugin is cheap on raw text (0.18 ms) but ~14× costlier on texturized output
  (2.5 ms), because post-texturize every quote is a `&#8220;`/`&#8216;` entity and the
  two unicode-regex passes then have many more sites to evaluate.

### Optimization applied

The comprehensive patch now guards the per-token context check with a cheap helper,
`_wptexturize_text_ends_with_quote_context()`, instead of running the full Unicode
context regex for every text token. ASCII letters/numbers and `. ! ? )` use direct
character checks; closing quote entities use a narrow entity-tail regex; multibyte
letter/number endings fall back to the Unicode regex. This applies the measured
~5.5 ms → ~2.0 ms (~2.6×) optimization before posting.

### Closing-tag helper: regex replaced by direct `substr` extraction

A reviewer questioned whether `_wptexturize_is_inline_closing_tag()` needs a regular
expression at all: it is only ever reached from inside the `if ( '<' === $first )`
branch, so `^<\/` re-tests a condition the caller already established, and the tag
name is then validated against a fixed `$inline_tags` allowlist — which makes the
`[a-z][a-z0-9]*` character classes redundant. Two refinements were proposed: (a) drop
the regex entirely and use `substr`; or (b) keep it but make the quantifiers
possessive (`[a-z]++`, `\s*+`) to cut PCRE backtracking.

Option (a) is the stronger one and was applied. The guard is now:

```php
if ( '</' !== substr( $text, 0, 2 ) || '>' !== substr( $text, -1 ) ) {
	return false;
}
$tag = strtolower( rtrim( substr( $text, 2, -1 ), " \t\n\r\f\x0B" ) );
return in_array( $tag, $inline_tags, true );
```

The `rtrim()` preserves the original `\s*` allowance for whitespace before `>`, and
*not* `ltrim`-ing preserves the original rejection of a space immediately after `</`
(the old `[a-z]` anchor). The allowlist stays the sole validator of the name.

- **Behaviour preserved.** A differential harness comparing the old regex guard and
  the new `substr` guard agreed on all 45 probe inputs, including `</strong >`
  (trailing whitespace), `</ strong>` (leading-space rejection), `</STRONG>`
  (case-fold), `</a foo>` / `</strong/>` (malformed closers), and multibyte
  (`</引用>`). The function extracted from the *applied* comprehensive patch was
  re-checked against a 27-case subset — still equivalent.
  `vendor/bin/phpcs --standard=phpcs.xml.dist` (WPCS 3.3.0, PHP_CodeSniffer 3.13.5)
  reports clean on both touched files after the refactor.
- **Cost.** On a 400k-call mixed-token microbenchmark the guard dropped from ~0.171
  µs to ~0.158 µs per call (~9%), by trading a per-token PCRE compile/execute for
  byte-level `substr`/`rtrim`. It is a small absolute saving — the helper only runs
  on `<`-prefixed tokens that already passed `$last_text_ends_with_quote_context` —
  but it removes a regex from a per-token path and reads more plainly.
- **Option (b) noted, not taken.** Possessive quantifiers would reduce backtracking
  if the regex were kept, but removing it outright is both cheaper and clearer here.
  The same `<\/[a-z][a-z0-9]*\s*>` construct survives in the comprehensive plugin's
  lookahead, where it stays a single C-level `preg_replace` by design; if that one is
  ever tightened, `[a-z]++\s*+>` is the possessive form to use.

## 6. Recommendations for the Trac comment

- Lead with performance, because it is the historical objection: this approach
  **avoids the replacement engine entirely** — no extra passes, no string
  reconstruction — and the hot-path per-token context check is
  guarded by a cheap character test, consistent with `wptexturize()`'s existing
  `str_contains` guards.
- State the deliberate trade-off: immediate adjacency resolves to a *closing* quote
  (`</tag>"Word"` → `&#8221;…`), per the original ticket intent; the space rule
  protects the opening case; the full suite stays green.
- State the deliberate exclusions: `kbd` (core no-texturize tag), deprecated
  `acronym`, `]` from the trailing class (it flipped the "crazy" shortcode fixture),
  the replacement engine and its low-level tests, and #29882 / `pap-texturize`.
- Note that every historical `data_inline_end_tags` case was re-run; two the original
  engine could not fix now pass, and the prior bounded gap (`Read more … </p>`) is
  closed.
- Minimal vs. comprehensive are **mutually exclusive** patches (same edited lines, same
  `_wptexturize_is_inline_closing_tag()`); propose one. Comprehensive is a superset of
  minimal and addresses the original report's quote-around-link examples.
- Respond to the "is the regex necessary?" review point (§5): it was not. The guard
  is only reached for `<`-prefixed tokens and the inline-tag allowlist already
  validates the name, so `_wptexturize_is_inline_closing_tag()` now extracts the
  name with `substr()`/`rtrim()` and drops the `preg_match()` entirely — the
  allowlist is the sole validator. `rtrim()` preserves the prior whitespace-before-`>`
  allowance; not trimming the leading edge preserves rejection of a space after `</`.
  Behaviour-identical (`Tests_Formatting_wpTexturize`: 361 tests, 469 assertions),
  ~9% faster on the guard. The possessive-quantifier alternative (`[a-z]++`, `\s*+`)
  would only matter if the regex were kept; removing it is cheaper and clearer.
- Related ticket **#43810** (apostrophe after inline tags). **Confirmed (2026-06-22,
  via `wptexturize()` probes on the Studio WP 7.0 site and the patched-trunk checkout
  `2241ba4`) to be the same context-loss bug.** The reported screenshot cases reduce
  to two things plus a non-bug:
  - **Closing-tag adjacency** (`<strong>I</strong>'m`, `<strong>He</strong>'s`) — this
    ticket. The patch fixes it: verified baseline `‘m`/`‘s` → patched `’m`/`’s`.
  - **Opening-tag adjacency** — bolding a contraction (`I` + bold `'ve been` →
    `I<strong>'ve been</strong>`) is the mirror image and is **not yet fixed**: still
    `I<strong>‘ve been</strong>` on *both* baseline and patched trunk, because the patch
    only sets its flag on closing tags. **This is a bounded follow-up patch, separate
    from PR #12249.** Same approach as the closing-tag fix, but it needs a guard so a
    genuine opening quote like `<em>'Hello'</em>` is left alone — only treat the `'` as
    an apostrophe when the text before the opening tag ends in a letter or number.
  - **Not a bug:** in `I'v'e' 'b'e'en'`, the inner apostrophes render identically with
    and without bold; the *only* plain-vs-bold difference is the leading apostrophe (the
    opening-tag case above). The `'`-after-a-space opening quote (` 'b` → ` ‘b`) is
    wptexturize's normal heuristic, the same with or without tags.
  - Consolidation: #43810's headline case is this ticket (one fix, both `'` and `"` via
    the shared `_wptexturize_is_inline_closing_tag()`); the opening-tag work is the
    remaining apostrophe piece. Offer to mark one ticket a duplicate; defer to
    maintainers on which stays canonical.

### Why these bugs look different in the block editor vs. the front end

**Quick diagnostic.** Two questions settle almost every "weird curly quote" report:

```
1. WHERE do you see it?
   • Only in the editor, fine on the front end → not this bug
       (the editor doesn't curl quotes; nothing is actually wrong)
   • On the front end / Preview, but looked fine in the editor → it's wptexturize → go to 2

2. Is the quote right up against a tag edge?
   (e.g. just after </strong> or just inside <strong> — usually from bolding)
   • YES → this bug (context lost across the tag boundary):
       – after a CLOSING tag  (</strong>'s)  → fixed by #18549 / PR #12249
       – after an OPENING tag (<strong>'ve)  → the opening-tag follow-up
   • NO  → normal curling of an ambiguous quote (e.g. apostrophe after a space) → not this bug
```

*Editor vs. front end* tells you whether `wptexturize()` is even involved; *next to a
tag edge or not* tells you whether it's this bug. The rest of this section is the "why"
behind those two rules.

A recurring source of confusion on #43810 (and worth pre-empting in any reply): the
mis-curled quote often *doesn't appear in the editor* even though it's plainly there
on the front end. That is not a second bug — it is the render path.

`wptexturize()` is a **server-side, output-time** filter on `the_content` (and
`the_title` / `the_excerpt` / `comment_text` / etc.). It runs when WordPress renders
the page for a visitor and **never modifies stored content** — `post_content` keeps
the literal straight `'`/`"`, and the transform is reapplied fresh on every render.

| Surface | Render path | Result |
| --- | --- | --- |
| Editor canvas (static blocks: paragraph, heading, list) | client-side JS, from block markup | raw `'` — bug **hidden** |
| Front end | PHP `the_content` → `wptexturize()` | curled quotes — bug **shows** |
| Editor *Preview* (new tab) | front-end template (PHP) | bug **shows** (matches front end) |
| Dynamic / server-rendered blocks (editor preview) | REST `ServerSideRender` → PHP | bug **can show in-editor** |

So static blocks render client-side without `wptexturize()` (bug hidden until the
front end), while Preview and dynamic blocks render server-side with it (bug visible).
The REST `content.rendered` field is filtered (bug present); `content.raw` — what the
editor loads for editing — is not (bug absent).

The irony specific to this bug: the editor is what *creates the tag boundary* that
triggers it — selecting text and pressing **Bold** wraps it in `<strong>…</strong>`,
which is what gets stored — but it renders that boundary rawly. The bug needs both the
boundary *and* `wptexturize()`; only the front end (and Preview) supplies both, which
is why it surfaces there and not on the editing canvas.

## 7. More realistic local benchmark pass

A second benchmark pass by updates the initial performance analysis with
additional, more realistic content shapes. It compared three implementations using
the same local PHP runtime and direct `wptexturize()` calls:

1. baseline `wordpress-develop` trunk `wptexturize()`;
2. the current comprehensive core patch;
3. baseline `wptexturize()` plus the comprehensive plugin's rendered-output post-process.

The benchmark used generated content shapes intended to be closer to actual rendered
content, plus one intentionally dense stress case. Each number below is the median
net milliseconds per call across repeated runs.

| Case | Size | Baseline | Comprehensive core patch | Core overhead | Comprehensive plugin | Plugin overhead |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Plain prose, mostly text | 8.7 KB | 0.148 ms | 0.142 ms | -3.9% (noise) | 0.150 ms | +1.4% |
| Typical post with paragraphs, links, emphasis, quotes | 13.8 KB | 0.503 ms | 0.538 ms | +7.0% | 0.552 ms | +9.7% |
| Rendered block-like HTML with captions/lists/links | 22.3 KB | 0.876 ms | 1.009 ms | +15.1% | 0.904 ms | +3.2% |
| Dirtbag docs/blog corpus wrapped as rendered-ish paragraphs | 27.7 KB | 0.345 ms | 0.391 ms | +13.5% | 0.382 ms | +10.7% |
| Intentionally tag/quote-dense stress body | 92.4 KB | 6.164 ms | 5.933 ms | -3.7% (noise / changed output) | 6.801 ms | +10.3% |

### Interpretation

- On realistic-ish content, both approaches are sub-millisecond per call. The observed
  overhead was usually in the `0.03–0.13 ms` range for the core patch and
  `0.002–0.05 ms` for the plugin on smaller/medium examples, with the plugin paying
  more on the dense stress body.
- The plugin can be competitive because its two `preg_replace()` calls are C-level
  full-string scans. The core patch is integrated, but it still adds token-level PHP
  branching and context checks inside `wptexturize()`.
- The core patch is still the right upstream shape: it fixes the decision where the
  quote is classified, avoids an additional filter pass, and applies anywhere
  `wptexturize()` is used. The plugin is a useful workaround/prototype, but it must
  post-process already-texturized output on every attached filter.
- The likely real-world performance difference between the current comprehensive core patch and the
  comprehensive plugin is small for normal post content. The plugin may be slightly faster on some
  moderate markup because of C-level scans; the core patch should scale better as a
  source fix and avoids extra passes/filter registrations. Neither resembles the old
  replacement-engine cost profile.

Caveats: these are local microbenchmarks, not canonical core performance numbers.
They exclude the rest of the WordPress filter stack and database/template work. They
are best read as comparative shape-of-cost evidence.

### Plugin regex anchoring (minimal vs comprehensive)

A standalone micro-benchmark of the two plugins' transform cost (their
`preg_replace`/`str_replace` work in isolation, not the surrounding
`wptexturize()`) surfaced a counterintuitive result and a fix. The figures below
are net ms/call on synthetic raw/texturized bodies; they isolate regex cost only,
so absolute numbers run lower than the full-WP figures above.

| Plugin transform | Typical ~10 KB | Dense ~60 KB |
| --- | ---: | ---: |
| Comprehensive (two `</…`-anchored passes) | 0.015 ms | 0.109 ms |
| Minimal, **original** un-anchored mark regex | 0.052 ms | 0.291 ms |
| Minimal, **anchored** mark regex (applied) | 0.010 ms | 0.069 ms |

The original minimal `mark` regex led with an un-anchored
`(?:[\p{L}\p{N}]|&…;)` class, so PCRE attempted a match at essentially every
letter and digit in the body — making its single pass ~3–4× *more* expensive than
the comprehensive plugin's two passes, despite the narrower scope. The
comprehensive plugin was already cheap because every pattern leads with the rare
literal `<\/`, which PCRE's first-code-unit scan fast-forwards to.

The minimal plugin's mark regex was rewritten to lead with the same `<\/` anchor:
the preceding-context requirement became a bounded variable-length lookbehind
(`(?<=[\p{L}\p{N}]|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};|&[a-z][a-z0-9]{1,40};)`) and
`\K` drops `</tag>` from the match so only the apostrophe is replaced. PCRE2 reads
past the lookbehind to the literal `<` for its start optimization, so the pass now
visits only closing-tag delimiters. Result: ~4–5× faster, and the minimal plugin
becomes the cheapest of the plugin approaches — the expected ordering for the
narrowest scope. Behaviour is unchanged across an 18-case differential battery
(space-before-tag rejection, named/numeric/hex entities including the 31-character
`&CounterClockwiseContourIntegral;`, multibyte, case-insensitive and non-inline
tags, string-start, chained apostrophes). The bounds cover every valid entity, so
the only divergence is on malformed/oversized entity-like runs immediately before a
closing tag — pathological and not word context.

The durable lesson, consistent with the core-patch helper change above: lead a
regex with the rarest literal available and let PCRE's scan skip the rest.

## 8. Verification — methods and results

Two refinements were made and verified in this round (2026-06): the core helper's
regex guard was replaced with `substr` extraction (§5), and the minimal plugin's
mark regex was anchored on `<\/` (§7). The gates below are what was actually run
locally for those changes; tool versions are recorded for reproducibility.

Environment: PHP 8.5.4, PCRE2 10.47, PHP_CodeSniffer 3.13.5, WordPress Coding
Standards 3.3.0 (installed via `composer install` in the `wordpress-develop`
checkout).

### Static analysis (phpcs)

Run against the WordPress-Core ruleset on the edited core file (and the touched
test file):

```bash
vendor/bin/phpcs --no-cache --standard=phpcs.xml.dist \
  src/wp-includes/formatting.php tests/phpunit/tests/formatting/wpTexturize.php
```

```text
.. 2 / 2 (100%)   → 0 violations (exit 0)
```

The minimal plugin file was checked with `php -l` (it lives in the Dirtbag repo,
outside the core ruleset).

### Behavioural parity (differential harnesses)

Correctness for the two refactors was established with standalone **differential
harnesses** — and, for the core helper, confirmed by the full core test suite (see
below). In a differential harness the old and new implementations are defined side
by side and asserted to return identical output across a battery of probe inputs. Each new implementation was also re-extracted from the *applied
patch* / *committed file* bytes and re-checked, so the harness tests the shipped
code rather than a hand-copy.

| Change | Harness | Inputs agreed |
| --- | --- | --- |
| Core helper: regex → `substr` | old regex guard vs new `substr` guard | 45/45 |
| Core helper (applied patch + working tree) | extracted function vs old regex | 27/27 each |
| Minimal plugin: un-anchored → anchored mark | HEAD `mark` vs working-tree `mark` | 18/18 |

Probe inputs covered the behaviour-sensitive edges: trailing whitespace before
`>` (`</strong >`), leading-space rejection after `</` (`</ strong>`), case-fold,
malformed closers (`</a foo>`, `</strong/>`), multibyte (`</引用>`), and — for the
plugin — space-before-tag rejection, named/numeric/hex entities (including the
31-character `&CounterClockwiseContourIntegral;`), non-inline tags, string-start,
and chained apostrophes.

### Performance (microbenchmarks)

| Measurement | Before | After | Delta |
| --- | ---: | ---: | ---: |
| Core helper guard (400k mixed tokens) | ~0.171 µs/call | ~0.158 µs/call | ~9% faster |
| Minimal plugin mark, typical ~10 KB | 0.052 ms/call | 0.010 ms/call | ~5× faster |
| Minimal plugin mark, dense ~60 KB | 0.291 ms/call | 0.069 ms/call | ~4× faster |

These are local, baseline-subtracted microbenchmarks isolating the changed code;
see §5 and §7 for method and caveats.

### Core test suite (`Tests_Formatting_wpTexturize`)

The full class is green against the `substr`-refactored core source:

```text
OK (361 tests, 469 assertions)
```

Reproduced locally this round on a **SQLite-backed** test database — the
`sqlite-database-integration` v2.2.9 drop-in (`src/wp-content/db.php`) plus a
generated `wp-tests-config.php`, run under PHPUnit 9.6.34:

```bash
vendor/bin/phpunit --filter Tests_Formatting_wpTexturize \
  tests/phpunit/tests/formatting/wpTexturize.php
```

The count matches the prior upstream MySQL run against trunk (`e269998`) exactly,
as expected for a behaviour-identical change. (The SQLite shim emits
`PDO::sqliteCreateFunction` deprecation notices on PHP 8.5; these are from the
drop-in, not the code under test.) The minimal-plugin mark-regex change lives in
the Dirtbag repo and is not exercised by this core class; its parity is covered by
the differential harness above.

## 9. Provenance — where the changes landed

| Change | Repo / branch | Commit | PR |
| --- | --- | --- | --- |
| Helper `substr` refactor (live core source) | `WordPress/wordpress-develop` `fix/18549-inline-quote-context` | `2241ba4` | [#12249](https://github.com/WordPress/wordpress-develop/pull/12249) |
| Helper `substr` refactor (both candidate patches + this write-up) | `dknauss/dirtbag` `fix/18549-substr-closing-tag-guard` | `33d560c` | [#83](https://github.com/dknauss/dirtbag/pull/83) |
| Minimal plugin mark-regex anchoring (+ §7 note) | `dknauss/dirtbag` `fix/18549-substr-closing-tag-guard` | `fb820eb` | [#83](https://github.com/dknauss/dirtbag/pull/83) |
| i18n tests (French elision + multibyte word context) | `WordPress/wordpress-develop` `fix/18549-inline-quote-context` | `0efc177` | [#12249](https://github.com/WordPress/wordpress-develop/pull/12249) |

The comprehensive plugin and the comprehensive/minimal patches' shared
`_wptexturize_is_inline_closing_tag()` carry the `substr` form; the minimal plugin
additionally carries the anchored mark regex. The comprehensive plugin's two
`preg_replace` passes were left unchanged — they already lead with the rare `<\/`
literal.

## 10. Internationalization, typography, and primes

Two concerns get conflated and only one is this ticket's:

- **Which glyph** to emit (`'` vs `'` vs „ vs « …) — cultural/locale. WordPress already
  delegates this: `wptexturize()` reads its curly characters from `_x()` strings
  (`$apos`, `$opening_quote`, `$closing_quote`, …), so translators swap glyphs per
  locale.
- **Which decision** to make (is this `'` an apostrophe/closing or an opening?) —
  context. This is where #18549/#43810 live.

### The character landscape

| Glyph | Unicode | Role | Relevance |
| --- | --- | --- | --- |
| `'` | U+0027 | straight apostrophe (typewriter) | **input** `wptexturize()` converts |
| `"` | U+0022 | straight double | **input** it converts |
| `'` `'` | U+2018 / U+2019 | left single quote / right single quote **and apostrophe** | output |
| `"` `"` | U+201C / U+201D | left / right double quote | output |
| `′` `″` `‴` `⁗` | U+2032/3/4, U+2057 | **primes** (feet/inches, minutes/seconds, math) | **not quotes** — separate path |
| `` ` `` `´` | U+0060 / U+00B4 | grave / acute accent | not quotes; `wptexturize()` leaves them |
| `〃` | U+3003 | CJK ditto mark ("same as above") | unrelated |

Two facts dominate:

1. **U+2019 is both the closing single quote and the apostrophe** — there is no separate
   apostrophe codepoint in normal use (Unicode recommends U+2019 for both). So apostrophe
   vs. closing-quote cannot be told apart by glyph, only by context. That ambiguity *is*
   #18549/#43810.
2. **Primes are a different axis** (see below); grave/acute/ditto are red herrings the
   filter never curls.

### Locale conventions WordPress honours

| Locale | Primary quotes | Note |
| --- | --- | --- |
| English | "…" / '…' | apostrophe = U+2019 |
| German | „…" / ‚…' | the **closing** double (U+201C) is the glyph English uses for **opening** — hardcoding breaks this |
| French | «… …» (narrow no-break spaces) | apostrophe = U+2019; heavy **elision** (l', d', j') |
| Spanish / Polish | «…» / „…" | |
| CJK (ja/zh) | 「…」 『…』 | corner brackets; contraction-apostrophes basically N/A |

### The patch is i18n-correct; the comprehensive plugin is not

- **Patch.** It writes `$apos` / `$closing_quote` (the locale variables), not literal
  `&#8217;`, and its context guards use Unicode classes (`\p{L}\p{N}\p{Po}\p{Pf}` under
  `/u`), so accented and non-Latin letters count as word context. Verified on the patched
  build (English `_x()` defaults): French elision exposed by bolding a leading letter —
  `<strong>l</strong>'homme` → `<strong>l</strong>&#8217;homme`, `<em>l</em>'eau` →
  `…&#8217;eau` — and multibyte word context — `<strong>café</strong>'s` →
  `…&#8217;s`, `<em>naïve</em>'s` → `…&#8217;s`. Pinned as
  `test_historic_apostrophe_after_inline_tag_i18n` (PR #12249, `0efc177`).
- **Comprehensive plugin.** Its regex hardcodes English entities
  (`&#8220;`/`&#8216;` → `&#8221;`/`&#8217;`). Under a German or French locale
  `wptexturize()` emits different glyphs and the plugin's pattern simply will not match.
  **The plugin only works for English-locale output** — a real limitation, and another
  argument for the in-core patch over the plugin. (The minimal plugin's marker is glyph
  independent on input but still substitutes a literal `&#8217;`, so it too assumes the
  English apostrophe.)
- The "adjacency forces closing/apostrophe" rule is a **heuristic**. It is right for
  English contractions and Romance elision; it could be wrong where a closing tag
  legitimately precedes an *opening* quote with no space. That is the same deliberate
  trade-off already documented for English (§6) — locale-dependent, not universal.

### Primes — how `7'` (feet) is told from `'7'` (quoted "7")

`wptexturize()` has a dedicated `wptexturize_primes()` whose docblock states its job:
decide whether `7'.` is seven feet, then emit a prime or a closing quote. The
disambiguation is **stateful — it keys off whether a single quote is already open.** A
digit-then-`'` becomes a prime only when it is *not* serving to close an open quotation.
**The leading `'` is the tell.** Verified on the patched build:

| Input | Output | Why |
| --- | --- | --- |
| `7'` | `7′` (prime/feet) | digit + `'`, no open quote → prime |
| `It is 7' long.` | `7′` | same |
| `9"` | `9″` (double prime/inches) | digit + `"`, no open quote |
| `'7'` | `'7'` (quoted 7) | leading `'` opens a quote → the trailing `'` **closes** it, not a prime |
| `The character '7' is odd.` | `'7'` | same |
| `5'6"` | `5'6″` (**wart**) | the feet `'` is eaten by the apostrophe rule (`digit'digit`) before the prime pass, so it becomes a closing apostrophe, not `′`; only the inches `"` primes |

So the answer to "how can you tell?": the **opening quote** is the signal — `'7'` has one
(the closer can't be feet); bare `7'` does not (read as feet). It is still a heuristic, with
real limits (the `5'6"` wart, and any lone `7'` the author meant as a stray closing quote).
**Our fix does not touch primes** — it requires a tag boundary, and the prime cases are
numeric without one (`<sup>7</sup>'` would be the rare intersection, left to the existing
prime logic). Grave/acute/ditto are out of scope by the same reasoning.

The two prime limits above are filed for a separate core exploration —
`.planning/todos/pending/2026-06-23-wptexturize-primes-limits.md`.

## 11. Plugin defects beyond i18n (and why we are not fixing them)

The two compat plugins (`docs/repro/wptexturize-18549-compat-plugin.php`, the minimal
mark/unmark; and `…-historic-compat-plugin.php`, the comprehensive post-processor) are
prototypes/fallbacks — the real fix is the in-core patch. What we learned is defective:

| # | Plugin | Defect | Status |
| --- | --- | --- | --- |
| 1 | Minimal | Un-anchored mark regex led with `[\p{L}\p{N}]` → PCRE tried every alnum char; ~3–4× slower than the comprehensive plugin while doing less | **Fixed** (`fb820eb`, anchored on `</` + `\K`) |
| 2 | Both | Opening-tag case unhandled — `I<strong>'ve</strong>` → `'ve` (both only match `</tag>'`) | Shared with the patch; **fix in core** (todo) |
| 3 | Minimal | Mark/unmark **removes** the apostrophe and depends on a marker comment surviving to a later filter — fragile | **Verified defective** (below) |
| 4 | Minimal | `unmark` substitutes a literal `&#8217;` → forces U+2019 regardless of locale | Minor (U+2019 is the near-universal apostrophe) |
| – | Comprehensive | Hardcodes English entities (`&#8220;`/`&#8216;`) → fails under non-English locales | See §10 |

### #3 verified: the mark/unmark failure mode is *worse than the bug*

The minimal plugin marks at priority 9 (replacing `'` with `<!--dk-wptexturize-18549-apos-->`)
and unmarks at priority 11 (marker → `&#8217;`), with `wptexturize()` at 10 in between. The
character's existence therefore depends on the marker surviving intact to priority 11. Run
against unpatched trunk `wptexturize()` (`tests` replicate the plugin's exact functions):

| Scenario | Output | Verdict |
| --- | --- | --- |
| no plugin (the bug) | `<strong>He</strong>&#8216;s` | wrong glyph, **still readable** |
| (A) default chain | `<strong>He</strong>&#8217;s` | **works** — marker survives `wptexturize`, restored |
| (B) + HTML-comment stripper between 9 and 11 | `<strong>He</strong>s` | **apostrophe silently dropped** (data loss) |
| (C) truncation across the marker | `<strong>He</strong><!--dk-wp` | **broken marker leaks** into output |

(B) is not hypothetical: HTML minifiers and caches (Autoptimize, WP Rocket "minify HTML",
"remove HTML comments" plugins) strip `<!-- … -->` exactly the way scenario (B) does, and they
commonly hook `the_content` around priority 10 — inside the mark→unmark window. The plugin thus
trades a **cosmetic** mis-curl for a risk of **missing characters or visible corruption**. The
comprehensive plugin has no such failure mode: it only rewrites an existing entity, never
removes a character it must put back.

### Worth fixing? No — the defects are the argument *for* the patch

- **Opening-tag (#2):** worth fixing, but **in `wptexturize()`**, not the prototypes — filed as
  `.planning/todos/pending/2026-06-23-wptexturize-opening-tag-core-solution.md`.
- **Mark/unmark fragility (#3):** not fixable without abandoning the pattern (i.e. becoming a
  post-processor like the comprehensive plugin). Lesson: if a stopgap plugin must ship, **retire
  the minimal one** and keep the comprehensive post-process shape (single rewrite, no character
  removal).
- **i18n (#4) and the comprehensive locale issue:** their value is as **evidence** that an
  in-core fix is categorically better than any plugin — locale-correct, robust, source-level,
  no extra render passes — not as a maintenance backlog.
