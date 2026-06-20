# Sidebar thumbnail layout: float and grid, both shipped

The front-page sidebar ("Used Cars & Unused Plans") lists posts as a small square
thumbnail next to the title/date/excerpt. The theme ships **two** layouts for it,
switchable with one class, because we finally found — and fixed — the bug that made
the nicer one (the magazine wrap-under) look impossible.

## The two layouts (one class toggle)

The sidebar post list lives in a `.sidebar-content` group. Its modifier picks the
layout:

- **`.sidebar-content`** (default) — **float**: the title/date/excerpt wrap *beside
  and under* the thumbnail, the magazine look.
- **`.sidebar-content is-grid`** — **grid**: a fixed thumbnail column and a text
  column beside it (no wrap-under). The boxy, media-object look.

To switch, add or remove `is-grid` on the `wp:group` className in
`patterns/front-page.php`. Nothing else changes.

```css
/* shared */
.sidebar-entry > .wp-block-post-title { margin-top: 0; margin-bottom: 0.15em; font-size: 20px; line-height: 1.2; }
.wp-block-post-featured-image.sidebar-thumb { width: 60px; height: 60px; overflow: hidden; }
.wp-block-post-featured-image.sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* default: magazine float */
.sidebar-content:not(.is-grid) .sidebar-entry { display: flow-root; }
.sidebar-content:not(.is-grid) .sidebar-thumb { float: left; margin: 0.15em 0.75em 0.25em 0; }
.sidebar-content:not(.is-grid) .sidebar-entry > .wp-block-post-title :where(a) { display: inline; }  /* THE FIX */

/* opt-in: media-object grid */
.sidebar-content.is-grid .sidebar-entry { display: grid; grid-template-columns: 60px 1fr; column-gap: 0.75em; align-items: start; }
.sidebar-content.is-grid .sidebar-entry > .wp-block-post-featured-image.sidebar-thumb { grid-column: 1; grid-row: 1 / span 3; margin: 0.15em 0 0 0; }
.sidebar-content.is-grid .sidebar-entry > :not(.wp-block-post-featured-image) { grid-column: 2; }
```

## The bug, and the one line that fixes it

For weeks the float "didn't work": on one maintainer's screen the title of the lower
sidebar entries stacked *below* the thumbnail instead of wrapping beside it, and it
got worse as the window narrowed (breaking bottom-up). It seemed to dodge our
headless screenshots and a quick Safari look — but that was a red herring: those
checks were at *wider* widths where the titles still fit. The failure is
**deterministic and not browser-specific** — the minimal repro reproduces it in
headless Chrome too (`stacked: 14/14` at `800×1200`). We chased — and ruled out — a
long list of suspects before finding that:

| Suspected cause | Verdict |
|---|---|
| Browser cache / stale CSS | ruled out (computed styles correct & live) |
| A browser extension | ruled out (repros in Incognito) |
| The lazy thumbnail image | ruled out (an imageless `::before` float failed identically) |
| Fractional float width (`6vw`) | ruled out (fixed `60px` failed too) |
| Fractional device-pixel-ratio | ruled out (`devicePixelRatio === 2`) |
| The `.front-grid` subgrid | ruled out (removing it still failed) |
| A Chromium below-the-fold/relayout bug | **wrong** — see below |

**The actual cause (found via the minimal repro in [`repro/`](repro/README.md),
confirmed in visible Chrome 149):** WordPress core styles the Post Title link as
**`display: inline-block`**:

```css
.wp-block-post-title :where(a) { display: inline-block; }   /* WordPress core */
```

An `inline-block` is an **atomic inline box** — it can't break across lines. When the
title link is wider than the space left beside the 60px float, the *whole box* drops
below the float instead of wrapping into the narrowed line. **Longer titles fail
first**, and narrowing the column shrinks the space beside the float, so the longest
titles drop while short ones still fit. That is the entire illusion of a
"lower-entry / below-the-fold Chrome bug": the lower entries simply had the longer
titles, and a narrower column tipped more of them over. (The "heal on scroll" was a
bounding-box-vs-line-fragment measurement artifact; the title's `<h3>` box sits at
the entry top while its first *line* is pushed below the float — measure with
`Range#getClientRects()`, not `getBoundingClientRect()`.)

The repro's six-case matrix (visible Chrome 149, `800×1200`, first paint) is
decisive: with the `inline-block` title link, **every** variant stacks `14/14` —
grid or no grid, subgrid or not, image or not, `::before` or real float. Override the
title link to `display: inline` and it's `0/14`. On the live front page the same
override took the float from `stacked: 2/4` to `0/4`.

So the float layout adds exactly one scoped rule — `…> .wp-block-post-title :where(a)
{ display: inline }` — and the wrap-under works on every display. The grid layout
doesn't need it (its title sits in its own column, where an atomic box wraps fine).

## Is it a WordPress/Gutenberg bug worth filing?

It is a **Gutenberg** (block-library) styling choice, not a Chromium bug — do **not**
file Chromium (an atomic `inline-block` dropping below a float is correct CSS). It is
worth raising with Gutenberg as a documented gotcha and a question — *why is the Post
Title link `display: inline-block`?* — because that one declaration silently breaks
any theme that floats content beside a Post Title. But it is **low-severity**: the
behavior is spec-correct and the theme-side workaround is a single rule. See the draft
issue in [`repro/README.md`](repro/README.md).

## A gotcha worth keeping

`playground/apply-style.php` overwrites the user global-styles post, so any
Site-Editor "Additional CSS" is wiped on each style switch — a real source of
"works-in-screenshots, broken-live" divergence. Investigated and ruled out as a cause
of this bug, but the hazard is real.
