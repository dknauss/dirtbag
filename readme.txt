=== Dirtbag ===
Contributors: dpknauss
Requires at least: 7.0
Tested up to: 7.0
Requires PHP: 7.2
Stable tag: 0.1.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Tags: full-site-editing, one-column, style-variations

A hyper-simple block theme for plain HTML, core blocks, web-safe fonts, and road grit.

== Description ==

Dirtbag is a small WordPress block theme with standard templates, simple template parts, style variations, web-safe font choices, and no bundled JavaScript runtime.

The default style is intentionally plain. Additional style variations provide sparse colour and typography changes through theme.json. WordPress core may still output global styles, layout styles, block styles, and block scripts needed by core blocks.

== Privacy ==

Dirtbag does not collect, store, or transmit user data. It does not load remote resources, analytics, tracking pixels, external fonts, or third-party scripts.

== Frequently Asked Questions ==

= Does Dirtbag include JavaScript? =

No theme-authored JavaScript, and no bundled libraries. WordPress core still loads its own scripts where core blocks need them — the navigation overlay, enhanced pagination, and image lightbox use core's Interactivity API — and each falls back to plain HTML when that script does not run.

= Does Dirtbag load external fonts or assets? =

No. The theme uses web-safe font stacks and local icon assets.

= How do I switch styles? =

Open Appearance > Editor > Styles and choose a style variation.

== Changelog ==

= 0.1.5 =
* Accessibility: graduate the confirmed-clean axe rule set to gating (image-alt, link-name, label, heading-order, landmark-unique, region, color-contrast, button-name) and add a per-style sweep that checks color contrast on every global style variation.
* Accessibility: fix an unnamed image-lightbox control on the h-card avatar by disabling the lightbox on that decorative icon.
* Ship a photo-free package: remove the bundled CC-licensed photographs and refresh the theme screenshot.

= 0.1.4 =
* Accessibility: remove the scrollable overlay captions from the front-page gallery (alt text kept; credits remain in this readme).
* WordPress.org Theme Check cleanup: drop the invalid block-theme tag, add a GPL copyright notice, and remove base64_decode from the bundled Playground seed.
* Expand the README overview and align the JavaScript policy wording with the core-Interactivity-first doctrine.

= 0.1.3 =
* Require WordPress 7.0 and PHP 7.2+; use the core Breadcrumbs block.
* State the JavaScript policy honestly: no theme-authored or bundled JavaScript, but core blocks may load WordPress's own (the Interactivity API), each with a plain-HTML fallback.
* Opt into core progressive enhancements: navigation overlay, enhanced (no-reload) pagination, and the image lightbox.
* Add Archive (master index) and Search page templates.
* Improve microformats2 markup (h-card path, post date binding, u-url) and make the byline translatable.
* Collapse style variations to their deltas over theme.json; document the editor-controls, CSS, and i18n policies.
* Add CC0 demo imagery and Playground seed content; add package-check and Playwright/CI tests.

= 0.1.2 =
* Apply barebones Playground export for header and front page.

= 0.1.1 =
* Refine header layout and add Playground demo content.

= 0.1.0 =
* Initial theme.

== Copyright ==

Dirtbag WordPress Theme, Copyright 2026 Dan Knauss.
Dirtbag is distributed under the terms of the GNU GPL v2 or later.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

Bundled third-party resources retain their own licences, listed below.

== Resources ==

* Pickup Truck SVG Vector, SVG Repo, CC0, https://www.svgrepo.com/svg/452616/pickup-truck
* Dirtbag pickup truck icon variants are adapted from the SVG Repo pickup truck icon with small CC0-compatible grit marks added by the theme author.
* Dirtbag site icon PNG variants are generated from the local pickup truck SVG variants.
* Potluck, La.Catholique, CC BY 2.0, https://www.flickr.com/photos/38559542@N02/8167936623
* Abandoned rusty Ford pickup truck, Jonathan Desrosiers, CC0 1.0, https://wordpress.org/photos/photo/3526751dbe/
* Blue Bird Truck Stop sign, libraryofcongress, CC0 1.0, https://www.rawpixel.com/image/3797049/photo-image-blue-vintage-bird
* Old Truck near Great Sand Dunes Colorado, Log Home Finishing, CC0 1.0, https://www.flickr.com/photos/23399885@N06/40197635543
* Sunny Side Truck Stop Cafe, libraryofcongress, CC0 1.0, https://www.rawpixel.com/image/3800505/photo-image-logo-vintage-neon
* Red pickup truck, creator not listed, CC0 1.0, https://www.rawpixel.com/image/6035980/red-pickup-truck-free-public-domain-cc0-photo
* Folding table and chairs, green 2008, robert therrian, CC0 1.0, https://commons.wikimedia.org/w/index.php?curid=163543396
* Driver This 1975 Van Watched, U.S. National Archives, CC0 1.0, https://www.rawpixel.com/image/8765476/photo-image-vintage-retro
* Datsun 521 Truck 1500, 先従隗始, CC0 1.0, https://commons.wikimedia.org/w/index.php?curid=172568009
* Ford Cortina, Txemai Argazki, CC0 1.0, https://www.flickr.com/photos/59170444@N05/52478677429
* Toyota RT66P Corona Mark II Double Pick, 先従隗始, CC0 1.0, https://commons.wikimedia.org/w/index.php?curid=172568010
* Sign roadside curio shop, 05/1972, U.S. National Archives, CC0 1.0, https://www.rawpixel.com/image/8802552/photo-image-mountain-nature-landscape
* Highway crossing desert Sandoval County, libraryofcongress, CC0 1.0, https://www.rawpixel.com/image/12151006/image-cloud-plant-art
* local chapter hall Veterans Foreign, Carol M Highsmith, CC0 1.0, https://www.rawpixel.com/image/8079773/photo-image-cloud-sky-american-flag
* What's in your glove box?, karmatosed (Tammie Lister), CC0 1.0, https://www.flickr.com/photos/73631307@N00/2096516382
* Secured Glovebox, cogdogblog (Alan Levine), CC0 1.0, https://www.flickr.com/photos/37996646802@N01/33213363108
* Typography scale informed by Butterick's Practical Typography, https://practicaltypography.com/

All bundled theme code and original theme design are distributed under GPLv2 or later.

Portions of this theme were developed with AI assistance (Anthropic Claude, via Claude Code) under maintainer direction and review.
