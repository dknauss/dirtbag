# Dirtbag backlog

## Release QA and review checks

These are planned checks before a public release or WordPress.org theme submission. Keep them boring, repeatable, and small.

1. **Official Theme Check pass**
   - Run the WordPress Theme Check plugin against Dirtbag.
   - Treat required errors as release blockers.
   - Record any recommended warnings that are intentionally accepted.

2. **Browser style-switcher regression test**
   - Use a browser-capable Codex session or manual Site Editor pass.
   - Switch through Default, Minimalist, Newspaper, Hi-vis, Amber CRT, Terminal, and Blueprint.
   - Verify the truck icon colour changes correctly and does not stick between styles.
   - Verify no old hover, active-nav, or random colour CSS returns.

3. **Small viewport screenshots**
   - Capture and review at least:
     - `240 × 320`
     - `320 × 240`
     - `360 × 640`
   - Check reading flow, navigation, site logo, featured images, comments, and forms.
   - Confirm there is no accidental horizontal scrolling.

4. **Keyboard and focus pass**
   - Test skip link, primary navigation, mobile overlay menu, footer links, search, comments, buttons, and forms.
   - Confirm focus is visible and tab order follows the page.
   - Confirm there are no keyboard traps.

5. **Package check script**
   - Add a small local script that verifies the theme zip before release.
   - Checks should include required files, no hidden files, no root site-kit `.txt`/`.opml` files, valid JSON, PHP syntax, and no bundled JS/fonts.
   - Keep the script local and simple; no build step.

6. **Translation and rendered-output checks**
   - Refresh `languages/dirtbag.pot` before release and avoid committing timestamp-only churn.
   - Run rendered HTML validation on key URLs.
   - Run axe or pa11y accessibility checks in a browser-capable session.
## Tooling and validation backlog

Add these before a formal release cycle:

- **Tiny package-check script:** add `bin/package-check` to rerun the static checks: required files, package hygiene, JSON validation, PHP syntax, WPCS/PHPCompatibility, no bundled JS/fonts, screenshot dimensions, and stale site-root file detection.
- **Browser-mode style picker regression:** in a `codex-browser` session, switch every style variation repeatedly and verify the truck icon colour does not stick or leak stale CSS between styles.
- **Official Theme Check plugin pass:** run the WordPress Theme Check plugin and treat required failures as blockers.
- **Optional W3C/Nu HTML validation:** validate rendered pages such as home, single, page, archive, search, 404, and comments.
- **Axe/pa11y accessibility checks:** run automated accessibility checks in a browser-capable session, then follow with keyboard/manual checks.

