import { stripNum } from './number'
import { rotatePointAroundDeg, Point } from './point'

export interface Size {
  height: number
  width: number
}

export interface Bounds extends Point, Size {}

export function isBoundsEqual(bound1: Bounds, bound2: Bounds) {
  return (
    bound1.x === bound2.x &&
    bound1.y === bound2.y && isSameSize(bound1, bound2)
  )
}

export function isBoundsIntersect(bounds1: Bounds, bounds2: Bounds): boolean {
  return !(
    bounds2.x > bounds1.x + bounds1.width ||
    bounds1.x > bounds2.x + bounds2.width ||
    bounds2.y > bounds1.y + bounds1.height ||
    bounds1.y > bounds2.y + bounds2.height
  )
}

export function isBoundsContainPoint(bound: Bounds, point: Point) {
  return !(
    point.x < bound.x ||
    point.x > bound.x + bound.width ||
    point.y < bound.y ||
    point.y > bound.y + bound.height
  )
}

export function mergeBounds(bound1: Bounds, bound2: Bounds): Bounds {
  const x = Math.min(bound1.x, bound2.x)
  const y = Math.min(bound1.y, bound2.y)
  const width = Math.max(bound1.x + bound1.width, bound2.x + bound2.width) - x
  const height = Math.max(bound1.y + bound1.height, bound2.y + bound2.height) - y
  return {
    x, y, width, height
  }
}

export function mergeBoundsArr(boundsArr: Bounds[]): Bounds {
  if (!Array.isArray(boundsArr)) throw 'Wrong arguments'
  if (boundsArr.length === 0) return { x: 0, y: 0, width: 0, height: 0 }
  if (boundsArr.length === 1) return boundsArr[0]
  return boundsArr.reduce((pre, cur) => mergeBounds(pre, cur))
}

export function inflateBounds(bounds: Bounds, padding: number): Bounds {
  return {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2
  }
}

export function moveBounds(bounds: Bounds, vector: Point): Bounds {
  return {
    x: vector.x + bounds.x,
    y: vector.y + bounds.y,
    width: bounds.width,
    height: bounds.height
  }
}

export function fromPoints(pointArr: Point[]): Bounds {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  pointArr.forEach(point => {
    if (point.x < minX) {
      minX = point.x
    }
    if (point.x > maxX) {
      maxX = point.x
    }
    if (point.y < minY) {
      minY = point.y
    }
    if (point.y > maxY) {
      maxY = point.y
    }
  })
  return {
    x: minX,
    y: minY,
    height: maxY - minY,
    width: maxX - minX
  }
}

export function rotateBounds(bound: Bounds, degree, cx = 0, cy = 0) {
  let p1 = { x: bound.x, y: bound.y },
    p2 = { x: bound.x + bound.width, y: bound.y },
    p3 = { x: bound.x + bound.width, y: bound.y + bound.height },
    p4 = { x: bound.x, y: bound.y + bound.height }
  return fromPoints([p1, p2, p3, p4].map(p => rotatePointAroundDeg(p, { x: cx, y: cy }, degree)))
}

export function outBounds(bounds: Bounds, biggerBounds: Bounds): Bounds {
  const newBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  if (bounds.x < biggerBounds.x) {
    newBounds.x = bounds.x
    newBounds.width = bounds.x - biggerBounds.x
  } else if (bounds.x + bounds.width > biggerBounds.x + biggerBounds.width) {
    newBounds.x = biggerBounds.x
    newBounds.width = bounds.x + bounds.width - (biggerBounds.x + biggerBounds.width)
  }

  if (bounds.y < biggerBounds.y) {
    newBounds.y = bounds.y
    newBounds.height = bounds.y - biggerBounds.y
  } else if (bounds.y + bounds.height > biggerBounds.y + biggerBounds.height) {
    newBounds.y = biggerBounds.y
    newBounds.height = bounds.y + bounds.height - (biggerBounds.y + biggerBounds.height)
  }

  return newBounds
}

export function isSameSize (size1: Size, size2: Size) {
  return stripNum(size1.width) === stripNum(size2.width) &&
    stripNum(size1.height) === stripNum(size2.height)
}