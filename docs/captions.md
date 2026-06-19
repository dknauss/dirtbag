# Image captions and credits

Notes on how Dirtbag handles image captions, why the front-page gallery captions
were removed, and where bundled-image credits live.

## Single posts and pages — captions already work properly

`templates/single.html` (and the `page*` templates) render the body through the
core **`post-content`** block. When an author adds an image with a caption in the
editor, core outputs an in-flow `<figcaption class="wp-element-caption">` directly
beneath the image.

That is the accessible, correct behavior: the caption is part of the document
flow, reachable by keyboard and announced by screen readers. **Nothing needs to be
added to the single templates** — content captions are handled.

## Featured images — no native caption

`core/post-featured-image` does not render the attachment's caption in a block
template, and core offers no native way to show it. Displaying a featured-image
caption/credit would need a custom block or a Block Bindings source (PHP), which
runs against Dirtbag's no-theme-frontend-code stance. So featured-image credits are
not printed on the page; they live with the other bundled-asset credits (below).

## Front-page gallery — why the overlay captions were removed

The front-page gallery (`patterns/front-page.php`) uses the core Gallery block with
`has-nested-images is-cropped`. Core styles those captions as an absolutely
positioned overlay with `overflow:auto`. When a caption is taller than its box the
overlay becomes a **scrollable region with no keyboard access** — axe flags it as
`scrollable-region-focusable` (serious).

The three gallery images are decorative, so the overlay captions were removed (alt
text retained). This cleared the finding without fighting core gallery CSS.

## Why image credits live in readme.txt (the "external text file")

The bundled images still need attribution for license compliance — the Potluck
image is **CC BY 2.0**, which *requires* credit; the rest are CC0 (credit is the
norm for WordPress.org). The standard, reviewer-expected home for bundled-asset
credits is the `== Copyright ==` / `== Resources ==` section of `readme.txt`, so
that is where they are.

This is independent of on-page captions. Attribution was never *dependent* on the
gallery overlay captions, so removing those for accessibility did not remove any
required credit.

## If visible, accessible captions are wanted later

Two options that keep accessibility intact:

1. **Individual `core/image` blocks** instead of the overlay gallery. A stacked or
   columned set of image blocks renders each caption in-flow *below* the image
   (accessible), so credits show on the page.
2. **A single credit line** (`core/paragraph`) beneath the gallery naming the three
   sources — visible, in-flow, one node, no scrollable region.

Both restore visible credit without reintroducing the scrollable-overlay problem.
