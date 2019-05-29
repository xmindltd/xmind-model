'use strict';

exports.__esModule = true;
exports.UndoManager = exports.Undo = undefined;

var _constants = require('../common/constants');

var _baseevent = require('./baseevent');

var _baseevent2 = _interopRequireDefault(_baseevent);

var _baseutil = require('./baseutil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TIME = 0;

var getMaxIndex = function getMaxIndex(arr) {
  var max = -Infinity;
  var maxIndex = 0;
  arr.forEach(function (n, i) {
    if (n > max) {
      max = n;
      maxIndex = i;
    }
  });
  return maxIndex;
};

var getMinIndex = function getMinIndex(arr) {
  var min = Infinity;
  var minIndex = 0;
  arr.forEach(function (n, i) {
    if (n < min) {
      min = n;
      minIndex = i;
    }
  });
  return minIndex;
};

var UndoStack = function () {
  function UndoStack() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { limit: 20 };

    _classCallCheck(this, UndoStack);

    this.opt = opt;
    this.undostack = []; //[[{undo: fn, redo: fn}... ]... ]
    this._index = 0;
    this._blocking = false;
  }

  UndoStack.prototype.addEmptyStep = function addEmptyStep() {
    var emptyStep = [];
    // delete the step which is dirty
    this.undostack = this.undostack.slice(0, this._index);

    this.undostack.push(emptyStep);
    if (this.undostack.length > this.opt.limit) {
      this.undostack = this.undostack.slice(1);
    }
    this._index = this.undostack.length;
  };

  UndoStack.prototype.addEntry = function addEntry(entry, needNewStep) {
    if (this._blocking) return;
    if (needNewStep) {
      this.addEmptyStep();
    }

    // push entry to the last step of undostack
    var last = this.undostack.length - 1;
    this.undostack[last].push(entry);
  };

  UndoStack.prototype.pop = function pop() {
    var entries = this.undostack.pop();
    this._index = Math.min(this._index, this.undostack.length);
    return entries;
  };

  UndoStack.prototype.clearRedo = function clearRedo() {
    this.undostack = this.undostack.slice(0, this._index);
  };

  UndoStack.prototype.isReadyUndo = function isReadyUndo() {
    return this._index !== 0;
  };

  UndoStack.prototype.isReadyRedo = function isReadyRedo() {
    return this._index !== this.undostack.length;
  };

  /**
   * @public
   * */


  UndoStack.prototype.undo = function undo() {
    if (!this.isReadyUndo()) {
      return;
    }
    this._blocking = true;
    this._index--;
    var entries = this.undostack[this._index];

    for (var i = entries.length - 1; i >= 0; i--) {
      entries[i].undo();
    }
    this._blocking = false;
    return entries;
  };

  /**
   * @public
   * */


  UndoStack.prototype.redo = function redo() {
    if (!this.isReadyRedo()) {
      return;
    }
    this._blocking = true;
    var entries = this.undostack[this._index];

    entries.forEach(function (entry) {
      return entry.redo();
    });
    this._index++;

    this._blocking = false;
    return entries;
  };

  /**
   * @public
   * @return {number}
   * */


  UndoStack.prototype.getIndex = function getIndex() {
    return this._index;
  };

  UndoStack.prototype.getUndoAction = function getUndoAction() {
    return this.undostack[this._index - 1];
  };

  UndoStack.prototype.getRedoAction = function getRedoAction() {
    return this.undostack[this._index];
  };

  return UndoStack;
}();

var CREATE = 'CREATE';
var ACCEPT = 'ACCEPT';
var EXECUTING = 'EXECUTING';

