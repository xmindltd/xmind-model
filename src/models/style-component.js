'use strict';

exports.__esModule = true;
exports.default = undefined;

var _summaryStyleDict;

var _constants = require('../common/constants');

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _utils = require('../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CLASS_SEPARATOR = ' ';

var GET = 'get';
var SET = 'set';
var DELETE = 'delete';

var STYLE = 'style';
var CLASS = 'class';

/**
 * @description summary样式名转换
 * */
var summaryStyleDict = (_summaryStyleDict = {}, _summaryStyleDict[_constants.STYLE_KEYS.SHAPE_CLASS] = 'summaryLineClass', _summaryStyleDict[_constants.STYLE_KEYS.LINE_WIDTH] = 'summaryLineWidth', _summaryStyleDict[_constants.STYLE_KEYS.LINE_COLOR] = 'summaryLineColor', _summaryStyleDict);

var EVENT_CLASS = 'changeClass';
var EVENT_STYLE = 'changeStyle';

var StyleComponent = function (_BaseComponent) {
  _inherits(StyleComponent, _BaseComponent);

  function StyleComponent(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, StyleComponent);

    var _this = _possibleConstructorReturn(this, _BaseComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.STYLE_COMPONENT;
    _this._style = null;
    _this._classList = null;
    return _this;
  }

  StyleComponent.prototype.init = function init(sheet) {
    _BaseComponent.prototype.init.call(this, sheet);
    var styleData = this._data.commit(GET, STYLE);
    this._initStyle(styleData);
  };

  StyleComponent.prototype._initStyle = function _initStyle(styleData) {
    var hasStyleData = styleData && styleData.properties;
    if (!hasStyleData) {
      styleData = this._createEmptyStyleData();
      this._data.commit(SET, STYLE, styleData);
    }
    this._style = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.STYLE, styleData);
    this._style.parent(this);
    return this._style;
  };

  StyleComponent.prototype._createEmptyStyleData = function _createEmptyStyleData() {
    return {
      'id': (0, _utils.UUID)(),
      'properties': {}
    };
  };

  StyleComponent.prototype.getClassList = function getClassList() {
    if (this._classList) {
      return this._classList;
    }
    this._classList = [];
    var classString = this._data.commit(GET, CLASS);
    if (typeof classString === 'string') {
      this._classList = classString.split(CLASS_SEPARATOR).filter(function (className) {
        return className !== '';
      });
    }
    return this._classList;
  };

  StyleComponent.prototype.addClass = function addClass(className, index) {
    var _this2 = this;

    if (!className || className.includes(CLASS_SEPARATOR)) {
      return;
    }
    var classList = this.getClassList();
    if ((0, _utils.isDefined)(className) && !classList.includes(className)) {
      classList.splice(index, 0, className);

      this._data.commit(SET, CLASS, classList.join(CLASS_SEPARATOR));
      this.triggerModelChanged(EVENT_CLASS, className);

      this.getUndo().add({
        undo: function undo() {
          _this2.removeClass(className);
        },
        redo: function redo() {
          _this2.addClass(className, index);
        }
      });
    }
  };

  StyleComponent.prototype.removeClass = function removeClass(className) {
    var _this3 = this;

    var classList = this.getClassList();
    if ((0, _utils.isDefined)(className) && classList.includes(className)) {
      var index = classList.indexOf(className);
      classList.splice(index, 1);

      // Modify model
      if (classList.length > 0) {
        this._data.commit(SET, CLASS, classList.join(CLASS_SEPARATOR));
      } else {
        this._data.commit(DELETE, CLASS);
      }
      this.triggerModelChanged(EVENT_CLASS, className);

      this.getUndo().add({
        undo: function undo() {
          _this3.addClass(className, index);
        },
        redo: function redo() {
          _this3.removeClass(className);
        }
      });
    }
  };

  StyleComponent.prototype.getClassValue = function getClassValue(key) {
    var classList = this.getClassList();
    var theme = this.ownerSheet().getTheme();
    var value = void 0;
    if (theme) {
      for (var _iterator = classList, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var className = _ref;

        var sv = theme.getStyleValue(className, key);
        if (sv) {
          value = sv;
        }
      }
    }
    return value;
  };

  StyleComponent.prototype.getStyle = function getStyle() {
    return this._style;
  };

  StyleComponent.prototype.getStyleValue = function getStyleValue(key) {
    return this._style.getValue(key);
  };

  StyleComponent.prototype.changeStyle = function changeStyle(key, value) {
    var _this4 = this;

    var primitiveKey = key;
    var oldStyle = this.getStyleValue(key);
    // if oldStyle is same as value, just return
    if (oldStyle === value) return;

    // special treat for textDecoration
    if (value && key === _constants.STYLE_KEYS.TEXT_DECORATION) {
      var _value$split = value.split(':'),
          preFix = _value$split[0],
          decoValue = _value$split[1];

      value = decoValue;

      // line-through redo的问题
      if (!decoValue) {
        value = preFix.trim();
      } else if (preFix === 'add') {
        if (oldStyle === 'none' || !oldStyle) oldStyle = '';
        value = oldStyle.includes(value) ? oldStyle : oldStyle + (' ' + value);
      } else if (preFix === 'rm') {
        if (!oldStyle) oldStyle = '';
        value = oldStyle.includes(value) && oldStyle.replace(value, '').trim();
        if (value === '') value = 'none';
      }
    }

    value ? this._style.setValue(key, value) : this._style.removeKey(key);

    if (this.componentType === _constants.COMPONENT_TYPE.SUMMARY && summaryStyleDict[key]) {
      key = summaryStyleDict[key];
    }

    this.triggerModelChanged(EVENT_STYLE, key, value);

    this.getUndo().add({
      undo: function undo() {
        _this4.changeStyle(primitiveKey, oldStyle);
      },
      redo: function redo() {
        _this4.changeStyle(primitiveKey, value);
      }
    });
  };

  return StyleComponent;
}(_baseComponent2.default);

exports.default = StyleComponent;
