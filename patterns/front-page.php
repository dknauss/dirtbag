<?php
/**
 * Title: front-page
 * Slug: dirtbag/front-page
 * Inserter: no
 *
 * @package Dirtbag
 */

?>
<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"tagName":"main","anchor":"main-content"} -->
<main id="main-content" class="wp-block-group"><!-- wp:columns {"verticalAlignment":null,"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"66.66%"} -->
<div class="wp-block-column" style="flex-basis:66.66%"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Roadside Almanac</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><em>Rural speed, shed talk, hard chirps, and the suspicion that a simple job should stay simple.</em></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"bottom","width":"33.33%"} -->
<div class="wp-block-column is-vertically-aligned-bottom" style="flex-basis:33.33%"><!-- wp:paragraph -->
<p>› <a href="/2026/06/15/plain-html-still-works/">Plain HTML still just works</a><br>› <a href="/2026/06/09/a-table-a-caption-and-a-cheap-folding-chair/">A Table, a Caption, and a Cheap Folding Chair</a><br>› <a href="/2026/06/10/no-build-step-just-keep-driving/">No Build Step, Just Keep Driving</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:columns {"align":"wide","className":"front-grid"} -->
<div class="wp-block-columns alignwide front-grid"><!-- wp:column {"width":"66.66%"} -->
<div class="wp-block-column" style="flex-basis:66.66%"><!-- wp:heading -->
<h2 class="wp-block-heading">Field Notes from the Shoulder</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":0,"query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"only","inherit":false},"className":"h-feed","layout":{"type":"default"}} -->
<div class="wp-block-query h-feed"><!-- wp:post-template {"className":"h-entry","layout":{"type":"grid","columnCount":3}} -->
<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","width":"100%","scale":"cover","sizeSlug":"medium_large","className":"u-featured","style":{"spacing":{"margin":{"top":"0","bottom":"0.75em"}}}} /-->

<!-- wp:post-title {"isLink":true,"level":3,"className":"p-name"} /-->

<!-- wp:group {"className":"post-meta","layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group post-meta"><!-- wp:post-date {"isLink":true,"className":"dt-published u-url"} /-->

<!-- wp:post-excerpt {"moreText":"(cont...)"} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No featured posts yet. Mark a post as sticky to feature it here.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"33.33%"} -->
<div class="wp-block-column" style="flex-basis:33.33%"><!-- wp:heading {"className":"sidebar-head"} -->
<h2 class="wp-block-heading sidebar-head">Used Cars &amp; Unused Plans</h2>
<!-- /wp:heading -->

<!-- wp:group {"className":"sidebar-content"} -->
<div class="wp-block-group sidebar-content"><!-- wp:query {"queryId":1,"query":{"perPage":4,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"className":"h-feed","layout":{"type":"default"}} -->
<div class="wp-block-query h-feed"><!-- wp:post-template {"className":"h-entry"} -->
<!-- wp:group {"className":"sidebar-entry","style":{"spacing":{"blockGap":"0.25em","margin":{"top":"0","bottom":"1.5em"}}}} -->
<div class="wp-block-group sidebar-entry" style="margin-top:0;margin-bottom:1.5em"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1","scale":"cover","sizeSlug":"thumbnail","className":"u-featured sidebar-thumb"} /-->

<!-- wp:post-title {"isLink":true,"level":3,"className":"p-name"} /-->

<!-- wp:post-date {"isLink":true,"className":"dt-published u-url"} /-->

<!-- wp:post-excerpt {"moreText":"(cont...)"} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No posts yet.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query -->

<!-- wp:pattern {"slug":"dirtbag/almanac-card"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
