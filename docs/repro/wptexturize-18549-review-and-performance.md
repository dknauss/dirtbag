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

Because the WordPress PHPUnit bootstrap needs a configured test database that this
environment does not provide, correctness for the two refactors was established
with standalone **differential harnesses**: the old and new implementations are
defined side by side and asserted to return identical output across a battery of
probe inputs. Each new implementation was also re-extracted from the *applied
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

### Upstream test suite

The full `Tests_Formatting_wpTexturize` class was green —
`OK (361 tests, 469 assertions)`, PHPCS clean — at the prior upstream verification
against `wordpress-develop` trunk (`e269998`). Both refinements are behaviour-
identical by the differential harnesses above, so the assertion set is unchanged;
the suite is re-run by CI on the upstream PR (see §9) rather than locally here.

## 9. Provenance — where the changes landed

| Change | Repo / branch | Commit | PR |
| --- | --- | --- | --- |
| Helper `substr` refactor (live core source) | `WordPress/wordpress-develop` `fix/18549-inline-quote-context` | `2241ba4` | [#12249](https://github.com/WordPress/wordpress-develop/pull/12249) |
| Helper `substr` refactor (both candidate patches + this write-up) | `dknauss/dirtbag` `fix/18549-substr-closing-tag-guard` | `33d560c` | [#83](https://github.com/dknauss/dirtbag/pull/83) |
| Minimal plugin mark-regex anchoring (+ §7 note) | `dknauss/dirtbag` `fix/18549-substr-closing-tag-guard` | `fb820eb` | [#83](https://github.com/dknauss/dirtbag/pull/83) |

The comprehensive plugin and the comprehensive/minimal patches' shared
`_wptexturize_is_inline_closing_tag()` carry the `substr` form; the minimal plugin
additionally carries the anchored mark regex. The comprehensive plugin's two
`preg_replace` passes were left unchanged — they already lead with the rare `<\/`
literal.
