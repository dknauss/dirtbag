<?php
/**
 * Title: Colophon
 * Slug: dirtbag/colophon
 * Description: Theme credits and operating principles.
 * Categories: text
 *
 * @package Dirtbag
 */
?>
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Colophon', 'dirtbag' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p><?php esc_html_e( 'This site runs Dirtbag, a block theme that prefers plain HTML, native browser behaviour, WordPress core blocks, and no JavaScript unless the job is real.', 'dirtbag' ); ?></p>
<!-- /wp:paragraph -->
<!-- wp:list -->
<ul><li><?php echo wp_kses_post( __( 'Typography scale informed by <a href="https://practicaltypography.com/">Butterick’s Practical Typography</a>.', 'dirtbag' ) ); ?></li><li><?php esc_html_e( 'Truck icon is CC0 from SVG Repo.', 'dirtbag' ); ?></li><li><?php esc_html_e( 'Feeds, sitemaps, OPML, XFN links, and microformats are part of the road kit.', 'dirtbag' ); ?></li></ul>
<!-- /wp:list -->
