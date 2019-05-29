'use strict';

exports.__esModule = true;
exports.defaultConfig = exports.Config = undefined;

var _defaultConfigData;

var _constants = require('./constants');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultConfigData = (_defaultConfigData = {}, _defaultConfigData[_constants.CONFIG.XAP_LOADER] = function () {
  return new Promise(function (resolve) {
    resolve('');
  });
}, _defaultConfigData[_constants.CONFIG.URL_PREFIX] = '', _defaultConfigData[_constants.CONFIG.FONT_URL_PREFIX] = '', _defaultConfigData[_constants.CONFIG.LANGUAGE] = _constants.LANGS.EN_US, _defaultConfigData[_constants.CONFIG.MAX_SCALE] = Infinity, _defaultConfigData[_constants.CONFIG.MIN_SCALE] = 0, _defaultConfigData[_constants.CONFIG.NO_KEYBIND] = false, _defaultConfigData[_constants.CONFIG.KEYBINDING_SERVICE] = function getCommand(keyCode, modifier) {
  return null;
}, _defaultConfigData[_constants.CONFIG.NO_EDIT_RECEIVER] = false, _defaultConfigData[_constants.CONFIG.READONLY] = false, _defaultConfigData[_constants.CONFIG.HIDE_COLLAPSE_BTN] = true, _defaultConfigData[_constants.CONFIG.NO_TOPIC_CUSTOM_WIDTH_BTN] = true, _defaultConfigData[_constants.CONFIG.INFO_ITEM_STYLE] = _constants.INFO_ITEM_STYLE_TYPE.FASHION, _defaultConfigData[_constants.CONFIG.CLIPBOARD_READER] = function () {
  return null;
}, _defaultConfigData[_constants.CONFIG.PADDING_FACTOR] = 1, _defaultConfigData[_constants.CONFIG.FAKE_IMAGE] = false, _defaultConfigData[_constants.CONFIG.LOGGER] = {
  /*eslint-disable no-console*/
  info: process.env.NODE_ENV === 'development' ? console.info.bind(console) : op,
  warn: process.env.NODE_ENV === 'development' ? console.warn.bind(console) : op,
  error: process.env.NODE_ENV === 'development' ? console.error.bind(console) : op,
  debug: process.env.NODE_ENV === 'development' ? console.debug.bind(console) : op
  /*eslint-enable no-console*/
}, _defaultConfigData[_constants.CONFIG.INPUT_HANDLER] = function (e) {
  return Promise.resolve('');
}, _defaultConfigData[_constants.CONFIG.LIMITED_OPERATION_HANDLER] = function (operation) {
  return Promise.resolve(true); //SUPPORTED_LIMITED_OPERATIONS.includes(operation) ? Promise.resolve(false) : Promise.resolve(true)
}, _defaultConfigData[_constants.CONFIG.AUTO_ACTION_STATUS] = false, _defaultConfigData);

function op() {}

var Config = exports.Config = function () {
  function Config(configData) {
    _classCallCheck(this, Config);

    this.data = Object.assign({}, configData);
  }

  Config.prototype.parent = function parent(parentConfigInstance) {
    if (parentConfigInstance instanceof Config) {
      this._parent = parentConfigInstance;
    }
    return this._parent || (this !== defaultConfig ? defaultConfig : null);
  };

  Config.prototype.get = function get(key) {
    var value = this.data[key];
    if ((0, _utils.isUndefined)(value)) {
      var p = this.parent();
      value = p && p.get(key);
    }
    return value;
  };

  Config.prototype.set = function set() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if ((0, _utils.isObject)(args[0])) {
      var d = args[0];
      for (var attr in d) {
        this.set(attr, d[attr]);
      }
    } else if (args.length === 2) {
      var key = args[0];
      var value = args[1];
      this.data[key] = value;
    } else {
      this.get(_constants.CONFIG.LOGGER).error('Illegal arguments for Config: ', args);
    }
  };

  return Config;
}();

var defaultConfig = exports.defaultConfig = new Config(defaultConfigData);