'use strict';

exports.__esModule = true;
exports.isSameSize = exports.outBounds = exports.rotateBounds = exports.moveBounds = exports.inflateBounds = exports.mergeBoundsArr = exports.mergeBounds = exports.isBoundsContainPoint = exports.isBoundsIntersect = exports.isBoundsEqual = undefined;

var _number = require('./number');

var _point = require('./point');

function isBoundsEqual(bound1, bound2) {
  return bound1.x === bound2.x && bound1.y === bound2.y && isSameSize(bound1, bound2);
}

function isBoundsIntersect(bounds1, bounds2) {
  return !(bounds2.x > bounds1.x + bounds1.width || bounds1.x > bounds2.x + bounds2.width || bounds2.y > bounds1.y + bounds1.height || bounds1.y > bounds2.y + bounds2.height);
}

function isBoundsContainPoint(bound, point) {
  return !(point.x < bound.x || point.x > bound.x + bound.width || point.y < bound.y || point.y > bound.y + bound.height);
}

function mergeBounds(bound1, bound2) {
  var x = Math.min(bound1.x, bound2.x);
  var y = Math.min(bound1.y, bound2.y);
  var width = Math.max(bound1.x + bound1.width, bound2.x + bound2.width) - x;
  var height = Math.max(bound1.y + bound1.height, bound2.y + bound2.height) - y;
  return {
    x: x, y: y, width: width, height: height
  };
}

function mergeBoundsArr(bounds) {
  if (!Array.isArray(bounds)) throw 'Wrong arguements';
  if (bounds.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  if (bounds.length === 1) return bounds[0];
  return bounds.reduce(function (pre, cur) {
    return mergeBounds(pre, cur);
  });
}

function inflateBounds(bounds, padding) {
  return {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2
  };
}

function moveBounds(bounds, vector) {
  return {
    x: vector.x + bounds.x,
    y: vector.y + bounds.y,
    width: bounds.width,
    height: bounds.height
  };
}

function fromPoints(pointArr) {
  var minX = Infinity;
  var minY = Infinity;
  var maxX = -Infinity;
  var maxY = -Infinity;
  pointArr.forEach(function (point) {
    if (point.x < minX) {
      minX = point.x;
    }
    if (point.x > maxX) {
      maxX = point.x;
    }
    if (point.y < minY) {
      minY = point.y;
    }
    if (point.y > maxY) {
      maxY = point.y;
    }
  });
  return {
    x: minX,
    y: minY,
    height: maxY - minY,
    width: maxX - minX
  };
}

function rotateBounds(bound, degree) {
  var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var p1 = { x: bound.x, y: bound.y },
      p2 = { x: bound.x + bound.width, y: bound.y },
      p3 = { x: bound.x + bound.width, y: bound.y + bound.height },
      p4 = { x: bound.x, y: bound.y + bound.height };
  return fromPoints([p1, p2, p3, p4].map(function (p) {
    return (0, _point.rotatePointAroundDeg)(p, { x: cx, y: cy }, degree);
  }));
}

function outBounds(bounds, biggerBounds) {
  var newBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  if (bounds.x < biggerBounds.x) {
    newBounds.x = bounds.x;
    newBounds.width = bounds.x - biggerBounds.x;
  } else if (bounds.x + bounds.width > biggerBounds.x + biggerBounds.width) {
    newBounds.x = biggerBounds.x;
    newBounds.width = bounds.x + bounds.width - (biggerBounds.x + biggerBounds.width);
  }

  if (bounds.y < biggerBounds.y) {
    newBounds.y = bounds.y;
    newBounds.height = bounds.y - biggerBounds.y;
  } else if (bounds.y + bounds.height > biggerBounds.y + biggerBounds.height) {
    newBounds.y = biggerBounds.y;
    newBounds.height = bounds.y + bounds.height - (biggerBounds.y + biggerBounds.height);
  }

  return newBounds;
}

function isSameSize(size1, size2) {
  return (0, _number.stripNum)(size1.width) === (0, _number.stripNum)(size2.width) && (0, _number.stripNum)(size1.height) === (0, _number.stripNum)(size2.height);
}

exports.isBoundsEqual = isBoundsEqual;
exports.isBoundsIntersect = isBoundsIntersect;
exports.isBoundsContainPoint = isBoundsContainPoint;
exports.mergeBounds = mergeBounds;
exports.mergeBoundsArr = mergeBoundsArr;
exports.inflateBounds = inflateBounds;
exports.moveBounds = moveBounds;
exports.rotateBounds = rotateBounds;
exports.outBounds = outBounds;
exports.isSameSize = isSameSize;