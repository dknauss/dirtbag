<?php
/**
 * Dirtbag → static export driver for Simply Static.
 *
 * Run via WP-CLI against a running site, e.g. from the Studio site directory:
 *
 *   SS_DEST_URL="https://dknauss.github.io/dirtbag" \
 *   SS_OUTPUT_DIR="/wordpress/wp-content/uploads/ss-export/" \
 *     studio wp eval-file /path/to/bin/static-export/export.php
 *
 * It (1) configures Simply Static for an absolute-URL rewrite to SS_DEST_URL,
 * (2) seeds the dynamic XML endpoints the crawler does not follow on its own
 * (RSS feeds + wp-sitemap*.xml), and (3) drives the export job to completion
 * synchronously — no reliance on the loopback WP-Cron dispatch, which is flaky
 * under WP-CLI. Run bin/static-export/supplement.sh afterwards for the feeds and
 * physical web-root files Simply Static still misses. See
 * docs/github-pages-static-export.md for the full runbook.
 *
 * Notes:
 * - Paths are resolved from PHP's point of view. Under WordPress Studio the web
 *   root is /wordpress, so SS_OUTPUT_DIR must be a /wordpress/... path even
 *   though it maps to ~/Studio/<site>/... on the host.
 * - Absolute (not relative) URLs are required so wp-sitemap.xml and the RSS
 *   feeds contain fully-qualified <loc>/<link> values and stay valid.
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	fwrite( STDERR, "This script must be run via WP-CLI (wp eval-file).\n" );
	exit( 1 );
}

use Simply_Static\Options;
use Simply_Static\Util;

if ( ! class_exists( Options::class ) ) {
	WP_CLI::error( 'Simply Static is not active. Install it first: wp plugin install simply-static --activate' );
}

$dest_url = rtrim( (string) getenv( 'SS_DEST_URL' ), '/' );
$out_dir  = (string) getenv( 'SS_OUTPUT_DIR' );

if ( '' === $dest_url || '' === $out_dir ) {
	WP_CLI::error( 'Set SS_DEST_URL and SS_OUTPUT_DIR environment variables.' );
}
$out_dir = trailingslashit( $out_dir );

// Split the destination into scheme + "host" (host may carry a subpath, e.g.
// "dknauss.github.io/dirtbag"); Options::get_destination_url() rejoins them.
$scheme = ( 0 === strpos( $dest_url, 'https://' ) ) ? 'https://' : 'http://';
$host   = preg_replace( '#^https?://#', '', $dest_url );

if ( ! is_dir( $out_dir ) ) {
	wp_mkdir_p( $out_dir );
}

$extra_urls = implode( "\n", array(
	home_url( '/wp-sitemap.xml' ),
	home_url( '/wp-sitemap-posts-post-1.xml' ),
	home_url( '/wp-sitemap-posts-page-1.xml' ),
	home_url( '/wp-sitemap-taxonomies-category-1.xml' ),
	home_url( '/wp-sitemap-taxonomies-post_tag-1.xml' ),
	home_url( '/wp-sitemap-users-1.xml' ),
) );

$opts = Options::instance();
$opts->set( 'destination_url_type', 'absolute' )
     ->set( 'destination_scheme', $scheme )
     ->set( 'destination_host', $host )
     ->set( 'delivery_method', 'local' )
     ->set( 'local_dir', $out_dir )
     ->set( 'clear_directory_before_export', true )
     ->set( 'force_replace_url', true )
     ->set( 'additional_urls', $extra_urls )
     ->set( 'debugging_mode', false )
     ->save();

WP_CLI::log( 'Origin:      ' . Util::origin_url() );
WP_CLI::log( 'Destination: ' . Options::reinstance()->get_destination_url() );
WP_CLI::log( 'Output dir:  ' . $out_dir );

// Build the task list for the local delivery method and drive each task to
// completion. A task->perform() returns true when done, a WP_Error on failure.
$task_list = apply_filters(
	'simplystatic.archive_creation_job.task_list',
	array(),
	$opts->get( 'delivery_method' )
);
WP_CLI::log( 'Tasks: ' . implode( ', ', $task_list ) );

$blog_id      = get_current_blog_id();
$archive_name = implode( '-', array( 'simply-static', $blog_id, time() ) );
$opts->set( 'archive_name', $archive_name )
     ->set( 'archive_status_messages', array() )
     ->set( 'archive_start_time', Util::formatted_datetime() )
     ->set( 'archive_end_time', null )
     ->set( 'generate_type', 'export' )
     ->set( 'zip_batch_offset', null )
     ->set( 'zip_total_files', null )
     ->set( 'zip_files', null )
     ->save();

Util::clear_transients();

foreach ( $task_list as $task_name ) {
	$class = apply_filters( 'simply_static_class_name', 'Simply_Static\\' . ucwords( $task_name ) . '_Task', $task_name );
	if ( ! class_exists( $class ) ) {
		WP_CLI::error( "Task class missing: $class" );
	}

	// Simply Static 3.7+ declares Fetch_Urls_Task::$archive_start_time as a
	// non-nullable string and assigns it from this option in the constructor;
	// an earlier task can blank it, so re-assert a value before each task is
	// constructed to avoid a TypeError on null.
	$opts->set( 'archive_start_time', $opts->get( 'archive_start_time' ) ?: Util::formatted_datetime() )->save();

	$guard = 0;
	do {
		$is_done = ( new $class() )->perform();
		if ( is_wp_error( $is_done ) ) {
			WP_CLI::error( "Task $task_name failed: " . $is_done->get_error_message() );
		}
		if ( ++$guard > 100000 ) {
			WP_CLI::error( "Task $task_name exceeded its iteration guard." );
		}
		// Heartbeat: emit output every iteration so the Studio WP-CLI bridge
		// (which aborts after ~120s of silence) stays alive on long tasks.
		if ( true !== $is_done ) {
			WP_CLI::log( sprintf( '  %s … %d', $task_name, $guard ) );
		}
	} while ( true !== $is_done );

	WP_CLI::log( sprintf( 'Done: %s (%d iterations)', $task_name, $guard ) );
}

$opts->set( 'archive_end_time', Util::formatted_datetime() )->save();

global $wpdb;
$pages = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}simply_static_pages" );
WP_CLI::success( "Export complete — $pages pages recorded in $out_dir" );
