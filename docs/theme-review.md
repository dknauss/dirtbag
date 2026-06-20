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

## Upload scanner triage (Theme Check)

The WordPress.org upload scanner runs the [Theme Check](https://wordpress.org/plugins/theme-check/)
plugin. Reproduce its result locally by scanning the **release zip** (the dev
directories in `.gitattributes` `export-ignore` are absent there, so scanning the
working tree reports extra `axe-styles.sh` / `playground/` hits that never ship):

```
unzip dirtbag-<v>.zip -d wp-content/themes/   # installs as theme slug "dirtbag"
wp i18n …                                      # (Theme Check runs via the admin UI
                                               #  or run_themechecks_against_theme())
```

The 0.1.8 release zip produced **no REQUIRED or WARNING** notes. The remaining
notes are non-blocking and intentional:

| Note | Level | Verdict |
| --- | --- | --- |
| No `register_block_style` reference found | RECOMMENDED | **Ignore.** Block-theme false positive. Style variations live in `styles/*.json` and `theme.json`, not in PHP. The theme has no `functions.php` and ships no PHP runtime by design. |
| No `register_block_pattern` reference found | RECOMMENDED | **Ignore.** Block-theme false positive. Patterns are auto-registered by core from `patterns/*.php` headers; calling `register_block_pattern()` would double-register them. |
| Possible hard-coded links in `patterns/blogroll-xfn.php` | INFO | **Ignore.** Intentional. A blogroll/XFN pattern is by definition a curated list of external links (indieweb.org, microformats.org, archive.org, textfiles.com). |
| Only one text-domain (`dirtbag`) is used | INFO | **Ignore.** This is a pass confirmation — the single domain matches the theme slug, as required for language-pack compatibility. |

None require a code change. Re-confirm this list whenever patterns, `functions.php`,
or external links change.

## Playground seed content

The `playground/` directory is repo-only demo infrastructure. It seeds content, taxonomy terms, authors, media, and preview state for WordPress Playground links. It must stay out of WordPress.org theme release zips.
