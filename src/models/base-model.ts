import { EventEmitter } from 'events'
import { isUndefined, isArray, isString } from '../common/utils'

export default class BaseModel<T> extends EventEmitter {

  public _data: DataWrapper<T>
  public _options?: any
  public _initData: T

  constructor(data: T, options: any = {}) {
    super()

    this._initData = data
    this._data = new DataWrapper<T>(data)
    this._options = options
  }

  toString() {
    return this._data.toString()
  }

  toJSON() {
    return this._data.toJSON()
  }

  getId() {
    return this._data.commit('get', 'id')
  }

  remove(key?: string) {
    if (!key) return this.reset()
    this._data.commit('delete', key)
  }

  reset() {
    this._data = null
    this._data = new DataWrapper<T>(this._initData)
    this.removeAllListeners()
  }

  get(key: string) {
    return this._data.commit('get', key)
  }

  set(key: string, value: any) {
    this._data.commit('set', key, value)
  }

}

///
/// DataWrapper
///

const privateData: WeakMap<any, any> = new WeakMap()
type OperationType = 'get' | 'set' | 'delete' | 'keys'
type DataKey = string | string[]
type OperationFunc = (key?: DataKey, value?: any) => any

class DataWrapper<T> {

  private _committing = false

  constructor(data: T) {
    privateData.set(this, data)
  }

  public _checkCommittingState() {
    if (!this._committing) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Guy, don't invoke method 'get | set | delete' of DataWrapper directly. MUST invoke 'commit' method instead.`)
      }
    }
  }

  private _getWrappedParentForKey(key: DataKey): { obj: any, key: string } {
    const data: T = privateData.get(this)
    if (isString(key)) {
      return {
        obj: data,
        key: key as string
      }
    } else if (isArray(key)) {
      let result = data
      for (let i = 0; i < key.length - 1; i++) {
        if (!isUndefined(result)) {
          result = result[key[i]]
        } else {
          return {
            obj: {},
            key: key[i]
          }
        }
      }
      return {
        obj: result,
        key: key[key.length - 1]
      }
    }
  }

  get = this._commitWrapper(key => {
    const { obj, key: newKey } = this._getWrappedParentForKey(key)
    return obj[newKey]
  })

  set = this._commitWrapper((key, value) => {
    const { obj, key: newKey } = this._getWrappedParentForKey(key)
    obj[newKey] = value
  })

  delete = this._commitWrapper(key => {
    const { obj, key: newKey } = this._getWrappedParentForKey(key)
    delete obj[newKey]
  })

  keys = this._commitWrapper(key => {
    const data: { [key: string]: any } = privateData.get(this)
    return Object.keys(data)
  })

  public toString() {
    const data = privateData.get(this)
    return JSON.stringify(data)
  }

  public getOriginalData(): T {
    return privateData.get(this)
  }

  public toJSON(): T {
    return JSON.parse(JSON.stringify(this.getOriginalData()))
  }

  private _commitWrapper(operation: OperationFunc): OperationFunc {
    return (key?: DataKey, value?: any) => {
      this._checkCommittingState()
      if (typeof operation === 'function') {
        return operation.call(this, key, value)
      }
    }
  }

  public commit(type: OperationType, key?: DataKey, value?: any): any {
    let result

    const committing = this._committing
    this._committing = true
    const operation = this[type]
    if (typeof operation === 'function') {
      result = operation.call(this, key, value)
    }
    this._committing = committing

    return result
  }

}
