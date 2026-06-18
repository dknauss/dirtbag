# Dirtbag

Dirtbag is a hyper-simple WordPress block theme with one default dirt mode and several paint jobs:

1. **Brutalist** — the default mode. It stays closest to plain browser/WordPress output.
2. **Minimalist** — readable spacing, typography, and a tiny state layer.
3. **Newspaper** — black ink, white paper, old classifieds energy.
4. **Terminal** — MS-DOS-adjacent green phosphor without the boot disk.
5. **Amber CRT** — late-night monitor glow.
6. **Blueprint** — garage floor plans and cyan chalk lines.
7. **Hi-vis** — safety vest, road cone, no-name yellow-box dinner.

There is no build step, no bundled JavaScript runtime, and no enqueued theme stylesheet in v1.

## Dirtbag CSS/JS rule

Dirtbag does not enqueue its own frontend stylesheet or JavaScript. Brutalist keeps its hands off interaction states and lets native browser/WP behaviour show. The CSS-allowed style variations add a tiny `theme.json` custom CSS layer for links, buttons, form controls, focus outlines, current navigation, and disclosure summaries.

If a WordPress core block needs core CSS or core JavaScript to stand up straight, that is allowed. Dirtbag does not add a second toolbox unless the job really needs it.

## Install

Place this repository in a WordPress themes directory:

```text
wp-content/themes/dirtbag
```

Then activate **Dirtbag** in **Appearance → Themes**.

## Switch style modes

1. Open **Appearance → Editor**.
2. Open **Styles**.
3. Choose **Brutalist**, **Minimalist**, **Newspaper**, **Terminal**, **Amber CRT**, **Blueprint**, or **Hi-vis**.
4. Save your site styles.

WordPress stores selected global styles in the database, so changes to files in `styles/` may not automatically affect a site that has already customized or selected a variation.



## JavaScript policy and roadmap

Dirtbag ships no theme-authored frontend JavaScript in v1. Add JavaScript only for a concrete, approved interaction. WordPress core may still load JavaScript for core block behaviour.

Roadmap:

1. **v1: No Dirtbag JS.** Current state. HTML, WordPress core blocks, style variations, and native browser behaviour.
2. **v1.1: Tiny vanilla JS only if approved.** Possible progressive enhancements: opening hash-targeted details, copy-permalink buttons, or small page-local helpers. No build step. Load only where used.
3. **v2 candidate: Cab Light.** An opt-in HTML + CSS + JS style/mode for carefully approved interactive bits. Default library choice would be Alpine.js because it keeps behaviour close to markup.
4. **Reef and VanJS stay parked.** Reef is a maybe for tiny reactive state. VanJS is only for a real app-like island, not decoration.

Preference order:

1. Vanilla JavaScript first.
2. [Alpine.js](https://alpinejs.dev/) if markup-local state is genuinely useful.
3. [Reef](https://reef.gomakethings.com/) if Alpine's attribute style is a poor fit.
4. [VanJS](https://vanjs.org/) only for app-like DOM generation justified by a real UI need.

What not to do:

- Do not load Alpine globally just because.
- Do not add JavaScript for things HTML already solves.
- Do not fake WordPress global style switching with script unless that feature is explicitly approved.
- Do not add a build system.


## Release testing roadmap

Before a Dirtbag release, do a small-screen shakedown as well as the usual WordPress checks. The dirtbag test is not “does it look like an app?” It is “can a tired person read it on a lousy little screen?”

Required pre-release checks:

- Validate block theme detection: `theme.json`, template files, template parts, and theme header present.
- Open the frontend, Site Editor, home, post, page, archive, search, and 404 templates.
- Confirm Brutalist has no theme-authored stylesheet or JavaScript.
- Confirm CSS-enabled style variations do not leak stale Site Editor custom CSS into Brutalist.
- Test keyboard focus, skip link, current navigation, links, buttons, forms, comments, and core interactive blocks.
- Test tiny/feature-phone viewports in browser devtools or a responsive tester:
  - `320 × 240` — classic landscape feature phone / KaiOS-ish check.
  - `240 × 320` — portrait small phone.
  - `280 × 653` — narrow cheap Android-ish check.
  - `360 × 640` — common small mobile baseline.
- At those sizes, confirm readable text, usable navigation, visible focus, no accidental horizontal scrolling, and no JS-only dead ends.
- Optional deeper check: use the KaiOS simulator or a real feature phone when available; viewport testing is the release minimum.

## Frontend colour demo

The seeded Studio content includes a **Colour Styles** page. It uses plain block markup, links, and native `<details>/<summary>` panels to preview the palettes. It is a demo switchboard, not a global style switcher. WordPress core changes global style variations in the Site Editor; Dirtbag does not fake that with JavaScript.


## Templates and patterns

Dirtbag now includes broad block-theme coverage:

- Core/fallback templates: `index`, `home`, `front-page`, `single`, `single-note`, `page`, `archive`, `category`, `tag`, `date`, `author`, `search`, and `404`.
- Custom page templates: no-title, wide, centred, plain, colophon, now, links, feeds, and uses.
- Patterns: h-card profile, rel-me links, colophon, blogroll with XFN, now section, post meta, previous/next, Webmention invitation, field note, roadside notice, accessible table, colour style demo panel, open web links, and comments.

## IndieWeb and old-open-web stance

Dirtbag adds microformats-friendly classes where block markup allows it: `h-card`, `h-entry`, `h-feed`, `p-name`, `p-note`, `u-url`, `u-photo`, `dt-published`, `p-author`, `p-category`, and `e-content`.

It also exposes old-open-web doors:

- Posts RSS: `/feed/`
- Comments RSS: `/comments/feed/`
- Sitemap: `/wp-sitemap.xml`
- OPML blogroll: `/wp-content/themes/dirtbag/blogroll.opml`
- humans.txt: `/wp-content/themes/dirtbag/humans.txt`
- security.txt placeholder: `/wp-content/themes/dirtbag/security.txt`

Protocol handling such as Webmention receiving/sending and Micropub posting should be provided by plugins. Dirtbag supplies plain markup and visible affordances.

## Translation readiness

Dirtbag is translation-ready but does not ship locale translations yet.

- Text domain: `dirtbag`
- Domain path: `/languages`
- Placeholder directory: `languages/.gitkeep`
- Future source catalogue: `languages/dirtbag.pot`

Generate the POT later when the theme text settles.

## Plain text doors

Dirtbag includes cult/common plain-text files for humans, bots, readers, and weird little scripts:

- `llms.txt` — blunt context for language models
- `robots.txt` — crawler hints and sitemap pointer
- `about.txt` — plain-text about page
- `colophon.txt` — plain-text colophon
- `blogroll.txt` — plain-text blogroll companion to OPML
- `now.txt` — plain-text now page
- `feeds.txt` — plain-text feed and machine-readable link directory
- `security.txt` and `.well-known/security.txt` — placeholder security contact

For root URLs like `/llms.txt`, copy these files to the WordPress document root. The Studio test site has been synced this way.


Transparent and inverted icon assets are included for light and dark style modes.
