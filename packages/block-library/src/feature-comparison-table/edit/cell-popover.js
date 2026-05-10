/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import {
	Button,
	ColorPalette,
	Icon,
	Popover,
	TextControl,
	Toolbar,
	ToolbarButton,
} from '@wordpress/components';
import {
	formatBold,
	formatItalic,
	formatUnderline,
	link as linkIcon,
	tableRowAfter,
	tableRowBefore,
	tableColumnAfter,
	tableColumnBefore,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { STATUS_ICONS } from '../constants';
import {
	applyNoteLink,
	getNoteCurrentLink,
	isNoteFormatActive,
	toggleNoteFormat,
} from './note-formatting';

// Status colours mirror style.scss so buttons in the editor popover show the
// same colours as the rendered symbols, regardless of the admin theme colour.
const STATUSES = [
	{ value: 'supported', label: __( 'Supported' ), color: '#00a32a' },
	{ value: 'partial', label: __( 'Partial' ), color: '#dba617' },
	{ value: 'unsupported', label: __( 'Not supported' ), color: '#d63638' },
];

export default function CellPopover( {
	cell,
	anchor,
	themeColors,
	onClose,
	onUpdateCell,
	onInsertRow,
	onInsertColumn,
} ) {
	const [ isNoteLinkUIOpen, setIsNoteLinkUIOpen ] = useState( false );
	const [ noteLinkUrl, setNoteLinkUrl ] = useState( '' );

	function handleToggleNoteFormat( formatType ) {
		const newHtml = toggleNoteFormat( cell.note, formatType );
		if ( newHtml !== null ) {
			onUpdateCell( { note: newHtml } );
		}
	}

	function handleApplyNoteLink( url ) {
		const newHtml = applyNoteLink( cell.note, url );
		if ( newHtml !== null ) {
			onUpdateCell( { note: newHtml } );
		}
	}

	function handleInsert( insertFn, offset ) {
		insertFn( offset );
		onClose();
	}

	return (
		<Popover
			anchor={ anchor }
			onClose={ onClose }
			placement="bottom-start"
			className="wp-block-feature-comparison-table__cell-popover"
			focusOnMount="firstElement"
			shift
		>
			<div className="wp-block-feature-comparison-table__cell-editor">
				<p className="wp-block-feature-comparison-table__cell-editor-label">
					{ __( 'Status' ) }
				</p>
				<div
					role="group"
					aria-label={ __( 'Cell status' ) }
					className="wp-block-feature-comparison-table__status-buttons"
				>
					{ STATUSES.map( ( s ) => {
						const isActive = cell.status === s.value;
						return (
							<Button
								key={ s.value }
								size="compact"
								variant="secondary"
								className="wp-block-feature-comparison-table__status-button"
								style={
									isActive
										? {
												backgroundColor: s.color,
												borderColor: s.color,
												color: '#fff',
										  }
										: { color: s.color }
								}
								onClick={ () =>
									onUpdateCell( { status: s.value } )
								}
								aria-pressed={ isActive }
							>
								<span
									className="wp-block-feature-comparison-table__symbol"
									aria-hidden="true"
								>
									<Icon icon={ STATUS_ICONS[ s.value ] } />
								</span>
								{ s.label }
							</Button>
						);
					} ) }
				</div>
				<div className="wp-block-feature-comparison-table__note-field">
					<p className="wp-block-feature-comparison-table__cell-editor-label">
						{ __( 'Note' ) }
					</p>
					<Toolbar
						label={ __( 'Note formatting' ) }
						className="wp-block-feature-comparison-table__note-format-toolbar"
					>
						<ToolbarButton
							icon={ formatBold }
							label={ __( 'Bold' ) }
							isActive={ isNoteFormatActive(
								cell.note,
								'core/bold'
							) }
							onClick={ () =>
								handleToggleNoteFormat( 'core/bold' )
							}
						/>
						<ToolbarButton
							icon={ formatItalic }
							label={ __( 'Italic' ) }
							isActive={ isNoteFormatActive(
								cell.note,
								'core/italic'
							) }
							onClick={ () =>
								handleToggleNoteFormat( 'core/italic' )
							}
						/>
						<ToolbarButton
							icon={ formatUnderline }
							label={ __( 'Underline' ) }
							isActive={ isNoteFormatActive(
								cell.note,
								'core/underline'
							) }
							onClick={ () =>
								handleToggleNoteFormat( 'core/underline' )
							}
						/>
						<ToolbarButton
							icon={ linkIcon }
							label={ __( 'Link' ) }
							isActive={
								isNoteFormatActive( cell.note, 'core/link' ) ||
								isNoteLinkUIOpen
							}
							onClick={ () => {
								if ( isNoteLinkUIOpen ) {
									setIsNoteLinkUIOpen( false );
								} else {
									setNoteLinkUrl(
										getNoteCurrentLink( cell.note )
									);
									setIsNoteLinkUIOpen( true );
								}
							} }
						/>
					</Toolbar>
					{ isNoteLinkUIOpen && (
						<form
							className="wp-block-feature-comparison-table__note-link-form"
							onSubmit={ ( e ) => {
								e.preventDefault();
								handleApplyNoteLink( noteLinkUrl );
								setIsNoteLinkUIOpen( false );
							} }
						>
							<TextControl
								__next40pxDefaultSize
								hideLabelFromVision
								label={ __( 'URL' ) }
								placeholder={ __( 'https://…' ) }
								value={ noteLinkUrl }
								onChange={ setNoteLinkUrl }
								type="url"
							/>
							<div className="wp-block-feature-comparison-table__note-link-actions">
								<Button
									size="compact"
									variant="primary"
									type="submit"
								>
									{ __( 'Apply' ) }
								</Button>
								{ isNoteFormatActive(
									cell.note,
									'core/link'
								) && (
									<Button
										size="compact"
										variant="tertiary"
										onClick={ () => {
											handleApplyNoteLink( '' );
											setIsNoteLinkUIOpen( false );
										} }
									>
										{ __( 'Remove' ) }
									</Button>
								) }
							</div>
						</form>
					) }
					<RichText
						tagName="p"
						className="wp-block-feature-comparison-table__note-input"
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/underline',
							'core/link',
						] }
						value={ cell.note }
						onChange={ ( value ) =>
							onUpdateCell( { note: value } )
						}
						placeholder={ __( 'Add a note…' ) }
						aria-label={ __( 'Note' ) }
					/>
				</div>
				<div className="wp-block-feature-comparison-table__note-color-field">
					<p className="wp-block-feature-comparison-table__cell-editor-label">
						{ __( 'Note color' ) }
					</p>
					<ColorPalette
						colors={ themeColors }
						value={ cell.noteColor || '' }
						onChange={ ( value ) =>
							onUpdateCell( { noteColor: value || '' } )
						}
						clearable
					/>
				</div>
				<div className="wp-block-feature-comparison-table__cell-editor-insert">
					<p className="wp-block-feature-comparison-table__cell-editor-label">
						{ __( 'Insert' ) }
					</p>
					<div className="wp-block-feature-comparison-table__insert-buttons">
						<Button
							size="small"
							variant="tertiary"
							icon={ tableRowBefore }
							label={ __( 'Row above' ) }
							showTooltip
							onClick={ () => handleInsert( onInsertRow, 0 ) }
						/>
						<Button
							size="small"
							variant="tertiary"
							icon={ tableRowAfter }
							label={ __( 'Row below' ) }
							showTooltip
							onClick={ () => handleInsert( onInsertRow, 1 ) }
						/>
						<Button
							size="small"
							variant="tertiary"
							icon={ tableColumnBefore }
							label={ __( 'Column before' ) }
							showTooltip
							onClick={ () => handleInsert( onInsertColumn, 0 ) }
						/>
						<Button
							size="small"
							variant="tertiary"
							icon={ tableColumnAfter }
							label={ __( 'Column after' ) }
							showTooltip
							onClick={ () => handleInsert( onInsertColumn, 1 ) }
						/>
					</div>
				</div>
			</div>
		</Popover>
	);
}
