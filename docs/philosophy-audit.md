# Dirtbag philosophy audit: core parts, no aftermarket pile-on

This audit was written after Dirtbag started leaning more honestly on WordPress core behavior: core navigation overlay, enhanced query pagination, image lightbox, and the Interactivity API runtime underneath them. The point is not to win a purity contest. The point is to say exactly which tools ride in the truck, who owns them, and what happens when they fail.

## Working thesis

Dirtbag does **not** mean “no JavaScript ever” or “no CSS exists on the page.” That claim is too small, too brittle, and too easy to disprove in a browser.

A better claim:

> Dirtbag does not ship theme-owned front-end JavaScript or CSS files. It uses WordPress core blocks, `theme.json`, native browser behavior, and core-owned progressive enhancements when they already belong to the job. Every interaction still has to degrade to a useful document.

That lets the theme admit the real machine:

- WordPress core may print block, layout, global-style, and view-script assets.
- Core Interactivity API behavior is still JavaScript in the browser, even when Dirtbag did not author or bundle it.
- Preact/signals in core are not a free pass; they are an OEM part already loaded for certain core blocks.
- “No dependencies” means no extra theme dependencies, not no dependency graph anywhere.
- Fallbacks, keyboard behavior, focus, mobile overlay behavior, and accessibility still belong to us when we choose the block or opt into the enhancement.

## What is already aligned

- `/Users/danknauss/Developer/GitHub/dirtbag/README.md` has the strongest current statement. Its JavaScript policy distinguishes native behavior, WordPress Interactivity API as the OEM part, tiny vanilla JavaScript, and aftermarket frameworks.
- `/Users/danknauss/Developer/GitHub/dirtbag/docs/development.md` correctly says “No theme CSS/JS” cannot subtract what WordPress core brings.
- `/Users/danknauss/Developer/GitHub/dirtbag/docs/testing.md` correctly frames browser checks as the place where core behavior, accessibility, and front-end reality are verified.
- The seeded `Field Guide` page says the quiet part well: no theme JavaScript means Dirtbag does not add any; it does not mean Dirtbag can confiscate what core brings.
- The seeded `Colophon` page already admits core progressive enhancements: instant pagination and image lightbox fall back to links and images.
- The seeded `About` page has the right practical line: WordPress core CSS and JavaScript are allowed when core blocks need them to render, line up, open, close, or stay usable.

## Contradictions and soft spots

These are not all fatal. Some are slogans that need footnotes; some should be tightened before release copy hardens around them.

1. **“No JavaScript” is still used as shorthand.**
   - `/Users/danknauss/Developer/GitHub/dirtbag/readme.txt` answers “Does Dirtbag include JavaScript?” with “No.” The next sentence narrows it, but the first word overpromises.
   - The seeded `Colour Styles` page says “no-JavaScript switchboard,” which is acceptable for that page, but can be misread beside enhanced pagination and lightbox.
   - The seeded `Idling near the gravel pit` post says “The JavaScript is still in the glovebox.” Good voice; less good precision now that core Preact can be on the page.

2. **“No dependencies” needs an owner.**
   - Seeded `Features` says “No dependencies added in version one.” That is defensible only if it means “no dependencies added by the theme.” Core dependencies still exist.
   - `readme.txt` says no bundled runtime, which is accurate, but should not be allowed to imply no runtime loads.

3. **The future-framework roadmap has drifted.**
   - Seeded `Features` still talks about Alpine.js as likely first lightweight option.
   - `/Users/danknauss/Developer/GitHub/dirtbag/README.md` now says the first stop should be core Interactivity API, with Alpine/Reef/VanJS as aftermarket parts.
   - The new doctrine should make Alpine a later exception, not the next natural step.

4. **CSS language is mostly right, but still easy to flatten.**
   - “No CSS” is wrong; `theme.json` styles and core global styles are real CSS output.
   - “No theme stylesheet file” and “no enqueued theme CSS file” are the durable phrases.

5. **Testing obligations should follow the philosophy.**
   - If Dirtbag opts into core enhancements, then “we did not write that script” is not enough.
   - The test checklist should explicitly cover JavaScript-off fallbacks for pagination/lightbox, keyboard/focus behavior for navigation overlay, mobile viewport checks, and axe checks against seeded content.

## Gaps worth filling

- A short doctrine page or README section named something like **Core parts, aftermarket parts**.
- A release checklist item: “If a core block/enhancement loads JS, document the fallback and test it with scripts disabled or unavailable.”
- A wording pass through `readme.txt`, seeded `Features`, seeded `About`, seeded `Field Guide`, seeded `Accessibility`, and old posts so they agree on the same distinction:
  - **theme-owned assets**: none for front-end JS/CSS files;
  - **WordPress-owned assets**: allowed when core blocks/enhancements need them;
  - **browser-owned behavior**: preferred first;
  - **third-party/runtime additions**: need a named job, a fallback, and permission.
- A blog post that says the new thing plainly: the browser is not empty, WordPress core is not empty, and that is fine if the document survives.

## Challenge to the vision

Is this the simplest solution? Mostly yes: use native HTML first, core blocks second, core Interactivity API only where core already owns the behavior, and avoid importing a second runtime.

Should any code be deleted instead of added? Yes, by default. The most Dirtbag interaction is the one that vanishes into a link, a `details` element, a form submit, or a core block that already exists.

Is the abstraction earning its cost? Core’s Interactivity API earns its cost when it arrives as part of the core block already selected. It does not earn its cost merely because it is available.

Did we generalize too early? The old “maybe Alpine/Reef/VanJS later” roadmap risks doing exactly that. Name the job first. Pick the tool last.

Does this optimize for clarity over cleverness? It can, if the public language stops pretending “no JS” is the whole story. The honest story is better: no aftermarket runtime, no theme-owned front-end script pile, no broken document when the fancy part stalls.
