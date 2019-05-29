"use strict";

exports.__esModule = true;

// 用来存放一些常用的工具函数
var base64Reg = /data:image[\s\S]*;base64/;

function isDef(v) {
  return v !== undefined && v !== null;
}

function isUndef(v) {
  return v === undefined || v === null;
}

function inArray(arr, v) {
  return arr.indexOf(v) !== -1;
}

function flatten(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(b);
  }, []);
}

/**
 * @description 限制函数触发频率
 * @param fn 需要限制频率的函数
 * @param interval 每调用一次最小时间间隔，单位ms
 * */
function throttle(fn, interval) {
  var __self = fn,
      // 保存需要被延迟执行的函数引用
  timer = void 0,
      // 定时器
  firstTime = true; // 是否是第一次调用
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var __me = this;
    if (firstTime) {
      // 如果是第一次调用,不需延迟执行
      __self.apply(__me, args);
      return firstTime = false;
    }
    if (timer) {
      // 如果定时器还在,说明前一次延迟执行还没有完成
      return false;
    }
    timer = setTimeout(function () {
      // 延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      __self.apply(__me, args);
    }, interval === undefined ? 500 : interval);
  };
}

/**
 * @description 验证字符串是否为base64
 * */
function isBase64Url(str) {
  return base64Reg.test(str);
}

/**
 * @description 用作过滤掉对绘图不必要的回调，当回调调用频率比fps要大时起作用，比如mousemove
 * @param frameRender 待降频的函数
 * @param eventHandler 可以用来停止冒泡
 * */
function frameStabilize(frameRender, eventHandler) {
  var isRequested = false;
  var args = void 0;
  return function () {
    args = Array.prototype.slice.apply(arguments);
    if (!isRequested) {
      isRequested = true;
      requestAnimationFrame(function () {
        frameRender.apply(this, args);
        isRequested = false;
      });
    }
    eventHandler && typeof eventHandler === "function" && eventHandler.apply(this, args);
  };
}

function removeItem(arr, item) {
  if (arr.length > 0) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

function flatten(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(b);
  }, []);
}

function isSame(o1, o2) {
  var keys = Object.keys(o1);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (o1[key] !== o2[key]) {
      return false;
    }
  }
  return true;
}

exports.isDef = isDef;
exports.isUndef = isUndef;
exports.inArray = inArray;
exports.flatten = flatten;
exports.throttle = throttle;
exports.isBase64Url = isBase64Url;
exports.frameStabilize = frameStabilize;
exports.removeItem = removeItem;
exports.isSame = isSame;