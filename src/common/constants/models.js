'use strict';

exports.__esModule = true;
var MODEL_TYPE = {
  BASE_COMPONENT: 'BaseComponent',
  STYLE_COMPONENT: 'StyleComponent',
  STYLE: 'Style',
  BOUNDARY: 'Boundary',
  SUMMARY: 'Summary',
  HREF: 'Href',
  LABEL: 'Label',
  LEGEND: 'Legend',
  MARKER: 'Marker',
  NOTE: 'Note',
  NUMBERING: 'Numbering',
  RELATIONSHIP: 'Relationship',
  SHEET: 'Sheet',
  THEME: 'Theme',
  TOPIC: 'Topic',
  EXTENSION: 'Extension',
  IMAGE: 'Image',
  WORKBOOK: 'workbook'
};

var TOPIC_TYPE = {
  ATTACHED: 'attached',
  DETACHED: 'detached',
  SUMMARY: 'summary',
  CALLOUT: 'callout',
  ROOT: 'root'
};

var NUMBERFORMAT = {
  "NONE": "org.xmind.numbering.none",
  "ARABIC": "org.xmind.numbering.arabic",
  "ROMAN": "org.xmind.numbering.roman",
  "LOWERCASE": "org.xmind.numbering.lowercase",
  "UPPERCASE": "org.xmind.numbering.uppercase"
};

var NUMBERSEPARATOR = {
  "COMMA": "org.xmind.numbering.separator.comma",
  "DOT": "org.xmind.numbering.separator.dot",
  "HYPHEN": "org.xmind.numbering.separator.hyphen",
  "DASH": "org.xmind.numbering.separator.dash",
  "OBLIQUE": "org.xmind.numbering.separator.oblique"
};

var INFO_ITEM_DISPLAY_MODE = {
  CARD: 'card',
  ICON: 'icon'
};

var INFOITEM_TYPE_FULL = {
  "LABEL": "org.xmind.ui.infoItem.label",
  "HREF": "org.xmind.ui.infoItem.hyperlink",
  "NOTE": "org.xmind.ui.infoItem.notes",
  "TASK": "org.xmind.ui.infoItem.taskInfo",
  "AUDIO": "org.xmind.ui.infoItem.AudioNotes",
  "COMMENT": "org.xmind.ui.infoItem.comments"
};

var INFOITEM_TYPE_SHORT = {
  "LABEL": "label",
  "HREF": "href",
  "NOTE": "note",
  "TASK": "task",
  "AUDIO": "audio",
  "COMMENT": "comments"
};

var INFO_ITEM_STYLE_TYPE = {
  CLASSIC: 'classic',
  FASHION: 'fashion',
  // 根据json格式
  ACC_TO_JSON: 'accToJSON'
};

var COMPONENT_TYPE = MODEL_TYPE;

var ATTACHMENT_PREFIX = "xap:resources/";
var TITLE_MAX_WIDTH = 300;
var TOPIC_TITLE_MAX_WIDTH = 300;
var TOPIC_MAX_CUSTOM_WIDTH = 762;
var TOPIC_DEFAULT_STRUCTURE = "org.xmind.ui.logic.right";
var DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  NONE: "none"
};

/**
 * @deprecated
 */
var TOPIC_ATTACHED = 'attached';
/**
 * @deprecated
 */
var TOPIC_DETACHED = 'detached';
/**
 * @deprecated
 */
var TOPIC_SUMMARY = 'summary';
/**
 * @deprecated
 */
var TOPIC_CALLOUT = 'callout';
/**
 * @deprecated
 */
var TOPIC_ROOT = 'root';

/**
* @description master range name
* */
var MASTER_RANGE = 'master';

var MANIFEST = {
  FILE_ENTRIES: 'file-entries',
  FILE_ENTRY: 'file-entry'
};

exports.MODEL_TYPE = MODEL_TYPE;
exports.COMPONENT_TYPE = COMPONENT_TYPE;
exports.TOPIC_TYPE = TOPIC_TYPE;
exports.NUMBERFORMAT = NUMBERFORMAT;
exports.NUMBERSEPARATOR = NUMBERSEPARATOR;
exports.INFO_ITEM_DISPLAY_MODE = INFO_ITEM_DISPLAY_MODE;
exports.INFO_ITEM_STYLE_TYPE = INFO_ITEM_STYLE_TYPE;
exports.INFOITEM_TYPE_FULL = INFOITEM_TYPE_FULL;
exports.INFOITEM_TYPE_SHORT = INFOITEM_TYPE_SHORT;
exports.TITLE_MAX_WIDTH = TITLE_MAX_WIDTH;
exports.TOPIC_TITLE_MAX_WIDTH = TOPIC_TITLE_MAX_WIDTH;
exports.TOPIC_MAX_CUSTOM_WIDTH = TOPIC_MAX_CUSTOM_WIDTH;
exports.ATTACHMENT_PREFIX = ATTACHMENT_PREFIX;
exports.TOPIC_DEFAULT_STRUCTURE = TOPIC_DEFAULT_STRUCTURE;
exports.DIRECTION = DIRECTION;
exports.TOPIC_ATTACHED = TOPIC_ATTACHED;
exports.TOPIC_DETACHED = TOPIC_DETACHED;
exports.TOPIC_SUMMARY = TOPIC_SUMMARY;
exports.TOPIC_CALLOUT = TOPIC_CALLOUT;
exports.TOPIC_ROOT = TOPIC_ROOT;
exports.MASTER_RANGE = MASTER_RANGE;
exports.MANIFEST = MANIFEST;