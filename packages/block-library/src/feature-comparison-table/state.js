/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

const DEFAULT_CELL = { status: 'supported', note: '', noteColor: '' };

export function createRow( columnCount ) {
	return {
		featureLabel: '',
		cells: Array.from( { length: columnCount }, () => ( {
			...DEFAULT_CELL,
		} ) ),
	};
}

export function buildInitialAttributes( { rowCount, columnCount } ) {
	return {
		featureColumnLabel: __( 'Feature' ),
		columns: Array.from( { length: columnCount }, ( _, i ) =>
			/* translators: %d: plan column number */
			sprintf( __( 'Plan %d' ), i + 1 )
		),
		rows: Array.from( { length: rowCount }, () =>
			createRow( columnCount )
		),
	};
}

export function updateColumnLabel( columns, colIndex, value ) {
	return columns.map( ( col, i ) => ( i === colIndex ? value : col ) );
}

export function updateFeatureLabel( rows, rowIndex, value ) {
	return rows.map( ( row, i ) =>
		i === rowIndex ? { ...row, featureLabel: value } : row
	);
}

export function updateCell( rows, rowIndex, colIndex, partial ) {
	return rows.map( ( row, ri ) => {
		if ( ri !== rowIndex ) {
			return row;
		}
		return {
			...row,
			cells: row.cells.map( ( cell, ci ) =>
				ci === colIndex ? { ...cell, ...partial } : cell
			),
		};
	} );
}

export function insertRow( rows, columnCount, rowIndex ) {
	const newRows = [ ...rows ];
	newRows.splice( rowIndex, 0, createRow( columnCount ) );
	return newRows;
}

export function deleteRow( rows, rowIndex ) {
	return rows.filter( ( _, i ) => i !== rowIndex );
}

export function insertColumn( columns, rows, colIndex ) {
	const newColumns = [ ...columns ];
	newColumns.splice(
		colIndex,
		0,
		/* translators: %d: plan column number */
		sprintf( __( 'Plan %d' ), colIndex + 1 )
	);
	const newRows = rows.map( ( row ) => {
		const newCells = [ ...row.cells ];
		newCells.splice( colIndex, 0, { ...DEFAULT_CELL } );
		return { ...row, cells: newCells };
	} );
	return { columns: newColumns, rows: newRows };
}

export function deleteColumn( columns, rows, colIndex ) {
	return {
		columns: columns.filter( ( _, i ) => i !== colIndex ),
		rows: rows.map( ( row ) => ( {
			...row,
			cells: row.cells.filter( ( _, i ) => i !== colIndex ),
		} ) ),
	};
}

export function getUpdatedHighlightAfterDelete(
	highlightedColumn,
	deletedColIndex
) {
	if ( highlightedColumn === deletedColIndex ) {
		return -1;
	}
	if ( highlightedColumn > deletedColIndex ) {
		return highlightedColumn - 1;
	}
	return highlightedColumn;
}
