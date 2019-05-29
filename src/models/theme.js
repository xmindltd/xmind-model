'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _utils = require('../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GET = 'get';
var SET = 'set';
var DELETE = 'delete';
var KEYS = 'keys';

var EVENT_THEME_CLASS = 'changeThemeClass';

var Theme = function (_BaseComponent) {
  _inherits(Theme, _BaseComponent);

  function Theme(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Theme);

    var _this = _possibleConstructorReturn(this, _BaseComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.THEME;
    _this._properties = {};
    return _this;
  }

  Theme.prototype.init = function init(sheet) {
    var _this2 = this;

    _BaseComponent.prototype.init.call(this, sheet);
    var classNames = this.getAllClassNames();
    classNames.forEach(function (className) {
      var styleData = _this2._data.commit(GET, className);
      _this2._properties[className] = _this2.ownerSheet().createComponent(_constants.COMPONENT_TYPE.STYLE, styleData);
      _this2._properties[className].parent(_this2);
    });
  };

  Theme.prototype.hasClass = function hasClass(className) {
    return !!this._properties[className];
  };

  Theme.prototype.getStyle = function getStyle(className) {
    return this.properties[className];
  };

  Theme.prototype.getStyleValue = function getStyleValue(className, styleKey) {
    var style = this._properties[className];
    return style && style.getValue(styleKey);
  };

  Theme.prototype.getAllClassNames = function getAllClassNames() {
    return this._data.commit(KEYS).filter(function (item) {
      item !== 'id' || item !== 'title';
    });
  };

  Theme.prototype.changeClass = function changeClass(className, styleData) {
    var _this3 = this;

    if (!(0, _utils.isDefined)(styleData)) {
      delete this._properties[className];
      this._data.commit(DELETE, className);
      this.triggerModelChanged(EVENT_THEME_CLASS);
      return;
    }

    var data = JSON.parse(JSON.stringify(styleData));
    var newStyle = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.STYLE, data);

    var oldStyleData = this._properties[className] ? this._properties[className].toJSON() : null;

    this._properties[className] = newStyle;
    this._properties[className].parent(this);
    this._data.commit(SET, className, data);
    this.triggerModelChanged(EVENT_THEME_CLASS);

    this.getUndo().add({
      undo: function undo() {
        return _this3.changeClass(className, oldStyleData);
      },
      redo: function redo() {
        return _this3.changeClass(className, styleData);
      }
    });
  };

  return Theme;
}(_baseComponent2.default);

exports.default = Theme;
