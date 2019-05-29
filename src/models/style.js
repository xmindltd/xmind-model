'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GET = 'get';
var SET = 'set';
var DELETE = 'delete';

var PROPERTIES = 'properties';

var Style = function (_BaseComponent) {
  _inherits(Style, _BaseComponent);

  function Style(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Style);

    var _this = _possibleConstructorReturn(this, _BaseComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.STYLE;
    return _this;
  }

  Style.prototype.keys = function keys() {
    var properties = this._data.commit(GET, PROPERTIES);
    return properties ? Object.keys(properties) : [];
  };

  Style.prototype.getValue = function getValue(key) {
    return this._data.commit(GET, [PROPERTIES, key]);
  };

  Style.prototype.setValue = function setValue(key, value) {
    this._data.commit(SET, [PROPERTIES, key], value);
  };

  Style.prototype.removeKey = function removeKey(key) {
    this._data.commit(DELETE, [PROPERTIES, key]);
  };

  return Style;
}(_baseComponent2.default);

exports.default = Style;
