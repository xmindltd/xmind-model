import { COMPONENT_TYPE } from '../common/constants'
import StyleComponent from './style-component'
import Topic from './topic'
import { StyleData } from './style'

const GET = 'get'
const SET = 'set'

const DATA_KEY_TOPIC_ID = 'topicId'
const DATA_KEY_RANGE = 'range'

const EVENT_RANGE = 'changeRange'

export interface SummaryData {
  id: string ///"<ID>", // generated UUID
  style: StyleData
  class: string ///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this summary
  range: string ///"(<INTEGER>,<INTEGER>)",
  topicId: string ///"<ID>"
}

export default class Summary extends StyleComponent<SummaryData> {

  componentType = COMPONENT_TYPE.SUMMARY

  getSummaryTopic(): Topic {
    const topicId = this._data.commit(GET, DATA_KEY_TOPIC_ID)
    return this.ownerSheet().findComponentById(topicId)
  }

  getRange(): string {
    return this._data.commit(GET, DATA_KEY_RANGE)
  }

  setRange(range: string) {
    var oldRange = this.getRange()

    if (range === oldRange) {
      return false
    }

    this._data.commit(SET, DATA_KEY_RANGE, range)
    this.triggerModelChanged(EVENT_RANGE)

    this.getUndo().add({
      undo: () => { this.setRange(oldRange) },
      redo: () => { this.setRange(range) }
    }, 'setRange summary')
  }

}