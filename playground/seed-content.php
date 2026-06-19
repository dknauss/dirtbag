<?php
/**
 * Seed the WordPress Playground preview with Dirtbag demo content.
 *
 * This file is not loaded by the theme at runtime. The Playground blueprints
 * include it once after installing and activating the theme.
 *
 * @package Dirtbag
 */

if ( ! function_exists( 'dirtbag_playground_seed_content' ) ) {
	/**
	 * Import demo content copied from the local Dirtbag Studio site.
	 */
	function dirtbag_playground_seed_content() {
		$data = json_decode( file_get_contents( __DIR__ . '/seed-content.json' ), true );
		if ( ! is_array( $data ) ) {
			return;
		}

		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
		}

		foreach ( $data['options'] as $option_name => $option_value ) {
			update_option( $option_name, $option_value );
		}

		$author_ids     = dirtbag_playground_seed_users( $data['users'] );
		$attachment_ids = dirtbag_playground_seed_media( $data['attachments'] );
		dirtbag_playground_seed_terms( $data['terms'] );
		dirtbag_playground_seed_posts( $data['posts'], $author_ids, $attachment_ids );
		dirtbag_playground_seed_site_icon();

		// Regenerate permalink rules so freshly seeded pages (archive, search,
		// etc.) resolve on the first pretty-permalink request.
		flush_rewrite_rules( false );
	}
}

if ( ! function_exists( 'dirtbag_playground_seed_users' ) ) {
	/**
	 * Create or update preview users.
	 *
	 * @param array $users Users.
	 * @return array Login to user ID map.
	 */
	function dirtbag_playground_seed_users( $users ) {
		$author_ids = array();
		foreach ( $users as $user ) {
			$user_id = username_exists( $user['user_login'] );
			if ( ! $user_id ) {
				$user_id = wp_insert_user(
					array(
						'user_login'    => $user['user_login'],
						'user_pass'     => wp_generate_password( 24, true, true ),
						'user_email'    => $user['user_email'],
						'user_nicename' => $user['user_nicename'],
						'display_name'  => $user['display_name'],
						'user_url'      => $user['user_url'],
						'role'          => 'author',
					)
				);
			}
			if ( ! is_wp_error( $user_id ) && $user_id ) {
				wp_update_user(
					array(
						'ID'           => $user_id,
						'display_name' => $user['display_name'],
						'user_url'     => $user['user_url'],
						'first_name'   => isset( $user['first_name'] ) ? $user['first_name'] : '',
						'last_name'    => isset( $user['last_name'] ) ? $user['last_name'] : '',
						'nickname'     => isset( $user['nickname'] ) ? $user['nickname'] : $user['display_name'],
						'description'  => isset( $user['description'] ) ? $user['description'] : '',
					)
				);
				$author_ids[ $user['user_login'] ] = (int) $user_id;
			}
		}
		$author_ids['admin'] = get_current_user_id() ? get_current_user_id() : 1;
		return $author_ids;
	}
}

if ( ! function_exists( 'dirtbag_playground_seed_terms' ) ) {
	/**
	 * Create categories and tags.
	 *
	 * @param array $terms Terms.
	 */
	function dirtbag_playground_seed_terms( $terms ) {
		foreach ( $terms as $term ) {
			$existing = get_term_by( 'slug', $term['slug'], $term['taxonomy'] );
			$args     = array(
				'slug'        => $term['slug'],
				'description' => $term['description'],
			);
			if ( $existing ) {
				wp_update_term( $existing->term_id, $term['taxonomy'], $args + array( 'name' => $term['name'] ) );
			} else {
				wp_insert_term( $term['name'], $term['taxonomy'], $args );
			}
		}
	}
}

if ( ! function_exists( 'dirtbag_playground_seed_media' ) ) {
	/**
	 * Import media from bundled Playground media.
	 *
	 * @param array $attachments Attachments keyed by old ID.
	 * @return array Old attachment ID to new attachment ID map.
	 */
	function dirtbag_playground_seed_media( $attachments ) {
		$attachment_ids = array();
		foreach ( $attachments as $old_id => $attachment ) {
			$existing = get_page_by_path( $attachment['post_name'], OBJECT, 'attachment' );
			if ( $existing ) {
				$attachment_ids[ $old_id ] = (int) $existing->ID;
				continue;
			}

			$source = get_theme_file_path( 'playground/media/' . $attachment['filename'] );
			if ( ! file_exists( $source ) ) {
				continue;
			}

			$upload = wp_upload_bits( $attachment['filename'], null, file_get_contents( $source ) );
			if ( ! empty( $upload['error'] ) ) {
				continue;
			}

			$filetype = wp_check_filetype( $upload['file'], null );
			$new_id   = wp_insert_attachment(
				array(
					'post_mime_type' => $filetype['type'],
					'post_title'     => $attachment['title'],
					'post_name'      => $attachment['post_name'],
					'post_excerpt'   => $attachment['caption'],
					'post_content'   => $attachment['description'],
					'post_status'    => 'inherit',
				),
				$upload['file']
			);

			if ( is_wp_error( $new_id ) || ! $new_id ) {
				continue;
			}

			$metadata = wp_generate_attachment_metadata( $new_id, $upload['file'] );
			wp_update_attachment_metadata( $new_id, $metadata );
			update_post_meta( $new_id, '_wp_attachment_image_alt', $attachment['alt'] );
			$attachment_ids[ $old_id ] = (int) $new_id;
		}
		return $attachment_ids;
	}
}

