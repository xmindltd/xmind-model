'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _baseComponent = require('./base-component');

var _baseComponent2 = _interopRequireDefault(_baseComponent);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SRC_DATA_KEY = 'src';
var WIDTH_DATA_KEY = 'width';
var HEIGHT_DATA_KEY = 'height';
var ALIGN_DATA_KEY = 'align';

var TopicImage = function (_BaseComponent) {
  _inherits(TopicImage, _BaseComponent);

  function TopicImage(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, TopicImage);

    var _this = _possibleConstructorReturn(this, _BaseComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.IMAGE;
    _this.modelEvents = {
      resize: 'resize',
      align: 'align'
    };
    return _this;
  }

  TopicImage.prototype.getSrc = function getSrc() {
    return this._data.commit("get", SRC_DATA_KEY);
  };

  TopicImage.prototype.getWidth = function getWidth() {
    return this._data.commit("get", WIDTH_DATA_KEY);
  };

  TopicImage.prototype.getHeight = function getHeight() {
    return this._data.commit("get", HEIGHT_DATA_KEY);
  };

  TopicImage.prototype.getAlign = function getAlign() {
    return this._data.commit("get", ALIGN_DATA_KEY);
  };

  TopicImage.prototype.resize = function resize(newSize) {
    var _this2 = this;

    var preSize = { width: this.getWidth(), height: this.getHeight() };
    if (_underscore2.default.isEqual(newSize, preSize)) return;

    newSize.width ? this._data.commit("set", WIDTH_DATA_KEY, newSize.width) : this._data.commit("delete", WIDTH_DATA_KEY);
    newSize.height ? this._data.commit("set", HEIGHT_DATA_KEY, newSize.height) : this._data.commit("delete", HEIGHT_DATA_KEY);

    this.triggerModelChanged(this.modelEvents.resize, newSize);

    this.getUndo().add({
      undo: function undo() {
        return _this2.resize(preSize);
      },
      redo: function redo() {
        return _this2.resize(newSize);
      }
    });
  };

  TopicImage.prototype.align = function align(direction) {
    var _this3 = this;

    var preDirection = this.getAlign();
    if (direction === preDirection) return;

    this._data.commit("set", ALIGN_DATA_KEY, direction);
    this.triggerModelChanged(this.modelEvents.align);

    this.getUndo().add({
      undo: function undo() {
        return _this3.align(preDirection);
      },
      redo: function redo() {
        return _this3.align(direction);
      }
    });
  };

  TopicImage.prototype.removeSelf = function removeSelf() {
    if (!this.parent()) return;

    this.parent().removeImage();
  };

  return TopicImage;
}(_baseComponent2.default);

exports.default = TopicImage;
