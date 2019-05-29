'use strict';

exports.__esModule = true;

/**
 * distance between two point.
 */
function getPointDistance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Rotate point/vector around origin({x:0,y:0}).
 * @param  {number} radian 弧度值，正为顺时针，负为逆时针. （在标准笛卡尔坐标系中，正度数指的是x正轴逆时针旋转，但我们的坐标系是上下颠倒的）
 */
function rotatePoint(point, radian) {
  var sinA = Math.sin(radian);
  var cosA = Math.cos(radian);
  var x = point.x * cosA - point.y * sinA;
  var y = point.x * sinA + point.y * cosA;
  return { x: x, y: y };
}

function rotatePointDeg(point, degree) {
  return rotatePoint(point, degree2Radian(degree));
}

/**
 * 计算出 以center为旋转中心，将point旋转radian度后的点
 * @param radian {number} 是弧度值(带PI的），正为顺时针，负为逆时针
 */
function rotatePointAround(point, center, radian) {
  var v = {
    x: point.x - center.x,
    y: point.y - center.y
  };
  v = rotatePoint(v, radian);
  return {
    x: center.x + v.x,
    y: center.y + v.y
  };
}

function rotatePointAroundDeg(point, center, degree) {
  return rotatePointAround(point, center, degree2Radian(degree));
}

function degree2Radian(degree) {
  return degree / 180 * Math.PI;
}

//使一个向量长度标准化为1，也可标准化为别的长度。
function normalizeVector(vector) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var d = Math.hypot(vector.x, vector.y);
  var ratio = d / len;
  return {
    x: vector.x / ratio,
    y: vector.y / ratio
  };
}

//construct a vector from two point.
function diffPoint(from, to) {
  return {
    x: to.x - from.x,
    y: to.y - from.y
  };
}

function addPoint(pointA, pointB) {
  return {
    x: pointA.x + pointB.x,
    y: pointA.y + pointB.y
  };
}

function isEqualPoint(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

function isPointLike(pos) {
  return !!pos && typeof pos.x === 'number' && typeof pos.y === 'number';
}

/**
 * @description 判断某个点是否在多边形内部
 * @param {point} point
 * @param {Array.<point>} polygonPoints 多边形的构成点
 * @return {boolean}
 * */
function isPointInPolygon(point, polygonPoints) {
  // todo 这一块儿的运算逻辑需要学习一下
  var i = void 0,
      j = polygonPoints.length - 1;
  var oddNodes = false;
  var x = point.x,
      y = point.y;
  var iPoint = void 0,
      jPoint = void 0;
  for (i = 0; i < polygonPoints.length; i++) {
    iPoint = polygonPoints[i];
    jPoint = polygonPoints[j];
    if ((iPoint.y < y && jPoint.y >= y || jPoint.y < y && iPoint.y >= y) && (iPoint.x <= x || jPoint.x <= x)) {
      if (iPoint.x + (y - iPoint.y) / (jPoint.y - iPoint.y) * (jPoint.x - iPoint.x) < x) {
        oddNodes = !oddNodes;
      }
    }
    j = i;
  }

  return oddNodes;
}

/**
 * @description 凸包算法
 * @return {Array<{ x: number, y: number }>}
 * */
function convexPointHull(pointList) {
  pointList = [].concat(pointList);
  pointList.sort(function (a, b) {
    return a.x !== b.x ? a.x - b.x : a.y - b.y;
  });

  var n = pointList.length;
  var hull = [];

  for (var i = 0; i < 2 * n; i++) {
    var j = i < n ? i : 2 * n - 1 - i;
    while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], pointList[j])) {
      hull.pop();
    }hull.push(pointList[j]);
  }

  hull.pop();

  return hull;

  function removeMiddle(a, b, c) {
    var cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x);
    var dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
    return cross < 0 || cross === 0 && dot <= 0;
  }
}

var Point = function Point(x, y) {
  return { x: x, y: y };
};

exports.Point = Point;
exports.getPointDistance = getPointDistance;
exports.rotatePoint = rotatePoint;
exports.rotatePointDeg = rotatePointDeg;
exports.rotatePointAround = rotatePointAround;
exports.rotatePointAroundDeg = rotatePointAroundDeg;
exports.normalizeVector = normalizeVector;
exports.diffPoint = diffPoint;
exports.addPoint = addPoint;
exports.isEqualPoint = isEqualPoint;
exports.isPointLike = isPointLike;
exports.isPointInPolygon = isPointInPolygon;
exports.convexPointHull = convexPointHull;