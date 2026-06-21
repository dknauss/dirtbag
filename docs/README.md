# Dirtbag docs

This folder holds repo-facing documentation for the Dirtbag WordPress block theme. It is for maintainers, reviewers, and anyone who wants to understand how the theme stays small.

## Start here

- [Development guide](development.md) — repo layout, editing rules, and the no-build-step workflow.
- [Testing guide](testing.md) — local checks, manual WordPress checks, browser checks, accessibility checks, and release gates.
- [Style variations](style-variations.md) — how the global styles work and how the truck icon colours are handled.
- [Site logos, site icons, and favicons](site-icons-and-logos.md) — the three separate brand marks, where each displays, and which ones CSS can recolour.
- [WordPress.org theme review notes](theme-review.md) — packaging, credits, translatability, security, performance, and review checklist.
- [Site-root open-web file templates](site-root-open-web-files.md) — `robots.txt`, `llms.txt`, OPML, and other files that belong in the site root, not the theme zip.
- [Backlog](backlog.md) — planned checks and improvements.
- [WordPress contribution notes](wordpress-contributions.md) — notable WordPress/Gutenberg/core contributions and a `wptexturize()` apostrophe deep dive.

## Live previews

- [Playground preview: stable tag](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/dirtbag/main/playground/blueprint-stable.json)
- [Playground preview: main branch](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/dirtbag/main/playground/blueprint-main.json)

## Project memory

The `.planning/` directory contains GSD project memory and roadmap state. It is useful for local development, but it is not part of a WordPress.org theme package.
