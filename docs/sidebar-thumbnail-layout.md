# Sidebar thumbnail layout: float (shipped) vs. grid (bulletproof fallback)

The front-page sidebar ("Used Cars & Unused Plans") lists posts as a small square
thumbnail next to the title/date/excerpt. There are two ways to lay this out, and
they are **not** interchangeable:

| | Float (shipped) | Grid (fallback) |
|---|---|---|
| Text wraps **under** the thumbnail (magazine look) | ✅ yes | ❌ beside only |
| Correct on first paint for below-the-fold lazy thumbs in Chrome | ⚠️ see below | ✅ yes |

The production sidebar ships the **float**, deliberately: the wrap-under reads like a
real magazine column, and that is worth more here than the one Chrome glitch it
carries. The grid version is fully documented below as a drop-in fallback if that
glitch ever becomes unacceptable.

## What ships: the bulletproof float

**Only `float` can make text wrap *under* an element.** Grid and flex produce rigid
rectangular cells, so the area under the thumbnail always stays empty — the text can
sit *beside* it but never reclaim the space below. `float` is antiquated for *page
layout* (use grid/flex), but for *flowing text around an image* it is the correct,
current, and only tool.

**Markup** (`patterns/front-page.php`, sidebar `post-template`) — flat: image first,
then title/date/excerpt as flowing siblings:

```html
<!-- wp:group {"className":"sidebar-entry"} -->
<div class="wp-block-group sidebar-entry">
  <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1","scale":"cover","sizeSlug":"thumbnail","className":"u-featured sidebar-thumb"} /-->
  <!-- wp:post-title {"isLink":true,"level":3} /-->
  <!-- wp:post-date {"isLink":true} /-->
  <!-- wp:post-excerpt {"moreText":"(cont...)"} /-->
</div>
<!-- /wp:group -->
```

**CSS** (`theme.json` → `styles.css`) — the image is **absolutely positioned** so its
load state can never change the floated box's geometry:

```css
.sidebar-entry { display: flow-root; }                 /* contain the float */
.wp-block-post-featured-image.sidebar-thumb {
  float: left; position: relative;
  width: clamp(48px, 6vw, 60px); height: clamp(48px, 6vw, 60px);
  overflow: hidden; margin: 0.15em 0.75em 0.25em 0;
}
/* Take the link+image OUT of the box's flow so the floated box is always exactly
   its own width/height, independent of whether the (lazy) image has loaded. */
.wp-block-post-featured-image.sidebar-thumb a { position: absolute; inset: 0; }
.wp-block-post-featured-image.sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }
```

## The known Chrome glitch (accepted)

The float is correct across viewport widths 600–1512, both device-pixel ratios, with
images loaded/blocked/mid-load, in headless Chrome, **and in Safari**. In live
Chrome 149 (including Incognito, so it is not an extension) the below-the-fold
entries can stack the title *under* the thumbnail instead of beside it. A
computed-style dump from that Chrome cracked the cause:

- Every entry reported `float: left`, the correct `57.6px` square, and
  `position: relative` — **the CSS was applied perfectly**, and each title was
  correctly beside its thumb…
- …but only *after the page had been scrolled*, which had loaded the lazy
  thumbnails (`img.complete === true` on all four). The broken state was captured
  *before* scrolling.

So the glitch, in one sentence:

> **The float mis-lays only while a below-the-fold thumbnail is still
> `loading="lazy"` and unloaded, and it self-heals the instant the image loads.**
> It is a Chrome float + lazy-image relayout bug, not a CSS error.

Two consequences worth knowing:

- **It mostly hides itself in normal use.** The image loads as the entry scrolls
  toward the viewport, so by the time a reader is actually looking at the lower
  entries they have usually corrected. The stacked state shows up in a
  top-of-page screenshot, less so in the act of reading.
- **The clean fix is out of reach here.** `loading="eager"` on those thumbnails
  would kill it, but that needs a `functions.php` filter and Dirtbag forbids a PHP
  runtime. Taking the image out of flow (the absolutely-positioned `<a>` above) does
  **not** help — Chrome defers the float layout regardless of where the image lives.

## The fallback: CSS grid (no float, no glitch)

If the glitch ever has to go, swap the float CSS for this grid. A fixed thumbnail
track is independent of image-load state, so the bug is structurally impossible —
at the cost of the wrap-under (text sits *beside* the thumb). The flat markup above
is unchanged.

```css
.sidebar-entry { display: grid; grid-template-columns: clamp(48px, 6vw, 60px) 1fr; column-gap: 0.75em; align-items: start; }
.sidebar-entry > .wp-block-post-featured-image.sidebar-thumb { grid-column: 1; grid-row: 1 / span 3; width: 100%; height: clamp(48px, 6vw, 60px); overflow: hidden; margin: 0.15em 0 0 0; }
.sidebar-entry > :not(.wp-block-post-featured-image) { grid-column: 2; }
.sidebar-entry > .wp-block-post-title { margin-top: 0; margin-bottom: 0.15em; font-size: 20px; line-height: 1.2; }
.wp-block-post-featured-image.sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }
```

The thumbnail **spans the three text rows** (`grid-row: 1 / span 3`) so it doesn't
inflate the title's row and re-open a title→date gap.

## A gotcha worth keeping

`playground/apply-style.php` overwrites the user global-styles post, so any
Site-Editor "Additional CSS" is wiped on each style switch — a real source of
"works-in-screenshots, broken-live" divergence to watch for. It was investigated and
**ruled out** as the cause of the float glitch (the user global-styles post was empty
and the served page carried no overriding rule), but the hazard is real.
