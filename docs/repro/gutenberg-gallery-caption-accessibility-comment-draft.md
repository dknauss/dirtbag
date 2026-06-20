# Draft Gutenberg supporting comment — Gallery caption overlay accessibility

> Do not post automatically. Draft for Dan to review.

Live target confirmed on 2026-06-20: **WordPress/gutenberg
[#56587](https://github.com/WordPress/gutenberg/issues/56587)**, “Gallery
captions: Enhance with theme colors, possibly captions outside option,” is the
best match for the Gallery overlay caption problem. It is open and already
describes the hard-coded white-on-scrim overlay, long-caption contrast loss, and
the possibility of external captions.

Related but distinct: **[#60469](https://github.com/WordPress/gutenberg/issues/60469)**
and open PR **[#77477](https://github.com/WordPress/gutenberg/pull/77477)** are
about Image/Gallery lightbox captions missing when enlarged. They are real and
current, but they are not the same issue as the Gallery block's on-page overlay
caption accessibility problem.

## Repro evidence captured

- WordPress-free repro:
  [`gutenberg-gallery-caption-a11y-repro.html`](gutenberg-gallery-caption-a11y-repro.html)
- Current-WP check: injected the same repro into the running Studio site at
  `http://localhost:8887/`; WP-CLI reported WordPress `7.0`.
- Screenshots:
  - Core overlay: [`screenshots/wp-free-core-overlay.png`](screenshots/wp-free-core-overlay.png)
  - Dirtbag fix: [`screenshots/wp-free-dirtbag-fix.png`](screenshots/wp-free-dirtbag-fix.png)
  - Current WP overlay: [`screenshots/current-wp-core-overlay.png`](screenshots/current-wp-core-overlay.png)
  - Current WP + Dirtbag fix: [`screenshots/current-wp-dirtbag-fix.png`](screenshots/current-wp-dirtbag-fix.png)
- axe output:
  - WordPress-free core overlay:
    [`screenshots/wp-free-core-overlay-axe.json`](screenshots/wp-free-core-overlay-axe.json)
  - Current WP core overlay:
    [`screenshots/current-wp-core-overlay-axe.json`](screenshots/current-wp-core-overlay-axe.json)
  - Summary:
    [`screenshots/caption-repro-summary.json`](screenshots/caption-repro-summary.json)

Important result:

```text
scrollable-region-focusable (serious)
Scrollable region must have keyboard access
Target: .wp-block-image.size-large:nth-child(1) > figcaption
Failure: Element should have focusable content; Element should be focusable
```

The measured core-overlay caption had `position:absolute`, `overflow-y:auto`,
no `tabindex`, `clientHeight: 182`, and `scrollHeight: 290`, so it was a real
internal scroll region. With the Dirtbag workaround applied, the same caption was
`position:static`, `overflow-y:visible`, and no longer scrollable.

## Comment draft for #56587

I can confirm this from a shipped theme perspective, and I think the issue is
more than visual polish: the current Gallery overlay caption can become an
accessibility regression.

In Dirtbag, a block theme that otherwise tries to stay close to core block output,
we had to add a scoped workaround for nested Gallery captions because current core
renders `.wp-block-gallery.has-nested-images figure.wp-block-image figcaption` as
an absolutely positioned overlay with `overflow: auto`.

That creates two problems:

1. **Long captions can become keyboard-inaccessible scroll regions.** In a
   minimal repro using current Gallery CSS, axe reports
   `scrollable-region-focusable` with serious impact. The overflowing
   `<figcaption>` has `overflow-y: auto`, no focusable content, and is not itself
   focusable.
2. **The hard-coded white overlay text still fails in light-image cases.** The
   scrim/gradient helps near the bottom, but longer captions extend into lighter
   image areas. On pale images, white text over the upper transparent/near-
   transparent part of the gradient is well below WCAG AA contrast.

Dirtbag's workaround was to pull Gallery captions back into normal document flow
and add a simple 2px frame to preserve the visual boundary:

```css
.wp-block-gallery.has-nested-images figure.wp-block-image img {
  border: 2px solid;
}

.wp-block-gallery.has-nested-images figure.wp-block-image figcaption {
  position: static;
  max-width: none;
  max-height: none;
  overflow: visible;
  margin: 0.4em 0 0;
  padding: 0;
  background: none;
  color: inherit;
  text-align: left;
  font-size: 0.8em;
}
```

That is intentionally scoped and small, but it is still theme CSS we would rather
not need. The theme notes explain why it exists:

- Dirtbag caption notes:
  https://github.com/dknauss/dirtbag/blob/release/0.1.9/docs/captions.md#front-page-gallery--why-the-overlay-captions-were-removed
- Dirtbag development note:
  https://github.com/dknauss/dirtbag/blob/release/0.1.9/docs/development.md
- Current workaround in `theme.json`:
  https://github.com/dknauss/dirtbag/blob/release/0.1.9/theme.json#L383

I tested this both as a WordPress-free reduction and injected into a running
WordPress 7.0 Studio site. In both cases, the core overlay version produced the
axe `scrollable-region-focusable` finding; the normal-flow caption workaround did
not.

So from the theme side, an “external captions” option would not just be a design
preference. It would give themes and authors a core-supported way to avoid the
keyboard-inaccessible scroll region and the white-on-light-image contrast failure
without overriding core Gallery CSS.
