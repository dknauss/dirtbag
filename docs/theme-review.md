# WordPress.org theme review notes

Dirtbag aims to be ready for WordPress.org theme review without losing its small-site philosophy.

## Required theme files

The package must include:

- `style.css`
- `readme.txt`
- `license.txt`
- `screenshot.png`
- `theme.json`
- `templates/index.html`
- `languages/dirtbag.pot`

## Package exclusions

Do not include development-only files in the release zip:

- `.git/`
- `.github/`
- `.planning/`
- `playground/`
- local backups
- database dumps
- root site-kit files such as `robots.txt`, `llms.txt`, `about.txt`, `blogroll.opml`, or `.well-known/security.txt`

The site-root files are documented as templates in [site-root open-web files](site-root-open-web-files.md).

## Translatability

- Text domain: `dirtbag`.
- Domain path: `/languages`.
- PHP pattern strings should use translation functions.
- Refresh `languages/dirtbag.pot` before release, but avoid committing timestamp-only churn.

## Security

The theme should not process privileged actions, save user input, call remote services, or register custom REST endpoints. Pattern PHP should only register pattern metadata/content and should keep strings escaped or translation-ready as appropriate.

## Performance

Dirtbag should remain light:

- No external fonts.
- No analytics.
- No third-party scripts.
- No bundled JavaScript runtime.
- No extra CSS files.
- No build artefacts.

WordPress core may still output block, layout, and global-style assets required by the active blocks.

## Credits

Keep third-party resource credits in `readme.txt`. Current credits include:

- CC0 pickup truck source image from SVG Repo.
- Dirtbag truck icon adaptations generated from that source.
- Typography scale inspiration from Butterick’s Practical Typography.

## Release checklist

1. Run `bin/package-check`.
2. Run the official Theme Check plugin.
3. Test the Site Editor and every style variation.
4. Test keyboard navigation and small viewports.
5. Validate rendered HTML on representative pages.
6. Confirm package contents before uploading.

## Playground seed content

The `playground/` directory is repo-only demo infrastructure. It seeds content, taxonomy terms, authors, media, and preview state for WordPress Playground links. It must stay out of WordPress.org theme release zips.