var Undo = exports.Undo = function (_BaseEvent) {
  _inherits(Undo, _BaseEvent);

  /**
   * Creates an instance of Undo.
   * @param {Object} opt
   * @param {Number} opt.limit - undoStack length limit
   * @memberof Undo
   */
  function Undo(opt) {
    _classCallCheck(this, Undo);

    var _this = _possibleConstructorReturn(this, _BaseEvent.call(this, opt));

    _this.undoStack = new UndoStack(opt);
    _this.state = CREATE;
    // keepMode: keep accepting new entris to last step of undo stack
    _this.keepMode = false;
    _this.recording = true;
    return _this;
  }

  Undo.prototype.isExecuting = function isExecuting() {
    return this.state === EXECUTING;
  };

  Undo.prototype.setState = function setState(newState) {
    clearTimeout(this.TIMEOUT_ID);
    this.state = newState;
  };

  Undo.prototype.timeoutInit = function timeoutInit() {
    var _this2 = this;

    clearTimeout(this.TIMEOUT_ID);
    this.TIMEOUT_ID = setTimeout(function () {
      _this2.initState();
      //this.triggerUndoState()
    }, TIME);
  };

  Undo.prototype.initState = function initState() {
    this.setState(CREATE);
  };

  Undo.prototype.openKeepMode = function openKeepMode() {
    this.keepMode = true;
    this.initState();
  };

  Undo.prototype.closeKeepMode = function closeKeepMode() {
    this.keepMode = false;
    this.initState();
    this.triggerUndoState();
  };

  /**
   * enable or disable undo.
   * @param {boolean} newRecord - open or close undo.
   */


  Undo.prototype.setRecord = function setRecord(newRecord) {
    this.recording = newRecord;
  };

  /** @public */


  Undo.prototype.add = function add(entry, type) {
    if (!this.recording) {
      return;
    }
    entry.type = type;

    switch (this.state) {
      case CREATE:
        var needNewStep = true;
        this.undoStack.addEntry(entry, needNewStep);
        this.setState(ACCEPT);
        this.trigger("undoPushed", this.getUndoAction());
        if (!this.keepMode) {
          this.timeoutInit();
        }
        break;
      case ACCEPT:
        this.undoStack.addEntry(entry);
        if (!this.keepMode) {
          this.timeoutInit();
        }
        break;
      case EXECUTING:
      default:
        return;
    }

    this.triggerUndoState();
  };

  Undo.prototype.pop = function pop() {
    this.undoStack.pop();
    this.initState();
    this.trigger("undoPoped");
    this.triggerUndoState();
  };

  Undo.prototype.clearRedo = function clearRedo() {
    this.undoStack.clearRedo();
    this.initState();
    this.triggerUndoState();
  };

  Undo.prototype.undo = function undo() {
    this.setState(EXECUTING);
    this.undoStack.undo();
    this.initState();

    this.triggerUndoState();
  };

  Undo.prototype.redo = function redo() {
    this.setState(EXECUTING);
    this.undoStack.redo();
    this.initState();

    this.triggerUndoState();
  };

  Undo.prototype.isReadyUndo = function isReadyUndo() {
    return this.undoStack.isReadyUndo();
  };

  Undo.prototype.isReadyRedo = function isReadyRedo() {
    return this.undoStack.isReadyRedo();
  };

  Undo.prototype.triggerUndoState = function triggerUndoState() {
    this.trigger(_constants.EVENTS.UNDO_STATE_CHANGE);
  };

  /**
   * @public
   * @return {number}
   * */


  Undo.prototype.getIndex = function getIndex() {
    return this.undoStack.getIndex();
  };

  Undo.prototype.getUndoAction = function getUndoAction() {
    return this.undoStack.getUndoAction();
  };

  Undo.prototype.getRedoAction = function getRedoAction() {
    return this.undoStack.getRedoAction();
  };

  return Undo;
}(_baseevent2.default);

/**
 * manage the undoObj, help workbook to find the appropriate undoObj
 */


var UndoManager = exports.UndoManager = function (_BaseEvent2) {
  _inherits(UndoManager, _BaseEvent2);

  function UndoManager() {
    _classCallCheck(this, UndoManager);

    var _this3 = _possibleConstructorReturn(this, _BaseEvent2.call(this));

    _this3.curTimeStamp = 0;
    _this3._undoObjArr = [];
    return _this3;
  }

  UndoManager.prototype.addUndoObj = function addUndoObj(undoObj) {
    var _this4 = this;

    this._undoObjArr.push(undoObj);
    this.listenTo(undoObj, 'undoPushed', function (action) {
      action._timeStamp = _this4.curTimeStamp;
      _this4.curTimeStamp++;
    });
  };

  UndoManager.prototype.removeUndoObj = function removeUndoObj(undoObj) {
    var index = this._undoObjArr.indexOf(undoObj);
    if (index > 0) {
      this._undoObjArr.splice(index, 1);
      this.stopListening(undoObj);
    }
  };

  UndoManager.prototype.getUndoObj = function getUndoObj() {
    var undoObjArr = this._undoObjArr;
    var actionArr = undoObjArr.map(function (undoObj) {
      return undoObj.getUndoAction();
    });
    var timeStampArr = actionArr.map(function (action) {
      if ((0, _baseutil.isUndef)(action)) {
        return -Infinity;
      } else {
        return action._timeStamp;
      }
    });
    var index = getMaxIndex(timeStampArr);
    return undoObjArr[index];
  };

  UndoManager.prototype.getRedoObj = function getRedoObj() {
    var undoObjArr = this._undoObjArr;
    var actionArr = undoObjArr.map(function (undoObj) {
      return undoObj.getRedoAction();
    });
    var timeStampArr = actionArr.map(function (action) {
      if ((0, _baseutil.isUndef)(action)) {
        return Infinity;
      } else {
        return action._timeStamp;
      }
    });
    var index = getMinIndex(timeStampArr);
    return undoObjArr[index];
  };

  return UndoManager;
}(_baseevent2.default);