'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _rangeComponent = require('./range-component');

var _rangeComponent2 = _interopRequireDefault(_rangeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DATA_KEY_TOPIC_ID = 'topicId';

var Summary = function (_RangeComponent) {
  _inherits(Summary, _RangeComponent);

  function Summary(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Summary);

    var _this = _possibleConstructorReturn(this, _RangeComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.SUMMARY;
    return _this;
  }

  Summary.prototype.getSummaryTopic = function getSummaryTopic() {
    var topicId = this._data.commit("get", DATA_KEY_TOPIC_ID);
    return this.ownerSheet().findComponentById(topicId);
  };

  return Summary;
}(_rangeComponent2.default);

exports.default = Summary;
