# Dirtbag backlog

Planned checks and improvements before a formal public release or WordPress.org theme submission.

## Release QA

1. **Official Theme Check pass**
   - Run the WordPress Theme Check plugin against Dirtbag.
   - Treat required errors as release blockers.
   - Record any recommended warnings that are intentionally accepted.

2. **Browser-mode style picker regression**
   - Use a fresh browser-capable `codex-browser` or `codex-browser-handoff` session, or do a manual Site Editor pass.
   - Switch through Default, Minimalist, Newspaper, Hi-vis, Amber CRT, Terminal, and Blueprint several times.
   - Verify the truck icon colour changes correctly and does not stick between styles.
   - Verify no old hover, active-nav, or random colour CSS returns.

3. **Small viewport screenshots**
   - Capture and review at least `240×320`, `320×240`, and `360×640`.
   - Check reading flow, navigation, site logo, featured images, comments, and forms.
   - Confirm there is no accidental horizontal scrolling.

4. **Keyboard and focus pass**
   - Test skip link, primary navigation, mobile overlay menu, footer links, search, comments, buttons, and forms.
   - Confirm focus is visible and tab order follows the page.
   - Confirm there are no keyboard traps.

5. **Rendered HTML validation**
   - Validate home, single, page, archive, search, 404, and comments with the W3C/Nu checker.
   - Record any unavoidable WordPress/core output notes separately from theme issues.

6. **Axe/pa11y accessibility checks**
   - Run automated checks in a browser-capable session.
   - Follow with manual keyboard and screen-reader spot checks.

7. **Clean-install verification**
   - Confirm the theme renders correctly for a brand-new user with no database overrides.
   - Use a Playground link (which reseeds from a blank install on every load) or a **throwaway** Studio site — never reset the main authoring site.
   - For a full wipe + reseed, first re-export current Studio content into `playground/seed-content.php`; the seed file is derived from Studio, not the reverse. See [development guide](development.md#studio-site-demo-content-and-reseeding).

## Tooling improvements

- Keep `bin/package-check` tiny, dependency-free, and easy to rerun.
- **Bake the reconcile into the export step (long-term fix).** A raw Site-Editor export reintroduces artifacts the reconcile strips (the `core/post-data` datetime binding, hardcoded `"theme":"dirtbag"` slugs, absolute `localhost` URLs). `bin/package-check` now *fails* when these reappear (short-term guardrail), but the durable fix is a Studio→repo export helper that applies the reconcile automatically so the artifacts never land in committed files.
- Consider adding optional checks for stale text-domain strings and pattern translation coverage.
- Consider a release packaging helper that creates a clean `dirtbag.zip` without development files.
- Consider a browser-mode regression script for the style picker if browser tooling becomes part of the normal workflow.

## Documentation improvements

- Add screenshots for every style variation.
- Add a short maintainer note for refreshing `languages/dirtbag.pot`.
- Add a WordPress Playground blueprint if it can stay simple and does not become a build step.

## Future experiments

- **Private note tool**
  - Do not ship `single-note.html` in v1 unless a real `note` post type or companion plugin backs it.
  - Explore a private-first note/scratch-pad tool later, possibly with a clearly labelled `contenteditable` area.
  - Define persistence, privacy, accessibility, keyboard, and screen-reader behaviour before adding any public template surface.
  - Avoid app-like machinery in the theme; use a companion plugin if saving or private dashboard behaviour is needed.

## Compatibility notes

- **Breadcrumbs and WordPress 7.0**
  - Dirtbag v1 targets WordPress 7.0+ so it can use the core Breadcrumbs block.
  - If a future release lowers the minimum WordPress version, remove or conditionally replace `core/breadcrumbs` first.

## Browser testing (future Playwright / manual)

Not yet verified in a real browser; looked OK on a quick manual skim.

- **Mobile navigation overlay — open/close and centering**
  - Tap the header menu icon on small viewports; confirm the overlay opens, the `core/navigation-overlay-close` button closes it, Esc closes it, and focus is trapped while open.
  - Confirm the site logo and the menu are visually centred (`parts/navigation-overlay.html`).
- **Mobile navigation overlay — dark style variations**
  - The overlay uses fixed `#ffffff` background / `#000000` text so it always renders solid. On dark variations (Terminal, Amber CRT, Blueprint) that is a light panel over a dark site.
  - Verify contrast and appearance there, and decide whether the overlay should follow each variation's colours instead of fixed black/white.
