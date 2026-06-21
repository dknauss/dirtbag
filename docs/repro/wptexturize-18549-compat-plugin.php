<?php
/**
 * Plugin Name: wptexturize Inline Apostrophe Compat
 * Description: Narrow compatibility workaround for Core Trac #18549: fixes apostrophes immediately after inline formatting tags after wptexturize() runs.
 * Version: 0.1.0
 * Author: Dan Knauss
 * License: GPL-2.0-or-later
 *
 * This is a workaround, not the preferred fix. The preferred fix belongs in
 * WordPress core's wptexturize() implementation. See:
 * https://core.trac.wordpress.org/ticket/18549
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adds temporary markers before wptexturize() sees apostrophes after inline tags.
 *
 * @param string $text Input text.
 * @return string Text with temporary markers.
 */
function dk_wptexturize_18549_mark_inline_apostrophes( $text ) {
	if ( ! is_string( $text ) || '' === $text || false === strpos( $text, "'" ) ) {
		return $text;
	}

	$inline_tags = 'a|abbr|b|bdi|bdo|cite|data|del|dfn|em|i|ins|label|mark|q|s|samp|small|span|strong|sub|sup|time|u|var';

	return preg_replace(
		'/((?:[\p{L}\p{N}]|&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);)<\/(?:' . $inline_tags . ')>)\'(?=[\p{L}\p{N}])/iu',
		'$1<!--dk-wptexturize-18549-apos-->',
		$text
	);
}

/**
 * Replaces temporary markers with the typographic apostrophe after wptexturize().
 *
 * @param string $text Input text.
 * @return string Text with restored apostrophes.
 */
function dk_wptexturize_18549_unmark_inline_apostrophes( $text ) {
	if ( ! is_string( $text ) || '' === $text ) {
		return $text;
	}

	return str_replace( '<!--dk-wptexturize-18549-apos-->', '&#8217;', $text );
}

$dk_wptexturize_18549_filters = array(
	'comment_text',
	'term_description',
	'the_content',
	'the_excerpt',
	'the_excerpt_embed',
	'the_title',
	'widget_text',
);

foreach ( $dk_wptexturize_18549_filters as $dk_wptexturize_18549_filter ) {
	add_filter( $dk_wptexturize_18549_filter, 'dk_wptexturize_18549_mark_inline_apostrophes', 9 );
	add_filter( $dk_wptexturize_18549_filter, 'dk_wptexturize_18549_unmark_inline_apostrophes', 11 );
}
unset( $dk_wptexturize_18549_filter, $dk_wptexturize_18549_filters );
