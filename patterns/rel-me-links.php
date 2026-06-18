<?php
/**
 * Title: rel-me links
 * Slug: dirtbag/rel-me-links
 * Description: Identity links using rel=me.
 * Categories: text
 *
 * @package Dirtbag
 */
?>
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Elsewhere', 'dirtbag' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:html -->
<ul>
<li><a href="https://github.com/" rel="me"><?php esc_html_e( 'GitHub', 'dirtbag' ); ?></a></li>
<li><a href="https://mastodon.social/" rel="me"><?php esc_html_e( 'Mastodon', 'dirtbag' ); ?></a></li>
<li><a href="mailto:hello@example.com" rel="me"><?php esc_html_e( 'Email', 'dirtbag' ); ?></a></li>
</ul>
<!-- /wp:html -->
