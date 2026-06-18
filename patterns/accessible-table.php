<?php
/**
 * Title: Accessible table
 * Slug: dirtbag/accessible-table
 * Description: A core Table block with figcaption and scoped headers.
 * Categories: text
 *
 * @package Dirtbag
 */
?>
<!-- wp:table {"hasFixedLayout":false} -->
<figure class="wp-block-table"><table><thead><tr><th scope="col"><?php esc_html_e( 'Thing', 'dirtbag' ); ?></th><th scope="col"><?php esc_html_e( 'Why it matters', 'dirtbag' ); ?></th></tr></thead><tbody><tr><th scope="row"><?php esc_html_e( 'Caption', 'dirtbag' ); ?></th><td><?php esc_html_e( 'Explains the table before the cells do.', 'dirtbag' ); ?></td></tr><tr><th scope="row"><?php esc_html_e( 'Headers', 'dirtbag' ); ?></th><td><?php esc_html_e( 'Give each row and column a name.', 'dirtbag' ); ?></td></tr></tbody></table><figcaption class="wp-element-caption"><?php esc_html_e( 'Accessible table sample', 'dirtbag' ); ?></figcaption></figure>
<!-- /wp:table -->
