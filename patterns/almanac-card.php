<?php
/**
 * Title: Almanac card
 * Slug: dirtbag/almanac-card
 * Description: A small roadside-almanac card for the front-page sidebar — a saying for the road and a feed nudge.
 * Inserter: no
 *
 * @package Dirtbag
 */

?>
<!-- wp:group {"className":"almanac-card","style":{"border":{"width":"1px","style":"solid"},"spacing":{"blockGap":"0.4em","padding":{"top":"0.9em","right":"1em","bottom":"0.9em","left":"1em"},"margin":{"top":"0"}}}} -->
<div class="wp-block-group almanac-card" style="border-style:solid;border-width:1px;margin-top:0;padding-top:0.9em;padding-right:1em;padding-bottom:0.9em;padding-left:1em"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"22px"}}} -->
<h3 class="wp-block-heading" style="font-size:22px"><?php esc_html_e( 'The Almanac', 'dirtbag' ); ?></h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontStyle":"italic","fontSize":"15px"},"spacing":{"margin":{"top":"0","bottom":"0"}}}} -->
<p style="margin-top:0;margin-bottom:0;font-size:15px;font-style:italic"><?php esc_html_e( 'Saying for the road', 'dirtbag' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"18px"}}} -->
<p style="font-size:18px"><?php esc_html_e( '“A page that loads is worth two that buffer.”', 'dirtbag' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"15px"},"spacing":{"margin":{"bottom":"0"}}}} -->
<p style="margin-bottom:0;font-size:15px"><?php esc_html_e( 'Filed in the glovebox.', 'dirtbag' ); ?> <a href="/feeds/"><?php esc_html_e( 'Subscribe by feed', 'dirtbag' ); ?> &rarr;</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
