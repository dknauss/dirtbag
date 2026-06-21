<?php
/**
 * Plugin Name: wptexturize Historic Inline Quote Compat
 * Description: Prototype rendered-content workaround for Core Trac #18549 historical inline-tag quote cases.
 * Version: 0.1.0
 * Author: Dan Knauss
 * License: GPL-2.0-or-later
 *
 * This is a prototype compatibility plugin, not the preferred fix. The preferred
 * fix belongs in WordPress core's wptexturize() implementation. See:
 * https://core.trac.wordpress.org/ticket/18549
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Fix common #18549 rendered output after wptexturize() has run.
 *
 * This intentionally mirrors the bounded modern core patch rather than the old
 * 4.7-era replacement-engine patch. It fixes an opening quote immediately after
 * a closing inline tag when it is followed by punctuation including Unicode punctuation, whitespace,
 * an entity such as an ellipsis, a closing HTML tag, or an alphanumeric continuation.
 *
 * The character class intentionally excludes `]` to avoid changing existing
 * shortcode-attribute edge behavior covered by WordPress core's "crazy" shortcode
 * texturize fixture.
 *
 * @param string $text Rendered text.
 * @return string Adjusted rendered text.
 */
function dk_wptexturize_18549_historic_fix_inline_quotes( $text ) {
	if ( ! is_string( $text ) || '' === $text ) {
		return $text;
	}

	$inline_tags = 'a|abbr|b|bdi|bdo|cite|data|del|dfn|em|i|ins|label|mark|q|s|samp|small|span|strong|sub|sup|time|u|var';
	$after_quote = '(?=(?:<\/[a-z][a-z0-9]*\s*>|&#8230;|[\p{L}\p{N}\p{Po}\p{Pf}\s.,;:!?\)\}\-&]|$))';

	$text = preg_replace(
		'/<\/(?:' . $inline_tags . ')>\K&#8220;' . $after_quote . '/iu',
		'&#8221;',
		$text
	);

	return preg_replace(
		'/<\/(?:' . $inline_tags . ')>\K&#8216;' . $after_quote . '/iu',
		'&#8217;',
		$text
	);
}

$dk_wptexturize_18549_historic_filters = array(
	'comment_text',
	'term_description',
	'the_content',
	'the_excerpt',
	'the_excerpt_embed',
	'the_title',
	'widget_text',
);

foreach ( $dk_wptexturize_18549_historic_filters as $dk_wptexturize_18549_historic_filter ) {
	add_filter( $dk_wptexturize_18549_historic_filter, 'dk_wptexturize_18549_historic_fix_inline_quotes', 12 );
}
unset( $dk_wptexturize_18549_historic_filter, $dk_wptexturize_18549_historic_filters );
