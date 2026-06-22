<?php
/**
 * Block Bindings API additions for WordPress 7.1.
 *
 * @since 7.1.0
 * @package gutenberg
 * @subpackage Block Bindings
 */

// The following filter can be removed once the minimum required WordPress version is 7.1 or newer.
add_filter(
	'block_bindings_supported_attributes',
	function ( $attributes, $block_type ) {
		if ( 'core/post-date' === $block_type && ! in_array( 'isLink', $attributes, true ) ) {
			$attributes[] = 'isLink';
		}
		return $attributes;
	},
	10,
	2
);
