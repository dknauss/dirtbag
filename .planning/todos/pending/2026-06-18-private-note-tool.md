---
created: 2026-06-18T23:40:55.497Z
title: Explore private note tool
area: theme
todos:
  - templates/single-note.html
  - docs/backlog.md
---

## Problem

Dirtbag briefly had a `single-note.html` template, but the theme does not register a `note` post type and v1 should not ship orphan template surface area. A private note tool still fits the Dirtbag/open-web direction as a later experiment, especially as a small scratch-pad or private dashboard feature.

The rough idea is often as simple as a labelled `contenteditable` area, but that alone does not persist content, does not define privacy/storage rules, and may create accessibility and user-expectation problems if shipped as a theme template without supporting functionality.

## Solution

Backlog a future private note tool as a companion plugin or explicitly supported optional feature, not as a v1 theme template. Explore a minimal implementation with clear labelling, persistence rules, privacy expectations, keyboard/screen-reader checks, and no theme-authored JavaScript unless deliberately approved for that feature.

Possible future shape:

- register or support a real `note` post type outside the v1 theme;
- provide a deliberately simple note template only when the post type exists;
- consider a labelled `contenteditable` scratch area only with explicit save/storage behaviour;
- keep it private-first and avoid adding app-like machinery to the public theme.
