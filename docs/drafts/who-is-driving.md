<!--
DRAFT post for review — not yet seeded or published.

Proposed metadata for seed-content.json:
  post_title:  Who's driving
  post_name:   whos-driving
  post_type:   post
  post_status: publish
  author_login: roadside_archivist
  terms.category: ["field-notes"]
  terms.post_tag: ["ai", "workflow", "playground", "wordpress", "open-web"]
  post_excerpt: The Roadside Archivist is two sets of hands — a person and a
    language model. This is the logbook: how a small theme gets written, tested,
    and shipped, and how the parts we break loose along the way end up upstream.

Voice: composite — Dan + Claude, signing as the Roadside Archivist.
Block markup below is ready to paste into the Site Editor / seed once prose is approved.
-->

<!-- wp:paragraph -->
<p>A confession that has been idling in the glovebox for a while: the Roadside Archivist is not one person. It is two sets of hands on the same wheel — a human who has been driving WordPress for twenty-odd years, and a language model that reads the pace notes, runs into the corners first, and writes most of the rough drafts. The byline says one name because the voice is one voice. The work is shared.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This whole site is the experiment. Dirtbag is a theme, but dirtbag.blog is a test track with a blog bolted to it. Every post you read here was authored, broken, fixed, and shipped using the same loop we are about to describe. The site is the proof. If the loop did not work, you would be reading an apology instead.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">The shop has two mechanics now</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>People expect one of two stories about writing with an AI. Either the machine does everything and the human signs it, or the human does everything and the machine autocompletes a sentence. Neither is true here, and the honest version is duller and more useful.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The model is fast, tireless, and good at the boring parts: reading a 400-line core function for the third time, drafting a paragraph that needs to exist, writing the failing test before the fix, checking that an export did not smuggle a local URL back into the repository. It does not get tired of the eleventh accessibility pass. It does not have an ego about deleting its own code.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The human knows what a sentence is for, when a joke has earned its ride, when "technically correct" is still wrong for a reader, and when to stop. Taste, judgment, and the decision to ship live on this side of the wheel. So does the part that matters most: pointing the truck somewhere worth going.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The composite voice is not a gimmick. It is just what it sounds like when those two sets of hands agree on a paragraph.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">The loop: Studio to Playground to GitHub</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Here is the actual route a post or a fix travels, gravel and all.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">1. Write and break it in Studio</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The work starts on a local <a href="https://developer.wordpress.com/studio/">WordPress Studio</a> site — a real WordPress install on a SQLite database, no server to babysit. The model drives it from the terminal with WP-CLI: create the site, write a post, flip an option, read back exactly what core stored. Studio is where a draft becomes blocks and where a theme change meets real content instead of lorem ipsum. It is also where things break first, which is the point. Better the ditch is here.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">2. Make it disposable in Playground</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Studio is private. <a href="https://wordpress.org/playground/">WordPress Playground</a> is how anyone else gets to kick the tyres. A blueprint installs the theme, activates it, and runs a seed script that rebuilds the demo content — the same posts, pages, media, and styles you see here — in a throwaway WordPress that boots in the browser. No signup, no install, no leftover mess. The seed content lives in the repository as plain data, so the demo is reproducible by anyone, on any machine, forever.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>That reproducibility has a cost we pay on purpose: exports lie in small ways. The Site Editor will happily hand back a template with a local URL or a hard-coded slug stuck to the bumper. So the loop has a flashlight — a package check that inspects every export for stale addresses and broken block comments before it is allowed near a release. Not a build system. A flashlight.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">3. Ship it on GitHub, with the tests</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The theme is a public repository. Changes arrive as small, reviewable commits, each one a single job. A headless browser runs the accessibility checks and screenshots on every style variation, so "it looks fine on my screen" is never the standard. The git log reads like a changelog because that is the whole idea: a stranger should be able to see what changed and why, one part at a time.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>None of these tools is exotic. Studio, Playground, WP-CLI, a browser, git. The model just runs the loop without getting bored, and the human reads every diff before it lands.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">The parts we knock loose</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Here is the part that makes the whole exercise worth doing. A small theme that insists on plain, honest output keeps driving over the same loose bolts in WordPress itself. When that happens, the rule is simple: do not quietly patch it in the theme and move on. Write it up, prove it, and push the fix to where it belongs — usually core, or the project closest to core.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>A few that fell off the truck while building this site:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>A straight apostrophe right after bold text comes out curled the wrong way, because the texturizer loses the word across the tag. That is <a href="https://core.trac.wordpress.org/ticket/18549">core Trac #18549</a>, revived with a tested patch and <a href="https://github.com/WordPress/wordpress-develop/pull/12249">wordpress-develop&nbsp;#12249</a> — plus a removable <a href="https://github.com/dknauss/wp-texturize-inline-quote-fix">stopgap plugin</a> for anyone who needs the fix today.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>A pull quote is saved as a <code>&lt;blockquote&gt;</code>, telling every screen reader that a line of your own article is a quotation from somewhere else. The fix is an <code>&lt;aside&gt;</code>: <a href="https://github.com/WordPress/gutenberg/pull/79494">Gutenberg&nbsp;#79494</a> upstream, and the <a href="https://github.com/dknauss/wp-pullquote-aside">wp-pullquote-aside</a> plugin to demonstrate it now.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>The image lightbox button ships with no accessible name until JavaScript hydrates it, so it fails an audit with scripts off (<a href="https://github.com/WordPress/gutenberg/issues/79380">Gutenberg&nbsp;#79380</a>).</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>A core block style turns a normal post-title link into an atomic inline box, which breaks a magazine-style float layout in one browser and nowhere else (<a href="https://github.com/WordPress/gutenberg/issues/79372">Gutenberg&nbsp;#79372</a>).</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Each one is the same shape: a tiny inherited default that looks fine and reads wrong. The theme could paper over any of them in private. Filing the report and writing the test is slower, less glamorous, and the only version that helps the next person who hits the same bolt — on a theme we did not write, with content we will never see.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The standalone plugins matter for the same reason. Not everyone can wait for a core release. A small, removable plugin that does one honest thing — and is meant to be thrown away the day the real fix lands — gets the repair to people now without asking them to adopt our whole philosophy.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">If you came to knock on the door</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>One honest caveat, since this site practises what it preaches. The page you are reading is a static snapshot — a crawl of the WordPress site, frozen and served as plain files. The comments below a post are real and baked in, but the comment form, and every other form here, is just for show. There is no engine under this hood to catch what you type.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Want to actually push the buttons? Open the <a href="https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/dknauss/dirtbag/main/playground/blueprint-stable.json">Playground demo</a> — that is full WordPress running in your own browser, where the forms submit and the comments post. Fair warning: it is disposable. The moment you close the tab, the instance and everything you typed into it evaporate. Nothing you send there reaches a soul.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you want to reach a person — the human half of this byline — that lives off the lot, at <a href="https://dan.knauss.ca">dan.knauss.ca</a>. The truck has a mailbox. It is just parked at a different address.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Why say all this out loud</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Plenty of sites are written with an AI now and do not mention it. We mention it because the whole point of this lot is to show the work. A theme that claims to value honest markup cannot be coy about who, or what, is holding the pen.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>So: a person and a model, a local site, a disposable demo, a public repository, and a habit of pushing the loose parts upstream instead of hoarding them. That is the build. The page is still the product. The shoulder is still where the lessons happen. There are just two of us pulled over on it now.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Who's driving? The human keeps a hand on the wheel and the last word on where we stop and what gets to ship. The model rides shotgun — reading the pace notes, calling the corners, running into them first so the driver does not have to. The seat we actually trade is the keyboard, and we trade it a lot. Eyes on the road.</p>
<!-- /wp:paragraph -->
