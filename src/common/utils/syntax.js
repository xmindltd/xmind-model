'use strict';

exports.__esModule = true;
exports.toNumber = exports.deepClone = exports.clone = exports.isEqual = exports.isArray = exports.subtract = exports.isNaN = exports.isError = exports.isRegExp = exports.isDate = exports.isNumber = exports.isString = exports.isFunction = exports.isArguments = exports.isBoolean = exports.isObject = exports.isNone = exports.isDefined = exports.isNull = exports.isUndefined = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Is a given variable undefined?
var isUndefined = function isUndefined(obj) {
  return obj === void 0;
};

// Is a given value equal to null?
var isNull = function isNull(obj) {
  return obj === null;
};

var isDefined = function isDefined(obj) {
  return !isUndefined(obj) && !isNull(obj);
};

var isNone = function isNone(obj) {
  return isUndefined(obj) || isNull(obj);
};

var isObject = function isObject(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  return type === 'function' || type === 'object' && !!obj;
};

// Is a given value a boolean?
var isBoolean = function isBoolean(obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
};

var isArguments = function isArguments(obj) {
  return toString.call(obj) === '[object Arguments]';
};

var isArray = function isArray(obj) {
  return Array.isArray(obj);
};

var isFunction = function isFunction(obj) {
  return toString.call(obj) === '[object Function]';
};

var isString = function isString(obj) {
  return toString.call(obj) === '[object String]';
};

var isNumber = function isNumber(obj) {
  return toString.call(obj) === '[object Number]';
};

var isDate = function isDate(obj) {
  return toString.call(obj) === '[object Date]';
};

var isRegExp = function isRegExp(obj) {
  return toString.call(obj) === '[object RegExp]';
};

var isError = function isError(obj) {
  return toString.call(obj) === '[object Error]';
};

var isNaN = function isNaN(obj) {
  return isNumber(obj) && obj !== +obj;
};

var subtract = function subtract(a, b) {
  var result = {};
  for (var _iterator = Object.keys(b), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var k = _ref;

    if (a[k] !== b[k]) {
      result[k] = b[k];
    }
  }
  return result;
};

var isEqual = function isEqual(a, b) {
  return _underscore2.default.isEqual(a, b);
};

var clone = function clone(obj) {
  if (isObject(obj)) return obj;
  return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
};

var deepClone = function deepClone(obj) {
  var cloned = clone(obj);
  Object.keys(cloned).forEach(function (key) {
    var value = cloned[key];
    if (isObject(value)) {
      cloned[key] = deepClone(value);
    }
  });
  return cloned;
};

var toNumber = function toNumber(fn, value) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  value = isDefined(value) ? value : defaultValue;
  var num = fn(value);
  if (isNaN(num)) {
    num = defaultValue;
  }
  return num;
};

exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isDefined = isDefined;
exports.isNone = isNone;
exports.isObject = isObject;
exports.isBoolean = isBoolean;
exports.isArguments = isArguments;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isDate = isDate;
exports.isRegExp = isRegExp;
exports.isError = isError;
exports.isNaN = isNaN;
exports.subtract = subtract;
exports.isArray = isArray;
exports.isEqual = isEqual;
exports.clone = clone;
exports.deepClone = deepClone;
exports.toNumber = toNumber;