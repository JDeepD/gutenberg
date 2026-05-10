/**
 * WordPress dependencies
 */
import { check, closeSmall, reset } from '@wordpress/icons';

export const STATUS_ICONS = {
	supported: check,
	partial: reset,
	unsupported: closeSmall,
};

// Capitalised for readability in screen-reader output; intentionally not
// translated to keep the markup language-stable.
export const STATUS_ACCESSIBLE_TEXT = {
	supported: 'Supported',
	partial: 'Partial support',
	unsupported: 'Not supported',
};
