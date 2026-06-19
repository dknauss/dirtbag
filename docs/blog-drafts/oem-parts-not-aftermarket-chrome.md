---
title: "OEM parts, not aftermarket chrome"
slug: "oem-parts-not-aftermarket-chrome"
status: "published"
published: "2026-06-18"
type: "post"
suggested_category: "Garage"
suggested_tags:
  - HTML
  - No JS
  - WordPress
  - Interactivity API
excerpt: "Dirtbag is not allergic to the machine WordPress already ships. It is allergic to bolting on a second machine because we got bored."
---

Dirtbag used to be easy to explain at the counter:

No theme JavaScript. No theme stylesheet. No build step. Cash only. Coffee burned since 6 a.m.

That is still mostly true, but mostly is where the honest work starts.

WordPress is not an empty field. It is a machine with a lot of factory parts already bolted to the frame. Core blocks bring layout styles. Global styles turn `theme.json` into CSS. The Navigation block can bring an overlay. Query pagination can be enhanced. Images can open in a lightbox. Under some of that work sits the WordPress Interactivity API — Preact and signals, packed by core, riding in the same parts bin as the blocks.

So the better Dirtbag line is this:

Dirtbag does not ship a theme-owned front-end JavaScript dependency. It does not enqueue a theme stylesheet file. It uses the browser first, WordPress core second, and aftermarket chrome only after the job has a name and the fallback still works.

That is less pure and more useful.

## The browser is already a tool

A link already goes somewhere. A form already submits. A heading already divides the page. A list already lists. A table already needs headers, rows, and a caption before anybody starts making it “interactive.”

Most websites do not need a tiny app pretending to be a document. They need the document to stop being embarrassed about itself.

Dirtbag starts there. Let the browser carry what the browser was born carrying. Use plain links. Use feeds. Use comments. Use `details` and `summary` when a disclosure is enough. Keep the page useful before the script arrives, after the script chokes, and when the script was never invited.

## Core is the OEM part

There is a difference between using the part that came with the truck and ordering a glowing spoiler from a catalogue.

When a WordPress core block needs its own behavior to open, close, paginate, or keep an interface usable, that is not Dirtbag sneaking in a private framework. It is core doing core work. The cost is still real. The JavaScript is still in the browser. The accessibility still has to hold. But the dependency belongs to the platform we already chose.

That is why the Interactivity API changes the conversation. If a core enhancement already uses the core runtime, Dirtbag should not pretend Alpine, Reef, VanJS, or some other handy little hitchhiker is the first stop. The first stop is still no runtime. The second stop is the core runtime already under the hood.

Only after that do we talk about bringing another tool.

## No theme JavaScript is not no responsibility

This is the part where the bumper sticker gets peeled off.

“No theme JavaScript” does not mean “no JavaScript ever executes.” It does not mean the mobile menu is somebody else’s problem. It does not mean enhanced pagination gets a hall pass because core wrote the script. If Dirtbag chooses the block or opts into the enhancement, Dirtbag owns the test.

Can you tab through it? Can you close it with the keyboard? Does the link still work when the enhancement does not? Does the image remain an image without the lightbox? Does the page still read like a page?

If not, the OEM part did not earn the ride.

## The rule for the glovebox

Keep the glovebox small.

Carry HTML. Carry feeds. Carry visible links. Carry `theme.json`. Carry core blocks. Carry core behavior when it is already the right part for the job.

Do not carry a second runtime because the first one was fashionable last week. Do not add a clever state machine to avoid writing a clearer document. Do not turn a small site into a kit car with seven manufacturers stamped under the hood.

Dirtbag is not anti-JavaScript the way a sign in a diner is anti-fun. Dirtbag is anti-freight. Every part has to earn its weight, and the page has to get home if that part falls off on the shoulder.
