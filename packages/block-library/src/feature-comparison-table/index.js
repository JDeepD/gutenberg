/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { blockTable as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import edit from './edit';
import metadata from './block.json';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	example: {
		attributes: {
			featureColumnLabel: __( 'Feature' ),
			columns: [ __( 'Pro' ), __( 'Max' ) ],
			rows: [
				{
					featureLabel: __( 'API access' ),
					cells: [
						{
							status: 'partial',
							note: __( '1,000 calls/month' ),
						},
						{ status: 'supported', note: '' },
					],
				},
				{
					featureLabel: __( 'Custom domain' ),
					cells: [
						{ status: 'supported', note: '' },
						{ status: 'supported', note: '' },
					],
				},
				{
					featureLabel: __( 'Priority support' ),
					cells: [
						{ status: 'unsupported', note: '' },
						{ status: 'supported', note: '' },
					],
				},
			],
			highlightedColumn: 1,
			showFeatureColumnHeader: true,
		},
		viewportWidth: 500,
	},
	edit,
	save,
};

export const init = () => initBlock( { name, metadata, settings } );
