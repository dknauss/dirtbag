<?php
/**
 * Title: h-card profile
 * Slug: dirtbag/h-card-profile
 * Description: A plain IndieWeb h-card identity block.
 * Categories: text
 *
 * @package Dirtbag
 */

?>
<!-- wp:group {"className":"h-card"} -->
<div class="wp-block-group h-card"><!-- wp:image {"width":"96px","height":"96px","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"u-photo"} -->
<figure class="wp-block-image size-full is-resized u-photo"><img src="/wp-content/themes/dirtbag/assets/icons/pickup-truck.svg" alt="" style="object-fit:cover;width:96px;height:96px"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p><strong class="p-name"><?php esc_html_e( 'Dirtbag', 'dirtbag' ); ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"p-note"} -->
<p class="p-note"><?php esc_html_e( 'A small site for HTML, blocks, road grit, and plain old links.', 'dirtbag' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a class="u-url u-uid" href="/"><?php esc_html_e( 'Home', 'dirtbag' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
