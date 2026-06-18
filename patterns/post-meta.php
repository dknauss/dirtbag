<?php
/**
 * Title: Post meta
 * Slug: dirtbag/post-meta
 * Description: Date, author, categories, tags, and permalink.
 * Categories: text
 *
 * @package Dirtbag
 */

?>
<!-- wp:group {"className":"post-meta","layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group post-meta"><!-- wp:post-date {"className":"dt-published"} /-->
<!-- wp:group {"className":"byline p-author h-card","style":{"spacing":{"blockGap":"0"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group byline p-author h-card"><!-- wp:paragraph {"className":"byline-prefix"} -->
<p class="byline-prefix"><?php esc_html_e( 'From', 'dirtbag' ); ?>&nbsp;</p>
<!-- /wp:paragraph -->
<!-- wp:post-author-name {"isLink":true,"className":"p-name"} /-->
<!-- wp:paragraph {"className":"byline-suffix"} -->
<p class="byline-suffix"><?php esc_html_e( '’s dashboard', 'dirtbag' ); ?></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- wp:post-terms {"term":"category","prefix":"<?php echo esc_attr__( 'Filed under: ', 'dirtbag' ); ?>","className":"p-category"} /-->
<!-- wp:post-terms {"term":"post_tag","prefix":"<?php echo esc_attr__( 'From the glovebox: ', 'dirtbag' ); ?>","className":"p-category"} /--></div>
<!-- /wp:group -->
