/**
 * @description 这些事件主要由外层监听，新加的事件，workbook editor触发的，前缀WE
 * @description 同理，sheet editor触发的，前缀SE
 * */
export const EVENTS = {
  'UNDO_STATE_CHANGE': 'undoStateChange',
  'BEFORE_EDITOR_REMOVE': 'beforeEditorRemove',
  'EDITOR_REMOVED': 'editorRemoved',

  'BEFORE_SWITCH_SHEET': 'beforeSwitchSheet',
  'SHEET_SWITCHED': 'sheetSwitched',

  'BEFORE_CREATE_SHEET_EDITOR': 'beforeCreateSheetEditor',
  'SHEET_EDITOR_CREATED': 'sheetEditorCreated',

  'ACTION_STATUS_MAY_CHANGED': 'actionStatusMayChanged',

  'AFTER_REMOVE_SHEET_MODEL': 'afterRemoveSheet',
  'BEFORE_REMOVE_SHEET_MODEL': 'beforeRemoveSheet',

  'AFTER_ADD_NEW_SHEET': 'afterAddNewSheet',
  'BEFORE_ADD_NEW_SHEET': 'beforeAddNewSheet',

  'AFTER_SHEET_CONTENT_CHANGE': 'afterSheetContentChange',
  'AFTER_WORKBOOK_CONTENT_CHANGE': 'afterWorkbookContentChange',

  'BEFORE_ADD_TOPIC': 'beforeAddTopic',
  'AFTER_ADD_TOPIC': 'afterAddTopic',

  'BEFORE_REMOVE_TOPIC': 'beforeRemoveTopic',
  'AFTER_REMOVE_TOPIC': 'afterRemoveTopic',

  'AFTER_SHEET_TITLE_CHANGE': 'sheetTitleChanged',

  'AFTER_WORKBOOK_TITLE_CHANGE': 'workbookTitleChanged',

  'SELECTION_CHANGED': 'selectionChanged',
  'SHOULD_SHOW_NOTE_PANEL': 'shouldShowNotesPanel',
  'SCALE_CHANGED': 'scaleChanged',

  'VIEW_PORT_MOVING': 'viewPortMoving',

  'SHEET_CONTENT_LOADED': 'SHEET_CONTENT_LOADED',

  'AFTER_UI_STATUS_ACTIVATE': 'AFTER_UI_STATUS_ACTIVATE',
  'AFTER_UI_STATUS_DEACTIVATE': 'AFTER_UI_STATUS_DEACTIVATE',

  'AFTER_MODIFY_STATUS_CHANGE': 'afterModifyStatusChange',

  'AFTER_SHEET_ORDER_CHANGE': 'afterSheetOrderChange',

  'AFTER_THEME_CHANGED': 'afterThemeChanged',

  'SE_BRANCH_DRAG_START': 'SE_branchDragStart',
  'SE_BRANCH_DRAG_END': 'SE_branchDragEnd',

  'RELATIONSHIP_CONTROL_POINT_DRAG_START': 'RELATIONSHIP_CONTROL_POINT_DRAG_START',
  'RELATIONSHIP_CONTROL_POINT_DRAG_END': 'RELATIONSHIP_CONTROL_POINT_DRAG_END',

  'SE_OVERRIDE_STYLE_CHANGED': 'SE_OVERRIDE_STYLE_CHANGED',

  'SE_BRANCH_COLLAPSE_TOGGLE': 'SE_BRANCH_COLLAPSE_TOGGLE',

  'SE_UI_STATUS_CHANGED': 'SE_UI_STATUS_CHANGED',

  'BEFORE_ANCESTOR_CHANGE': 'beforeAncestorChange',
  'AFTER_ANCESTOR_CHANGE': 'afterAncestorChange',

  'FILE_DROP_IN_START': 'fileDropInStart',
  'FILE_DROP_IN_END': 'fileDropInEnd',

  'EXIT_BRANCH_ONLY_MODE': 'exitBranchOnlyMode'
}