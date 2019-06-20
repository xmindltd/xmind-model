import { MASTER_RANGE } from '../common/constants'
import StyleComponent from './style-component'

const DATA_KEY_RANGE = 'range'
const GET = 'get'
const SET = 'set'

export default class RangeComponent<T> extends StyleComponent<T> {

  getRange() {
    return this._data.commit(GET, DATA_KEY_RANGE)
  }

  setRange(range) {
    const oldRange = this.getRange()

    if (range === oldRange) {
      return
    }

    this._data.commit(SET, DATA_KEY_RANGE, range)

    this.getUndo().add({
      undo: () => this.setRange(oldRange),
      redo: () => this.setRange(range)
    })
  }

  get rangeStart() {
    const range = this.getRange()
    if (range === MASTER_RANGE) return -1

    return parseInt(range.match(/\d+/g)[0], 10)
  }

  get rangeEnd() {
    const range = this.getRange()
    if (range === MASTER_RANGE) return -1

    return parseInt(range.match(/\d+/g)[1], 10)
  }

}