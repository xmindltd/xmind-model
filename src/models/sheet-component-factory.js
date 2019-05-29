'use strict';

exports.__esModule = true;

var _supportedComponents;

exports.default = createComponent;

var _constants = require('../common/constants');

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _boundary = require('./boundary');

var _boundary2 = _interopRequireDefault(_boundary);

var _legend = require('./legend');

var _legend2 = _interopRequireDefault(_legend);

var _marker = require('./marker');

var _marker2 = _interopRequireDefault(_marker);

var _notes = require('./notes');

var _notes2 = _interopRequireDefault(_notes);

var _numbering = require('./numbering');

var _numbering2 = _interopRequireDefault(_numbering);

var _relationship = require('./relationship');

var _relationship2 = _interopRequireDefault(_relationship);

var _topicExtension = require('./topic-extension');

var _topicExtension2 = _interopRequireDefault(_topicExtension);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _summary = require('./summary');

var _summary2 = _interopRequireDefault(_summary);

var _theme = require('./theme');

var _theme2 = _interopRequireDefault(_theme);

var _topic = require('./topic');

var _topic2 = _interopRequireDefault(_topic);

var _topicImage = require('./topic-image');

var _topicImage2 = _interopRequireDefault(_topicImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportedComponents = (_supportedComponents = {}, _supportedComponents[_constants.COMPONENT_TYPE.LEGEND] = _legend2.default, _supportedComponents[_constants.COMPONENT_TYPE.THEME] = _theme2.default, _supportedComponents[_constants.COMPONENT_TYPE.BOUNDARY] = _boundary2.default, _supportedComponents[_constants.COMPONENT_TYPE.RELATIONSHIP] = _relationship2.default, _supportedComponents[_constants.COMPONENT_TYPE.TOPIC] = _topic2.default, _supportedComponents[_constants.COMPONENT_TYPE.STYLE] = _style2.default, _supportedComponents[_constants.COMPONENT_TYPE.SUMMARY] = _summary2.default, _supportedComponents[_constants.COMPONENT_TYPE.IMAGE] = _topicImage2.default, _supportedComponents[_constants.COMPONENT_TYPE.MARKER] = _marker2.default, _supportedComponents[_constants.COMPONENT_TYPE.NOTE] = _notes2.default, _supportedComponents[_constants.COMPONENT_TYPE.NUMBERING] = _numbering2.default, _supportedComponents[_constants.COMPONENT_TYPE.EXTENSION] = _topicExtension2.default, _supportedComponents);

var needIdTypeList = [_constants.COMPONENT_TYPE.THEME, _constants.COMPONENT_TYPE.TOPIC, _constants.COMPONENT_TYPE.BOUNDARY, _constants.COMPONENT_TYPE.SUMMARY, _constants.COMPONENT_TYPE.RELATIONSHIP, _constants.COMPONENT_TYPE.STYLE];

var dataChecker = function dataChecker(sheet, componentType, data) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  if (!data.id && needIdTypeList.includes(componentType)) {
    data.id = sheet.generateComponentId();
  }

  if (componentType === _constants.COMPONENT_TYPE.SUMMARY) {
    if (!data.topicId) {
      data.topicId = sheet.generateComponentId();
    }
  }

  return true;
};

function createComponent(sheet, componentType, data) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


  if (!dataChecker(sheet, componentType, data, options)) {
    throw new Error(componentType + ' data check error!', data);
  }

  var SheetComponent = supportedComponents[componentType];
  if (!SheetComponent) {
    throw new Error(componentType + ' is not supported.');
  }

  var sheetComponent = new SheetComponent(data, options);
  sheetComponent.init(sheet);

  return sheetComponent;
}
