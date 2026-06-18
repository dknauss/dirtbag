# Dirtbag

Dirtbag is a hyper-simple WordPress block theme. It favours plain markup, core blocks, web-safe fonts, and style variations over bundled front-end machinery.

## Modes

- **Brutalist** — default, plainest mode. No enqueued theme stylesheet and no theme JavaScript.
- **Minimalist** — sparse theme.json styling for readable defaults.
- **Newspaper** — black ink, white paper, old classifieds energy.
- **Terminal** — MS-DOS-adjacent green phosphor without the boot disk.
- **Amber CRT** — late-night monitor glow.
- **Blueprint** — garage floor plans and cyan chalk lines.
- **Hi-vis** — safety vest, road cone, no-name yellow-box dinner.

WordPress core may still print global styles, layout styles, block styles, and block scripts needed by core blocks. Dirtbag does not enqueue a separate stylesheet or JavaScript runtime.

## JavaScript policy

Dirtbag ships no theme-authored front-end JavaScript in v1. Future interaction work should start with native HTML and WordPress core. If a real enhancement needs JavaScript, prefer tiny vanilla JavaScript first. Alpine.js, Reef, and VanJS remain future candidates only.

## Templates and patterns

Dirtbag includes standard block templates for home, posts, pages, archives, search, author archives, date archives, taxonomy archives, 404s, and several page variants. Patterns cover comments, post meta, previous/next links, h-card profile markup, rel=me links, a blogroll, a now section, a colophon, an accessible table, and open-web links.

## Review notes

- Required theme files: `style.css`, `readme.txt`, `theme.json`, and `templates/index.html`.
- Translation text domain: `dirtbag`.
- Domain path: `/languages`.
- No bundled JavaScript libraries.
- No remote resources are loaded by the theme.
- Theme credits and third-party resource licences are documented in `readme.txt`.
## Development checks

Dirtbag has no build step. Use the small package check before publishing changes:

```sh
bin/package-check
```

The same check runs in GitHub Actions. GSD project memory lives in `.planning/`.

