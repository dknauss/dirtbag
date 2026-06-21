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

if ( ! function_exists( 'dirtbag_lightbox_trigger_label' ) ) {
	/**
	 * Give the core image lightbox trigger a static accessible name.
	 *
	 * Core renders the lightbox "enlarge" control as a bare
	 * <button class="lightbox-trigger"> with no text and only a runtime-bound
	 * aria-label (data-wp-bind--aria-label="state.thisImage.triggerButtonAriaLabel").
	 * With JavaScript off — or before the Interactivity API hydrates — the
	 * button therefore has no accessible name and fails the WCAG 4.1.2
	 * "button-name" check. Inject a plain, translatable aria-label so the
	 * control is named in the server-rendered HTML; core's script still
	 * replaces it with the image-specific label once it runs.
	 *
	 * This lets the lightbox stay enabled without tripping the gated
	 * accessibility suite (cf. the 0.1.5 h-card avatar, which instead disabled
	 * the lightbox for the same reason).
	 *
	 * @param string $block_content Rendered block HTML.
	 * @return string Block HTML with a named lightbox trigger.
	 */
	function dirtbag_lightbox_trigger_label( $block_content ) {
		if ( false === strpos( $block_content, 'lightbox-trigger' ) || ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $block_content;
		}
		$processor = new WP_HTML_Tag_Processor( $block_content );
		while ( $processor->next_tag() ) {
			if ( 'BUTTON' === $processor->get_tag()
				&& $processor->has_class( 'lightbox-trigger' )
				&& null === $processor->get_attribute( 'aria-label' )
			) {
				$processor->set_attribute( 'aria-label', __( 'Enlarge image', 'dirtbag' ) );
			}
		}
		return $processor->get_updated_html();
	}
}
// Run on render_block (not render_block_core/image): the lightbox button's
// markup is still in flux while the image block itself renders, but it is final
// HTML once an enclosing block (post-content, group) renders, so match it there.
add_filter( 'render_block', 'dirtbag_lightbox_trigger_label', 20 );
