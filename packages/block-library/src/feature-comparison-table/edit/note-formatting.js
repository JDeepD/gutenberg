/**
 * WordPress dependencies
 */
import {
	create,
	toHTMLString,
	applyFormat,
	removeFormat,
} from '@wordpress/rich-text';

// core/underline serialises as <span style="…"> so its attributes must be
// supplied explicitly; other formats use semantic tags and need none.
const FORMAT_APPLY_ATTRIBUTES = {
	'core/underline': { style: 'text-decoration: underline;' },
};

export function isNoteFormatActive( noteHtml, formatType ) {
	const richValue = create( { html: noteHtml || '' } );
	return richValue.formats.some( ( charFormats ) =>
		charFormats?.some( ( f ) => f.type === formatType )
	);
}

export function toggleNoteFormat( noteHtml, formatType ) {
	const richValue = create( { html: noteHtml || '' } );
	if ( ! richValue.text.length ) {
		return null;
	}
	const isActive = richValue.formats.some( ( charFormats ) =>
		charFormats?.some( ( f ) => f.type === formatType )
	);
	let newValue;
	if ( isActive ) {
		newValue = removeFormat(
			richValue,
			formatType,
			0,
			richValue.text.length
		);
	} else {
		const formatSpec = { type: formatType };
		if ( FORMAT_APPLY_ATTRIBUTES[ formatType ] ) {
			formatSpec.attributes = FORMAT_APPLY_ATTRIBUTES[ formatType ];
		}
		newValue = applyFormat(
			{ ...richValue, start: 0, end: richValue.text.length },
			formatSpec
		);
	}
	return toHTMLString( { value: newValue } );
}

export function getNoteCurrentLink( noteHtml ) {
	const richValue = create( { html: noteHtml || '' } );
	for ( const charFormats of richValue.formats ) {
		if ( ! charFormats ) {
			continue;
		}
		const linkFormat = charFormats.find( ( f ) => f.type === 'core/link' );
		if ( linkFormat ) {
			return linkFormat.attributes?.url || '';
		}
	}
	return '';
}

export function applyNoteLink( noteHtml, url ) {
	const richValue = create( { html: noteHtml || '' } );
	if ( ! richValue.text.length ) {
		return null;
	}
	let newValue;
	if ( ! url ) {
		newValue = removeFormat(
			richValue,
			'core/link',
			0,
			richValue.text.length
		);
	} else {
		newValue = applyFormat(
			{ ...richValue, start: 0, end: richValue.text.length },
			{ type: 'core/link', attributes: { url } }
		);
	}
	return toHTMLString( { value: newValue } );
}
