# Development guide

Dirtbag is intentionally low machinery. The theme should be understandable by reading the files in the repo.

## Repository layout

| Path | Purpose |
| --- | --- |
| `style.css` | WordPress theme header only. No theme CSS rules. |
| `theme.json` | Global settings, default style values, font families, spacing, and shared custom variables. |
| `styles/` | WordPress global style variations. |
| `templates/` | Block theme templates. |
| `parts/` | Header and footer template parts. |
| `patterns/` | PHP block patterns with translation-ready strings. |
| `languages/` | Translation template files. |
| `docs/` | Maintainer and release documentation. |
| `playground/` | WordPress Playground blueprints for stable-tag and main-branch previews. |
| `.planning/` | Local GSD planning state. Not part of release packages. |
| `bin/package-check` | Small local verification script. |

## Rules of the road

- Keep `style.css` as a header-only file.
- Do not add theme-authored front-end JavaScript in v1.
- Do not add a package manager or build step unless the project explicitly changes direction.
- Prefer `theme.json`, core block markup, template parts, and patterns.
- Prefer native HTML and WordPress core behaviour before custom behaviour.
- Keep copy changes intentional. Do not rewrite existing demo content unless that is the task.
- Keep site-root files such as `robots.txt`, `llms.txt`, and `blogroll.opml` out of the theme package.

## Local workflow

Make the smallest useful change, then run:

```sh
bin/package-check
```

If the change affects rendered output, also check the local Studio site manually or in a browser-capable Codex session.

## Versioning

Theme version metadata currently lives in:

- `style.css`
- `readme.txt`

Update both together before a tagged release.

## No build step means no hidden step

Dirtbag should not require `npm install`, `composer install`, asset compilation, minification, transpilation, or generated CSS/JS to be usable. If a future tool is added for validation, it should be optional and documented as a check, not as a required build.

## Playground previews

Dirtbag keeps two small browser preview blueprints:

- `playground/blueprint-stable.json` installs the commit for the current stable tag. It uses the commit SHA rather than the annotated tag ref because Playground/isomorphic-git can fail on annotated tag pack resolution.
- `playground/blueprint-main.json` installs the main branch.

Both blueprints force the theme folder to `dirtbag` so theme asset paths resolve, and both seed the site logo from the bundled truck icon. Update the stable blueprint ref when cutting a new stable tag.
