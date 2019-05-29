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

var DATA_KEY_VISIBILITY = 'visibility';
var DATA_KEY_POSITION = 'position';
var DATA_KEY_USER_MARKERS = 'markers';

var Legend = function (_BaseComponent) {
  _inherits(Legend, _BaseComponent);

  function Legend(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Legend);

    var _this = _possibleConstructorReturn(this, _BaseComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.LEGEND;
    _this.modelEvents = {
      legendAddMarker: 'legendAddMarker',
      legendRemoveMarker: 'legendRemoveMarker',
      legendMarkerDescChanged: 'legendMarkerDescChanged'
    };
    _this._liveMarkerMap = {};
    return _this;
  }

  Legend.prototype.init = function init(sheet) {
    _BaseComponent.prototype.init.call(this, sheet);
    this._initEventsListener();
  };

  Legend.prototype.getLiveMarkerMap = function getLiveMarkerMap() {
    return Object.assign({}, this._liveMarkerMap);
  };

  Legend.prototype._initEventsListener = function _initEventsListener() {
    var parentSheetModel = this.ownerSheet();
    var sheetModelEvents = parentSheetModel.modelEvents;
    this.listenTo(parentSheetModel, sheetModelEvents.topicAddMarker, this._onTopicAddMarker);
    // todo
    this.listenTo(parentSheetModel, sheetModelEvents.topicChangeMarker, this._onTopicChangeMarker);
    this.listenTo(parentSheetModel, sheetModelEvents.topicRemoveMarker, this._onTopicRemoveMarker);
  };

  Legend.prototype._onTopicAddMarker = function _onTopicAddMarker(markerData) {
    var liveMarkerMap = this._liveMarkerMap;
    var markerId = markerData.markerId;

    // if the added marker is not in the liveMarkerList
    // it's a new marker
    if (!liveMarkerMap[markerId]) {
      liveMarkerMap[markerId] = 1;
      this.trigger(this.modelEvents.legendAddMarker, markerId);
    } else {
      liveMarkerMap[markerId]++;
    }
  };

  Legend.prototype._onTopicChangeMarker = function _onTopicChangeMarker(markerData) {};

  Legend.prototype._onTopicRemoveMarker = function _onTopicRemoveMarker(markerData) {
    var liveMarkerMap = this._liveMarkerMap;
    var markerId = markerData.markerId;

    // Marker - 1
    if (! --liveMarkerMap[markerId]) {
      delete liveMarkerMap[markerId];
      this.trigger(this.modelEvents.legendRemoveMarker, markerId);
    }
  };

  Legend.prototype.isVisible = function isVisible() {
    return this._data.commit("get", DATA_KEY_VISIBILITY) === 'visible';
  };

  Legend.prototype.setVisible = function setVisible(isVisible) {
    var _this2 = this;

    this._data.commit("set", DATA_KEY_VISIBILITY, isVisible ? 'visible' : 'hidden');

    this.getUndo().add({
      undo: function undo() {
        return _this2.setLegendDisplay(!isVisible);
      },
      redo: function redo() {
        return _this2.setLegendDisplay(isVisible);
      }
    });
  };

  Legend.prototype.setLegendDisplay = function setLegendDisplay(isVisible) {
    return this.setVisible(isVisible);
  };

  Legend.prototype.getPosition = function getPosition() {
    return this._data.commit("get", DATA_KEY_POSITION);
  };

  Legend.prototype.setPosition = function setPosition(position) {
    var _this3 = this;

    var oldPosition = this._data.commit("get", DATA_KEY_POSITION);

    if (!position) {
      this._data.commit("delete", DATA_KEY_POSITION);
    } else {
      this._data.commit("set", DATA_KEY_POSITION, position);
    }

    this.getUndo().add({
      undo: function undo() {
        return _this3.setLegendPosition(oldPosition);
      },
      redo: function redo() {
        return _this3.setLegendPosition(position);
      }
    });
  };

  Legend.prototype.setLegendPosition = function setLegendPosition(position) {
    return this.setPosition(position);
  };

  Legend.prototype.getUserMarkerDescription = function getUserMarkerDescription() {
    return JSON.parse(JSON.stringify(this._data.commit("get", DATA_KEY_USER_MARKERS)));
  };

  Legend.prototype.setUserMarkerDescription = function setUserMarkerDescription(markerId, userDescription) {
    var _this4 = this;

    var userMarkerDescriptionMap = JSON.parse(JSON.stringify(this._data.commit("get", DATA_KEY_USER_MARKERS) || {}));
    var oldUserDescription = (userMarkerDescriptionMap[markerId] || {}).name;

    if (!userDescription) {
      delete userMarkerDescriptionMap[markerId];
    } else {
      userMarkerDescriptionMap[markerId] = { name: userDescription };
    }

    this._data.commit("set", DATA_KEY_USER_MARKERS, userMarkerDescriptionMap);
    this.trigger(this.modelEvents.legendMarkerDescChanged);

    this.getUndo().add({
      undo: function undo() {
        return _this4.setUserMarkerDescription(markerId, oldUserDescription);
      },
      redo: function redo() {
        return _this4.setUserMarkerDescription(markerId, userDescription);
      }
    });
  };

  return Legend;
}(_baseComponent2.default);

exports.default = Legend;
