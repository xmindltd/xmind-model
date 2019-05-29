'use strict';

exports.__esModule = true;
exports.default = undefined;

var _utils = require('../common/utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseModel = function (_BaseEvent) {
  _inherits(BaseModel, _BaseEvent);

  function BaseModel(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, BaseModel);

    var _this = _possibleConstructorReturn(this, _BaseEvent.call(this));

    _this._data = new DataWrapper(data);
    _this._options = options;
    return _this;
  }

  BaseModel.prototype.toString = function toString() {
    return this._data.toString();
  };

  BaseModel.prototype.toJSON = function toJSON() {
    return this._data.toJSON();
  };

  BaseModel.prototype.getConfig = function getConfig() {
    return this._config;
  };

  BaseModel.prototype.getId = function getId() {
    return this._data.commit('get', 'id');
  };

  BaseModel.prototype.remove = function remove() {};

  BaseModel.prototype.get = function get(key) {
    return this._data.commit('get', key);
  };

  BaseModel.prototype.set = function set(key, value) {
    this._data.commit('set', key, value);
  };

  return BaseModel;
}(_utils.BaseEvent);

///
/// DataWrapper
///

exports.default = BaseModel;
var privateData = new WeakMap();

var DataWrapper = function () {
  function DataWrapper(data) {
    var _this2 = this;

    _classCallCheck(this, DataWrapper);

    this._committing = false;

    privateData.set(this, data);

    var _check = function _check() {
      if (!_this2._committing) {
        if (process.env.NODE_ENV === 'development') {
          throw new Error('Guy, don\'t invoke method \'get | set | delete\' of DataWrapper directly. MUST invoke \'commit\' method instead.');
        }
      }
    };
    var getWrappedParentForKey = function getWrappedParentForKey(key) {
      var data = privateData.get(_this2);
      if ((0, _utils.isString)(key)) {
        return {
          obj: data,
          key: key
        };
      } else if (Array.isArray(key)) {
        var result = data;
        for (var i = 0; i < key.length - 1; i++) {
          if (!(0, _utils.isUndefined)(result)) {
            result = result[key[i]];
          } else {
            return {
              obj: {},
              key: key[i]
            };
          }
        }
        return {
          obj: result,
          key: key[key.length - 1]
        };
      }
    };
    var fns = {
      get: function get(key) {
        var _getWrappedParentForK = getWrappedParentForKey(key),
            obj = _getWrappedParentForK.obj,
            newKey = _getWrappedParentForK.key;

        return obj[newKey];
      },
      set: function set(key, value) {
        var _getWrappedParentForK2 = getWrappedParentForKey(key),
            obj = _getWrappedParentForK2.obj,
            newKey = _getWrappedParentForK2.key;

        obj[newKey] = value;
      },
      delete: function _delete(key) {
        var _getWrappedParentForK3 = getWrappedParentForKey(key),
            obj = _getWrappedParentForK3.obj,
            newKey = _getWrappedParentForK3.key;

        delete obj[newKey];
      },
      keys: function keys() {
        var data = privateData.get(_this2);
        return Object.keys(data);
      }
    };
    Object.keys(fns).forEach(function (fnName) {
      // $flow-disable-line
      Object.defineProperty(_this2, fnName, {
        get: function get() {
          _check();
          return fns[fnName];
        }
      });
    });
  }

  DataWrapper.prototype.toString = function toString() {
    var data = privateData.get(this);
    return JSON.stringify(data);
  };

  DataWrapper.prototype.toJSON = function toJSON() {
    var data = privateData.get(this);
    return JSON.parse(JSON.stringify(data));
  };

  DataWrapper.prototype.toOriginData = function toOriginData() {
    return privateData.get(this);
  };

  DataWrapper.prototype.commit = function commit(type, key, value) {
    var result = void 0;

    var committing = this._committing;
    this._committing = true;
    // $flow-disable-line
    var operation = this[type];
    if (typeof operation === 'function') {
      result = operation.call(this, key, value);
    }
    this._committing = committing;

    return result;
  };

  return DataWrapper;
}();
