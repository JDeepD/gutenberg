/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	SelectControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../utils/hooks';

export default function FeatureComparisonInspectorControls( {
	columns,
	highlightedColumn,
	showFeatureColumnHeader,
	setAttributes,
} ) {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Settings' ) }
				resetAll={ () => {
					setAttributes( {
						highlightedColumn: -1,
						showFeatureColumnHeader: true,
					} );
				} }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					hasValue={ () => ! showFeatureColumnHeader }
					label={ __( 'Feature column header' ) }
					onDeselect={ () =>
						setAttributes( { showFeatureColumnHeader: true } )
					}
					isShownByDefault
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Feature column header' ) }
						help={ __(
							'Show a header label above the feature names column.'
						) }
						checked={ showFeatureColumnHeader }
						onChange={ ( value ) =>
							setAttributes( {
								showFeatureColumnHeader: value,
							} )
						}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => highlightedColumn !== -1 }
					label={ __( 'Highlighted column' ) }
					onDeselect={ () =>
						setAttributes( { highlightedColumn: -1 } )
					}
					isShownByDefault
				>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Highlighted column' ) }
						help={ __( 'Visually emphasize a recommended plan.' ) }
						value={ highlightedColumn }
						options={ [
							{ label: __( 'None' ), value: -1 },
							...columns.map( ( col, i ) => ( {
								label:
									col ||
									sprintf(
										/* translators: %d: column number */
										__( 'Column %d' ),
										i + 1
									),
								value: i,
							} ) ),
						] }
						onChange={ ( value ) =>
							setAttributes( {
								highlightedColumn: parseInt( value, 10 ),
							} )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}
