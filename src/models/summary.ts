import { COMPONENT_TYPE } from '../common/constants'
import Topic from './topic'
import { StyleData } from './style'
import RangeComponent from './range-component'

const GET = 'get'

const DATA_KEY_TOPIC_ID = 'topicId'

export interface SummaryData {
  id: string ///"<ID>", // generated UUID
  style: StyleData
  class: string ///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this summary
  range: string ///"(<INTEGER>,<INTEGER>)",
  topicId: string ///"<ID>"
}

export default class Summary extends RangeComponent<SummaryData> {

  componentType = COMPONENT_TYPE.SUMMARY

  getSummaryTopic(): Topic {
    const topicId = this._data.commit(GET, DATA_KEY_TOPIC_ID)
    return this.ownerSheet().findComponentById(topicId)
  }

}