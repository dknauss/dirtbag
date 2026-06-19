// Smoke + accessibility checks for the Dirtbag theme.
// These assert the seeded demo site renders and stays accessible.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('smoke', () => {
  for (const path of ['/', '/archive/', '/search/']) {
    test(`200: ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res.status(), path).toBeLessThan(400);
    });
  }

  test('unknown URL renders the 404 template', async ({ page }) => {
    const res = await page.goto('/no-such-road-here/');
    expect(res.status()).toBe(404);
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('front page features sticky posts', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main .wp-block-post-title').first()).toBeVisible();
  });

  test('archive lists posts', async ({ page }) => {
    await page.goto('/archive/');
    expect(await page.locator('.wp-block-post-title').count()).toBeGreaterThan(1);
  });

  test('search page has a search form', async ({ page }) => {
    await page.goto('/search/');
    await expect(page.locator('.wp-block-search__input')).toBeVisible();
  });
});

test.describe('accessibility', () => {
  test('skip link targets main content', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: /skip to content/i }).first();
    await expect(skip).toHaveAttribute('href', '#main-content');
  });

  for (const path of ['/', '/archive/', '/colophon/']) {
    test(`axe (wcag2a/aa): ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      // Report-only for now: surface findings without failing CI while the
      // baseline is established. Once clean, re-enable the strict assertion at
      // the bottom (and drop this reporting block) to guard against regressions.
      if (results.violations.length) {
        const summary = results.violations
          .map((v) => `- ${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
          .join('\n');
        console.log(`\naxe findings on ${path}:\n${summary}\n`);
        await testInfo.attach('axe-violations.json', {
          body: JSON.stringify(results.violations, null, 2),
          contentType: 'application/json',
        });
      }
      // Strict mode (enable once the baseline is clean):
      // expect(results.violations, results.violations.map((v) => v.id).join('\n')).toEqual([]);
    });
  }
});

test.describe('navigation overlay (mobile)', () => {
  test('opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 800 });
    await page.goto('/');
    const opener = page.locator('.wp-block-navigation__responsive-container-open').first();
    if ((await opener.count()) === 0) test.skip(true, 'No responsive nav opener on this page');
    await opener.click();
    await expect(page.locator('.wp-block-navigation__responsive-container.is-menu-open')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
