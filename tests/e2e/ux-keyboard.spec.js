// Keyboard / UX behaviour, focused on the mobile navigation overlay and forms.
// Marked fixme: selectors for the WP 7.0 navigation-overlay must be confirmed in
// a browser-capable session (claude-playwright) on first run, then un-fixme'd.
// See docs/testing-strategy.md → "Implementation plan".
const { test, expect } = require('@playwright/test');

test.describe.fixme('keyboard and overlay (validate selectors in a browser run)', () => {
  test('tab order reaches the skip link first', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main-content');
  });

  test('mobile nav overlay opens, traps focus, and closes on Esc', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');

    const open = page.getByRole('button', { name: /menu/i }).first();
    await open.click();

    const overlay = page.locator('[role="dialog"], .wp-block-navigation-overlay').first();
    await expect(overlay).toBeVisible();

    // Focus should be inside the overlay while open.
    await expect(overlay.locator(':focus')).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden();
  });

  test('search and comment inputs are keyboard-operable', async ({ page }) => {
    await page.goto('/search/');
    const search = page.locator('.wp-block-search__input').first();
    await search.focus();
    await expect(search).toBeFocused();
  });
});
