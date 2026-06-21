# Trac #18549 comprehensive compatibility inventory

Ticket: <https://core.trac.wordpress.org/ticket/18549>

This inventory accompanies the comprehensive local artifacts:

- [`wptexturize-18549-historic-compat.patch`](wptexturize-18549-historic-compat.patch)
- [`wptexturize-18549-historic-compat-plugin.php`](wptexturize-18549-historic-compat-plugin.php)

Terminology note: Claude is revising the related docs to use **minimal** and
**comprehensive** for the two patch approaches. This document covers the
comprehensive approach: the broader patch that restores historical inline-tag quote
cases. The file names retain `historic` because they were created while
inventorying historical Trac attachments.

The goal is not to port the old 4.7-era replacement engine verbatim. The goal is
to preserve the historically proposed behaviour that still fits current
`wptexturize()` with zero regressions in the full focused `wpTexturize` PHPUnit
class.

## Source material archived locally

Raw Trac attachments were downloaded into
[`trac-18549-historic/`](trac-18549-historic/) for comparison:

| Attachment | Local copy | Role in this inventory |
| --- | --- | --- |
| `18549.diff` | [`trac-18549-historic/18549.diff`](trac-18549-historic/18549.diff) | Early test adjustment that commented out failing quote-around-inline-HTML assertions. |
| `18549.2.diff` | [`trac-18549-historic/18549.2.diff`](trac-18549-historic/18549.2.diff) | Follow-up test tweak. |
| `18549.3.diff` | [`trac-18549-historic/18549.3.diff`](trac-18549-historic/18549.3.diff) | Restored failing tests as separate expected-failure coverage. |
| `18549_wptexturize.diff` | [`trac-18549-historic/18549_wptexturize.diff`](trac-18549-historic/18549_wptexturize.diff) | First implementation of the strip/replace/reinsert algorithm described in ticket comment #19. |
| `18549_tests.diff` | [`trac-18549-historic/18549_tests.diff`](trac-18549-historic/18549_tests.diff) | Dedicated unit tests, including inline end-tag cases and low-level replacement-engine tests. |
| `18549_wptexturize.2.diff` | [`trac-18549-historic/18549_wptexturize.2.diff`](trac-18549-historic/18549_wptexturize.2.diff) | Replacement-engine revision using individual static variables. |
| `18549_wptexturize.3.diff` | [`trac-18549-historic/18549_wptexturize.3.diff`](trac-18549-historic/18549_wptexturize.3.diff) | Replacement-engine performance revision. |
| `18549_wptexturize.4.diff` | [`trac-18549-historic/18549_wptexturize.4.diff`](trac-18549-historic/18549_wptexturize.4.diff) | WordPress 4.7 refresh including implementation and tests. |

## Historical ideas normalized

### 1. Original report examples

The original ticket reported that quotes after inline `a` tags were curled as
opening quotes instead of closing quotes:

```html
The word is "<a href="http://example.com/">quoted</a>".
The word is '<a href="http://example.com/">quoted</a>'
The word is '<a href="http://example.com/">quoted.</a>'
The word is '<a href="http://example.com/">quoted</a>'.
The word is '<a href="http://example.com/">quot</a>'d
```

These are normalized in the comprehensive patch as
`test_historic_quotes_around_inline_html()`.

### 2. Restored `test_texturize_around_html()` cases

The old `18549.3.diff`, `18549_tests.diff`, and `18549_wptexturize.4.diff` patches
restore quote-around-link cases involving end of string, period, comma, semicolon,
dash, ellipsis, a quote spanning text plus an inline tag, a quote immediately
followed by a word, and the `'<strong>Quoted Text</strong>,'` shape.

These are normalized in the comprehensive patch as
`test_historic_texturize_around_html_cases()`.

### 3. Apostrophe / possessive snippets

The later ticket workaround snippet was:

```php
$content = preg_replace( '#>&\#8216;s\b#', '>&#8217;s', $content );
```

The comprehensive patch covers that family in core state rather than as a rendered-content
string replacement. The normalized test method is
`test_historic_apostrophe_after_inline_formatting_tag()` and includes the modern
Gutenberg-style examples, `rock</strong>'n'roll`, and an entity-adjacent case.

### 4. Miqrogroove / gitlost replacement-engine algorithm

Ticket comment #19 proposed stripping elements/shortcodes, formatting the text-only
string, and copying the formatting changes back to the original input. The gitlost
patch series implemented that idea with `wptexturize_replace_*()` routines.

