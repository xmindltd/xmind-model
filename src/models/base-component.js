'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _baseModel = require('./base-model');

var _baseModel2 = _interopRequireDefault(_baseModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseComponent = function (_BaseModel) {
  _inherits(BaseComponent, _BaseModel);

  function BaseComponent() {
    var _temp, _this, _ret;

    _classCallCheck(this, BaseComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _BaseModel.call.apply(_BaseModel, [this].concat(args))), _this), _this.componentType = _constants.COMPONENT_TYPE.BASE_COMPONENT, _temp), _possibleConstructorReturn(_this, _ret);
  }

  BaseComponent.prototype.init = function init(sheet) {
    this.ownerSheet(sheet);
  };

  BaseComponent.prototype.triggerModelChanged = function triggerModelChanged() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    this.trigger(args);
    this.ownerSheet().trigger(_constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE);
  };

  BaseComponent.prototype.ownerWorkbook = function ownerWorkbook(workbook) {
    if (workbook) this._ownerWorkbook = workbook;
    return this._ownerWorkbook;
  };

  BaseComponent.prototype.ownerSheet = function ownerSheet(sheet) {
    if (sheet) this._ownerSheet = sheet;
    return this._ownerSheet;
  };

  BaseComponent.prototype.parent = function parent(parentModel) {
    if (parentModel !== undefined) {
      this.trigger('beforeParentChange');
      this._parent = parentModel;
      this.trigger('afterParentChange');
    }
    return this._parent;
  };

  BaseComponent.prototype.getUndo = function getUndo() {
    return this.ownerSheet().getUndo();
  };

  BaseComponent.prototype.isOrphan = function isOrphan() {
    var parent = this.parent();
    if (parent) {
      return parent.isOrphan();
    }
    return true;
  };

  return BaseComponent;
}(_baseModel2.default);

exports.default = BaseComponent;
