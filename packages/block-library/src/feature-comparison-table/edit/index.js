/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import {
	BlockControls,
	RichText,
	useBlockProps,
	useBlockEditingMode,
	useSettings,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import { Icon, ToolbarDropdownMenu } from '@wordpress/components';
import {
	tableRowAfter,
	tableRowBefore,
	tableRowDelete,
	tableColumnAfter,
	tableColumnBefore,
	tableColumnDelete,
	table as tableIcon,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { STATUS_ICONS } from '../constants';
import {
	deleteColumn,
	deleteRow,
	getUpdatedHighlightAfterDelete,
	insertColumn,
	insertRow,
	updateCell,
	updateColumnLabel,
	updateFeatureLabel,
} from '../state';
import FeatureComparisonInspectorControls from './inspector-controls';
import FeatureComparisonPlaceholder from './placeholder';
import CellPopover from './cell-popover';

export default function FeatureComparisonTableEdit( {
	attributes,
	setAttributes,
	isSelected: isSingleSelected,
} ) {
	const {
		featureColumnLabel,
		columns,
		rows,
		caption,
		highlightedColumn,
		showFeatureColumnHeader,
	} = attributes;

	const [ selectedCell, setSelectedCell ] = useState( null );
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );

	const colorProps = useColorProps( attributes );
	const borderProps = useBorderProps( attributes );
	const blockEditingMode = useBlockEditingMode();
	const [ themeColors ] = useSettings( 'color.palette' );

	const isEmpty = ! columns.length;

	useEffect( () => {
		if ( ! isSingleSelected ) {
			setSelectedCell( null );
			setPopoverAnchor( null );
		}
	}, [ isSingleSelected ] );

	function clearSelection() {
		setSelectedCell( null );
		setPopoverAnchor( null );
	}

	function handleInsertRow( rowIndex ) {
		setAttributes( { rows: insertRow( rows, columns.length, rowIndex ) } );
		setSelectedCell( { type: 'feature', rowIndex, colIndex: null } );
	}

	function handleDeleteRow( rowIndex ) {
		if ( rows.length <= 1 ) {
			return;
		}
		setAttributes( { rows: deleteRow( rows, rowIndex ) } );
		clearSelection();
	}

	function handleInsertColumn( colIndex ) {
		setAttributes( insertColumn( columns, rows, colIndex ) );
	}

	function handleDeleteColumn( colIndex ) {
		if ( columns.length <= 1 ) {
			return;
		}
		setAttributes( {
			...deleteColumn( columns, rows, colIndex ),
			highlightedColumn: getUpdatedHighlightAfterDelete(
				highlightedColumn,
				colIndex
			),
		} );
		clearSelection();
	}

	const selectedRowIndex =
		selectedCell?.type === 'data' || selectedCell?.type === 'feature'
			? selectedCell.rowIndex
			: null;
	const selectedColIndex =
		selectedCell?.type === 'data' || selectedCell?.type === 'header'
			? selectedCell.colIndex
			: null;

	const tableControls = [
		{
			icon: tableRowBefore,
			title: __( 'Insert row before' ),
			isDisabled: selectedRowIndex === null,
			onClick: () => handleInsertRow( selectedRowIndex ),
		},
		{
			icon: tableRowAfter,
			title: __( 'Insert row after' ),
			isDisabled: selectedRowIndex === null,
			onClick: () => handleInsertRow( selectedRowIndex + 1 ),
		},
		{
			icon: tableRowDelete,
			title: __( 'Delete row' ),
			isDisabled: selectedRowIndex === null || rows.length <= 1,
			onClick: () => handleDeleteRow( selectedRowIndex ),
		},
		{
			icon: tableColumnBefore,
			title: __( 'Insert column before' ),
			isDisabled: selectedColIndex === null,
			onClick: () => handleInsertColumn( selectedColIndex ),
		},
		{
			icon: tableColumnAfter,
			title: __( 'Insert column after' ),
			isDisabled: selectedColIndex === null,
			onClick: () => handleInsertColumn( selectedColIndex + 1 ),
		},
		{
			icon: tableColumnDelete,
			title: __( 'Delete column' ),
			isDisabled: selectedColIndex === null || columns.length <= 1,
			onClick: () => handleDeleteColumn( selectedColIndex ),
		},
	];

	const selectedDataCell =
		selectedCell?.type === 'data' ? selectedCell : null;
	const activeCellData =
		selectedDataCell &&
		rows[ selectedDataCell.rowIndex ]?.cells[ selectedDataCell.colIndex ];

	return (
		<figure { ...useBlockProps() }>
			{ ! isEmpty && blockEditingMode === 'default' && (
				<>
					<BlockControls group="other">
						<ToolbarDropdownMenu
							icon={ tableIcon }
							label={ __( 'Edit table' ) }
							controls={ tableControls }
						/>
					</BlockControls>
					<FeatureComparisonInspectorControls
						columns={ columns }
						highlightedColumn={ highlightedColumn }
						showFeatureColumnHeader={ showFeatureColumnHeader }
						setAttributes={ setAttributes }
					/>
				</>
			) }

			{ isEmpty ? (
				<FeatureComparisonPlaceholder setAttributes={ setAttributes } />
			) : (
				<>
					<div className="wp-block-feature-comparison-table__scroll-wrapper">
						<table
							className={ clsx(
								'wp-block-feature-comparison-table__table',
								colorProps.className,
								borderProps.className
							) }
							style={ {
								...colorProps.style,
								...borderProps.style,
							} }
						>
							<thead>
								<tr>
									{ showFeatureColumnHeader ? (
										<th
											className="wp-block-feature-comparison-table__feature-header"
											scope="col"
											onClick={ clearSelection }
										>
											<RichText
												tagName="span"
												value={ featureColumnLabel }
												onChange={ ( value ) =>
													setAttributes( {
														featureColumnLabel:
															value,
													} )
												}
												placeholder={ __( 'Feature' ) }
												aria-label={ __(
													'Feature column header'
												) }
												allowedFormats={ [] }
											/>
										</th>
									) : (
										<th
											className="wp-block-feature-comparison-table__feature-header"
											scope="col"
											aria-hidden="true"
										/>
									) }
									{ columns.map( ( colLabel, colIndex ) => (
										<th
											key={ colIndex }
											scope="col"
											className={ clsx(
												'wp-block-feature-comparison-table__column-header',
												{
													'is-highlighted':
														highlightedColumn ===
														colIndex,
													'is-selected':
														selectedCell?.type ===
															'header' &&
														selectedCell.colIndex ===
															colIndex,
												}
											) }
											onClick={ () => {
												setSelectedCell( {
													type: 'header',
													rowIndex: null,
													colIndex,
												} );
												setPopoverAnchor( null );
											} }
										>
											<RichText
												tagName="span"
												value={ colLabel }
												onChange={ ( value ) =>
													setAttributes( {
														columns:
															updateColumnLabel(
																columns,
																colIndex,
																value
															),
													} )
												}
												placeholder={ sprintf(
													/* translators: %d: column number */
													__( 'Plan %d' ),
													colIndex + 1
												) }
												aria-label={ sprintf(
													/* translators: %d: column number */
													__( 'Column %d header' ),
													colIndex + 1
												) }
												allowedFormats={ [
													'core/bold',
													'core/italic',
												] }
											/>
										</th>
									) ) }
								</tr>
							</thead>
							<tbody>
								{ rows.map( ( row, rowIndex ) => (
									<tr
										key={ rowIndex }
										className="wp-block-feature-comparison-table__row"
									>
										<td
											className="wp-block-feature-comparison-table__feature-label"
											onClick={ () => {
												setSelectedCell( {
													type: 'feature',
													rowIndex,
													colIndex: null,
												} );
												setPopoverAnchor( null );
											} }
										>
											<RichText
												tagName="span"
												value={ row.featureLabel }
												onChange={ ( value ) =>
													setAttributes( {
														rows: updateFeatureLabel(
															rows,
															rowIndex,
															value
														),
													} )
												}
												placeholder={ __(
													'Feature name'
												) }
												aria-label={ sprintf(
													/* translators: %d: row number */
													__( 'Row %d feature name' ),
													rowIndex + 1
												) }
												allowedFormats={ [
													'core/bold',
													'core/italic',
												] }
											/>
										</td>
										{ row.cells.map( ( cell, colIndex ) => {
											const isThisCellSelected =
												selectedDataCell?.rowIndex ===
													rowIndex &&
												selectedDataCell?.colIndex ===
													colIndex;
											return (
												<td
													key={ colIndex }
													className={ clsx(
														'wp-block-feature-comparison-table__cell',
														`is-${ cell.status }`,
														{
															'is-highlighted':
																highlightedColumn ===
																colIndex,
															'is-selected':
																isThisCellSelected,
														}
													) }
													onClick={ ( e ) => {
														// Prevent links inside note text from navigating in the editor.
														if (
															e.target.closest(
																'a'
															)
														) {
															e.preventDefault();
														}
														if (
															isThisCellSelected
														) {
															clearSelection();
														} else {
															setSelectedCell( {
																type: 'data',
																rowIndex,
																colIndex,
															} );
															setPopoverAnchor(
																e.currentTarget
															);
														}
													} }
												>
													<span
														className="wp-block-feature-comparison-table__symbol"
														aria-hidden="true"
													>
														<Icon
															icon={
																STATUS_ICONS[
																	cell.status
																] ||
																STATUS_ICONS.supported
															}
														/>
													</span>
													{ cell.note && (
														<RichText.Content
															tagName="span"
															className="wp-block-feature-comparison-table__note"
															value={ cell.note }
															style={
																cell.noteColor
																	? {
																			color: cell.noteColor,
																	  }
																	: undefined
															}
														/>
													) }
												</td>
											);
										} ) }
									</tr>
								) ) }
							</tbody>
						</table>
					</div>

					{ selectedDataCell && popoverAnchor && activeCellData && (
						<CellPopover
							key={ `${ selectedDataCell.rowIndex }-${ selectedDataCell.colIndex }` }
							cell={ activeCellData }
							anchor={ popoverAnchor }
							themeColors={ themeColors }
							onClose={ clearSelection }
							onUpdateCell={ ( partial ) =>
								setAttributes( {
									rows: updateCell(
										rows,
										selectedDataCell.rowIndex,
										selectedDataCell.colIndex,
										partial
									),
								} )
							}
							onInsertRow={ ( offset ) =>
								handleInsertRow(
									selectedDataCell.rowIndex + offset
								)
							}
							onInsertColumn={ ( offset ) =>
								handleInsertColumn(
									selectedDataCell.colIndex + offset
								)
							}
						/>
					) }

					{ ( ! RichText.isEmpty( caption ) || isSingleSelected ) && (
						<RichText
							tagName="figcaption"
							className="wp-element-caption"
							aria-label={ __( 'Table caption text' ) }
							placeholder={ __( 'Add caption' ) }
							value={ caption }
							onChange={ ( value ) =>
								setAttributes( { caption: value } )
							}
							inlineToolbar
						/>
					) }
				</>
			) }
		</figure>
	);
}
