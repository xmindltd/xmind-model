//@flow

import { COMPONENT_TYPE } from '../common/constants'
import BaseComponent from './base-component'

const GET = 'get'
const SET = 'set'
const DELETE = 'delete'

const PROPERTIES = 'properties'

export interface StyleData {
  id: string
  properties: any
}

export default class Style extends BaseComponent<StyleData> {

  componentType = COMPONENT_TYPE.STYLE

  constructor (data: any, options: any = {}) {
    super(data, options)
  }

  keys(): string[] {
    const properties = this._data.commit(GET, PROPERTIES)
    return properties ? Object.keys(properties) : []
  }

  getValue(key: string): string {
    return this._data.commit(GET, [PROPERTIES, key])
  }

  setValue(key: string, value: string | number) {
    this._data.commit(SET, [PROPERTIES, key], value)
  }

  removeKey(key?: string) {
    if (!key) return this.remove()
    this._data.commit(DELETE, [PROPERTIES, key])
  }

}