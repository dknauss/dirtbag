#!/usr/bin/env bash
#
# Publish an already-built static export directory to the gh-pages branch.
#
# This does NOT crawl — run bin/static-export/export.php and
# bin/static-export/supplement.sh first, then point this at the output dir.
# It uses an isolated git worktree so your main checkout is never touched, and
# stops short of pushing unless you pass --push (publishing is outward-facing).
#
# Usage:
#   bin/static-export/deploy.sh <output_dir> [--push]
#
# Example:
#   bin/static-export/deploy.sh ~/Studio/dirtbag/wp-content/uploads/ss-export
#   bin/static-export/deploy.sh ~/Studio/dirtbag/wp-content/uploads/ss-export --push
#
# After the first push, enable Pages once:
#   gh api repos/dknauss/dirtbag/pages -X POST -f source.branch=gh-pages -f source.path=/

set -euo pipefail

OUT="${1:?output_dir required}"
PUSH="${2:-}"
OUT="${OUT%/}"
[ -d "$OUT" ] || { echo "Output dir not found: $OUT" >&2; exit 1; }
[ -f "$OUT/.nojekyll" ] || { echo "Missing .nojekyll — run supplement.sh first." >&2; exit 1; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WT="$(mktemp -d "${TMPDIR:-/tmp}/dirtbag-ghpages.XXXXXX")"

cleanup() { git -C "$ROOT" worktree remove --force "$WT" >/dev/null 2>&1 || true; }
trap cleanup EXIT

echo "== Preparing gh-pages worktree =="
if git -C "$ROOT" show-ref --verify --quiet refs/heads/gh-pages; then
  git -C "$ROOT" worktree add --force "$WT" gh-pages
  # Replace the tree wholesale so deletes propagate.
  find "$WT" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
else
  git -C "$ROOT" worktree add --orphan -b gh-pages "$WT"
fi

echo "== Copying export =="
cp -R "$OUT/." "$WT/"

echo "== Committing =="
git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi
version="$(sed -n 's/^ \* Version:[[:space:]]*//p' "$ROOT/style.css" | head -1)"
git -C "$WT" commit -q -m "deploy: static export of Dirtbag ${version:-(dev)} for GitHub Pages"
git -C "$WT" log --oneline -1

if [ "$PUSH" = "--push" ]; then
  echo "== Pushing =="
  git -C "$WT" push -u origin gh-pages
  echo "Pushed. Live at https://dknauss.github.io/dirtbag/ once Pages rebuilds."
else
  echo "Built on branch gh-pages (not pushed). Re-run with --push to publish."
fi
