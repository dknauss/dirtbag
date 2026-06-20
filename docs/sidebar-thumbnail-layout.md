# Sidebar thumbnail layout: grid (shipped) vs. float (the wrap-under that lost)

The front-page sidebar ("Used Cars & Unused Plans") lists posts as a small square
thumbnail next to the title/date/excerpt. We wanted the *magazine* look — text
wrapping beside **and under** the thumb — and chased it hard. It cannot be done
reliably here, for a reason worth recording. The production sidebar ships a **CSS
grid** (thumb beside text, no wrap-under). The float is kept as a documented,
one-block drop-in alternative for anyone who wants to try again.

## What ships: CSS grid

`.sidebar-entry` is a two-track grid — a fixed thumbnail column and a flexible text
column. It has no `float`, so it cannot hit the bug described below on any display.

```css
.sidebar-entry { display: grid; grid-template-columns: 60px 1fr; column-gap: 0.75em; align-items: start; }
.sidebar-entry > .wp-block-post-featured-image.sidebar-thumb { grid-column: 1; grid-row: 1 / span 3; width: 100%; height: 60px; overflow: hidden; margin: 0.15em 0 0 0; }
.sidebar-entry > :not(.wp-block-post-featured-image) { grid-column: 2; }
.sidebar-entry > .wp-block-post-title { margin-top: 0; margin-bottom: 0.15em; font-size: 20px; line-height: 1.2; }
.wp-block-post-featured-image.sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }
```

The thumbnail **spans the three text rows** (`grid-row: 1 / span 3`) so it doesn't
sit alone in row 1, inflate that row to its own 60px height, and re-open a gap
between the title and the date.

## Why not float (the magazine wrap-under)

**Only `float` can make text wrap *under* an element.** Grid and flex make rigid
rectangular cells: the text can sit *beside* the thumb but never reclaim the space
*below* it. `float` is antiquated for *page layout* but is the correct — and only —
tool for *flowing text around an image*. So the wrap-under is inherently a float job,
and the float is exactly what breaks.

## The bug (fully characterised)

**Symptom.** In live Chrome, the *lower* sidebar entries stack the thumbnail above
the title (the float fails to wrap) instead of the text flowing beside and under it.

**When it appears — and the elimination trail.** This took five rounds to corner.
Each row below is a hypothesis we tested and *ruled out*:

| Suspected cause | Test | Result |
|---|---|---|
| Browser cache / stale CSS | view-source + computed styles | CSS provably correct & live |
| A browser extension | repro in Incognito | still breaks → not an extension |
| Lazy-loaded thumbnail in the float | absolutely-position the image out of flow | still breaks |
| Lazy image *at all* | float an **empty `::before`** (no image anywhere) | **still breaks** → not lazy-loading |
| Fractional float width (`6vw`) | pin to a fixed integer `60px` | still breaks |
| Fractional DPR / sub-pixel | `window.devicePixelRatio` | `2` (clean) → not sub-pixel |
| `.front-grid` column subgrid | remove only `grid-template-rows: subgrid` from `.front-grid > .wp-block-column` | still breaks → not subgrid |
| Sidebar column wrapper grid | force only the sidebar column wrapper to `display: block` | still breaks → not the column wrapper grid |

**What it *is*.** The one thing that reliably moves the failure is **how far down the
column an entry sits, and how narrow the column is**:

- Narrow the window and the entries break **bottom-up** — the further down the page,
  the sooner they fail, because narrowing makes the text taller and pushes them down.
- On a scaled "high readability" display the built-in screen reports a *narrower CSS
  viewport*, so the condition is met for the lower entries at the default width — it
  looks "always broken" there, but it's the same narrow-column effect.
- It **self-heals on scroll** (any forced relayout fixes it).
- Safari and headless Chrome never reproduce it — headless does one full layout pass
  before painting; the bug lives in Chrome's *initial/progressive* layout of
  below-the-fold floats.

So: a **Chrome float-and-wrap layout bug for below-the-fold content in a tall, narrow
column**, independent of images, DPR, cache, extensions, and now the sidebar column's
subgrid. The clean escape hatch a normal theme would use — a `functions.php` filter,
or a sliver of JS to force a relayout — is off the table by Dirtbag's no-PHP/no-JS
rule.

## Chrome 149 follow-up: subgrid lead ruled out

Codex reproduced the failure in **visible Google Chrome 149.0.7827.156** on macOS
using the live Studio site, a fresh Chrome profile, and Chrome DevTools Protocol only
to size/navigate/capture the visible tab. The reproduction that made the bug obvious
used a tall, narrow CSS viewport (`800 × 1200`) to match the scaled/high-readability
condition where lower sidebar entries are present during initial layout. Two testing
details mattered:

- Short physical windows can miss the bug because less of the lower sidebar is laid
  out/painted during the first visible pass. A tall narrow viewport exposes the
  bottom-up failure consistently.
- Checking the title element's bounding box is misleading: the element can still
  start at the entry's top while its first **line fragment** is placed below the
  floated thumb. Inspect line-fragment rectangles (`Range#getClientRects()`), or use a
  screenshot, to detect the stack reliably.

The current best explanation is therefore **not subgrid**. It looks like a Chrome
initial line-layout / float-exclusion invalidation bug for floats inside the front
page's grid area when content is narrow enough and far enough down the page. A later
scroll or any forced relayout recomputes the float exclusions and the wrap heals.

Tests run against the imageless `::before` float variant:

| Test | Result |
|---|---|
| Current shipped grid sidebar | stable |
| Imageless `::before` float with current `.front-grid` subgrid | lower entries stack |
| Remove only `grid-template-rows: subgrid` from `.front-grid > .wp-block-column` | lower entries still stack |
| Also force the sidebar column wrapper to `display: block` | lower entries still stack |

That leaves the broader outer grid/progressive-layout interaction as a possible
engine trigger, but removing subgrid alone does not bring the magazine float back.
Because the shipped grid has no float, it remains the safest front-page sidebar
layout.

## To flip the float back on

Replace the grid block in `theme.json` → `styles.css` with this (the most robust
float variant — image absolutely positioned over an empty floated `::before`, so the
floated box carries no lazy descendant). The flat markup needs no change.

```css
.sidebar-entry { position: relative; display: flow-root; }
.sidebar-entry::before { content: ""; float: left; width: 60px; height: 60px; margin: 0.15em 0.75em 0.25em 0; }
.sidebar-entry > .wp-block-post-title { margin-top: 0; margin-bottom: 0.15em; font-size: 20px; line-height: 1.2; }
.wp-block-post-featured-image.sidebar-thumb { position: absolute; top: 0.15em; left: 0; width: 60px; height: 60px; overflow: hidden; margin: 0; }
.wp-block-post-featured-image.sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }
```

(In `theme.json` the `content: ""` must be written `content: \"\"` — it sits inside a
JSON string.) This gives the wrap-under in Safari, headless, and Chrome on a clean
wide viewport; it will stack the lower entries in Chrome on a narrow/scaled display
until the bug above is solved.

## A gotcha worth keeping

`playground/apply-style.php` overwrites the user global-styles post, so any
Site-Editor "Additional CSS" is wiped on each style switch — a real source of
"works-in-screenshots, broken-live" divergence. It was investigated and **ruled out**
as a cause of this bug, but the hazard is real.
