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
<main id="main-content" class="wp-block-group"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Car Wheels on a Gravel Road</h1>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"width":"66.66%"} -->
<div class="wp-block-column" style="flex-basis:66.66%"><!-- wp:query {"queryId":0,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"only","inherit":false},"className":"h-feed","layout":{"type":"default"}} -->
<div class="wp-block-query h-feed"><!-- wp:post-template {"className":"h-entry","layout":{"type":"grid","columnCount":3}} -->
<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","width":"100%","sizeSlug":"medium_large","className":"u-featured","style":{"spacing":{"margin":{"top":"0","bottom":"1em"}}}} /-->

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
<div class="wp-block-column" style="flex-basis:33.33%"><!-- wp:heading -->
<h2 class="wp-block-heading">Used Cars and Unused Plans</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":1,"query":{"perPage":4,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"className":"h-feed","layout":{"type":"default"}} -->
<div class="wp-block-query h-feed"><!-- wp:post-template {"className":"h-entry"} -->
<!-- wp:group {"style":{"spacing":{"blockGap":"0.75em","margin":{"top":"0","bottom":"1.25em"}}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"top"}} -->
<div class="wp-block-group" style="margin-top:0;margin-bottom:1.25em"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1","width":"72px","scale":"cover","sizeSlug":"thumbnail","className":"u-featured","style":{"layout":{"selfStretch":"fixed","flexSize":"72px"}}} /-->

<!-- wp:group {"style":{"spacing":{"blockGap":"0.25em"}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group"><!-- wp:post-title {"isLink":true,"level":3,"className":"p-name","style":{"typography":{"fontSize":"18px","lineHeight":"1.25"}}} /-->

<!-- wp:post-date {"isLink":true,"className":"dt-published u-url","fontSize":"small"} /-->

<!-- wp:post-excerpt {"moreText":"(cont...)","fontSize":"small"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No posts yet.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:gallery {"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-default is-cropped"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/potluck-la-catholique.jpg" alt="Potluck dishes set out on a table indoors." class=""/><figcaption class="wp-element-caption">Potluck. Image: La.Catholique via Openverse/flickr, CC BY 2.0.</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/abandoned-rusty-ford-pickup-1024x768.jpg" alt="Abandoned rusty Ford pickup truck without a bed in a gravel driveway." class=""/><figcaption class="wp-element-caption">Abandoned rusty Ford pickup truck. Image: Jonathan Desrosiers via Openverse/wordpress.org/photos, CC0 1.0.</figcaption></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"is-style-default"} -->
<figure class="wp-block-image size-full is-style-default"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/local-chapter-hall-veterans-foreign.jpg" alt="American flag mural and Veterans Foreign Wars sign on a local chapter hall wall." class=""/><figcaption class="wp-element-caption">local chapter hall Veterans Foreign. Image: Carol M Highsmith via Openverse/rawpixel, CC0 1.0.</figcaption></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery --></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->
