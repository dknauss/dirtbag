# Dirtbag

[![Package Check](https://github.com/dknauss/dirtbag/actions/workflows/package-check.yml/badge.svg)](https://github.com/dknauss/dirtbag/actions/workflows/package-check.yml) [![Latest Tag](https://img.shields.io/github/v/tag/dknauss/dirtbag)](https://github.com/dknauss/dirtbag/tags) [![Docs](https://img.shields.io/badge/docs-available-0a7ea4.svg)](docs/)
[![License: GPL-2.0-or-later](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![WordPress 7.0+](https://img.shields.io/badge/WordPress-7.0%2B-21759b.svg?logo=wordpress&logoColor=white)](https://wordpress.org/)
[![Tested up to WP 7.0](https://img.shields.io/badge/tested%20up%20to-WP%207.0-21759b.svg?logo=wordpress&logoColor=white)](https://wordpress.org/)
[![PHP 7.2+](https://img.shields.io/badge/PHP-7.2%2B-777bb4.svg?logo=php&logoColor=white)](https://www.php.net/)
[![▶ Playground (stable tag)](https://img.shields.io/badge/▶_Playground-stable_tag-3858e9.svg?logo=wordpress&logoColor=white)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/dirtbag/main/playground/blueprint-stable.json) [![▶ Playground (main)](https://img.shields.io/badge/▶_Playground-main_branch-6e40c9.svg?logo=wordpress&logoColor=white)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/dirtbag/main/playground/blueprint-main.json)

**Dirtbag is a simple WordPress block theme focused on the fundamentals.** It favours plain HTML markup, as little JS (and CSS) as possible, core WordPress blocks, the fonts everyone already has, visible feeds, and old/open-web habits over front-end machinery. 

![Dirtbag](https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/dirtbag-card.png)

Out of the box Dirtbag gives you a plain, brutalist, 1990s default, unstyled foundation. It's packaged with Web 1.0-inspired page templates, block patterns, and six global styles: Amber CRT, Blueprint (or BSOD), Hi-vis (No-Name), Minimalist, Newspaper, and Terminal. Unlike the default no-style style, these alternative global styles open the door to the the full powers of the site editor, if you want to go there. 

Dirtbag is about doing more with native WordPress, more without creating new external dependencies, and more wih less. Instead of packing everything into the theme, ensure the theme gets the most out of the document, the browser, and WordPress.

## What it is

Dirtbag is a freely distributable WordPress block theme that's small, simple, durable, accessible, and understandable. Dirtbag is for people who want to get under the hood to tinker, with or without the aid of a diagnostic cart (AI) and complex tooling. All you need is a little HTML, curiosity, and a DIY independent streak. Future versions will explore style options with modern but minimalist approaches to CSS and JS.

- **Block theme:** full-site editing templates, template parts, patterns, and `theme.json`.
- **No build step:** edit files, run the package check, ship the theme.
- **No theme-authored JavaScript:** core blocks may still load WordPress's own Interactivity API (navigation overlay, enhanced pagination, image lightbox), each with a plain-HTML fallback. Core's runtime is the OEM part; aftermarket frameworks like Alpine are a later, approved exception — see the [JavaScript policy](#javascript-policy).
- **No enqueued theme stylesheet file:** `style.css` contains the WordPress theme header only — and it is *empty*. Dirtbag does use WordPress-native `theme.json` styles.
- **Core-first layout:** uses WordPress core layout, block, and global-style output where needed.
- **Web-safe typography:** universal font stacks instead of bundled web fonts.
- **Open-web friendly:** templates and docs for RSS, OPML, XFN, h-card, rel=me, now pages, and plain-text site-root files.

WordPress core may still print global styles, layout styles, block styles, and scripts required by core blocks. Dirtbag’s rule is narrower and simpler: the theme does not enqueue a theme stylesheet file and does not ship front-end JavaScript files.

## Quick start

From a WordPress installation:

```sh
cd wp-content/themes
git clone https://github.com/dknauss/dirtbag.git dirtbag
```

Then in WordPress:

1. Go to **Appearance → Themes**.
2. Activate **Dirtbag**.
3. Go to **Appearance → Editor → Styles** to choose a style variation.

For a release zip, make sure the zip contains a top-level `dirtbag/` directory and excludes development-only files such as `.git/`, `.github/`, and `.planning/`.

## Style variations

| Style | Intent | Truck icon |
| --- | --- | --- |
| Brutalist / default | Plainest mode, browser-like HTML energy | Black on transparent |
| Minimalist | Sparse readable defaults | Black on transparent |
| Newspaper | Ink, paper, classifieds | Black on transparent |
| Hi-vis | Safety vest and road cone | Black on transparent |
| Amber CRT | Late-night monitor glow | Amber on transparent |
| Terminal | MS-DOS-adjacent phosphor | Green on transparent |
| Blueprint | Garage plans and cyan chalk lines | Amber on transparent |

The style variations live in `styles/`. Shared defaults live in `theme.json`.

### Gallery

Real home-page renders of each style (same content, different style variation):

<table>
<tr>
<td align="center" width="50%"><strong>Brutalist</strong> (default)<br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/brutalist.png" alt="Dirtbag home page in the Brutalist default style"></td>
<td align="center" width="50%"><strong>Minimalist</strong><br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/minimalist.png" alt="Dirtbag home page in the Minimalist style"></td>
</tr>
<tr>
<td align="center" width="50%"><strong>Newspaper</strong><br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/newspaper.png" alt="Dirtbag home page in the Newspaper style"></td>
<td align="center" width="50%"><strong>Hi-vis</strong><br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/hi-vis.png" alt="Dirtbag home page in the Hi-vis style"></td>
</tr>
<tr>
<td align="center" width="50%"><strong>Amber CRT</strong><br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/amber-crt.png" alt="Dirtbag home page in the Amber CRT style"></td>
<td align="center" width="50%"><strong>Terminal</strong><br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/terminal.png" alt="Dirtbag home page in the Terminal style"></td>
</tr>
<tr>
<td align="center" width="50%"><strong>Blueprint</strong><br><img src="https://raw.githubusercontent.com/dknauss/dirtbag/main/docs/images/styles/blueprint.png" alt="Dirtbag home page in the Blueprint style"></td>
<td align="center" width="50%"></td>
</tr>
</table>

## Templates and patterns

Dirtbag includes standard block templates for:

- Home and front page
- Single posts and pages
- Archives, authors, dates, categories, tags, and search
- 404 pages
- Plain, wide, centred, no-title, links, feeds, now, colophon, and uses page variants

Patterns cover comments, post meta, previous/next links, h-card profile markup, rel=me links, XFN/blogroll links, a now section, a colophon, an accessible table, open-web links, and small roadside notices.

## Development

There is no package install and no build command. The main local check is:

```sh
bin/package-check
```

It verifies required theme files, JSON validity, screenshot dimensions, block nesting, package hygiene, suspicious front-end code patterns, bundled asset rules, and PHP syntax for patterns.

The same check runs in GitHub Actions on pushes and pull requests.

## Documentation

Start with the docs index:

- [Docs index](docs/README.md)
- [Development guide](docs/development.md)
- [Testing guide](docs/testing.md)
- [Style variations](docs/style-variations.md)
- [WordPress.org theme review notes](docs/theme-review.md)
- [Site-root open-web file templates](docs/site-root-open-web-files.md)
- [Backlog and roadmap notes](docs/backlog.md)
- [Changelog](CHANGELOG.md)
- [Support](SUPPORT.md)

GSD project memory lives in `.planning/` for local planning context.

## JavaScript policy

Dirtbag ships no theme-authored front-end JavaScript. WordPress core still loads its own where blocks need it — the navigation overlay already pulls in the Interactivity API runtime, and the theme opts into two of core’s progressive enhancements: enhanced (no-reload) feed pagination and the image lightbox. All three degrade to plain links and images when JavaScript is off.

When an interaction genuinely needs JavaScript, reach for the OEM part before the aftermarket catalogue:

1. **Native HTML and WordPress core behaviour** — no runtime at all.
2. **The WordPress Interactivity API** — the OEM part. Preact + signals (~10&nbsp;kb), built by the same shop that built the engine, progressive-enhancement-first, and already in the parts bin whenever a core interactive block is on the page (overlay, accordion, search, enhanced pagination, lightbox). Adding behaviour on a runtime you are already carrying costs almost nothing.
3. **Tiny vanilla JavaScript** — for a one-bolt job that does not justify a framework.
4. **Aftermarket frameworks** — Alpine.js, Reef, or VanJS, *only* if the OEM part is genuinely wrong for the job. These are bolt-ons from another maker: a second runtime to haul around, extra weight, and no guarantee it fits the WordPress engine. Approve before fitting.

Whatever the part: if it needs JavaScript to be understood, it needs a better fallback.

## Accessibility and performance goals

Dirtbag aims to stay boring in the best way:

- Semantic landmarks and headings.
- Visible links and keyboard focus from WordPress/core styling.
- Skip link support.
- No external fonts, trackers, analytics, or remote assets.
- No bundled JavaScript runtime.
- Small template and pattern surface area.

Manual browser accessibility checks are still required before release. See [Testing](docs/testing.md).

## License and credits

Dirtbag is licensed under the [GNU General Public License v2 or later](license.txt).

Third-party resource credits are listed in [`readme.txt`](readme.txt), including the CC0 pickup truck source image from SVG Repo and typographic inspiration from Butterick’s Practical Typography.

## AI assistance

Parts of Dirtbag were built with AI assistance — Anthropic’s Claude, via Claude Code — under human direction and review. Commits made with that help carry a `Co-Authored-By: Claude` trailer. The maintainer reviews and remains responsible for all shipped code, content, and design.

## Contributing

Small, plain patches are welcome. Please run `bin/package-check` before opening a pull request and keep the no-build-step/no-theme-JS rule intact unless an issue explicitly agrees otherwise.
