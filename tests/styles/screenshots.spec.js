// Per-style front-page screenshot capture — documentation captures, NOT visual
// diff assertions. Run once per style via the same DIRTBAG_STYLE driver model as
// a11y-styles.spec.js and truck-icon.spec.js: axe-styles.sh (or a wrapper) sets
// DIRTBAG_STYLE and applies the variation before invoking Playwright. This spec
// then captures the active front page at a fixed viewport and saves it to
// tests/screenshots/<slug>.png.
//
// Covers the backlog item: "screenshots for every style variation."
// Not a regression gate — no assertions beyond the page rendering successfully.
// Headless-friendly: CSS animations are disabled via page.addStyleTag so captures
// are deterministic regardless of host browser capabilities.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const STYLE = process.env.DIRTBAG_STYLE || 'default';
const OUT_DIR = path.resolve(__dirname, '..', 'screenshots');

// Fixed viewport for reproducible crops. Desktop width to match the per-style
// axe sweep (Desktop Chrome project in playwright.styles.config.js).
const VIEWPORT = { width: 1280, height: 900 };

test.describe(`front-page screenshot: ${STYLE}`, () => {
  test.use({ viewport: VIEWPORT });

  test(`[${STYLE}] capture full-page front-page screenshot`, async ({ page }) => {
    // Disable CSS transitions and animations so the screenshot is deterministic.
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }',
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Basic liveness check: the page must have rendered a body.
    await expect(page.locator('body'), 'page body should be present').toBeVisible();

    // Ensure the output directory exists (first-run safety; normally created by
    // repo setup but we can't assume it in a fresh checkout).
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const outFile = path.join(OUT_DIR, `${STYLE}.png`);
    await page.screenshot({
      path: outFile,
      fullPage: true,
    });

    // Surface the path in the test report so it's easy to locate in CI artefacts.
    console.log(`[${STYLE}] screenshot saved: ${outFile}`);
  });
});
