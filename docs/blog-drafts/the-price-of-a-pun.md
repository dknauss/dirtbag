---
title: "The price of a pun"
slug: "the-price-of-a-pun"
status: "published"
published: "2026-06-20"
type: "post"
suggested_category: "Garage"
suggested_tags:
  - CSS
  - HTML
  - Typography
  - WordPress
excerpt: "An apostrophe kept wandering onto its own line. Fixing it cost a split string, a flexbox quirk, and two exclamation points. Worth it? Barely — and only because the joke earned the ride."
---

Every post on this site is signed the same way: *From [author]'s dashboard*. It is a small joke. A dashboard is where you keep your hands at ten and two, and it is also where WordPress keeps its knobs. The byline drives both meanings at once. Cheap pun, paid for once, runs forever.

Except it didn't run. On a narrow screen the byline kept throwing a rod.

## The apostrophe that wouldn't stay in its lane

Read it back: *From Roadside Archivist's dashboard*. Three pieces — the word "From," the author's name, and the suffix "'s dashboard." On a wide screen they sit in a row like they should. Shrink the window and the last piece would snap off and drop to the next line, stranding an orphaned *'s dashboard* under a name it no longer belonged to.

A possessive that loses its noun is not a typo. It is worse. It reads like the page forgot how grammar works.

So either the joke had to go, or the apostrophe had to learn to stay glued to the name.

## How you glue an apostrophe to a name

The byline is a flexbox — a little horizontal rack the three pieces ride in. Two settings hold it together.

First, `flex-wrap: nowrap`: the three pieces are forbidden from breaking apart from each other. They travel as one unit or not at all.

Second, a single line in `theme.json`: `.byline { flex-shrink: 0 }`. That tells the layout the byline will not be squeezed thinner to fit beside the date. When it doesn't fit, the *whole* byline drops to its own line — intact — instead of shedding its tail to make room.

There is a third thing, and it is a quirk, not a setting. Flexbox quietly eats the whitespace between its items. So the gap that would normally sit between the name and the "'s" — the gap that let it break in the first place — simply isn't rendered. The apostrophe ends up flush against the last letter of the name, like it was never two separate pieces of markup at all.

Three small moves, and *Archivist's* holds together down to the phone.

## What the joke costs

Honesty time, because that is the house style.

The byline is a **split string**. The translator gets "From" and "'s dashboard" as two separate scraps wrapped around a name they never see. A language that builds possessives differently — or builds sentences in a different order — can't just swap the words. It has to rephrase around a hole.

It is also a **CSS escape**. Dirtbag keeps almost no hand-written CSS, and this spends two of the precious lines, both with `!important` on them — the layout equivalent of raising your voice.

And it leans on that **flexbox whitespace quirk**, which is real and well-defined but is still a behavior, not a promise. Push the screen below about 340 pixels with a long enough name and the unbreakable byline will run off the edge rather than wrap. A short name never notices. A long one on a tiny phone does.

None of it is free. All of it is for a pun.

## Is it defensible?

Barely. And that is the honest answer, not a dodge.

It earns the word *defensible* because it never leaves the property. No JavaScript. No `functions.php`. No plugin. Just a core block, a translatable pattern, and one small rule in the file where the theme already keeps its design. By Dirtbag's own rules, it is in bounds.

But it is the most indulgent thing in the whole theme. The cheaper build was sitting right there the entire time: *By Roadside Archivist*. Three words, no apostrophe, no split string, no flexbox sermon, translatable in any language without a fight. Every engineering instinct says ship that one.

We didn't. We kept the pun, wrote down exactly what it cost, and paid it on purpose.

## The thing under the thing

Discipline is not never indulging. A site with no indulgences has no voice; it is a spec sheet with a domain name.

Discipline is knowing the bill before you order. The trouble is the indulgence you take without pricing it — the framework you add because everyone does, the clever thing you can't explain a month later, the dependency nobody remembers signing for. Those are the ones that total the truck.

A possessive apostrophe held in place by a flexbox quirk is a flourish. But it is a *measured* one. We can tell you what it costs, where it breaks, and what the boring alternative would have been. That is the whole difference between a theme with character and a theme that just got away from somebody.

Keep the joke. Keep the receipt.
