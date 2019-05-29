'use strict';

exports.__esModule = true;
exports.default = undefined;

var _constants = require('../common/constants');

var _utils = require('../common/utils');

var _config = require('../common/config');

var _sheetComponentFactory = require('./sheet-component-factory');

var _sheetComponentFactory2 = _interopRequireDefault(_sheetComponentFactory);

var _Undo = require('../utils/Undo');

var _undo = require('../common/undo');

var _undo2 = _interopRequireDefault(_undo);

var _styleComponent = require('./style-component');

var _styleComponent2 = _interopRequireDefault(_styleComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ROOT_TOPIC_DATA_KEY = 'rootTopic';

var GET = 'get';
var SET = 'set';
var DELETE = 'delete';

var LEGEND = 'legend';
var DATA_KEY_TITLE = 'title';
var RELATIONSHIPS = 'relationships';
var STYLE = 'style';
var THEME = 'theme';
var TOPIC_POSITIONING = 'topicPositioning';
var TOPIC_OVER_LAPPING = 'topicOverlapping';

var SHEET_EVENT = {
  ADD_RELATIONSHIP: 'addRelationship',
  REMOVE_RELATIONSHIP: 'removeRelationship',
  ADD_THEME: 'addTheme',
  CHANGE_THEME: 'changeTheme'
};

var Sheet = function (_StyleComponent) {
  _inherits(Sheet, _StyleComponent);

  function Sheet(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Sheet);

    var _this = _possibleConstructorReturn(this, _StyleComponent.call(this, data, options));

    _this.componentType = _constants.MODEL_TYPE.SHEET;
    _this._config = new _config.Config();
    _this._idMap = {};
    _this._textTranslator = null;
    _this.modelEvents = {
      topicAddMarker: 'topicAddMarker',
      topicChangeMarker: 'topicChangeMarker',
      topicRemoveMarker: 'topicRemoveMarker'
    };


    _this.init();
    _this._idMap = {};

    if (options.undo) {
      _this._undoManager = options.undo;
    } else {
      _this._undoManager = new _undo2.default();
      _this._undoManager.setStackLimitedLength(Infinity);
    }
    return _this;
  }

  Sheet.prototype.init = function init() {
    _StyleComponent.prototype.init.call(this, this);

    // legend
    this._initLegend();

    // root topic
    this._initRootTopic();

    // relationships
    this._initRelationships();

    // theme
    var themeData = this._data.commit(GET, THEME);
    this._initTheme(themeData);

    // old free position
    this._enableOldFreePosition();
  };

  Sheet.prototype._initLegend = function _initLegend() {
    var legendData = this._data.commit(GET, LEGEND) || {};
    this.legend = this.createComponent(_constants.MODEL_TYPE.LEGEND, legendData);
    this.legend.parent(this);
  };

  Sheet.prototype._initRootTopic = function _initRootTopic() {
    this._rootTopic = this.createComponent(_constants.COMPONENT_TYPE.TOPIC, this._data.commit('get', ROOT_TOPIC_DATA_KEY), {
      type: _constants.TOPIC_TYPE.ROOT
    });
    this._rootTopic.parent(this);
  };

  Sheet.prototype._initRelationships = function _initRelationships() {
    var _this2 = this;

    this._relationships = [];
    var relationshipsData = this._data.commit(GET, RELATIONSHIPS);
    relationshipsData && relationshipsData.forEach(function (data) {
      var relationship = _this2.createComponent(_constants.COMPONENT_TYPE.RELATIONSHIP, data);
      relationship.parent(_this2);
      _this2._relationships.push(relationship);
      _this2.trigger(SHEET_EVENT.ADD_RELATIONSHIP, relationship, _this2);
    });
  };

  Sheet.prototype.getUndo = function getUndo() {
    return this._undoManager;
  };

  Sheet.prototype.ownerSheet = function ownerSheet() {
    return this;
  };

  Sheet.prototype.getLegend = function getLegend() {
    return this.legend;
  };

  Sheet.prototype.getRootTopic = function getRootTopic() {
    return this._rootTopic;
  };

  Sheet.prototype.replaceRootTopic = function replaceRootTopic(newRootTopicData) {
    this._rootTopic.remove();

    this._data.commit("set", ROOT_TOPIC_DATA_KEY, newRootTopicData);
    this._rootTopic = this.createComponent(_constants.COMPONENT_TYPE.TOPIC, newRootTopicData, {
      type: _constants.TOPIC_TYPE.ROOT
    });
    this._rootTopic.parent(this);
  };

  Sheet.prototype.getRelationships = function getRelationships() {
    return [].concat(this._relationships);
  };

  Sheet.prototype.addRelationship = function addRelationship(relationshipData) {
    var _this3 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newRelationship = this.createComponent(_constants.COMPONENT_TYPE.RELATIONSHIP, relationshipData);
    newRelationship.parent(this);

    var relationships = this._relationships;

    var relationshipsData = this._data.commit(GET, RELATIONSHIPS);
    if (relationshipsData) {
      relationshipsData.push(relationshipData);
    } else {
      this._data.commit(SET, RELATIONSHIPS, [relationshipData]);
    }
    this.trigger(_constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE);

    relationships.push(newRelationship);
    this.trigger(SHEET_EVENT.ADD_RELATIONSHIP, newRelationship, this);

    this.getUndo().add({
      undo: function undo() {
        return _this3.removeRelationship(newRelationship);
      },
      redo: function redo() {
        return _this3.addRelationship(newRelationship);
      }
    }, 'R-add');
  };

  Sheet.prototype.removeRelationship = function removeRelationship(relationship) {
    var _this4 = this;

    var relationships = this._relationships;
    var relationshipIndex = relationships.indexOf(relationship);
    if (relationshipIndex < 0) {
      return;
    }

    var relationshipsData = this._data.commit(GET, RELATIONSHIPS);
    relationshipsData.splice(relationshipIndex, 1);
    this.trigger(_constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE);

    relationships.splice(relationshipIndex, 1);
    relationship.parent(null);
    // TODO: relationship.remove()
    this.trigger(SHEET_EVENT.REMOVE_RELATIONSHIP, relationship);

    this.getUndo().add({
      undo: function undo() {
        return _this4.addRelationship(relationship.toJSON());
      },
      redo: function redo() {
        return _this4.removeRelationship(relationship);
      }
    }, 'R-remove');
  };

  Sheet.prototype.getTheme = function getTheme() {
    return this._theme;
  };

  Sheet.prototype._initTheme = function _initTheme(themeData) {
    if (themeData) {
      var theme = this.createComponent(_constants.COMPONENT_TYPE.THEME, themeData);
      theme.parent(this);
      this._theme = theme;
    }
  };

  Sheet.prototype.changeTheme = function changeTheme(themeData) {
    var _this5 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var oldTheme = this.getTheme();
    var oldThemeData = this._data.commit(GET, THEME);

    this._data.commit(SET, THEME, themeData);
    this._initTheme(themeData);

    if (!oldTheme) {
      this.trigger(SHEET_EVENT.ADD_THEME, this._theme);
    } else {
      if (options.fixUserStyleWhenChangeTheme) {
        options.fixUserStyleWhenChangeTheme();
      }
      this.trigger(SHEET_EVENT.CHANGE_THEME, this._theme);
    }

    this.getUndo().add({
      undo: function undo() {
        _this5.changeTheme(oldThemeData);
      },
      redo: function redo() {
        _this5.changeTheme(themeData);
      }
    }, 'changeTheme');

    this.trigger(_constants.EVENTS.AFTER_THEME_CHANGED);
    this.trigger(_constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE);
  };

  Sheet.prototype.changeFreePosition = function changeFreePosition(isFree) {
    var _this6 = this;

    var original = this._data.commit(GET, TOPIC_POSITIONING);
    var topicPositioning = isFree ? 'free' : 'fixed';

    if (topicPositioning === original || !original && topicPositioning === 'fixed') {
      return;
    }

    if (original === 'free' && !isFree) {
      // status change from free to fixed
      // TODO
      // clearPositionOfAllAttachedTopic(this)
    }

    this._data.commit(SET, TOPIC_POSITIONING, topicPositioning);
    this.trigger(_constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE);

    this.getUndo().add({
      undo: function undo() {
        _this6._changePositioning(original);
      },
      redo: function redo() {
        _this6._changePositioning(topicPositioning);
      }
    });
  };

  Sheet.prototype.isFreePosition = function isFreePosition() {
    return this._data.commit(GET, TOPIC_POSITIONING) === 'free';
  };

  /**
   * 如果以前在 free position 下编辑的，应该开启 topicPositioning
   */


  Sheet.prototype._enableOldFreePosition = function _enableOldFreePosition() {
    if (this._data.commit(GET, TOPIC_POSITIONING) !== undefined) return;
    var mainTopics = this.getRootTopic().getChildrenByType(_constants.TOPIC_TYPE.ATTACHED);
    var isFree = mainTopics.some(function (topic) {
      return !!topic._data['position'];
    });
    if (isFree) {
      this._data.commit(SET, TOPIC_POSITIONING, 'free');
    } else {
      this._data.commit(SET, TOPIC_POSITIONING, 'fixed');
    }
  };

  Sheet.prototype.changeOverlap = function changeOverlap(topicOverlapping) {
    var _this7 = this;

    var original = this._data.commit(GET, TOPIC_OVER_LAPPING);

    var isOverlapEqual = function isOverlapEqual(val1, val2) {
      return val1 === val2 || !val1 && val2 === 'none' || val1 === 'none' && !val2;
    };

    if (isOverlapEqual(topicOverlapping, original)) {
      return;
    }
    this.data.commit(SET, TOPIC_OVER_LAPPING, topicOverlapping);

    this.trigger(_constants.EVENTS.AFTER_SHEET_CONTENT_CHANGE);
    this.getUndo().add({
      undo: function undo() {
        return _this7.changeOverlap(original);
      },
      redo: function redo() {
        return _this7.changeOverlap(topicOverlapping);
      }
    });
  };

  Sheet.prototype.isTopicOverlapping = function isTopicOverlapping() {
    return this._data.commit(GET, TOPIC_OVER_LAPPING) === 'overlap';
  };

  Sheet.prototype.createComponent = function createComponent(componentType, data) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var model = (0, _sheetComponentFactory2.default)(this, componentType, data, options);
    this._idMap[model.getId()] = model;
    return model;
  };

  Sheet.prototype.generateComponentId = function generateComponentId() {
    var id = (0, _utils.UUID)();
    while (!!this._idMap[id]) {
      id = (0, _utils.UUID)();
    }
    return id;
  };

  Sheet.prototype.getTitle = function getTitle() {
    return this.get(DATA_KEY_TITLE);
  };

  Sheet.prototype.findComponentById = function findComponentById(id) {
    return this._idMap[id];
  };

  Sheet.prototype.remove = function remove() {
    this.stopListening();
    this.parent(null);
  };

  Sheet.prototype.setTextTranslator = function setTextTranslator(fn) {
    this._textTranslator = fn;
  };

  Sheet.prototype.getTranslatedText = function getTranslatedText(key) {
    if (!this._textTranslator) {
      return langs.translate(_constants.LANGS.ZH_CN, key);
    } else {
      return this._textTranslator(key);
    }
  };

  Sheet.prototype.relationships = function relationships() {
    console.error('need to remove');
    return this.getRelationships();
  };

  Sheet.prototype.getLegendModel = function getLegendModel() {
    console.error('need to remove');
    return this.getLegend();
  };

  Sheet.prototype.isFreePositionEnabled = function isFreePositionEnabled() {
    console.error('need to remove');
    return this.isFreePosition();
  };

  return Sheet;
}(_styleComponent2.default);

exports.default = Sheet;
