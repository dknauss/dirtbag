<?php
/**
 * Dirtbag theme functions.
 *
 * Dirtbag is deliberately code-light: it ships no theme-authored JavaScript and
 * leans on core block templates. The only PHP behaviour lives here.
 *
 * @package Dirtbag
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'dirtbag_site_logo_fallback' ) ) {
	/**
	 * Show the bundled pickup-truck mark when no Site Logo has been set.
	 *
	 * The header uses the core Site Logo block, which renders nothing on the
	 * front end until a logo is uploaded — so a fresh install (or the generic
	 * WordPress.org directory preview, which never runs the theme's demo seed)
	 * falls back to the plain site title. This filter fills that gap with the
	 * theme's own SVG truck, sized to the block's width and wrapped in the same
	 * markup core uses, so existing styles (including the dark-mode icon filter)
	 * apply unchanged.
	 *
	 * It only acts when the site has no logo of its own: an uploaded Site Logo,
	 * or a Site Icon when the block is set to sync with it, both take precedence.
	 *
	 * @param string $block_content Rendered block HTML.
	 * @param array  $block         Parsed block, including attributes.
	 * @return string Original content, or the truck fallback when no logo is set.
	 */
	function dirtbag_site_logo_fallback( $block_content, $block ) {
		if ( empty( $block['blockName'] ) || 'core/site-logo' !== $block['blockName'] ) {
			return $block_content;
		}

		// A real Site Logo wins.
		if ( get_theme_mod( 'custom_logo' ) ) {
			return $block_content;
		}

		$attrs = isset( $block['attrs'] ) ? $block['attrs'] : array();

		// A synced Site Icon also wins, since core renders it as the logo.
		if ( ! empty( $attrs['shouldSyncIcon'] ) && get_option( 'site_icon' ) ) {
			return $block_content;
		}

		$src = get_theme_file_uri( 'assets/icons/pickup-truck-header.svg' );
		if ( ! is_readable( get_theme_file_path( 'assets/icons/pickup-truck-header.svg' ) ) ) {
			return $block_content;
		}

		$width      = isset( $attrs['width'] ) ? (int) $attrs['width'] : 0;
		$is_link    = ! isset( $attrs['isLink'] ) || $block['attrs']['isLink'];
		$wrap_class = 'wp-block-site-logo';
		if ( ! empty( $attrs['className'] ) ) {
			$wrap_class .= ' ' . $attrs['className'];
		}

		$img = sprintf(
			'<img class="custom-logo" src="%1$s" alt="%2$s"%3$s decoding="async" />',
			esc_url( $src ),
			esc_attr( get_bloginfo( 'name', 'display' ) ),
			$width ? ' width="' . $width . '"' : ''
		);

		if ( $is_link ) {
			$img = sprintf(
				'<a href="%1$s" class="custom-logo-link" rel="home">%2$s</a>',
				esc_url( home_url( '/' ) ),
				$img
			);
		}

		return sprintf( '<div class="%1$s">%2$s</div>', esc_attr( $wrap_class ), $img );
	}
}
add_filter( 'render_block', 'dirtbag_site_logo_fallback', 10, 2 );
