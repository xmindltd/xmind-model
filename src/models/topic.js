'use strict';

exports.__esModule = true;
exports.default = undefined;

var _styleComponent = require('./style-component');

var _styleComponent2 = _interopRequireDefault(_styleComponent);

var _constants = require('../common/constants');

var _utils = require('../common/utils');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultInitOptions = {
  type: _constants.TOPIC_TYPE.ATTACHED
};

var CHILDREN_DATA_KEY = 'children';
var BOUNDARIES_DATA_KEY = 'boundaries';
var SUMMARIES_DATA_KEY = 'summaries';
var MARKERS_DATA_KEY = 'markers';
var LABELS_DATA_KEY = 'labels';
var NOTES_DATA_KEY = 'notes';
var IMAGE_DATA_KEY = 'image';
var HREF_DATA_KEY = 'href';
var NUMBERING_DATA_KEY = 'numbering';
var FOLDED_DATA_KEY = 'branch';
var TITLE_DATA_KEY = 'title';
var POSITION_DATA_KEY = 'position';
var STRUCTURE_CLASS_DATA_KEY = 'structureClass';
var WIDTH_DATA_KEY = 'width';
var EXTENSIONS_DATA_KEY = 'extensions';

var Topic = function (_StyleComponent) {
  _inherits(Topic, _StyleComponent);

  function Topic(data) {
    var _add, _remove;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultInitOptions;

    _classCallCheck(this, Topic);

    var _this = _possibleConstructorReturn(this, _StyleComponent.call(this, data, options));

    _this.componentType = _constants.COMPONENT_TYPE.TOPIC;
    _this.modelEvents = {
      addTopic: 'addTopic',
      removeTopic: 'removeTopic',
      moveChildTopic: 'moveChildTopic',

      addBoundary: 'addBoundary',
      removeBoundary: 'removeBoundary',

      addSummary: 'addSummary',
      removeSummary: 'removeSummary',

      addImage: 'addImage',
      removeImage: 'removeImage',

      addMarker: 'addMarker',
      removeMarker: 'removeMarker',

      addLabel: 'addLabel',
      removeLabel: 'removeLabel',

      addNotes: 'addNotes',

      addHref: 'addHref',
      removeHref: 'removeHref',

      addNumbering: 'addNumbering',
      removeNumbering: 'removeNumbering',

      changeTitle: 'changeTitle',

      changePosition: 'changePosition',

      changeStructureClass: 'changeStructureClass',

      changeCustomWidth: 'changeCustomWidth',

      extensionEventMap: {
        add: (_add = {}, _add[_constants.EXTENSION_PROVIDER.AUDIO_NOTES] = 'addAudioNotes', _add[_constants.EXTENSION_PROVIDER.TASK_INFO] = 'addTaskInfo', _add[_constants.EXTENSION_PROVIDER.UNBALANCED_MAP] = 'addUnbalancedMapInfo', _add),
        remove: (_remove = {}, _remove[_constants.EXTENSION_PROVIDER.AUDIO_NOTES] = 'removeAudioNotes', _remove[_constants.EXTENSION_PROVIDER.TASK_INFO] = 'removeTaskInfo', _remove[_constants.EXTENSION_PROVIDER.UNBALANCED_MAP] = 'removeUnbalancedMapInfo', _remove)
      },

      labelsChanged: 'labelsChanged',
      informationChanged: 'informationChanged'
    };
    _this._childrenTopicMap = {};
    _this._boundaries = [];
    _this._summaries = [];
    _this._markers = [];
    _this._image = null;
    _this._notes = null;
    _this._numbering = null;
    _this._extensionMap = {};


    _this._topicType = options.type || _constants.TOPIC_TYPE.ATTACHED;
    return _this;
  }

  Topic.prototype.init = function init(sheet) {
    _StyleComponent.prototype.init.call(this, sheet);

    // children
    this._initChildren();

    // boundaries
    this._initBoundaries();

    // summaries
    this._initSummaries();

    // markers
    this._initMarkers();

    // image
    this._initImage();

    // label不存在model，所以不需要init

    // notes
    this._initNotes();

    // href不存在model

    // numbering
    this._initNumbering();

    // extensions
    this._initExtensionMap();
  };

  Topic.prototype._initChildren = function _initChildren() {
    var _this2 = this;

    var childrenData = this._data.commit('get', CHILDREN_DATA_KEY);

    if (!childrenData) return;

    Object.keys(childrenData).forEach(function (topicType) {
      var childrenDataList = childrenData[topicType];
      if (Array.isArray(childrenDataList)) {
        childrenDataList.forEach(function (topicData, index) {
          _this2._addChildTopic(topicData, { type: topicType, index: index });
        });
      }
    });
  };

  Topic.prototype._initBoundaries = function _initBoundaries() {
    var _this3 = this;

    var boundariesData = this._data.commit('get', BOUNDARIES_DATA_KEY);
    if (Array.isArray(boundariesData)) {
      boundariesData.forEach(function (boundaryData) {
        _this3._addBoundary(boundaryData);
      });
    }
  };

  Topic.prototype._initSummaries = function _initSummaries() {
    var _this4 = this;

    var summariesData = this._data.commit('get', SUMMARIES_DATA_KEY);
    if (Array.isArray(summariesData)) {
      summariesData.forEach(function (summaryData) {
        _this4._addSummary(summaryData, {}, true);
      });
    }
  };

  Topic.prototype._initMarkers = function _initMarkers() {
    var _this5 = this;

    var markersData = this._data.commit('get', MARKERS_DATA_KEY);
    if (Array.isArray(markersData)) {
      markersData.forEach(function (markerData) {
        _this5._addMarker(markerData);
      });
    }
  };

  Topic.prototype._initImage = function _initImage() {
    var imageSavedData = this._data.commit('get', IMAGE_DATA_KEY);
    if (imageSavedData) {
      this._addImage(imageSavedData);
    }
  };

  Topic.prototype._initNotes = function _initNotes() {
    var notesData = this._data.commit("get", NOTES_DATA_KEY);
    if (notesData) {
      this._addNotes(notesData);
    }
  };

  Topic.prototype._initNumbering = function _initNumbering() {
    var numberingData = this._data.commit("get", NUMBERING_DATA_KEY);
    if (numberingData) {
      this._addNumbering(numberingData);
    }
  };

  Topic.prototype._initExtensionMap = function _initExtensionMap() {
    var _this6 = this;

    var extensionsData = this._data.commit("get", EXTENSIONS_DATA_KEY);
    if (Array.isArray(extensionsData)) {
      extensionsData.forEach(function (extensionData) {
        _this6._addExtension(extensionData.provider, extensionData);
      });
    }
  };

  Topic.prototype.getType = function getType() {
    return this._topicType;
  };

  Topic.prototype.getChildrenByType = function getChildrenByType(typeList) {
    var _this7 = this;

    if (typeof typeList === 'string') {
      typeList = [typeList];
    }

    var result = [];

    typeList.forEach(function (type) {
      var childrenList = _this7._childrenTopicMap[type];
      if (Array.isArray(childrenList)) {
        result.push.apply(result, childrenList);
      }
    });

    return result;
  };

  Topic.prototype.addChildTopic = function addChildTopic(childTopicData) {
    var _this8 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultInitOptions;


    options = Object.assign({}, defaultInitOptions, options);

    // todo: before add topic 事件：触发与参数设计
    var newTopicModel = this._addChildTopic(childTopicData, options);

    // 对data数据做前置校验
    if (!this._data.commit('get', CHILDREN_DATA_KEY)) {
      this._data.commit('set', CHILDREN_DATA_KEY, {});
    }

    var childrenData = this._data.commit('get', CHILDREN_DATA_KEY);

    if (!childrenData[options.type]) {
      childrenData[options.type] = [];
    }

    // update data
    childrenData[options.type].splice(options.index, 0, childTopicData);

    var addTopicOptions = {
      type: options.type,
      index: options.index
    };

    this.triggerModelChanged(this.modelEvents.addTopic, newTopicModel, addTopicOptions);

    // todo undo and redo
    this.getUndo().add({
      undo: function undo() {
        return _this8.removeChildTopic(newTopicModel);
      },
      redo: function redo() {
        return _this8.addChildTopic(childTopicData, options);
      }
    });

    return newTopicModel;
  };

  Topic.prototype._addChildTopic = function _addChildTopic(childTopicData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultInitOptions;

    var newTopicModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.TOPIC, childTopicData, options);

    // set index value
    if ((0, _utils.isUndefined)(options.index) || (0, _utils.isNull)(options.index) || options.index < 0) {
      options.index = this.getChildrenByType(options.type).length;
    }

    // put child topic model in _childrenTopicMap
    if (!this._childrenTopicMap[options.type]) this._childrenTopicMap[options.type] = [];
    this._childrenTopicMap[options.type].splice(options.index, 0, newTopicModel);

    // set parent
    newTopicModel.parent(this);

    return newTopicModel;
  };

  Topic.prototype.removeChildTopic = function removeChildTopic(childTopic) {
    var _this9 = this;

    var childTopicType = childTopic.getType();

    var childrenList = this.getChildrenByType(childTopicType);
    var index = childrenList.indexOf(childTopic);

    if (index === -1) throw new Error('target is not child of this topic');

    // todo 相关boundary与summary的before topic remove方法具体内容

    // todo unbalance info

    // todo BEFORE_REMOVE_TOPIC事件：触发与参数设计

    // remove child topic model from _childrenTopicMap
    this._childrenTopicMap[childTopicType].splice(index, 1);

    // remove child topic data from _data
    var childrenData = this._data.commit('get', CHILDREN_DATA_KEY);

    childrenData[childTopicType].splice(index, 1);
    // 若修改后_data中已不存在对应type的child
    if (!childrenData[childTopicType].length) delete childrenData[childTopicType];
    // 若children中已不存在任何内容
    if (_underscore2.default.isEmpty(childrenData)) this._data.commit('delete', CHILDREN_DATA_KEY);

    childTopic.remove();

    var removeTopicOptions = {
      type: childTopicType,
      index: index
    };

    this.triggerModelChanged(this.modelEvents.removeTopic, childTopic, removeTopicOptions);

    // todo AFTER_REMOVE_TOPIC事件

    // todo undo
    this.getUndo().add({
      undo: function undo() {
        return _this9.addChildTopic(childTopic.toJSON(), { type: childTopicType, index: index });
      },
      redo: function redo() {
        return _this9.removeChildTopic(_this9._childrenTopicMap(childTopicType)[index]);
      }
    });
  };

  Topic.prototype.moveChildTopic = function moveChildTopic(from, to) {
    var _this10 = this;

    if ((0, _utils.isUndefined)(from) || (0, _utils.isUndefined)(to)) return;
    if (from === to) return;

    var childrenList = this._childrenTopicMap[_constants.TOPIC_TYPE.ATTACHED];

    if (!Array.isArray(childrenList)) return;

    var canMove = from >= 0 && from <= childrenList.length - 1 && to >= 0 && to <= childrenList.length - 1;

    if (!canMove) return;

    var topicModelToMove = childrenList[from];

    // move topic model in _childrenTopicMap
    this._childrenTopicMap[_constants.TOPIC_TYPE.ATTACHED].splice(from, 1);
    this._childrenTopicMap[_constants.TOPIC_TYPE.ATTACHED].splice(to, 0, topicModelToMove);

    // move json
    var childrenData = this._data.commit('get', CHILDREN_DATA_KEY);
    childrenData[_constants.TOPIC_TYPE.ATTACHED].splice(from, 1);
    childrenData[_constants.TOPIC_TYPE.ATTACHED].splice(to, 0, topicModelToMove.toJSON());

    this.trigger(this.modelEvents.moveChildTopic, from, to);

    this.getUndo().add({
      undo: function undo() {
        return _this10.moveChildTopic(to, from);
      },
      redo: function redo() {
        return _this10.moveChildTopic(from, to);
      }
    });
  };

  Topic.prototype.getBoundaries = function getBoundaries() {
    return [].concat(this._boundaries);
  };

  Topic.prototype.addBoundary = function addBoundary(boundaryData) {
    var _this11 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var newBoundaryModel = this._addBoundary(boundaryData, options);

    if (!newBoundaryModel) return;

    // 对data数据做前置校验
    if (!this._data.commit('get', BOUNDARIES_DATA_KEY)) {
      this._data.commit('set', BOUNDARIES_DATA_KEY, []);
    }

    // update data
    this._data.commit('get', BOUNDARIES_DATA_KEY).push(boundaryData);

    // todo 参数设计
    this.triggerModelChanged(this.modelEvents.addBoundary, newBoundaryModel);

    this.getUndo().add({
      undo: function undo() {
        return _this11.removeBoundary(newBoundaryModel);
      },
      redo: function redo() {
        return _this11.addBoundary(boundaryData, options);
      }
    });

    return newBoundaryModel;
  };

  Topic.prototype._addBoundary = function _addBoundary(boundaryData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newBoundaryModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.BOUNDARY, boundaryData, options);

    // todo 判断是否已有相同range的boundary

    // todo 是否需要实现boundary的checkRange方法？

    // update boundaries list
    this._boundaries.push(newBoundaryModel);
    newBoundaryModel.parent(this);

    return newBoundaryModel;
  };

  Topic.prototype.removeBoundary = function removeBoundary(boundary) {
    var _this12 = this;

    var index = this._boundaries.indexOf(boundary);
    if (index === -1) return;

    // todo boundary的remove需要实现相关relationship的remove流程

    // remove boundary model from boundaries list
    this._boundaries.splice(index, 1);

    // remove boundary data from boundariesData list
    var boundariesData = this._data.commit('get', BOUNDARIES_DATA_KEY);
    boundariesData.splice(index, 1);

    // 若boundaries data已为空，则删除boundaries data列表
    if (boundariesData.length === 0) this._data.commit('delete', BOUNDARIES_DATA_KEY);

    // todo 需要实现
    boundary.remove();

    // todo 参数设计
    this.trigger(this.modelEvents.removeBoundary);

    this.getUndo().add({
      undo: function undo() {
        return _this12.addBoundary(boundary.toJSON());
      },
      redo: function redo() {
        return _this12.removeBoundary(_this12._boundaries[index]);
      }
    });
  };

  Topic.prototype.getSummaries = function getSummaries() {
    return [].concat(this._summaries);
  };

  Topic.prototype.addSummary = function addSummary(summaryData, summaryTopicData) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // 在生成summaryModel的时候，summaryData被确保了topicId字段
    var newSummaryModel = this._addSummary(summaryData, options);

    if (!newSummaryModel) return;

    summaryTopicData.id = summaryData.topicId;

    // add new summary topic
    this.addChildTopic(summaryTopicData, { type: _constants.TOPIC_TYPE.SUMMARY });
  };

  Topic.prototype._addSummary = function _addSummary(summaryData) {
    var _this13 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var isInit = arguments[2];

    var newSummaryModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.SUMMARY, summaryData, options);

    // todo 判断是否已有相同range的summary

    // todo 是否需要实现summary的checkRange方法？

    // update summaries list
    if (options.index) options.index = this._summaries.length;

    this._summaries.splice(options.index, 0, newSummaryModel);
    newSummaryModel.parent(this);

    if (!isInit) {
      // 对data数据做前置校验
      if (!this._data.commit('get', SUMMARIES_DATA_KEY)) {
        this._data.commit('set', SUMMARIES_DATA_KEY, []);
      }

      // update data
      this._data.commit('get', SUMMARIES_DATA_KEY).splice(options.index, 0, summaryData);

      this.getUndo().add({
        undo: function undo() {
          return _this13._removeSummary(newSummaryModel);
        },
        redo: function redo() {
          return _this13._addSummary(summaryData, options);
        }
      });
    }

    return newSummaryModel;
  };

  Topic.prototype.removeSummary = function removeSummary(summary) {
    this._removeSummary(summary);

    // remove summary topic
    var summaryTopic = summary.getSummaryTopic();
    this.removeChildTopic(summaryTopic);
  };

  Topic.prototype._removeSummary = function _removeSummary(summary) {
    var _this14 = this;

    var index = this._summaries.indexOf(summary);
    if (index === -1) return;

    // remove from summaries
    this._summaries.splice(index, 1);

    // remove from summariesData
    var summariesData = this._data.commit('get', SUMMARIES_DATA_KEY);
    summariesData.splice(index, 1);

    // remove summaries data while it's empty
    if (summariesData.length === 0) this._data.commit('delete', SUMMARIES_DATA_KEY);

    // todo 需要实现
    summary.remove();

    this.triggerModelChanged(this.modelEvents.removeSummary);

    // todo
    this.getUndo().add({
      undo: function undo() {
        return _this14._addSummary(summary.toJSON(), { index: index });
      },
      redo: function redo() {
        return _this14._removeSummary(_this14._summaries[index]);
      }
    });
  };

  Topic.prototype._canCollapse = function _canCollapse() {
    var hasChildren = this.getChildrenByType(_constants.TOPIC_TYPE.ATTACHED).length > 0;
    return hasChildren && !this.isRootTopic();
  };

  Topic.prototype.isFolded = function isFolded() {
    return this._data.commit('get', FOLDED_DATA_KEY) === 'folded' && this._canCollapse();
  };

  Topic.prototype.extendTopic = function extendTopic() {
    var _this15 = this;

    if (this.isFolded()) {
      this._data.commit('delete', FOLDED_DATA_KEY);

      this.getUndo().add({
        undo: function undo() {
          return _this15.collapseTopic();
        },
        redo: function redo() {
          return _this15.extendTopic();
        }
      });
    }
  };

  Topic.prototype.collapseTopic = function collapseTopic() {
    var _this16 = this;

    if (!this.isFolded() && this._canCollapse()) {
      this._data.commit('set', FOLDED_DATA_KEY, 'folded');

      this.getUndo().add({
        undo: function undo() {
          return _this16.extendTopic();
        },
        redo: function redo() {
          return _this16.collapseTopic();
        }
      });
    }
  };

  Topic.prototype.getMarkers = function getMarkers() {
    return [].concat(this._markers);
  };

  Topic.prototype.addMarker = function addMarker(markerData) {
    var _this17 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this._addMarker(markerData, options);

    // check markers data list
    if (!this._data.commit('get', MARKERS_DATA_KEY)) {
      this._data.commit('set', MARKERS_DATA_KEY, []);
    }

    // update markers data
    this._data.commit('get', MARKERS_DATA_KEY).push(markerData);

    // todo 参数设计
    this.triggerModelChanged(this.modelEvents.addMarker);

    this.getUndo().add({
      undo: function undo() {
        return _this17.removeMarker(markerData);
      },
      redo: function redo() {
        return _this17.addMarker(markerData, options);
      }
    });
  };

  Topic.prototype._addMarker = function _addMarker(markerData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // update markers list
    this._markers.push(markerData);

    // trigger sheet's add marker, for legend model's liveMarkerMap data
    this.ownerSheet().trigger(this.ownerSheet().modelEvents.topicAddMarker, markerData);
  };

  // todo


  Topic.prototype.changeMarker = function changeMarker() {};

  Topic.prototype.removeMarker = function removeMarker(markerData) {
    var _this18 = this;

    var index = this._markers.findIndex(function (existMarkerData) {
      return existMarkerData.markerId === markerData.markerId;
    });
    if (index === -1) return;

    // remove from model
    this._markers.splice(index, 1);

    // remove from data
    var markersData = this._data.commit('get', MARKERS_DATA_KEY);
    markersData.splice(index, 1);

    if (markersData.length === 0) this._data.commit('delete', MARKERS_DATA_KEY);

    // todo 参数设计
    this.triggerModelChanged(this.modelEvents.removeMarker);

    // todo sheet topicRemoveMarker event
    this.ownerSheet().trigger(this.ownerSheet().modelEvents.topicRemoveMarker, Object.assign({}, markerData));

    this.getUndo().add({
      undo: function undo() {
        return _this18.addMarker(Object.assign({}, markerData));
      },
      redo: function redo() {
        return _this18.removeMarker(_this18._markers[index]);
      }
    });
  };

  Topic.prototype.getImage = function getImage() {
    return this._image;
  };

  Topic.prototype.addImage = function addImage(imageData) {
    var _this19 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this._image) this.removeImage();

    this._addImage(imageData, options);

    // update data
    this._data.commit("set", IMAGE_DATA_KEY, imageData);

    this.trigger(this.modelEvents.addImage);

    this.getUndo().add({
      undo: function undo() {
        return _this19.removeImage();
      },
      redo: function redo() {
        return _this19.addImage(imageData, options);
      }
    });
  };

  Topic.prototype._addImage = function _addImage(imageData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newImageModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.IMAGE, imageData, options);

    newImageModel.parent(this);

    // update _image
    this._image = newImageModel;

    return newImageModel;
  };

  Topic.prototype.removeImage = function removeImage() {
    var _this20 = this;

    if (!this._image) return;

    var imageModel = this._image;

    imageModel.parent(null);

    // remove model
    this._image = null;

    // remove data
    this._data.commit("delete", IMAGE_DATA_KEY);

    imageModel.removeSelf();

    this.trigger(this.modelEvents.removeImage);

    this.getUndo().add({
      undo: function undo() {
        return _this20.addImage(imageModel.toJSON());
      },
      redo: function redo() {
        return _this20.removeImage();
      }
    });
  };

  /** @important 没有Label Model */


  Topic.prototype.getLabels = function getLabels() {
    var labels = this._data.commit('get', LABELS_DATA_KEY) || [];
    return [].concat(labels);
  };

  // todo 第一个参数是否需要支持数组？


  Topic.prototype.addLabel = function addLabel(newLabel) {
    var _this21 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var labels = this.getLabels();

    if (labels.includes(newLabel)) return;

    // update data
    var index = options.index || labels.length;
    labels.splice(index, 0, newLabel);
    this._data.commit('set', LABELS_DATA_KEY, [].concat(labels));

    this.trigger(this.modelEvents.addLabel);

    this.getUndo().add({
      undo: function undo() {
        return _this21.removeLabel(newLabel);
      },
      redo: function redo() {
        return _this21.addLabel(newLabel, options);
      }
    });
  };

  Topic.prototype.removeLabel = function removeLabel(label) {
    var _this22 = this;

    var labels = this.getLabels();

    var index = labels.indexOf(label);

    if (index === -1) return;

    // update data
    labels.splice(index, 1);
    if (labels.length) {
      this._data.commit("set", LABELS_DATA_KEY, [].concat(labels));
    } else {
      this._data.commit("delete", LABELS_DATA_KEY);
    }

    this.trigger(this.modelEvents.removeLabel);

    this.getUndo().add({
      undo: function undo() {
        return _this22.addLabel(label, { index: index });
      },
      redo: function redo() {
        return _this22.removeLabel(label);
      }
    });
  };

  Topic.prototype.getNotes = function getNotes() {
    return this._notes;
  };

  Topic.prototype.addNotes = function addNotes(notesData) {
    var _this23 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this._addNotes(notesData, options);

    // update data
    this._data.commit("set", NOTES_DATA_KEY, notesData);

    this.trigger(this.modelEvents.addNotes);

    this.getUndo().add({
      undo: function undo() {
        return _this23.removeNotes();
      },
      redo: function redo() {
        return _this23.addNotes(notesData, options);
      }
    });
  };

  Topic.prototype._addNotes = function _addNotes(notesData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newNotesModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.NOTE, notesData, options);

    // update _notes
    this._notes = newNotesModel;

    return newNotesModel;
  };

  Topic.prototype.removeNotes = function removeNotes() {
    var _this24 = this;

    var notesModel = this._notes;

    if (!notesModel) return;

    // remove _notes
    this._notes = null;

    // remove data
    this._data.commit("delete", NOTES_DATA_KEY);

    notesModel.remove();

    this.trigger(this.modelEvents.removeNotes);

    this.getUndo().add({
      undo: function undo() {
        return _this24.addNotes(notesModel.toJSON());
      },
      redo: function redo() {
        return _this24.removeNotes();
      }
    });
  };

  Topic.prototype.getHref = function getHref() {
    return this._data.commit('get', HREF_DATA_KEY);
  };

  Topic.prototype.addHref = function addHref(href) {
    var _this25 = this;

    // update data
    this._data.commit("set", HREF_DATA_KEY, href);

    this.trigger(this.modelEvents.addHref);

    this.getUndo().add({
      undo: function undo() {
        return _this25.removeHref();
      },
      redo: function redo() {
        return _this25.addHref(href);
      }
    });
  };

  Topic.prototype.removeHref = function removeHref() {
    var _this26 = this;

    var oldHref = this.getHref();

    if (!oldHref) return;

    // update data
    this._data.commit("delete", HREF_DATA_KEY);

    this.trigger(this.modelEvents.removeHref);

    this.getUndo().add({
      undo: function undo() {
        return _this26.addHref(oldHref);
      },
      redo: function redo() {
        return _this26.removeHref();
      }
    });
  };

  // todo


  Topic.prototype.getComments = function getComments() {};

  // todo


  Topic.prototype.changeComments = function changeComments(newCommentsInfo) {};

  Topic.prototype.getNumbering = function getNumbering() {
    return this._numbering;
  };

  Topic.prototype.addNumbering = function addNumbering(numberingData) {
    var _this27 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // update data
    if (!numberingData) {
      this._data.commit("delete", NUMBERING_DATA_KEY);
    } else {
      this._data.commit("set", NUMBERING_DATA_KEY, numberingData);
      this._addNumbering(numberingData, options);
    }

    this.trigger(this.modelEvents.addNumbering);

    this.getUndo().add({
      undo: function undo() {
        return _this27.removeNumbering();
      },
      redo: function redo() {
        return _this27.addNumbering(numberingData, options);
      }
    });
  };

  Topic.prototype._addNumbering = function _addNumbering(numberingData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newNumberingModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.NUMBERING, numberingData, options);

    // update _numbering
    this._numbering = newNumberingModel;

    return newNumberingModel;
  };

  Topic.prototype.changeNumbering = function changeNumbering(key, value) {
    this._numbering.changeNumbering(key, value);
  };

  Topic.prototype.removeNumbering = function removeNumbering() {
    var _this28 = this;

    var oldNumberingModel = this._numbering;

    if (!oldNumberingModel) return;

    // remove _numbering
    this._numbering = null;

    // remove data
    this._data.commit("delete", NUMBERING_DATA_KEY);

    this._numbering.remove();

    this.trigger(this.modelEvents.removeNumbering);

    this.getUndo().add({
      undo: function undo() {
        return _this28.addNumbering(oldNumberingModel.toJSON());
      },
      redo: function redo() {
        return _this28.removeNumbering();
      }
    });
  };

  Topic.prototype.isRootTopic = function isRootTopic() {
    return this.getType() === _constants.TOPIC_TYPE.ROOT;
  };

  Topic.prototype.getTitle = function getTitle() {
    return this._data.commit('get', TITLE_DATA_KEY);
  };

  Topic.prototype.changeTitle = function changeTitle(title) {
    var _this29 = this;

    var oldTitle = this.getTitle();

    if (oldTitle === title) return;

    this._data.commit("set", TITLE_DATA_KEY, title);

    this.trigger(this.modelEvents.changeTitle);

    this.getUndo().add({
      undo: function undo() {
        return _this29.changeTitle(oldTitle);
      },
      redo: function redo() {
        return _this29.changeTitle(title);
      }
    });
  };

  /**
   * For floating topic
   */


  Topic.prototype.getPosition = function getPosition() {
    return Object.assign({}, this._data.commit("get", POSITION_DATA_KEY));
  };

  Topic.prototype.changePosition = function changePosition(position) {
    var _this30 = this;

    var oldPosition = this.getPosition();

    if (!position || !(0, _utils.isPointLike)(position)) {
      this._data.commit("delete", POSITION_DATA_KEY);
    } else {
      if ((0, _utils.isEqualPoint)(position, oldPosition)) return;

      this._data.commit("set", POSITION_DATA_KEY, position);
    }

    this.trigger(this.modelEvents.changePosition);

    this.getUndo().add({
      undo: function undo() {
        return _this30.changePosition(oldPosition);
      },
      redo: function redo() {
        return _this30.changePosition(position);
      }
    });
  };

  Topic.prototype.getStructureClass = function getStructureClass() {
    return this._data.commit("get", STRUCTURE_CLASS_DATA_KEY);
  };

  Topic.prototype.changeStructureClass = function changeStructureClass(structureClass) {
    var _this31 = this;

    var oldStructureClass = this.getStructureClass();

    if (oldStructureClass === structureClass) return;

    if (structureClass) {
      this._data.commit("set", STRUCTURE_CLASS_DATA_KEY, structureClass);
    } else {
      this._data.commit("delete", STRUCTURE_CLASS_DATA_KEY);
    }

    this.trigger(this.modelEvents.changeStructureClass);

    this.getUndo().add({
      undo: function undo() {
        return _this31.changeStructureClass(oldStructureClass);
      },
      redo: function redo() {
        return _this31.changeStructureClass(structureClass);
      }
    });
  };

  Topic.prototype.getCustomWidth = function getCustomWidth() {
    return this._data.commit("get", WIDTH_DATA_KEY);
  };

  Topic.prototype.changeCustomWidth = function changeCustomWidth(customWidth) {
    var _this32 = this;

    var oldWidth = this.getCustomWidth();

    if (oldWidth === customWidth) return;

    if (customWidth) {
      this._data.commit("set", WIDTH_DATA_KEY, customWidth);
    } else {
      // custom width won't be zero.
      this._data.commit("delete", WIDTH_DATA_KEY);
    }

    this.trigger(this.modelEvents.changeCustomWidth);

    this.getUndo().add({
      undo: function undo() {
        return _this32.changeCustomWidth(oldWidth);
      },
      redo: function redo() {
        return _this32.changeCustomWidth(customWidth);
      }
    });
  };

  Topic.prototype.addExtension = function addExtension(provider, extensionData) {
    var _this33 = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    this._addExtension(provider, extensionData, options);

    // update data 直接根据extensionMap的结果全部覆盖
    var extensionsData = Object.keys(this._extensionMap).map(function (provider) {
      return _this33._extensionMap[provider];
    });
    this._data.commit("set", EXTENSIONS_DATA_KEY, extensionsData);

    this.trigger(this.modelEvents.extensionEventMap.add[provider]);

    this.getUndo().add({
      undo: function undo() {
        return _this33.removeExtension(provider);
      },
      redo: function redo() {
        return _this33.addExtension(provider, extensionData, options);
      }
    });
  };

  Topic.prototype._addExtension = function _addExtension(provider, extensionData) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var newExtensionModel = this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.EXTENSION, extensionData, options);

    // update _extensionMap
    this._extensionMap[provider] = newExtensionModel;

    return newExtensionModel;
  };

  Topic.prototype.removeExtension = function removeExtension(provider) {
    var _this34 = this;

    var targetExtension = this._extensionMap[provider];

    if (!targetExtension) return;

    // update _extensionMap
    delete this._extensionMap[provider];

    // update _data
    var extensionsData = Object.keys(this._extensionMap).map(function (provider) {
      return _this34._extensionMap[provider];
    });
    if (extensionsData.length) {
      this._data.commit("set", EXTENSIONS_DATA_KEY, extensionsData);
    } else {
      this._data.commit("delete", EXTENSIONS_DATA_KEY);
    }

    // model remove invoke
    targetExtension.remove();

    this.trigger(this.modelEvents.extensionEventMap.remove[provider]);

    this.getUndo().add({
      undo: function undo() {
        return _this34.addExtension(provider, targetExtension.toJSON());
      },
      redo: function redo() {
        return _this34.removeExtension(provider);
      }
    });
  };

  Topic.prototype.getExtensions = function getExtensions() {
    return Object.values(this._extensionMap);
  };

  Topic.prototype.getExtension = function getExtension(provider) {
    return this._extensionMap[provider];
  };

  Topic.prototype.getAudioNotes = function getAudioNotes() {
    return this._extensionMap[_constants.EXTENSION_PROVIDER.AUDIO_NOTES];
  };

  Topic.prototype.addAudioNotes = function addAudioNotes(audioNotesData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.addExtension(_constants.EXTENSION_PROVIDER.AUDIO_NOTES, audioNotesData, options);
  };

  Topic.prototype.removeAudioNotes = function removeAudioNotes() {
    this.removeExtension(_constants.EXTENSION_PROVIDER.AUDIO_NOTES);
  };

  Topic.prototype.getTaskInfo = function getTaskInfo() {
    return this._extensionMap[_constants.EXTENSION_PROVIDER.TASK_INFO];
  };

  Topic.prototype.addTaskInfo = function addTaskInfo(taskInfoData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.addExtension(_constants.EXTENSION_PROVIDER.TASK_INFO, taskInfoData, options);
  };

  Topic.prototype.removeTaskInfo = function removeTaskInfo() {
    this.removeExtension(_constants.EXTENSION_PROVIDER.TASK_INFO);
  };

  Topic.prototype.getUnbalancedMapInfo = function getUnbalancedMapInfo() {
    return this._extensionMap[_constants.EXTENSION_PROVIDER.UNBALANCED_MAP];
  };

  Topic.prototype.setUnBalancedInfoContent = function setUnBalancedInfoContent(content) {
    var extensionModel = this.getUnbalancedMapInfo(),
        extensionData = void 0;
    if (!extensionModel) {
      extensionData = {
        "content": [{
          "content": content + "",
          "name": "right-number"
        }],
        "provider": "org.xmind.ui.map.unbalanced"
      };
    } else {
      extensionData = extensionModel.toJSON();
    }

    if (extensionData.content[0]) {
      extensionData.content[0].content = '' + content;
      this.addUnbalancedMapInfo(extensionData);
      this.trigger("unbalancedInfoUpdated", content);
    }
  };

  Topic.prototype.addUnbalancedMapInfo = function addUnbalancedMapInfo(unbalancedMapData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.addExtension(_constants.EXTENSION_PROVIDER.UNBALANCED_MAP, unbalancedMapData, options);
  };

  Topic.prototype.removeUnbalancedMapInfo = function removeUnbalancedMapInfo() {
    this.removeExtension(_constants.EXTENSION_PROVIDER.UNBALANCED_MAP);
  };

  Topic.prototype.remove = function remove() {
    this.parent(null);
  };

  Topic.prototype.removeSelf = function removeSelf() {
    this.parent().removeChildTopic(this);
  };

  /** todo */


  Topic.prototype.markers = function markers() {
    console.error('need to remove');
    return this.getMarkers();
  };

  Topic.prototype.boundaries = function boundaries() {
    console.error('need to remove');
    return this.getBoundaries();
  };

  Topic.prototype.summaries = function summaries() {
    console.error('need to remove');
    return this.getSummaries();
  };

  Topic.prototype.customWidth = function customWidth() {
    console.error('need to remove');
    return this.getCustomWidth();
  };

  Topic.prototype.createEmptyTopic = function createEmptyTopic(data) {
    return this.ownerSheet().createComponent(_constants.COMPONENT_TYPE.TOPIC, data);
  };

  Topic.prototype.getDescendantList = function getDescendantList() {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    console.error('need to remove');

    var result = [];

    var children = this.getChildrenByType(types);

    if (!children.length) return result;

    result.push.apply(result, children);

    children.forEach(function (child) {
      result.push.apply(result, child.getDescendantList.apply(child, types));
    });

    return result;
  };

  Topic.prototype.getImageModel = function getImageModel() {
    console.error('need to remove');

    return this.getImage();
  };

  return Topic;
}(_styleComponent2.default);

exports.default = Topic;
