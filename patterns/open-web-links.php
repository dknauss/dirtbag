<?php
/**
 * Title: Open web links
 * Slug: dirtbag/open-web-links
 * Description: Visible feeds, sitemap, and open-web links.
 * Categories: text
 *
 * @package Dirtbag
 */

?>
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Open web doors', 'dirtbag' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:list -->
<ul><!-- wp:list-item -->
<li><a href="/feed/" type="application/rss+xml"><?php esc_html_e( 'Posts RSS', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="/comments/feed/" type="application/rss+xml"><?php esc_html_e( 'Comments RSS', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="/wp-sitemap.xml"><?php esc_html_e( 'Sitemap', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="/links/"><?php esc_html_e( 'Links page', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="/now/"><?php esc_html_e( 'Now page', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="/colophon/"><?php esc_html_e( 'Colophon', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
