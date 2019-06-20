// Is a given variable undefined?
export const isUndefined = function (obj) {
  return obj === void 0
}

// Is a given value equal to null?
export const isNull = function (obj) {
  return obj === null
}

export const isObject = function (obj) {
  const type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

export const isEmpty = function (obj) {
  if (obj === '') return true
  if (obj == null) return true
  if (isObject(obj) && Object.keys(obj).length <= 0) return true
  if (Array.isArray(obj) && obj.length <= 0) return true

  return false
}

if (!Array.isArray) {
  (Array as any).isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

export const isArray = function (obj) {
  return Array.isArray(obj)
}

// Is a given value a boolean?
export const isBoolean = function (obj) {
  return obj === true || obj === false || toString.call(obj) === '[object Boolean]'
}

export const isArguments = function (obj) {
  return toString.call(obj) === '[object Arguments]'
}

export const isFunction = function (obj) {
  return toString.call(obj) === '[object Function]'
}

export const isString = function (obj) {
  return toString.call(obj) === '[object String]'
}

export const isNumber = function (obj) {
  return toString.call(obj) === '[object Number]'
}

export const isDate = function (obj) {
  return toString.call(obj) === '[object Date]'
}

export const isRegExp = function (obj) {
  return toString.call(obj) === '[object RegExp]'
}

export const isError = function (obj) {
  return toString.call(obj) === '[object Error]'
}

export const isNaN = function (obj) {
  return isNumber(obj) && obj !== +obj
}

export const subtract = function (a, b) {
  let result = {}
  for (let k of Object.keys(b)) {
    if (a[k] !== b[k]) {
      result[k] = b[k]
    }
  }
  return result
}

if (!Object.is) {
  Object.is = function(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  };
}

export const isEqual = function (a, b) {
  return Object.is(a, b)
}

export const clone = function (obj) {
  if (isObject(obj)) return obj
  return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
}

export const deepClone = function (obj) {
  let cloned = clone(obj)
  Object.keys(cloned).forEach(key => {
    let value = cloned[key]
    if (isObject(value)) {
      cloned[key] = deepClone(value)
    }
  })
  return cloned
}
