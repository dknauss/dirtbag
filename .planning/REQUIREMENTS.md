# Requirements: Dirtbag

**Defined:** 2026-06-18
**Core Value:** A Dirtbag site must remain readable, navigable, and understandable with WordPress core blocks, native browser behaviour, and minimal theme machinery.

## v1 Requirements

### Theme Package

- [ ] **PKG-01**: Theme package contains required WordPress files: `style.css`, `readme.txt`, `license.txt`, `screenshot.png`, `theme.json`, and `templates/index.html`.
- [ ] **PKG-02**: Theme package excludes hidden/repo-only files, site-root text files, OPML files, zips, SQL dumps, scripts with `.sh` extensions, and generated cruft.
- [ ] **PKG-03**: Theme package validates JSON and PHP syntax before release.
- [ ] **PKG-04**: Theme package includes complete resource credits and GPL-compatible licensing.

### Theme Behaviour

- [ ] **THEME-01**: Default style uses black transparent truck icon.
- [ ] **THEME-02**: Minimalist, Newspaper, and Hi-vis use black transparent truck icon.
- [ ] **THEME-03**: Amber CRT and Blueprint use amber truck icon.
- [ ] **THEME-04**: Terminal uses green truck icon.
- [ ] **THEME-05**: Style switching does not accumulate stale CSS or sticky icon colours.
- [ ] **THEME-06**: Theme includes no bundled frontend JavaScript runtime.

### Accessibility and Quality

- [ ] **A11Y-01**: Key templates include one main landmark and functional skip link.
- [ ] **A11Y-02**: Navigation, comments, forms, and links are keyboard usable with visible focus.
- [ ] **I18N-01**: PHP pattern strings use the `dirtbag` text domain.
- [ ] **I18N-02**: `languages/dirtbag.pot` is refreshed before release without timestamp-only churn.
- [ ] **QA-01**: Official Theme Check plugin pass is run before WordPress.org submission.
- [ ] **QA-02**: Browser-mode style picker regression is run before release.

## v2 Requirements

### Optional Enhancements

- **JS-01**: If an approved interaction needs JavaScript, start with tiny vanilla JS and document why HTML/core blocks are insufficient.
- **DOCS-01**: Consider a separate site-kit repo for root text files and OPML examples if they grow beyond a single doc template.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Bundled JS frameworks | Not needed in v1 and conflicts with the small-theme principle. |
| Remote web fonts | Web-safe fonts support the core value and avoid external dependencies. |
| Theme-owned root `robots.txt`/`security.txt`/`llms.txt` files | These are site-root policy/content files, not theme files. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PKG-01 | Phase 1 | In Progress |
| PKG-02 | Phase 1 | In Progress |
| PKG-03 | Phase 1 | In Progress |
| PKG-04 | Phase 1 | In Progress |
| THEME-01 | Phase 1 | Complete |
| THEME-02 | Phase 1 | Complete |
| THEME-03 | Phase 1 | Complete |
| THEME-04 | Phase 1 | Complete |
| THEME-05 | Phase 2 | Pending |
| THEME-06 | Phase 1 | Complete |
| A11Y-01 | Phase 2 | Pending |
| A11Y-02 | Phase 2 | Pending |
| I18N-01 | Phase 1 | In Progress |
| I18N-02 | Phase 2 | Pending |
| QA-01 | Phase 2 | Pending |
| QA-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-06-18*
*Last updated: 2026-06-18 after GSD initialization*
