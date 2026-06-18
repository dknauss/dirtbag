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
<!-- wp:html -->
<section class="h-card" aria-label="<?php esc_attr_e( 'Site identity', 'dirtbag' ); ?>">
<p><img class="u-photo" src="/wp-content/themes/dirtbag/assets/icons/pickup-truck.svg" alt="" width="96" height="96"></p>
<p><strong class="p-name"><?php esc_html_e( 'Dirtbag', 'dirtbag' ); ?></strong></p>
<p class="p-note"><?php esc_html_e( 'A small site for HTML, blocks, road grit, and plain old links.', 'dirtbag' ); ?></p>
<p><a class="u-url u-uid" href="/"><?php esc_html_e( 'Home', 'dirtbag' ); ?></a></p>
</section>
<!-- /wp:html -->
