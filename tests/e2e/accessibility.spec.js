// Accessibility coverage for Dirtbag — the project's primary quality focus.
// Structure assertions below are verified-safe and gating. axe runs report-only
// for now; graduate rules to gating as the baseline clears (see
// docs/testing-strategy.md → "Implementation plan").
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Representative seeded pages. Adjust slugs if the seed changes.
const PAGES = ['/', '/archive/', '/search/', '/about/', '/colophon/'];

test.describe('structure (gating)', () => {
  test('front page has exactly one h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('core landmarks and a labelled nav exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
    await expect(page.locator('nav[aria-label]').first()).toBeVisible();
  });

  test('skip link targets main content', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: /skip to content/i }).first();
    await expect(skip).toHaveAttribute('href', '#main-content');
  });
});

// Rules we intend to gate first, once confirmed clean across pages and styles.
const GATED_RULES = [
  'image-alt', 'link-name', 'label', 'heading-order',
  'landmark-unique', 'region', 'color-contrast',
];

test.describe('axe (wcag2a/aa) — report-only', () => {
  for (const path of PAGES) {
    test(`axe: ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      if (violations.length) {
        console.log(`\naxe findings on ${path}:\n` + violations
          .map((v) => `- ${v.id} (${v.impact}): ${v.help} [${v.nodes.length}]`).join('\n'));
        await testInfo.attach('axe.json', {
          body: JSON.stringify(violations, null, 2), contentType: 'application/json',
        });
      }

      // Graduation target — uncomment per rule as each is confirmed clean:
      // const gated = violations.filter((v) => GATED_RULES.includes(v.id));
      // expect(gated, `gated a11y violations on ${path}`).toEqual([]);
      void GATED_RULES;
    });
  }
});
