'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../common/constants');

var _styleComponent = require('./style-component');

var _styleComponent2 = _interopRequireDefault(_styleComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DATA_KEY_RANGE = 'range';

var RangeComponent = function (_StyleComponent) {
  _inherits(RangeComponent, _StyleComponent);

  function RangeComponent() {
    _classCallCheck(this, RangeComponent);

    return _possibleConstructorReturn(this, _StyleComponent.apply(this, arguments));
  }

  RangeComponent.prototype.getRange = function getRange() {
    return this._data.commit("get", DATA_KEY_RANGE);
  };

  RangeComponent.prototype.setRange = function setRange(range) {
    var _this2 = this;

    var oldRange = this.getRange();

    if (range === oldRange) {
      return;
    }

    this._data.commit("set", DATA_KEY_RANGE, range);

    this.getUndo().add({
      undo: function undo() {
        _this2.setRange(oldRange);
      },
      redo: function redo() {
        _this2.setRange(range);
      }
    });
  };

  _createClass(RangeComponent, [{
    key: 'rangeStart',
    get: function get() {
      var range = this.getRange();
      if (range === _constants.MASTER_RANGE) return -1;

      return parseInt(range.match(/\d+/g)[0], 10);
    }
  }, {
    key: 'rangeEnd',
    get: function get() {
      var range = this.getRange();
      if (range === _constants.MASTER_RANGE) return -1;

      return parseInt(range.match(/\d+/g)[1], 10);
    }
  }]);

  return RangeComponent;
}(_styleComponent2.default);

exports.default = RangeComponent;
