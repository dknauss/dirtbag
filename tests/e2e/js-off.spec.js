// JavaScript-off fallbacks: the core enhancements Dirtbag opts into (overlay,
// enhanced pagination, image lightbox) must degrade to a usable document.
// Behaviour validated against WP 7.0 in a browser run (Studio site) — see
// docs/testing-strategy.md → "Implementation plan".
const { test, expect } = require('@playwright/test');

test.use({ javaScriptEnabled: false });

test.describe('with JavaScript disabled', () => {
  test('query pagination still navigates via real links', async ({ page }) => {
    await page.goto('/archive/');
    const next = page.locator('.wp-block-query-pagination-next');
    if (await next.count()) {
      await expect(next.first()).toHaveAttribute('href', /\S/);
    }
  });

  test('images remain plain images (lightbox degrades)', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('main img').count()).toBeGreaterThan(0);
    // No lightbox dialog should be present/usable without JS.
    await expect(page.locator('.wp-lightbox-overlay')).toHaveCount(0);
  });

  test('navigation links are reachable without JS', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('nav a').count()).toBeGreaterThan(0);
  });
});
