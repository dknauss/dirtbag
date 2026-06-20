---
title: "The build sheet"
slug: "the-build-sheet"
status: "published"
published: "2026-06-19"
type: "post"
suggested_category: "Garage"
suggested_tags:
  - WordPress
  - theme.json
  - CSS
  - Typography
excerpt: "Dirtbag's whole design lives in one 8 KB file. It is small for the same reason the truck has crank windows: most of the options were left off on purpose."
---

Pop the hood on a block theme and one part is doing most of the steering: `theme.json`. It is the build sheet — the page that lists which options the theme came with, what is standard, and what the factory will not let you order. Dirtbag's build sheet is tiny, about 8.7 KB, because most of it says *no*.

That is not laziness. It is the whole idea.

## Two columns on the sheet

There are only two things on a build sheet worth reading.

The first is `settings`: what the factory will let you order. These are the controls the editor shows you — the color pickers, the font menus, the toggles.

The second is `styles`: what actually rolled off the line. These are the numbers the theme commits to — the type sizes, the spacing, the heading scale.

Settings is the menu. Styles is the plate. Read them in that order and the whole file makes sense.

## What you can't order

Most of Dirtbag's settings are switched off, and that is the point.

The bundled design tools are off. The color section turns off the custom picker, the gradients, the duotones, and ships a fixed palette of nineteen named colors — black, white, a row of greys, and the primaries that came packed in with HTML itself. No wheel, no hex field, no "brand purple #6B21A8." If you have ever run View Source on a 1998 homepage, you already know this palette.

The fonts are the same story: thirteen web-safe stacks, Arial through Verdana, all of them already on the machine. Nothing gets downloaded. Nothing phones home. The page renders the same whether the network is fast, slow, or on fire in a ditch.

Shadows: off. Fluid type: off. A short menu is a kind of honesty. It tells you what the theme is for before you waste an afternoon finding out what it is not.

## What's standard

The other column is just plain numbers, written down where you can see them.

Six type sizes, fifteen pixels up to forty-eight. A heading scale that steps down by level — 36, 28, 26, 20, 18, 15 — so an `h2` is a smaller voice than an `h1` and the screen reader and the eye agree on the outline. Body text at eighteen pixels with a 1.4 line height. A measure of about 42rem, because a line you can actually finish reading is worth more than a line that fills the window. Block gap at 1.4em. Square buttons. Underlined links.

No cleverness. No per-block paint job. Just the spec, stated once, applied everywhere.

## The one drawer with a wrench in it

Every honest toolbox has the drawer where the real wrench lives, and Dirtbag's is a small block of hand-written CSS inside `theme.json`. Three rules, no more:

One collapses the gap in a byline so the author and date read as a single line. One recolors the monochrome truck logo per style variation. And the newest one lines up the two columns on the front page so the sidebar's posts don't drift a line below the grid when a heading wraps.

That is the whole drawer. The rule is simple: if you keep an exception, you write it down. Exceptions that live in the dark breed. Three rules in a list, each with a reason, is a thing you can audit on a slow afternoon. A stylesheet nobody remembers writing is how a small theme quietly becomes a big one.

## Why it fits on one page

A `theme.json` gets fat when it tries to style every block — a rule here, an override there, a special case for the thing that looked wrong on one screen in one browser one Tuesday.

Dirtbag's stays thin because it does the opposite. It decides what not to allow, writes down a short list of numbers, and keeps three honest exceptions. Then it gets out of the way. The browser and WordPress core already know how to render a document.

The build sheet fits on one page because the truck does not have many options. On purpose. Constrain, then declare. That is the whole theme, and it turns out you can read it in about eight kilobytes.
