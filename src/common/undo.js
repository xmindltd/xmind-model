'use strict';

exports.__esModule = true;

var _constants = require('./constants');

var _baseEvent = require('./utils/base-event');

var _baseEvent2 = _interopRequireDefault(_baseEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EXECUTOR_RESULT_NEXT = 'next';
var EXECUTOR_RESULT_BREAK = 'break';


var DEFAULT_LIMITED_LENGTH = 20;

var DEFAULT_GROUP_NAME = '__default__';

var DEFAULT_EXECUTOR = function DEFAULT_EXECUTOR(operateType, tasks) {
  var length = tasks.length;
  if (operateType === 'undo') {
    for (var i = length - 1; i >= 0; i--) {
      var task = tasks[i];
      task['undo']();
    }
  } else if (operateType === 'redo') {
    for (var _i = 0; _i < length; _i++) {
      var _task = tasks[_i];
      _task['redo']();
    }
  }
  return EXECUTOR_RESULT_BREAK;
};

var Group = function () {
  function Group(identifier, executor) {
    _classCallCheck(this, Group);

    this._identifier = identifier;
    this._executor = executor;

    this._tasks = [];
  }

  Group.prototype.getName = function getName() {
    return this._identifier;
  };

  Group.prototype.push = function push(task) {
    this._tasks.push(task);
  };

  Group.prototype.pop = function pop() {
    this._tasks.pop();
  };

  Group.prototype.execute = function execute(operateType) {
    var executorResult = EXECUTOR_RESULT_BREAK;
    var executor = this._executor ? this._executor : DEFAULT_EXECUTOR;
    var newTasks = Array.from(this._tasks);
    var result = executor(operateType, newTasks);
    if (!result) executorResult = EXECUTOR_RESULT_NEXT;
    return executorResult;
  };

  return Group;
}();

var UndoManager = function (_BaseEvent) {
  _inherits(UndoManager, _BaseEvent);

  function UndoManager() {
    _classCallCheck(this, UndoManager);

    var _this = _possibleConstructorReturn(this, _BaseEvent.call(this));

    _this._undoStack = [];
    _this._redoStack = [];
    _this._standbyGroup = null;

    _this._limitedLength = DEFAULT_LIMITED_LENGTH;

    _this._canRecord = true;
    _this._blocking = false;
    _this._allInOne = false;

    _this._nameToTagGroup = new Map();
    return _this;
  }

  UndoManager.prototype.setRecordState = function setRecordState(canRecord) {
    this._canRecord = canRecord;
  };

  UndoManager.prototype.keepAllInOne = function keepAllInOne(allInOne) {
    if (this._allInOne !== allInOne) {
      this._allInOne = allInOne;
      if (!allInOne) {
        this._resetStandbyGroup();
      }
    }
  };

  UndoManager.prototype.setStackLimitedLength = function setStackLimitedLength(length) {
    this._limitedLength = length;

    var undoStackLength = this._undoStack.length;
    var redoStackLength = this._redoStack.length;

    if (this._limitedLength < undoStackLength) {
      this._undoStack.slice(undoStackLength - this._limitedLength, undoStackLength);
    } else if (this._limitedLength < undoStackLength + redoStackLength) {
      this._redoStack.slice(redoStackLength + undoStackLength - this._limitedLength, this._limitedLength - undoStackLength);
    }
  };

  UndoManager.prototype._genNewGroup = function _genNewGroup(name, executor) {
    var newGroup = new Group(name, executor);
    this._changeUndoStack(newGroup);
    this._redoStack.length = 0;
    if (this._undoStack.length + this._redoStack.length > this._limitedLength) {
      this._undoStack = this._undoStack.slice(1, this._limitedLength);
    }
    return newGroup;
  };

  UndoManager.prototype._autoStandbyGroup = function _autoStandbyGroup() {
    var _this2 = this;

    clearTimeout(this.TIMEOUT_ID);
    this.TIMEOUT_ID = setTimeout(function () {
      if (_this2._allInOne) return;
      _this2._resetStandbyGroup();
    }, 0);
    var newGroup = this._genNewGroup(DEFAULT_GROUP_NAME);
    return newGroup;
  };

  UndoManager.prototype.add = function add(task, type) {
    this.push(task, type);
  };

  UndoManager.prototype.push = function push(task, type) {
    if (!this._canRecord) return;

    if (this._blocking) return;

    task.type = type;

    if (!this._standbyGroup) {
      this._standbyGroup = this._autoStandbyGroup();
    }
    this._standbyGroup.push(task);
  };

  UndoManager.prototype.pop = function pop() {
    var group = this._changeUndoStack();
    this._redoStack.length = 0;
    this._nameToTagGroup.delete(group && group.getName());
    this._resetStandbyGroup();
    return group;
  };

  /**
   * Append to last group which is not tag group
   * @param {*} task
   * @param {*} type
   */


  UndoManager.prototype.append = function append(task, type) {
    if (!this._canRecord) return;

    if (this._blocking) return;

    task.type = type;

    var lastGroup = this.getLastGroup();
    if (!lastGroup || this.isTagGroup(lastGroup)) {
      lastGroup = this._genNewGroup(DEFAULT_GROUP_NAME);
    }
    lastGroup.push(task);
  };

  UndoManager.prototype.getLastGroup = function getLastGroup() {
    return this._undoStack[this._undoStack.length - 1];
  };

  UndoManager.prototype.isTagGroup = function isTagGroup(group) {
    return this._nameToTagGroup.has(group.getName());
  };

  UndoManager.prototype.pushTag = function pushTag(tagName, executor) {
    if (!this._canRecord) return;

    if (this._blocking) return;

    if (this._nameToTagGroup.has(tagName)) return;

    this._resetStandbyGroup();

    var newGroup = this._genNewGroup(tagName, executor);
    this._nameToTagGroup.set(tagName, newGroup);
  };

  UndoManager.prototype.popTag = function popTag(tagName) {
    this._resetStandbyGroup();

    var group = this._nameToTagGroup.get(tagName);
    var indexForUndo = this._undoStack.indexOf(group);
    if (indexForUndo > -1) {
      this._undoStack.splice(indexForUndo, 1);
    }
    var indexForRedo = this._redoStack.indexOf(group);
    if (indexForRedo > -1) {
      this._redoStack.splice(indexForRedo, 1);
    }
    this._nameToTagGroup.delete(tagName);
    return group;
  };

  UndoManager.prototype.undo = function undo() {
    this._blocking = true;
    this._resetStandbyGroup();
    var currentGroup = this._changeUndoStack();
    if (currentGroup) {
      this._redoStack.push(currentGroup);
      var result = currentGroup.execute('undo');
      if (result === EXECUTOR_RESULT_NEXT) {
        this.undo();
      }
    }
    this._blocking = false;
  };

  UndoManager.prototype.redo = function redo() {
    this._blocking = true;
    this._resetStandbyGroup();
    var currentGroup = this._redoStack.pop();
    if (currentGroup) {
      this._changeUndoStack(currentGroup);
      var result = currentGroup.execute('redo');
      if (result === EXECUTOR_RESULT_NEXT) {
        this.redo();
      }
    }
    this._blocking = false;
  };

  UndoManager.prototype._resetStandbyGroup = function _resetStandbyGroup() {
    this._standbyGroup = null;
  };

  UndoManager.prototype._changeUndoStack = function _changeUndoStack(task) {
    var _this3 = this;

    var result = task ? this._undoStack.push(task) : this._undoStack.pop();
    Promise.resolve().then(function () {
      _this3.trigger(_constants.EVENTS.UNDO_STATE_CHANGE, { canUndo: _this3.canUndo(), canRedo: _this3.canRedo() });
    });
    return result;
  };

  UndoManager.prototype.isExecuting = function isExecuting() {
    return this._blocking === true;
  };

  UndoManager.prototype.canUndo = function canUndo() {
    return this._undoStack.length > 0;
  };

  UndoManager.prototype.canRedo = function canRedo() {
    return this._redoStack.length > 0;
  };

  UndoManager.prototype.clearRedo = function clearRedo() {
    this._redoStack.length = 0;
  };

  UndoManager.prototype.getIndex = function getIndex() {
    return this._undoStack.length - 1;
  };

  return UndoManager;
}(_baseEvent2.default);

exports.default = UndoManager;