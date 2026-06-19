// Per-style accessibility sweep — axe across every Dirtbag style variation.
// This spec scans whatever variation is currently active; the driver
// (tests/axe-styles.sh) applies each variation in turn and re-runs this config,
// passing the active slug via DIRTBAG_STYLE for labelling. Contrast and focus
// visibility differ per variation (the dark themes especially), so this is the
// layer that guards them. See docs/testing-strategy.md → "Per-style accessibility
// sweep". Report-only today, matching the baseline axe policy.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const STYLE = process.env.DIRTBAG_STYLE || 'default';
const PAGES = ['/', '/archive/', '/search/', '/about/', '/colophon/'];

test.describe(`axe per style: ${STYLE}`, () => {
  for (const path of PAGES) {
    test(`[${STYLE}] axe ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const contrastNodes = violations
        .filter((v) => v.id === 'color-contrast')
        .reduce((n, v) => n + v.nodes.length, 0);

      if (violations.length) {
        console.log(
          `\n[${STYLE}] ${path} — ${violations.length} violation(s), ` +
          `${contrastNodes} contrast node(s):\n` +
          violations.map((v) => `  - ${v.id} (${v.impact}): ${v.help} [${v.nodes.length}]`).join('\n')
        );
        await testInfo.attach(`axe-${STYLE}${path.replace(/\W+/g, '_')}.json`, {
          body: JSON.stringify(violations, null, 2),
          contentType: 'application/json',
        });
      }

      // Gating — color-contrast is the rule this sweep exists to guard, now clean
      // on every style and page. A per-style regression fails the sweep.
      const contrast = violations
        .filter((v) => v.id === 'color-contrast')
        .map((v) => `${v.id} [${v.nodes.length}]`);
      expect(contrast, `color-contrast violations on ${path} (${STYLE})`).toEqual([]);
      void contrastNodes;
    });
  }
});
