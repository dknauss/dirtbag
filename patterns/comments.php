<?php
/**
 * Title: Comments
 * Slug: dirtbag/comments
 * Description: Comments list, pagination, and comment form.
 * Categories: text
 *
 * @package Dirtbag
 */

?>
<!-- wp:comments {"className":"wp-block-comments-query-loop"} -->
<div class="wp-block-comments wp-block-comments-query-loop">
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Comments', 'dirtbag' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:comments-title {"level":3} /-->
<!-- wp:comment-template -->
<!-- wp:group {"className":"h-entry comment"} -->
<div class="wp-block-group h-entry comment"><!-- wp:avatar {"size":50,"className":"u-photo"} /-->
<!-- wp:comment-date {"className":"dt-published"} /-->
<!-- wp:comment-author-name {"className":"p-author h-card"} /-->
<!-- wp:comment-content {"className":"e-content"} /-->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group"><!-- wp:comment-edit-link /-->
<!-- wp:comment-reply-link /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->
<!-- /wp:comment-template -->
<!-- wp:comments-pagination {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<!-- wp:comments-pagination-previous /-->
<!-- wp:comments-pagination-numbers /-->
<!-- wp:comments-pagination-next /-->
<!-- /wp:comments-pagination -->
<!-- wp:post-comments-form /-->
</div>
<!-- /wp:comments -->
