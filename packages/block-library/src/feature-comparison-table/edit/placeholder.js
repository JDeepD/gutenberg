/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, Placeholder, TextControl } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { grid as gridIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { buildInitialAttributes } from '../state';

export default function FeatureComparisonPlaceholder( { setAttributes } ) {
	const [ initialColumnCount, setInitialColumnCount ] = useState( 2 );
	const [ initialRowCount, setInitialRowCount ] = useState( 3 );

	function onCreateTable( event ) {
		event.preventDefault();
		setAttributes(
			buildInitialAttributes( {
				rowCount: Math.max( 1, parseInt( initialRowCount, 10 ) || 3 ),
				columnCount: Math.max(
					1,
					parseInt( initialColumnCount, 10 ) || 2
				),
			} )
		);
	}

	return (
		<Placeholder
			label={ __( 'Feature Comparison Table' ) }
			icon={ <BlockIcon icon={ gridIcon } showColors /> }
			instructions={ __(
				'Create a table to compare features across plans or products.'
			) }
		>
			<form
				className="wp-block-feature-comparison-table__placeholder-form"
				onSubmit={ onCreateTable }
			>
				<TextControl
					__next40pxDefaultSize
					type="number"
					label={ __( 'Number of columns' ) }
					value={ initialColumnCount }
					onChange={ setInitialColumnCount }
					min="1"
					max="10"
				/>
				<TextControl
					__next40pxDefaultSize
					type="number"
					label={ __( 'Number of rows' ) }
					value={ initialRowCount }
					onChange={ setInitialRowCount }
					min="1"
					max="50"
				/>
				<Button __next40pxDefaultSize variant="primary" type="submit">
					{ __( 'Create table' ) }
				</Button>
			</form>
		</Placeholder>
	);
}
