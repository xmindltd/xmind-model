'use strict';

exports.__esModule = true;
exports.default = undefined;

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _constants = require('../common/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PROVIDER_KEY = 'provider';

var Extension = function (_BaseComponent) {
  _inherits(Extension, _BaseComponent);

  function Extension(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Extension);

    var _this = _possibleConstructorReturn(this, _BaseComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.EXTENSION;
    return _this;
  }

  Extension.prototype.getProvider = function getProvider() {
    return this._data.commit("get", PROVIDER_KEY);
  };

  return Extension;
}(_baseComponent2.default);

exports.default = Extension;
