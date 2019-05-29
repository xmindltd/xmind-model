'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('../common/constants');

var _styleComponent = require('./style-component');

var _styleComponent2 = _interopRequireDefault(_styleComponent);

var _utils = require('../common/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GET = 'get';
var SET = 'set';

var TITLE_KEY = 'title';
var END_1_ID_KEY = 'end1Id';
var END_2_ID_KEY = 'end2Id';
var CONTROL_POINTS_KEY = 'controlPoints';

var EVENT_TITLE = 'change:title';
var EVENT_END_POINT = 'change:endPoints';
var EVENT_CONTROL_POINTS = 'change:controlPoints';

var Relationship = function (_StyleComponent) {
  _inherits(Relationship, _StyleComponent);

  function Relationship(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Relationship);

    var _this = _possibleConstructorReturn(this, _StyleComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.RELATIONSHIP;
    return _this;
  }

  Relationship.prototype.getTitle = function getTitle() {
    return this._data.commit(GET, TITLE_KEY);
  };

  Relationship.prototype.changeTitle = function changeTitle(title) {
    var _this2 = this;

    var oldTitle = this.getTitle();

    if (oldTitle === title) {
      return;
    }

    this._data.commit(SET, TITLE_KEY, title);
    this.triggerModelChanged(EVENT_TITLE);

    this.getUndo().add({
      undo: function undo() {
        return _this2.changeTitle(oldTitle);
      },
      redo: function redo() {
        return _this2.changeTitle(title);
      }
    }, 'R-changeTitle');
  };

  Relationship.prototype.getEnd1Id = function getEnd1Id() {
    return this._data.commit(GET, END_1_ID_KEY);
  };

  Relationship.prototype.getEnd2Id = function getEnd2Id() {
    return this._data.commit(GET, END_2_ID_KEY);
  };

  Relationship.prototype.changeEndPoints = function changeEndPoints(newEndIds) {
    var _this3 = this;

    var oldEndIds = {
      end1Id: this.getEnd1Id(),
      end2Id: this.getEnd2Id()

      // check change
    };if (oldEndIds.end1Id === newEndIds.end1Id && oldEndIds.end2Id === newEndIds.end2Id) return;

    if (newEndIds.end1Id && newEndIds.end1Id !== oldEndIds.end1Id) {
      this._data.commit(SET, END_1_ID_KEY, newEndIds.end1Id);
    }

    if (newEndIds.end2Id && newEndIds.end2Id !== oldEndIds.end2Id) {
      this._data.commit(SET, END_2_ID_KEY, newEndIds.end2Id);
    }

    this.triggerModelChanged(EVENT_END_POINT);

    this.getUndo().add({
      undo: function undo() {
        _this3.changeEndPoints(oldEndIds);
      },
      redo: function redo() {
        _this3.changeEndPoints(newEndIds);
      }
    }, 'R-changeEndPoints');
  };

  Relationship.prototype.getControlPoint0 = function getControlPoint0() {
    return this._data.commit(GET, CONTROL_POINTS_KEY)['0'];
  };

  Relationship.prototype.getControlPoint1 = function getControlPoint1() {
    return this._data.commit(GET, CONTROL_POINTS_KEY)['1'];
  };

  Relationship.prototype.changeControlPoints = function changeControlPoints(points) {
    var _this4 = this;

    if (!points || Object.keys(points).length === 0) {
      return;
    }

    // control point type has two patten
    // { x: number, y: number } or { amount: number, angle: number }
    // we only us the first patten now

    var controlPointsData = this._data.commit(GET, CONTROL_POINTS_KEY) || {};

    var oldPoints = _extends({}, controlPointsData);

    var hasPoint0Changed = points['0'] ? !(0, _utils.isEqualPoint)(points['0'], oldPoints['0']) : false;
    var hasPoint1Changed = points['1'] ? !(0, _utils.isEqualPoint)(points['1'], oldPoints['1']) : false;

    if (!hasPoint0Changed && !hasPoint1Changed) return;

    var newPoints = _extends({}, oldPoints, points);
    this._data.commit(SET, CONTROL_POINTS_KEY, newPoints);

    this.triggerModelChanged(EVENT_CONTROL_POINTS);

    this.getUndo().add({
      undo: function undo() {
        _this4.changeControlPoints(oldPoints);
      },
      redo: function redo() {
        _this4.changeControlPoints(newPoints);
      }
    }, 'R-changeControlPoints');
  };

  return Relationship;
}(_styleComponent2.default);

exports.default = Relationship;
