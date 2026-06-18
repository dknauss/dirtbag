<?php
/**
 * Title: Open web links
 * Slug: dirtbag/open-web-links
 * Description: Visible feeds, sitemap, OPML, humans, and security links.
 * Categories: text
 *
 * @package Dirtbag
 */
?>
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Open web doors', 'dirtbag' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:html -->
<ul>
<li><a href="/feed/" type="application/rss+xml"><?php esc_html_e( 'Posts RSS', 'dirtbag' ); ?></a></li>
<li><a href="/comments/feed/" type="application/rss+xml"><?php esc_html_e( 'Comments RSS', 'dirtbag' ); ?></a></li>
<li><a href="/wp-sitemap.xml"><?php esc_html_e( 'Sitemap', 'dirtbag' ); ?></a></li>
<li><a href="/wp-content/themes/dirtbag/blogroll.opml" type="text/x-opml"><?php esc_html_e( 'Blogroll OPML', 'dirtbag' ); ?></a></li>
<li><a href="/llms.txt" type="text/markdown"><?php esc_html_e( 'llms.txt', 'dirtbag' ); ?></a></li>
<li><a href="/robots.txt" type="text/plain"><?php esc_html_e( 'robots.txt', 'dirtbag' ); ?></a></li>
<li><a href="/about.txt" type="text/plain"><?php esc_html_e( 'about.txt', 'dirtbag' ); ?></a></li>
<li><a href="/colophon.txt" type="text/plain"><?php esc_html_e( 'colophon.txt', 'dirtbag' ); ?></a></li>
<li><a href="/blogroll.txt" type="text/plain"><?php esc_html_e( 'blogroll.txt', 'dirtbag' ); ?></a></li>
<li><a href="/now.txt" type="text/plain"><?php esc_html_e( 'now.txt', 'dirtbag' ); ?></a></li>
<li><a href="/feeds.txt" type="text/plain"><?php esc_html_e( 'feeds.txt', 'dirtbag' ); ?></a></li>
<li><a href="/wp-content/themes/dirtbag/humans.txt" type="text/plain"><?php esc_html_e( 'humans.txt', 'dirtbag' ); ?></a></li>
<li><a href="/.well-known/security.txt" type="text/plain"><?php esc_html_e( 'security.txt', 'dirtbag' ); ?></a></li>
</ul>
<!-- /wp:html -->
