# Chrome float-in-grid below-the-fold repro

A minimal, **WordPress-free** reproduction of the Dirtbag sidebar float bug
documented in [`../sidebar-thumbnail-layout.md`](../sidebar-thumbnail-layout.md):
in live Chrome, a floated thumbnail's sibling text **stacks below** the float
instead of wrapping beside it, for entries low in a tall, narrow column — and it
self-heals on scroll/relayout.

The goal is to decide whether the bug survives **outside** WordPress. If
[`chrome-float-repro.html`](chrome-float-repro.html) reproduces it standalone, it
is a clean [Chromium bug](https://issues.chromium.org/) to file. If it does *not*,
the trigger is something WordPress/theme-specific and the matrix narrows it down.

## How to run it (this matters)

The bug **only** appears under specific conditions — it never shows in headless
Chrome, Safari, or a short window:

1. **Visible** Google Chrome (seen on **149.0.7827.156**), *not* headless. Headless
   does one full layout pass before painting and never reproduces it.
2. A **tall, narrow** viewport — `800 × 1200` is reliable. Short windows miss it
   because less of the lower column is laid out during the first visible paint.
3. **Look on first paint, before scrolling.** Scrolling forces the relayout that
   heals the bug.
4. Detection uses **line-fragment rects** (`Range#getClientRects()`), not the
   paragraph's bounding box — the `<p>` box can sit at the entry top while its
   first *line* is pushed below the float. The page's self-check banner already
   does this and prints `stacked: N / total` plus `BUG REPRODUCED`. Press `r` to
   re-measure; a screenshot is the ground truth.

Driving it: a CDP-capable visible-Chrome session (the way Codex reproduced the
original) or a browser-handoff session. Open:

```
file:///…/docs/repro/chrome-float-repro.html?grid=outer&float=before&img=1&n=14
```

## Config (query string)

| Param | Values | Default | Meaning |
|---|---|---|---|
| `grid` | `outer` \| `subgrid` \| `none` | `outer` | Is the entry list inside a CSS grid area? `none` keeps the column narrow without a grid. |
| `float` | `before` \| `div` | `before` | Floated empty `::before` (no image in the float) or a floated real `<div>`. |
| `img` | `1` \| `0` | `1` | Include a `loading="lazy"` image (absolutely positioned over the reserved shape). |
| `n` | integer | `14` | Number of entries; more = taller page = more below the fold. |

## Test matrix

Run each at `800 × 1200`, first paint, no scroll. Record `stacked N/total`.

| # | grid | float | img | Hypothesis isolated |
|---|---|---|---|---|
| 1 | outer | before | 1 | Baseline — closest to the shipped float. |
| 2 | outer | before | 0 | Is a lazy image required? (We expect: no — imageless still stacks.) |
| 3 | outer | div | 1 | Real floated element vs pseudo-element. |
| 4 | **none** | before | 1 | **Is the outer CSS grid required?** The key untested lead. |
| 5 | subgrid | before | 1 | Does `grid-template-rows: subgrid` change it? (Ruled out in-app.) |
| 6 | outer | before | 1, `n=4` | Does a short list (less below the fold) hide it? |

Interpretation:
- If **#4 (`grid=none`) is clean** but **#1 stacks**, the **outer grid context** is
  the trigger — strong signal for a Chromium grid/float-exclusion layout bug.
- If **#4 also stacks**, the trigger is float-in-a-narrow-tall-column alone,
  independent of grid — an even simpler, more reportable Chromium bug.
- If **nothing stacks in any config**, the standalone repro does not capture it and
  the trigger is WordPress/theme-specific (e.g. progressive HTML streaming, core
  block CSS); note that and stop before filing.

## Draft Chromium bug report (fill in once confirmed)

> **Title:** Floated element's sibling text stacks below it (float exclusion not
> applied) for below-the-fold content in a tall, narrow [grid] column on first paint
>
> **Chrome version:** 149.0.7827.156 (arm64, macOS). Not reproduced in Safari.
>
> **Steps to reproduce:**
> 1. Open the attached `chrome-float-repro.html?grid=outer&float=before&img=0&n=14`.
> 2. Size the window to ~800×1200. Load the page and look at the lower entries
>    **without scrolling**.
>
> **Expected:** each entry's body text wraps to the right of (and under) its 60×60
> floated box, on every entry.
>
> **Actual:** entries low in the column render their first text line *below* the
> floated box (the float exclusion is not applied) until a scroll/relayout, after
> which they correct. Detection via `Range#getClientRects()` on the first line; a
> screenshot shows the stack. (See the in-page self-check banner: `BUG REPRODUCED`.)
>
> **Notes:** independent of `loading=lazy` images (reproduces with `img=0`), of
> `devicePixelRatio` (seen at a clean `2`), and of caching/extensions (reproduces in
> Incognito). Does **not** reproduce in headless Chrome (single layout pass).
> Minimal repro attached; no framework, no network.

Attach the HTML file and a first-paint screenshot of a failing config.
