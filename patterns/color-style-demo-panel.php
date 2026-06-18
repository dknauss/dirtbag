<?php
/**
 * Title: Colour style demo panel
 * Slug: dirtbag/color-style-demo-panel
 * Description: Plain section panel for previewing a colour style.
 * Categories: text
 *
 * @package Dirtbag
 */

?>
<!-- wp:group {"metadata":{"name":"Dirtbag colour panel"},"style":{"spacing":{"padding":{"top":"1em","right":"1em","bottom":"1em","left":"1em"},"margin":{"top":"1em","bottom":"1em"}},"border":{"width":"2px"}},"backgroundColor":"yellow","textColor":"black"} -->
<div class="wp-block-group has-black-color has-yellow-background-color has-text-color has-background" style="border-width:2px;margin-top:1em;margin-bottom:1em;padding-top:1em;padding-right:1em;padding-bottom:1em;padding-left:1em"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading"><?php esc_html_e( 'Dirtbag colour panel', 'dirtbag' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong><?php esc_html_e( 'Safety yellow, black type, visible links.', 'dirtbag' ); ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="/colour-styles/"><?php esc_html_e( 'See all colour styles', 'dirtbag' ); ?></a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
