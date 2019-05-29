'use strict';

exports.__esModule = true;

var _browsers = require('./browsers');

Object.keys(_browsers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _browsers[key];
    }
  });
});

var _configs = require('./configs');

Object.keys(_configs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _configs[key];
    }
  });
});

var _events = require('./events');

Object.keys(_events).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _events[key];
    }
  });
});

var _models = require('./models');

Object.keys(_models).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _models[key];
    }
  });
});

var _modules = require('./modules');

Object.keys(_modules).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _modules[key];
    }
  });
});

var _services = require('./services');

Object.keys(_services).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _services[key];
    }
  });
});

var _status = require('./status');

Object.keys(_status).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _status[key];
    }
  });
});

var _structures = require('./structures');

Object.keys(_structures).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _structures[key];
    }
  });
});

var _styles = require('./styles');

Object.keys(_styles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _styles[key];
    }
  });
});

var _views = require('./views');

Object.keys(_views).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _views[key];
    }
  });
});

var _adapters = require('./adapters');

Object.keys(_adapters).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _adapters[key];
    }
  });
});

var _extensions = require('./extensions');

Object.keys(_extensions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _extensions[key];
    }
  });
});

var _figures = require('./figures');

Object.keys(_figures).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _figures[key];
    }
  });
});

var _renderengine = require('./renderengine');

Object.keys(_renderengine).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _renderengine[key];
    }
  });
});

var _xaptypes = require('./xaptypes');

Object.keys(_xaptypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _xaptypes[key];
    }
  });
});

var _actions = require('./actions');

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});

var _limited = require('./limited');

Object.keys(_limited).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _limited[key];
    }
  });
});
var LANGS = exports.LANGS = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
  ZH_HK: 'zh-HK',
  ZH_TW: 'zh-TW',
  JA_JP: 'ja-JP',
  DE_DE: 'de-DE',
  FR_FR: 'fr-FR'
};

var PLATFORMS = exports.PLATFORMS = {
  VANA: 'vana',
  BROWNIE: 'brownie',
  DOUGHNUT: 'doughnut',
  PUFF: 'puff',
  PUFFMAC: 'puffmac'
};