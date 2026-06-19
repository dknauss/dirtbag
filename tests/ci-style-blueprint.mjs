// Emits a CI Playground blueprint to stdout: the base tests/blueprint.json with
// __REF__ pinned to $REF and, for a non-default $STYLE, an extra step that applies
// that style variation as the active global styles (so axe scans it on this boot).
//
// Playground in CI is in-memory with no persistent wp-cli, so — unlike the local
// Studio sweep (tests/axe-styles.sh) — each style gets its own boot via the
// e2e-styles matrix. See .github/workflows/e2e.yml.
//
//   REF=<sha> STYLE=terminal node tests/ci-style-blueprint.mjs > tests/blueprint.ci.json
import { readFileSync } from 'node:fs';

const ref = process.env.REF || 'main';
const style = process.env.STYLE || 'default';

if (!/^[a-z0-9-]+$/.test(style)) {
  throw new Error(`invalid style slug: ${style}`);
}

const base = readFileSync(new URL('./blueprint.json', import.meta.url), 'utf8');
const bp = JSON.parse(base.replaceAll('__REF__', ref));

if (style !== 'default') {
  // $args is read by playground/apply-style.php exactly as it is under `wp
  // eval-file <file> <slug>`; a require shares this scope, so it sees the slug.
  bp.steps.push({
    step: 'runPHP',
    code: `<?php require '/wordpress/wp-load.php'; $args = ['${style}']; require get_theme_file_path('playground/apply-style.php');`,
  });
}

process.stdout.write(`${JSON.stringify(bp, null, 2)}\n`);
