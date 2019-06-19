import { COMPONENT_TYPE } from '../common/constants'
import BaseComponent from './base-component'

export interface NumberingData {
  numberFormat: string ///"<TYPE:NUMBER_FORMAT>",
  prefix: string ///"<STRING>",
  suffix: string ///"<STRING>",
  prependingNumbers?: "none" | undefined
}

export default class Numbering extends BaseComponent<NumberingData> {
  componentType = COMPONENT_TYPE.NUMBERING

  createEmptyNumbering(): NumberingData {
    return {
      'numberFormat': '',
      'prefix': '',
      'suffix': ''
    }
  }


  changeNumbering(key: string, value: string) {
    this._data.commit('set', key, value)
    this.emit('changeNumbering', key, value)
  }
}