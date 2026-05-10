/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { STATUS_ICONS, STATUS_ACCESSIBLE_TEXT } from './constants';

export default function save( { attributes } ) {
	const {
		featureColumnLabel,
		columns,
		rows,
		caption,
		highlightedColumn,
		showFeatureColumnHeader,
	} = attributes;

	if ( ! columns?.length ) {
		return null;
	}

	const colorProps = getColorClassesAndStyles( attributes );
	const borderProps = getBorderClassesAndStyles( attributes );
	const hasCaption = ! RichText.isEmpty( caption );

	return (
		<figure { ...useBlockProps.save() }>
			<div className="wp-block-feature-comparison-table__scroll-wrapper">
				<table
					className={ clsx(
						'wp-block-feature-comparison-table__table',
						colorProps.className,
						borderProps.className
					) }
					style={ { ...colorProps.style, ...borderProps.style } }
				>
					<thead>
						<tr>
							{ showFeatureColumnHeader ? (
								<th
									className="wp-block-feature-comparison-table__feature-header"
									scope="col"
								>
									<span>{ featureColumnLabel }</span>
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
												highlightedColumn === colIndex,
										}
									) }
								>
									<RichText.Content
										tagName="span"
										value={ colLabel }
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
								<td className="wp-block-feature-comparison-table__feature-label">
									<RichText.Content
										tagName="span"
										value={ row.featureLabel }
									/>
								</td>
								{ row.cells.map( ( cell, colIndex ) => {
									const icon =
										STATUS_ICONS[ cell.status ] ||
										STATUS_ICONS.supported;
									const accessibleText =
										STATUS_ACCESSIBLE_TEXT[ cell.status ] ||
										STATUS_ACCESSIBLE_TEXT.supported;
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
												}
											) }
											data-status={ cell.status }
										>
											<span
												className="wp-block-feature-comparison-table__symbol"
												aria-hidden="true"
											>
												{ icon }
											</span>
											<span className="wp-block-feature-comparison-table__status-text">
												{ accessibleText }
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
			{ hasCaption && (
				<RichText.Content
					tagName="figcaption"
					className={ __experimentalGetElementClassName( 'caption' ) }
					value={ caption }
				/>
			) }
		</figure>
	);
}
