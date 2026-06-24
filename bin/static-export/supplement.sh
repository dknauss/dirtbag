#!/usr/bin/env bash
#
# Supplement a Simply Static export with the bits its crawler misses, then make
# the directory GitHub-Pages-ready. Run AFTER bin/static-export/export.php.
#
# Simply Static does not follow <head> RSS <link> tags and does not copy
# physical files that live in the web root but are not WordPress routes. This
# script fetches the feeds, copies the root open-web text/OPML files, grabs the
# sitemap XSL stylesheets, rewrites the origin URL in all of them, and drops a
# .nojekyll marker so Pages serves everything verbatim.
#
# Usage:
#   bin/static-export/supplement.sh <output_dir> <origin_url> <dest_url> [web_root]
#
# Example (Studio):
#   bin/static-export/supplement.sh \
#     ~/Studio/dirtbag/wp-content/uploads/ss-export \
#     http://localhost:8887 \
#     https://dknauss.github.io/dirtbag \
#     ~/Studio/dirtbag
#
# All paths here are HOST paths (this runs in your shell, not inside the PHP
# sandbox), so point <output_dir> at the host location of SS_OUTPUT_DIR.

set -euo pipefail

OUT="${1:?output_dir required}"
ORIGIN="${2:?origin_url required}"
DEST="${3:?dest_url required}"
WEB_ROOT="${4:-}"

ORIGIN="${ORIGIN%/}"
DEST="${DEST%/}"
OUT="${OUT%/}"

[ -d "$OUT" ] || { echo "Output dir not found: $OUT" >&2; exit 1; }

rewrite() { sed "s#${ORIGIN}#${DEST}#g"; }

echo "== Feeds =="
mkdir -p "$OUT/feed" "$OUT/comments/feed"
curl -fsS "$ORIGIN/feed/"          | rewrite > "$OUT/feed/index.html"
curl -fsS "$ORIGIN/comments/feed/" | rewrite > "$OUT/comments/feed/index.html"

echo "== Sitemap stylesheets =="
curl -fsS "$ORIGIN/wp-sitemap.xsl"       | rewrite > "$OUT/wp-sitemap.xsl"       || true
curl -fsS "$ORIGIN/wp-sitemap-index.xsl" | rewrite > "$OUT/wp-sitemap-index.xsl" || true

if [ -n "$WEB_ROOT" ] && [ -d "$WEB_ROOT" ]; then
  echo "== Web-root open-web files =="
  # Physical files served directly, not WordPress routes. robots.txt / llms.txt
  # are emitted by the crawl already, so they are intentionally not copied here.
  for f in about.txt blogroll.opml blogroll.txt colophon.txt feeds.txt now.txt security.txt license.txt; do
    if [ -f "$WEB_ROOT/$f" ]; then
      rewrite < "$WEB_ROOT/$f" > "$OUT/$f"
    fi
  done
  if [ -f "$WEB_ROOT/.well-known/security.txt" ]; then
    mkdir -p "$OUT/.well-known"
    rewrite < "$WEB_ROOT/.well-known/security.txt" > "$OUT/.well-known/security.txt"
  fi
fi

echo "== Pages markers =="
touch "$OUT/.nojekyll"

origin_host="${ORIGIN#*://}"
# grep exits 1 when it finds nothing — the success case here — which would abort
# the script under `set -e`/pipefail before the check below. Swallow that exit.
remaining="$(grep -rl "$origin_host" "$OUT" 2>/dev/null | wc -l | tr -d ' ')" || true
echo "Files still referencing the origin host: $remaining (expected 0)"
[ "$remaining" = "0" ] || { echo "WARNING: origin URLs remain — inspect before deploying." >&2; exit 1; }

echo "Supplement complete: $OUT"
