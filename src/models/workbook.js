'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _undo = require('../common/undo');

var _undo2 = _interopRequireDefault(_undo);

var _config = require('../common/config');

var _utils = require('../common/utils');

var _baseModel = require('./base-model');

var _baseModel2 = _interopRequireDefault(_baseModel);

var _sheet = require('./sheet');

var _sheet2 = _interopRequireDefault(_sheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Workbook = function (_BaseModel) {
  _inherits(Workbook, _BaseModel);

  function Workbook(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Workbook);

    var _this = _possibleConstructorReturn(this, _BaseModel.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.WORKBOOK;
    _this._sheets = [];


    _this._config = new _config.Config();

    _this._initUndo();

    // sheets
    _this._initSheets();
    return _this;
  }

  Workbook.prototype._initUndo = function _initUndo() {
    var _this2 = this;

    this._undoManager = new _undo2.default();
    this._undoManager.setStackLimitedLength(Infinity);

    this._undoManager.on(_constants.EVENTS.UNDO_STATE_CHANGE, function () {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return _this2.trigger.apply(_this2, [_constants.EVENTS.UNDO_STATE_CHANGE].concat(params));
    });
  };

  Workbook.prototype._initSheets = function _initSheets() {
    var _this3 = this;

    var sheetDataList = this._data.toOriginData();
    sheetDataList.forEach(function (sheetData) {
      var newSheet = new _sheet2.default(sheetData, { undo: _this3._undoManager });
      newSheet.parent(_this3);
      _this3._sheets.push(newSheet);
      _this3._listenSheetModel(newSheet, sheetData.id);
    });
  };

  Workbook.prototype._listenSheetModel = function _listenSheetModel(sheet, id) {
    var _this4 = this;

    if (!sheet) {
      return;
    }
    this.listenTo(sheet, _constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE, function () {
      _this4.trigger(_constants.EVENTS.AFTER_WORKBOOK_CONTENT_CHANGE);
    });
  };

  Workbook.prototype.addSheet = function addSheet(sheetData) {
    var _this5 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var sheetIndex = this._sheets.findIndex(function (sheet) {
      return sheet.getId() === sheetData.id;
    });

    var sheetModel = new _sheet2.default(sheetData, { undo: this._undoManager });
    sheetModel.parent(this);
    this._listenSheetModel(sheetModel, sheetData.id);

    if (sheetIndex > 0) {
      this.getConfig().get(_constants.CONFIG.LOGGER).info(sheetData.id);
      this.getConfig().get(_constants.CONFIG.LOGGER).warn("try to add an existing sheet");

      this._sheets[sheetIndex] = sheetModel;
    } else {
      var at = options.at || this._sheets.length;
      var info = { sheetModel: sheetModel, at: at };
      this.trigger(_constants.EVENTS.BEFORE_ADD_NEW_SHEET, sheetData, info);

      var sheetDataList = this._data.toOriginData();
      sheetDataList.splice.apply(sheetDataList, [at, 0].concat(sheetData));
      this._sheets.splice(at, 0, sheetModel);

      this.trigger(_constants.EVENTS.AFTER_ADD_NEW_SHEET, sheetData, info);
    }

    this.getUndo().add({
      undo: function undo() {
        return _this5.removeSheet(sheetData.id);
      },
      redo: function redo() {
        return _this5.addSheet(sheetData);
      }
    });

    return sheetModel;
  };

  Workbook.prototype.removeSheet = function removeSheet(sheetId) {
    var _this6 = this;

    var sheet = this.getSheetById(sheetId);

    if (!sheet) {
      return;
    }

    this.trigger(_constants.EVENTS.BEFORE_REMOVE_SHEET_MODEL, sheetId);

    var index = this._sheets.indexOf(sheet);
    var oldSheetData = sheet.toJSON();
    var sheetsData = this._data.toOriginData();

    sheetsData.splice(index, 1);
    this._sheets.splice(index, 1);

    this.stopListening(sheet);
    sheet.remove();

    this.trigger(_constants.EVENTS.AFTER_REMOVE_SHEET_MODEL, sheetId);

    this.getUndo().add({
      undo: function undo() {
        return _this6.addSheet(oldSheetData);
      },
      redo: function redo() {
        return _this6.removeSheet(sheetId);
      }
    });

    this.trigger(_constants.EVENTS.AFTER_WORKBOOK_CONTENT_CHANGE);
  };

  Workbook.prototype.moveSheetTo = function moveSheetTo(sheetId, to) {
    var _this7 = this;

    var sheet = this.getSheetById(sheetId);

    if (!sheet) {
      return;
    }

    var index = this._sheets.indexOf(sheet);

    var sheetsData = this._data.toOriginData();
    var sheetDataArr = sheetsData.splice(index, 1);

    if (to < 0) to = 0;
    if (to > this._sheets.length - 1) to = this._sheets.length - 1;

    sheetsData.splice.apply(sheetsData, [to, 0].concat(sheetDataArr));

    this._sheets.splice(index, 1);
    this._sheets.splice(to, 0, sheet);

    this.getUndo().add({
      undo: function undo() {
        return _this7.moveSheetTo(sheetId, index);
      },
      redo: function redo() {
        return _this7.moveSheetTo(sheetId, to);
      }
    });

    this.trigger(_constants.EVENTS.AFTER_SHEET_ORDER_CHANGE);
    this.trigger(_constants.EVENTS.AFTER_WORKBOOK_CONTENT_CHANGE);
  };

  Workbook.prototype.getSheets = function getSheets() {
    return [].concat(this._sheets);
  };

  Workbook.prototype.getSheetByIndex = function getSheetByIndex(index) {
    return this._sheets[index];
  };

  Workbook.prototype.getSheetById = function getSheetById(sheetId) {
    return this._sheets.find(function (sheet) {
      return sheet.getId() === sheetId;
    });
  };

  Workbook.prototype.findSheetIndex = function findSheetIndex(sheetId) {};

  Workbook.prototype.getUndo = function getUndo() {
    return this._undoManager;
  };

  Workbook.prototype.createEmptySheet = function createEmptySheet() {
    var sheetTitle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var rootTopicTitle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var newSheetData = {
      id: (0, _utils.UUID)(),
      title: sheetTitle,
      rootTopic: {
        id: (0, _utils.UUID)(),
        title: rootTopicTitle
      }
    };

    return this.addSheet(newSheetData);
  };

  return Workbook;
}(_baseModel2.default);

exports.default = Workbook;
