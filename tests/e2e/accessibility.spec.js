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

// Gated rules — confirmed clean across the seeded pages (and, for color-contrast,
// across every style via the per-style sweep). A regression here fails the suite.
// Other axe findings stay report-only until they are likewise confirmed clean.
const GATED_RULES = [
  'image-alt', 'link-name', 'label', 'heading-order',
  'landmark-unique', 'region', 'color-contrast', 'button-name',
];

// Run axe on the current page: gate the confirmed-clean set, report the rest.
// `best-practice` is included alongside the WCAG tags because heading-order,
// landmark-unique, and region are best-practice rules — without it they would
// not be evaluated and gating them would be a silent no-op.
async function checkAxe(page, label, testInfo) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .analyze();

  const ungated = violations.filter((v) => !GATED_RULES.includes(v.id));
  if (ungated.length) {
    console.log(`\naxe findings (report-only) on ${label}:\n` + ungated
      .map((v) => `- ${v.id} (${v.impact}): ${v.help} [${v.nodes.length}]`).join('\n'));
    await testInfo.attach('axe.json', {
      body: JSON.stringify(ungated, null, 2), contentType: 'application/json',
    });
  }

  const gated = violations
    .filter((v) => GATED_RULES.includes(v.id))
    .map((v) => `${v.id} [${v.nodes.length}]`);
  expect(gated, `gated a11y violations on ${label}`).toEqual([]);
}

test.describe('axe (wcag2a/aa)', () => {
  for (const path of PAGES) {
    test(`axe: ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      await checkAxe(page, path, testInfo);
    });
  }

  // Templates that can't be static slugs: a single post (its URL embeds the seed
  // date) and the 404 fallback. Resolve the post link from the archive at runtime.
  test('axe: a single post (with comment form)', async ({ page }, testInfo) => {
    await page.goto('/archive/');
    const href = await page.locator('.wp-block-post-title a').first().getAttribute('href');
    expect(href, 'a post link on the archive').toBeTruthy();
    await page.goto(href);
    await expect(page.locator('.comment-form, #commentform').first()).toBeVisible();
    await checkAxe(page, 'single post', testInfo);
  });

  test('axe: the 404 template', async ({ page }, testInfo) => {
    await page.goto('/no-such-road-here/');
    await checkAxe(page, '404', testInfo);
  });
});