if ( ! function_exists( 'dirtbag_playground_seed_posts' ) ) {
	/**
	 * Create or update pages and posts.
	 *
	 * @param array $posts Posts.
	 * @param array $author_ids Author IDs.
	 * @param array $attachment_ids Attachment IDs.
	 */
	function dirtbag_playground_seed_posts( $posts, $author_ids, $attachment_ids ) {
		foreach ( array( 'hello-world', 'sample-page' ) as $slug ) {
			$existing = get_page_by_path( $slug, OBJECT, array( 'post', 'page' ) );
			if ( $existing ) {
				wp_delete_post( $existing->ID, true );
			}
		}

		foreach ( $posts as $post ) {
			$existing = get_page_by_path( $post['post_name'], OBJECT, $post['post_type'] );
			$postarr  = array(
				'post_author'       => isset( $author_ids[ $post['author_login'] ] ) ? $author_ids[ $post['author_login'] ] : 1,
				'post_date'         => $post['post_date'],
				'post_date_gmt'     => $post['post_date_gmt'],
				'post_content'      => $post['post_content'],
				'post_title'        => $post['post_title'],
				'post_excerpt'      => $post['post_excerpt'],
				'post_status'       => $post['post_status'],
				'post_name'         => $post['post_name'],
				'post_modified'     => $post['post_modified'],
				'post_modified_gmt' => $post['post_modified_gmt'],
				'post_parent'       => 0,
				'menu_order'        => (int) $post['menu_order'],
				'post_type'         => $post['post_type'],
			);
			if ( $existing ) {
				$postarr['ID'] = $existing->ID;
				$new_id        = wp_update_post( $postarr, true );
			} else {
				$new_id = wp_insert_post( $postarr, true );
			}

			if ( is_wp_error( $new_id ) || ! $new_id ) {
				continue;
			}

			if ( ! empty( $post['template'] ) ) {
				update_post_meta( $new_id, '_wp_page_template', $post['template'] );
			}

			if ( 'post' === $post['post_type'] ) {
				if ( ! empty( $post['terms']['category'] ) ) {
					wp_set_object_terms( $new_id, $post['terms']['category'], 'category', false );
				}
				if ( ! empty( $post['terms']['category'] ) && in_array( 'field-notes', (array) $post['terms']['category'], true ) ) {
					stick_post( $new_id );
				}
				if ( ! empty( $post['terms']['post_tag'] ) ) {
					wp_set_object_terms( $new_id, $post['terms']['post_tag'], 'post_tag', false );
				}
				if ( ! empty( $post['thumbnail_attachment_id'] ) && isset( $attachment_ids[ $post['thumbnail_attachment_id'] ] ) ) {
					set_post_thumbnail( $new_id, $attachment_ids[ $post['thumbnail_attachment_id'] ] );
				}
			}
		}
	}
}

if ( ! function_exists( 'dirtbag_playground_seed_site_icon' ) ) {
	/**
	 * Use the bundled truck icon for the site icon and custom logo.
	 */
	function dirtbag_playground_seed_site_icon() {
		$icon_path = get_theme_file_path( 'assets/icons/dirtbag-site-icon.png' );
		if ( ! file_exists( $icon_path ) ) {
			return;
		}

		$upload = wp_upload_bits( 'dirtbag-site-icon.png', null, file_get_contents( $icon_path ) );
		if ( ! empty( $upload['error'] ) ) {
			return;
		}

		$filetype      = wp_check_filetype( $upload['file'], null );
		$attachment_id = wp_insert_attachment(
			array(
				'post_mime_type' => $filetype['type'],
				'post_title'     => 'Dirtbag site icon',
				'post_content'   => '',
				'post_status'    => 'inherit',
			),
			$upload['file']
		);

		if ( is_wp_error( $attachment_id ) || ! $attachment_id ) {
			return;
		}

		$metadata = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
		wp_update_attachment_metadata( $attachment_id, $metadata );
		set_theme_mod( 'custom_logo', $attachment_id );
		update_option( 'site_icon', $attachment_id );
	}
}
