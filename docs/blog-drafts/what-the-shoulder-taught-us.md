---
title: "What the shoulder taught us"
slug: "what-the-shoulder-taught-us"
status: "published"
published: "2026-06-18"
type: "post"
suggested_category: "Field Notes"
suggested_tags:
  - Dirtbag
  - WordPress
  - Accessibility
  - Testing
excerpt: "A small theme still teaches big lessons: slogans leak, core has weight, exports lie, and the page has to survive the ditch."
---

The first Dirtbag rule was simple enough to write on the back of a gas receipt:

Keep it small.

No build step. No theme JavaScript. No stylesheet file pretending to be a lifestyle brand. No remote font with a passport. Plain pages, visible links, feeds, comments, and enough road grit to make the thing feel owned by a person instead of a launch committee.

Then the theme went out for a drive and came back with better rules.

## Slogans leak

“No JS” sounds clean until you look at an actual WordPress page. Core blocks are not cardboard cutouts. Navigation has to open. An overlay has to close. A lightbox has to trap attention without trapping people. Enhanced pagination still has to be pagination when the enhancement quits.

The old slogan was pointing in the right direction, but it was too smug for the machinery underneath it.

The honest version is duller and stronger: Dirtbag does not add its own front-end JavaScript dependency. Dirtbag does not enqueue its own stylesheet file. WordPress core may still bring CSS and JavaScript when core blocks need them. The browser may still do browser work. The document still has to stand when the extras fall away.

That sentence will not fit on a sticker. Good. Stickers are where nuance goes to rust.

## Core has weight

Using core is not the same as using nothing.

`theme.json` becomes CSS. Core block support becomes markup and styles. The Interactivity API is JavaScript, even when it arrives as an OEM part from WordPress instead of an aftermarket box from the parts store.

That does not make it bad. It makes it countable.

The lesson is not “never use it.” The lesson is “name the owner.” If WordPress core owns the behavior and the fallback is a plain link, button, image, or document, the part might earn its keep. If Dirtbag has to import a second runtime, invent a private convention, or explain why the page is useless until hydration, the truck is overloaded.

## Exports lie in small ways

The Site Editor is useful, but it is not a holy writ machine. Exported templates can come back with local URLs, hard-coded theme slugs, or odd block bindings stuck to the bumper. Seed content can carry yesterday’s idea after today’s philosophy changed.

So Dirtbag learned to treat exports like parts from a swap meet: inspect them before installation.

The package check is not glamour work. It looks for stale local addresses, broken block comments, bad nesting, and things that should have been cleaned before release. That is exactly the kind of boring tool a small theme needs. Not a build system. Not a dashboard. A flashlight.

## Accessibility is where philosophy pays rent

A plain theme can still fail people.

A caption can sit in a scrollable region that keyboard users cannot reach. A menu can look simple and still mishandle focus. A clever visual shortcut can flatten the document for somebody reading it a different way.

That is why “we did not write the JavaScript” is not a release gate. It is trivia. The gate is whether the page works with a keyboard, a screen reader, a small viewport, slow patience, and scripts that may or may not arrive.

Plain is not automatically accessible. Plain is just easier to audit when you have not buried the page under theater.

## The page is the product

The best thing Dirtbag learned is also the oldest thing on the web: the page is already the product.

Not the framework. Not the tooling story. Not the perfect screenshot. Not the promise that a future version might carry a shinier library if the vibes are right.

A page with a title, a date, a byline, some links, a feed, comments, and honest markup is not a fallback. It is the thing.

Everything else is a part in the glovebox. Useful sometimes. Dead weight often. Worth carrying only when it gets the page farther down the road without leaving anybody in the ditch.
