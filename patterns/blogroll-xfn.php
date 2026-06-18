<?php
/**
 * Title: Blogroll with XFN
 * Slug: dirtbag/blogroll-xfn
 * Description: An old-web blogroll with XFN rel values.
 * Categories: text
 *
 * @package Dirtbag
 */

?>
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading"><?php esc_html_e( 'Blogroll', 'dirtbag' ); ?></h2>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p><?php esc_html_e( 'Links are the road. Some are friends, some are neighbours, some are just good exits.', 'dirtbag' ); ?></p>
<!-- /wp:paragraph -->
<!-- wp:list {"className":"xoxo blogroll"} -->
<ul class="xoxo blogroll"><!-- wp:list-item -->
<li><a href="https://indieweb.org/" rel="friend met colleague"><?php esc_html_e( 'IndieWeb', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="https://microformats.org/" rel="met colleague"><?php esc_html_e( 'Microformats', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="https://archive.org/" rel="muse"><?php esc_html_e( 'Internet Archive', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="https://textfiles.com/" rel="muse"><?php esc_html_e( 'TEXTFILES.COM', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
