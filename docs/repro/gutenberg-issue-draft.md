# Gutenberg issue — filed

> **Filed 2026-06-20 as [WordPress/gutenberg #79372](https://github.com/WordPress/gutenberg/issues/79372).**
> Kept here as the source/record. It is a **question / low-severity report**, not a
> bug claim — the behavior is spec-correct CSS.

---

**Title:** Post Title block link uses `display: inline-block`, limiting float and `shape-outside` text wrapping

### What

`@wordpress/block-library` styles the link inside the Post Title block as an atomic
inline box:

```css
/* packages/block-library/src/post-title/style.scss → .wp-block-post-title :where(a) */
.wp-block-post-title :where(a) { display: inline-block; }
```

(Still present on `trunk` as of this writing:
[post-title/style.scss](https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/post-title/style.scss).)

An `inline-block` is an atomic inline-level box. Its *contents* may wrap internally,
but the box itself cannot split across the separate line boxes a float creates beside
and below it. So a linked Post Title flowing around a `float` (or `shape-outside`)
**drops whole below the float** the moment it is too wide for the line box beside it,
instead of wrapping its text beside and under the float. A plain inline link wraps
correctly.

This is spec-correct CSS — an atomic box that doesn't fit beside a float moves below
it — so it is **not a browser bug**. But the `inline-block` is easy to miss as the
cause, and it silently constrains any theme that wants a magazine-style float beside a
post title (a common pattern for compact post lists / sidebars).

### Steps to reproduce (no WordPress required)

Open this in a browser, in a narrow viewport:

```html
<!doctype html>
<div style="width: 320px; font: 16px/1.3 sans-serif">
  <div style="overflow: hidden">
    <div style="float: left; width: 60px; height: 60px; background: #ccc; margin: 0 .75em .25em 0"></div>
    <!-- WordPress-style title link -->
    <h3 style="margin: 0"><a style="display: inline-block" href="#">A reasonably long linked post title that should wrap</a></h3>
    <p style="margin: 0">Body text that should wrap beside and under the grey box.</p>
  </div>
</div>
```

Then change the `<a>` to `display: inline` and compare.

### Expected

The title text wraps beside the float, like normal inline text and like the body
paragraph below it.

### Actual

With `display: inline-block`, the whole title link drops below the float. Longer
titles / narrower containers fail first.

### Evidence

Chrome 149 was just the debugging environment; the reduced case is ordinary CSS, so
it reproduces in any engine (including **headless** Chrome) at a narrow-enough column.
A standalone matrix (`800×1200`, first paint) isolates the trigger cleanly — every
layout variant (CSS grid / no grid / subgrid, lazy image or none, real float or
`::before`) stacks the title **only** when the link is `inline-block`, and is clean
when it is `inline`:

| title link | result |
|---|---|
| `display: inline-block` (current core) | title stacks below the float, every variant |
| `display: inline` | wraps correctly, every variant |

(Repro page + matrix: link to your published repro or attach
`chrome-float-repro.html`.)

### Question

- Is `display: inline-block` on the Post Title link load-bearing, or could it be
  `inline`? What does the inline-block buy here?
- Are there other linked title-style blocks using the same `inline-block`-on-the-link
  pattern that should be evaluated consistently?

### Workaround (for theme authors hitting this)

Scope the title link back to `inline` where you float beside it:

```css
.your-entry > .wp-block-post-title :where(a) { display: inline; }
```

(For example, Dirtbag's float sidebar uses
`.sidebar-content:not(.is-grid) .sidebar-entry > .wp-block-post-title :where(a) { display: inline; }`.)

### Environment

- Gutenberg / WordPress: <fill in>
- Browser: reproduced in Chrome 149; the behavior is not browser-specific (it is
  spec-correct float/inline-block interaction).
