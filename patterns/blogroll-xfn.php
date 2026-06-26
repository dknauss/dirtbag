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
<p><?php esc_html_e( 'Links are the road. Some are friends, some are neighbours, some are just good exits. Replace the example links below with your own, and set each rel value to describe the relationship.', 'dirtbag' ); ?></p>
<!-- /wp:paragraph -->
<!-- wp:list {"className":"xoxo blogroll"} -->
<ul class="xoxo blogroll"><!-- wp:list-item -->
<li><a href="https://example.com/" rel="friend met"><?php esc_html_e( 'A friend you have met', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="https://example.com/" rel="colleague met"><?php esc_html_e( 'A colleague you have met', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="https://example.com/" rel="muse"><?php esc_html_e( 'A site that inspires you', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item -->
<!-- wp:list-item -->
<li><a href="https://example.com/" rel="acquaintance"><?php esc_html_e( 'An acquaintance', 'dirtbag' ); ?></a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
