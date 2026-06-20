# Sidebar thumbnail layout: float vs. flex

The front-page sidebar ("Used Cars & Unused Plans") lists posts as a small square
thumbnail next to the title/date/excerpt. There are two ways to lay this out, and
they are **not** interchangeable.

## The choice

| | Float | Flex (shipped) |
|---|---|---|
| Text wraps **under** the thumbnail (magazine look) | ✅ yes | ❌ no |
| Deterministic across browsers | ⚠️ see below | ✅ yes |

**Only `float` can make text wrap *under* an element.** Flexbox and grid produce
rigid rectangular cells, so a "thumbnail column" always leaves the space under the
thumb empty — the text can sit *beside* it but never reclaim the area below. `float`
is antiquated for *page layout* (use grid/flex), but for *flowing text around an
image* it is the correct, current, and only tool (optionally refined with
`shape-outside`, which itself requires a float).

The production sidebar uses **flex** because the float, while correct in every
automated test, rendered inconsistently in one maintainer's live Chrome + Safari
(see "The unreproducible failure"). Flex is boxy but bulletproof.

## Best float implementation (preserved)

If you want the wrap-under look back, this is the most robust float version — the
image is **absolutely positioned** so its load state, intrinsic size, or broken-alt
text can never change the floated box's geometry (the most likely cause of the
failure below).

**Markup** (`patterns/front-page.php`, sidebar `post-template`) — flat: image first,
then title/date/excerpt as flowing siblings:

```html
<!-- wp:group {"className":"sidebar-entry","style":{"spacing":{"blockGap":"0.25em","margin":{"top":"0","bottom":"1.5em"}}}} -->
<div class="wp-block-group sidebar-entry" style="margin-top:0;margin-bottom:1.5em">
  <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1","scale":"cover","sizeSlug":"thumbnail","className":"u-featured sidebar-thumb"} /-->
  <!-- wp:post-title {"isLink":true,"level":3,"className":"p-name"} /-->
  <!-- wp:post-date {"isLink":true,"className":"dt-published u-url"} /-->
  <!-- wp:post-excerpt {"moreText":"(cont...)"} /-->
</div>
<!-- /wp:group -->
```

**CSS** (`theme.json` → `styles.css`):

```css
.sidebar-entry { display: flow-root; }                 /* contain the float */
.wp-block-post-featured-image.sidebar-thumb {
  float: left;
  position: relative;                                  /* positioning context */
  width: clamp(48px, 6vw, 60px);
  height: clamp(48px, 6vw, 60px);
  overflow: hidden;
  margin: 0.15em 0.75em 0.25em 0;
}
/* Take the link+image OUT of the box's flow so the floated box is always exactly
   its own width/height, independent of whether the (lazy) image has loaded. */
.wp-block-post-featured-image.sidebar-thumb a { position: absolute; inset: 0; }
.wp-block-post-featured-image.sidebar-thumb img { width: 100%; height: 100%; object-fit: cover; }
.sidebar-entry > .wp-block-post-title { margin-top: 0; font-size: 20px; line-height: 1.2; }
.sidebar-head { font-size: 22px; }                     /* section heading fits one line */
```

## The unreproducible failure

The float was correct — verified across viewport widths 600–1512, both device-pixel
ratios, and with images loaded, blocked, and mid-load — and it rendered correctly in
headless Chrome (the same Chrome binary that drives the screenshots). Yet in one
maintainer's **live** Chrome 149 and Safari, the 2nd–4th (below-the-fold) entries
stacked the title under the thumbnail instead of wrapping beside it. It could not be
reproduced in any automated context.

Hypotheses investigated:
- **Browser/cache** — ruled out: view-source showed the correct CSS; failure
  survived hard refresh and persisted in two engines.
- **Lazy-loaded image collapsing the box** — the most likely cause. The fixed-size +
  `overflow: hidden` box should prevent it; the absolutely-positioned-image version
  above is the belt-and-suspenders fix and was **not** yet tested live.
- **DB-saved (Site Editor "Additional CSS") override** — checked: the user
  global-styles post was empty, and the served page had no overriding rule. Not the
  cause here, **but** note that `playground/apply-style.php` overwrites that post, so
  any saved Additional CSS is wiped on each style-switch — a real source of
  "works-in-screenshots, broken-live" divergence to watch for.

If you revisit the float, apply the absolutely-positioned-image CSS above and test
in a real Chrome + Safari (not a headless render, which never reproduced the bug).
