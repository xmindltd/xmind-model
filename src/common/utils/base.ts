const uuidMap: { [jsonUUID: string]: string } = {}

export function UUID(jsonUUID?: string) {
  if (jsonUUID && uuidMap[jsonUUID]) return uuidMap[jsonUUID];

  const toReplacedString = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

  const newUUID = toReplacedString.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })

  return jsonUUID ? uuidMap[jsonUUID] = newUUID : newUUID
}

export function methodDeprecatedWarn(deprecatedMethod: string, suggestedMethod: string) {
  return `${deprecatedMethod} has been deprecated, use ${suggestedMethod} instead`
}

// 用来存放一些常用的工具函数
const base64Reg = /data:image[\s\S]*;base64/

export function isDef(v: any) { return v !== undefined && v !== null; }

export function isUndef(v: any) { return v === undefined || v === null; }

export function inArray(arr, v) { return arr.indexOf(v) !== -1 }

export function flatten(arr: any[]) { return arr.reduce((a, b) => a.concat(b), []) }

/**
 * @description 限制函数触发频率
 * @param fn 需要限制频率的函数
 * @param interval 每调用一次最小时间间隔，单位ms
 * */
export function throttle(fn: Function, interval: number) {
  let __self = fn, // 保存需要被延迟执行的函数引用
    timer, // 定时器
    firstTime = true; // 是否是第一次调用
  return function(this: any, ...args) {
    if (firstTime) { // 如果是第一次调用,不需延迟执行
      __self.apply(this, args)
      return firstTime = false
    }
    if (timer) { // 如果定时器还在,说明前一次延迟执行还没有完成
      return false
    }
    timer = setTimeout(() => { // 延迟一段时间执行
      clearTimeout(timer)
      timer = null
      __self.apply(this, args)
    }, interval === undefined ? 500 : interval)
  }
}

/**
 * @description 验证字符串是否为base64
 * */
export function isBase64Url(str: string): boolean {
  return base64Reg.test(str)
}

/**
 * @description 用作过滤掉对绘图不必要的回调，当回调调用频率比fps要大时起作用，比如mousemove
 * @param frameRender 待降频的函数
 * @param eventHandler 可以用来停止冒泡
 * */
export function frameStabilize(frameRender: Function, eventHandler: Function): Function {
  let isRequested = false
  let args
  return function(this: any) {
    args = Array.prototype.slice.apply(arguments)
    if (!isRequested) {
      isRequested = true
      requestAnimationFrame(() => {
        frameRender.apply(this, args)
        isRequested = false
      });
    }
    eventHandler && typeof eventHandler === "function" && eventHandler.apply(this, args)
  }
}

export function removeItem(arr, item) {
  if (arr.length > 0) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isSame(o1: any, o2: any) {
  const keys = Object.keys(o1)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (o1[key] !== o2[key]) { return false }
  }
  return true
}
