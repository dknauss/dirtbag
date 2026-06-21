# Publishing Dirtbag as a static site on GitHub Pages

Dirtbag's demo is published as a **static export** of the WordPress site at
**https://dknauss.github.io/dirtbag/**, served from the `gh-pages` branch.

Because it is a *project* Pages site (no custom domain), everything lives under
the `/dirtbag/` subpath. WordPress's absolute `http://localhost:8887/…` URLs are
rewritten to `https://dknauss.github.io/dirtbag/…` during the crawl. This is the
one detail that makes or breaks the export — get the destination URL right and
everything else follows.

We use the [Simply Static](https://wordpress.org/plugins/simply-static/) plugin
in **absolute-URL** mode. Absolute (not relative) is deliberate: `wp-sitemap.xml`
and the RSS feeds must contain fully-qualified URLs to stay valid.

## What works vs. what breaks

**Works:** posts, pages, archives, the front page, author/category/tag archives,
RSS feeds, `wp-sitemap*.xml`, the OPML blogroll, the root open-web text files
(`about.txt`, `now.txt`, `colophon.txt`, …; see
[site-root-open-web-files.md](site-root-open-web-files.md)), all global style
variations, and the client-side lightbox + navigation overlay (the Interactivity
API JS the crawl captures).

**Breaks (no backend):** **search** (dynamic results) and **comment submission**
(existing comments still display; the form just has nowhere to post). Both are
expected for a static host. Search could later be replaced with a client-side
index such as Pagefind.

The `/feed/` and `/comments/feed/` endpoints are saved as `index.html` files, so
GitHub Pages serves them as `text/html` rather than `application/rss+xml`. Feed
readers sniff the XML and parse it correctly; only the response header differs.

## One-time prerequisites

- The Studio "Dirtbag" site running at `http://localhost:8887`
  (`cd ~/Studio/dirtbag && studio site start`).
- Simply Static installed and active:
  `studio wp plugin install simply-static --activate`.
- `gh` authenticated with push access to `dknauss/dirtbag`.

> The command sandbox blocks `localhost`; run the `studio`/`curl` steps below
> with the sandbox disabled.

## Build and deploy

All three scripts live in [`bin/static-export/`](../bin/static-export) (which is
`export-ignore`d from the theme zip).

### 1. Crawl + rewrite

Run from the Studio site directory. `SS_OUTPUT_DIR` is a **PHP-side** path: under
Studio the web root is `/wordpress`, which maps to `~/Studio/dirtbag` on disk.

```sh
cd ~/Studio/dirtbag
SS_DEST_URL="https://dknauss.github.io/dirtbag" \
SS_OUTPUT_DIR="/wordpress/wp-content/uploads/ss-export/" \
  studio wp eval-file ~/Developer/GitHub/dirtbag/bin/static-export/export.php
```

This configures Simply Static, seeds the sitemap URLs the crawler won't discover
on its own, and drives the export job to completion synchronously (it does not
rely on the loopback WP-Cron dispatch, which is unreliable under WP-CLI).

### 2. Supplement

Fetch the feeds + web-root files Simply Static misses, rewrite their origin URLs,
and add `.nojekyll`. Paths here are **host** paths.

```sh
~/Developer/GitHub/dirtbag/bin/static-export/supplement.sh \
  ~/Studio/dirtbag/wp-content/uploads/ss-export \
  http://localhost:8887 \
  https://dknauss.github.io/dirtbag \
  ~/Studio/dirtbag
```

It exits non-zero if any `localhost:8887` reference survives.

### 3. Deploy

Copies the output into an isolated `gh-pages` worktree, commits, and (with
`--push`) publishes. Your main checkout is never touched.

```sh
~/Developer/GitHub/dirtbag/bin/static-export/deploy.sh \
  ~/Studio/dirtbag/wp-content/uploads/ss-export --push
```

### 4. Enable Pages (first time only)

```sh
gh api repos/dknauss/dirtbag/pages -X POST -f source.branch=gh-pages -f source.path=/
```

Then confirm the build and the live site:

```sh
gh api repos/dknauss/dirtbag/pages/builds/latest -q .status   # → "built"
curl -sI https://dknauss.github.io/dirtbag/ | head -1          # → HTTP/2 200
```

## Automating it (CI)

The manual flow above depends on a running Studio site. A release-triggered CI
job could remove that dependency by booting the theme + seed from
[`playground/blueprint-stable.json`](../playground/blueprint-stable.json) with
`@wp-playground/cli`, installing Simply Static, running the same `export.php` /
`supplement.sh`, and deploying with `actions/deploy-pages`. That is a separate
piece of work — see [backlog.md](backlog.md) — and is not wired up yet.
