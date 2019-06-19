export interface Point {
  x?: number
  y?: number
  amount?: number
  angle?: number
}

/**
 * distance between two point.
 */
export function getPointDistance(p1: Point, p2: Point) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

/**
 * Rotate point/vector around origin({x:0,y:0}).
 * @param  {number} radian 弧度值，正为顺时针，负为逆时针. （在标准笛卡尔坐标系中，正度数指的是x正轴逆时针旋转，但我们的坐标系是上下颠倒的）
 */
export function rotatePoint(point: Point, radian: number): Point {
  let sinA = Math.sin(radian)
  let cosA = Math.cos(radian)
  let x = point.x * cosA - point.y * sinA
  let y = point.x * sinA + point.y * cosA
  return { x, y }
}

export function rotatePointDeg(point: Point, degree: number) {
  return rotatePoint(point, degree2Radian(degree))
}

/**
 * 计算出 以center为旋转中心，将point旋转radian度后的点
 * @param radian {number} 是弧度值(带PI的），正为顺时针，负为逆时针
 */
export function rotatePointAround(point: Point, center: Point, radian: number): Point {
  let v: Point = {
    x: point.x - center.x,
    y: point.y - center.y
  }
  v = rotatePoint(v, radian)
  return {
    x: center.x + v.x,
    y: center.y + v.y
  }
}

export function rotatePointAroundDeg(point: Point, center: Point, degree: number) {
  return rotatePointAround(point, center, degree2Radian(degree))
}

export function degree2Radian(degree: number) {
  return degree / 180 * Math.PI
}

//使一个向量长度标准化为1，也可标准化为别的长度。
export function normalizeVector(vector: Point, len = 1): Point {
  const d = Math.hypot(vector.x, vector.y)
  const ratio = d / len
  return {
    x: vector.x / ratio,
    y: vector.y / ratio
  }
}

//construct a vector from two point.
export function diffPoint(from: Point, to: Point): Point {
  return {
    x: to.x - from.x,
    y: to.y - from.y
  }
}

export function addPoint(pointA: Point, pointB: Point): Point {
  return {
    x: pointA.x + pointB.x,
    y: pointA.y + pointB.y
  }
}

export function isEqualPoint(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y
}

export function isPointLike(pos: any) {
  return !!pos && typeof pos.x === 'number' && typeof pos.y === 'number';
}

/**
 * @description 判断某个点是否在多边形内部
 * @param {point} point
 * @param {Array.<point>} polygonPoints 多边形的构成点
 * @return {boolean}
 * */
export function isPointInPolygon(point: Point, polygonPoints: Point[]) {
  // todo 这一块儿的运算逻辑需要学习一下
  let i, j = polygonPoints.length - 1
  let oddNodes = false
  let x = point.x, y = point.y
  let iPoint, jPoint
  for (i = 0; i < polygonPoints.length; i++) {
    iPoint = polygonPoints[i]
    jPoint = polygonPoints[j]
    if ((iPoint.y < y && jPoint.y >= y
      || jPoint.y < y && iPoint.y >= y)
      && (iPoint.x <= x || jPoint.x <= x)) {
      if (iPoint.x + (y - iPoint.y) / (jPoint.y - iPoint.y) * (jPoint.x - iPoint.x) < x) {
        oddNodes = !oddNodes
      }
    }
    j = i
  }

  return oddNodes
}

/**
 * @description 凸包算法
 * @return {Point[]}
 * */
export function convexPointHull(pointList: Point[]): Point[] {
  pointList = [...pointList]
  pointList.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y)

  const n = pointList.length
  const hull = []

  for (let i = 0; i < 2 * n; i++) {
    const j = i < n ? i : 2 * n - 1 - i
    while (hull.length >= 2 && removeMiddle(hull[hull.length - 2], hull[hull.length - 1], pointList[j]))
      hull.pop()
    hull.push(pointList[j])
  }

  hull.pop()

  return hull

  function removeMiddle(a: Point, b: Point, c: Point) {
    const cross = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x)
    const dot = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y)
    return cross < 0 || cross === 0 && dot <= 0
  }
}

export function Point(x: number, y: number): Point {
  return { x, y }
}