The comprehensive patch does **not** port that engine. It keeps the current tokenizer and adds
only enough cross-token state to recognize a quote immediately after a closing
inline tag. The hot-path context check uses `_wptexturize_text_ends_with_quote_context()`
to avoid running a Unicode regex for every token: ASCII letters/numbers and
`. ! ? )` use direct checks, closing quote entities use a narrow regex, and only
multibyte endings fall back to a Unicode letter/number regex. This avoids the old
code-size/performance concerns and preserves the existing shortcode edge behaviour
tested by WordPress core's "crazy" shortcode fixture.

## Deliberate exclusions

- `kbd` is excluded because core treats it as a no-texturize tag.
- Deprecated `acronym` is excluded.
- `]` is excluded from the after-quote character class because including it changed
  the existing "crazy" shortcode expected output from an opening quote to a closing
  quote. The full suite caught this, and the patch preserves current behaviour.
- The low-level `wptexturize_replace_*()` unit tests from the old replacement-engine
  patches are not ported because this patch does not add those routines.
- The broader plugin mentioned in ticket comment #31 / `pap-texturize` and its
  separate #29882 quote-inside-quote behaviour are not incorporated here.

## Validation

Validated against a fresh `wordpress-develop` trunk checkout at `e269998`:

```bash
vendor/bin/phpunit --filter Tests_Formatting_wpTexturize tests/phpunit/tests/formatting/wpTexturize.php
```

Result:

```text
OK (361 tests, 469 assertions)
```

## Candidate multilingual edge cases

These are real-world text shapes worth tracking separately from the initial Trac
examples. The rule for this pass is: add tests first, and only broaden the patch
when the full focused `wpTexturize` class stays green.

### Promoted in `wptexturize-18549-historic-compat.patch`

The comprehensive patch now treats a straight quote immediately after a closing inline tag as a
closing quote when the next text token begins with Unicode punctuation in the
`\p{Po}` or `\p{Pf}` families. This covers punctuation commonly used after
quoted inline text in CJK and other localized text, without treating `]` as a safe
trigger.

Promoted tests include:

```php
$this->assertSame(
    'Here is &#8220;<a href="http://example.com">a test with a link</a>&#8221;… and a Unicode ellipsis.',
    wptexturize( 'Here is "<a href="http://example.com">a test with a link</a>"… and a Unicode ellipsis.' )
);
$this->assertSame(
    '&#8220;<em>引用</em>&#8221;。',
    wptexturize( '"<em>引用</em>"。' )
);
$this->assertSame(
    '&#8220;<em>引用</em>&#8221;，然后继续。',
    wptexturize( '"<em>引用</em>"，然后继续。' )
);
```

### Closing quote before a block closing tag

The WP 4.7 replacement-engine test data also included this shape:

```html
<strong>Read more: </strong>"<a>Something (else)</a>"</p>
```

The comprehensive patch now restores the expected closing quote before `</p>` by
allowing visible inline text ending in `)` to provide quote context for the
following closing inline tag. The comprehensive rendered-content plugin prototype mirrors this
with a post-process lookahead that allows a closing HTML tag after the quote.

### Gnarly possessive after quoted inline text

A later real-world edge case is a possessive after an inline-formatted quoted
word/name:

```html
<em>"John"</em>'s
<em>'John'</em>'s
```

Without this extra state, the text inside `<em>` ends in WordPress's numeric
closing quote entity (`&#8221;` or `&#8217;`), so the next token starts with `'s` and
can still be mistaken for an opening single quote. The comprehensive patch now treats
text ending in those closing quote entities as valid quote context for the next
closing inline tag.

### Deferred / inventory only

The following are useful future cases, but they are not part of this patch until
there is a narrower diagnosis and green-suite implementation:

- Opening straight quotes immediately after CJK text, e.g.
  `日本語では"<em>引用</em>"。`. Current `wptexturize()` already treats the opening
  quote as a closing quote because it follows a Unicode letter. That is a separate
  opening-quote-context problem, not the closing-inline-tag problem fixed here.
- French, Italian, Irish, Gaelic, and Catalan elisions split across inline markup,
  e.g. `<strong>l</strong>'homme`, `<strong>O</strong>'Neill`, and
  `d<em>'</em>accord`. Some are covered by the possessive/apostrophe rule when the
  apostrophe follows a closing inline tag; cases where the apostrophe is before or
  inside the tag need separate tests.
- RTL Arabic/Hebrew quoted text around inline markup. The use of `\p{L}` should
  cover letter detection, but bidi rendering and punctuation placement should be
  tested explicitly before broadening behaviour.
- Localized quote marks that are already typographic input, such as `»`, `」`, and
  `”`. These may not need `wptexturize()` conversion at all unless a straight quote
  is adjacent to them in a reproducible failure.
