# Publish a static Dirtbag site to GitHub Pages

**Handoff brief for a fresh session.** This is self-contained — read it, then start.

## Goal
Publish a **static export** of the Dirtbag WordPress site (running in WordPress
Studio) to **GitHub Pages**. **No custom domain**, so it lives at the project subpath:
`https://dknauss.github.io/dirtbag/`.

## Environment / facts
- **Theme repo:** `~/Developer/GitHub/dirtbag` (GitHub `dknauss/dirtbag`). Do **not**
  push to `main` directly — branch + PR. Static output goes to a separate `gh-pages` branch.
- **Studio site "Dirtbag":** `http://localhost:8887`, path `~/Studio/dirtbag`. Drive it
  with `studio wp …` run **from the site dir** (`cd ~/Studio/dirtbag && studio wp …`);
  filter the spinner noise. The **command sandbox blocks `localhost`** — run any
  `curl`/`wget`/`studio` commands with `dangerouslyDisableSandbox: true`.
- The demo content is the **Playground seed** (`playground/seed-content.*`). The
  texturize **mu-plugin** (and the "faithful" variant) are active on Studio — leave them.
- Current theme release: **0.1.14**.

## THE key gotcha — base path
A **project** Pages site serves at the `/dirtbag/` subpath, so WordPress's absolute
`http://localhost:8887/…` URLs must be rewritten to `https://dknauss.github.io/dirtbag/…`
(or root-relative `/dirtbag/…`). **Use an exporter that rewrites to an explicit
destination URL.** (Permalinks are fine — `/2026/06/21/post/` → `…/post/index.html`,
which Pages serves.)

## Recommended approach
**Simply Static plugin** (cleanest base-URL rewrite):
1. Install in Studio via wp-cli (`studio wp plugin install simply-static --activate`).
2. Set **Destination URL** = `https://dknauss.github.io/dirtbag/`, then run an export.
3. Push the static output to a **`gh-pages`** branch.
4. Enable Pages:
   `gh api repos/dknauss/dirtbag/pages -X POST -f source.branch=gh-pages -f source.path=/`

**Alternative** if Simply Static is awkward: `wget --mirror -k -p -E` against
`http://localhost:8887`, then rewrite the base to `/dirtbag/`.

## What works vs. breaks (static)
- **Works:** posts/pages/archives, front page, feeds (RSS), sitemap, OPML, humans.txt,
  the global style variations (CSS), and the **client-side** lightbox + nav overlay
  (Interactivity JS the crawl captures).
- **Breaks (no backend):** **search** (dynamic results) and **comment submission**
  (comments still *display*; you just can't post). Expected — note it; Pagefind/Lunr can
  replace search later if wanted.

## Deliverable
The static demo live at `https://dknauss.github.io/dirtbag/`, deployed from a
`gh-pages` branch. Then decide whether to **automate** it: a CI job that boots the
existing `playground/blueprint-stable.json` (theme + seed), crawls it, and deploys to
Pages on each release — no Studio dependency.

## First steps
1. Pick the exporter (try Simply Static via wp-cli; fall back to `wget`).
2. Prove the export locally (correct base URL, links resolve under `/dirtbag/`).
3. Deploy to `gh-pages` + enable Pages; `curl` the live URL to verify.
