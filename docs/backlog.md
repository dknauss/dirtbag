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

## Tooling improvements

- Keep `bin/package-check` tiny, dependency-free, and easy to rerun.
- Consider adding optional checks for stale text-domain strings and pattern translation coverage.
- Consider a release packaging helper that creates a clean `dirtbag.zip` without development files.
- Consider a browser-mode regression script for the style picker if browser tooling becomes part of the normal workflow.

## Documentation improvements

- Add screenshots for every style variation.
- Add a short maintainer note for refreshing `languages/dirtbag.pot`.
- Add a WordPress Playground blueprint if it can stay simple and does not become a build step.
