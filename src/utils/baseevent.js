'use strict';

exports.__esModule = true;

var _backbone = require('backbone');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BaseEvent() {}
BaseEvent.prototype = _underscore2.default.extend({}, _backbone.Events);

exports.default = BaseEvent;