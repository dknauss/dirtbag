<?php
/**
 * Title: Byline
 * Slug: dirtbag/byline
 * Description: Translatable author byline (h-card) for use inside post loops and single posts.
 * Inserter: no
 *
 * @package Dirtbag
 */

?>
<!-- wp:group {"className":"byline p-author h-card","style":{"spacing":{"blockGap":"0"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group byline p-author h-card"><!-- wp:paragraph {"className":"byline-prefix"} -->
<p class="byline-prefix"><?php esc_html_e( 'From', 'dirtbag' ); ?>&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:post-author-name {"isLink":true,"className":"p-name"} /-->

<!-- wp:paragraph {"className":"byline-suffix"} -->
<p class="byline-suffix"><?php esc_html_e( '’s dashboard', 'dirtbag' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
