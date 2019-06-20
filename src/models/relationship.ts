import { COMPONENT_TYPE } from '../common/constants'
import StyleComponent from './style-component'
import { isEqualPoint, Point } from '../common/utils'
import { StyleData } from './style'

const GET = 'get'
const SET = 'set'

const TITLE_KEY = 'title'
const END_1_ID_KEY = 'end1Id'
const END_2_ID_KEY = 'end2Id'
const CONTROL_POINTS_KEY = 'controlPoints'

const EVENT_TITLE = 'change:title'
const EVENT_END_POINT = 'change:endPoints'
const EVENT_CONTROL_POINTS = 'change:controlPoints'

export interface RelationshipData {
  id: string ///"<ID>", // generated UUID
  title: string ///"<STRING>",
  style: StyleData
  class: string ///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this relationship
  end1Id: string ///"<ID>",
  end2Id: string///"<ID>",
  controlPoints: [ Point, Point ]
}

export default class Relationship extends StyleComponent<RelationshipData> {

  componentType = COMPONENT_TYPE.RELATIONSHIP

  getTitle(): string {
    return this._data.commit(GET, TITLE_KEY)
  }

  changeTitle(title: string) {
    let oldTitle = this.getTitle()

    if (oldTitle === title) {
      return
    }

    this._data.commit(SET, TITLE_KEY, title)
    this.triggerModelChanged(EVENT_TITLE)

    this.getUndo().add({
      undo: () => this.changeTitle(oldTitle),
      redo: () => this.changeTitle(title)
    }, 'R-changeTitle')

  }

  getEnd1Id(): string {
    return this._data.commit(GET, END_1_ID_KEY)
  }

  getEnd2Id(): string {
    return this._data.commit(GET, END_2_ID_KEY)
  }

  changeEndPoints(newEndIds: { end1Id: string, end2Id: string }) {
    const oldEndIds = {
      end1Id: this.getEnd1Id(),
      end2Id: this.getEnd2Id(),
    }

    // check change
    if ((oldEndIds.end1Id === newEndIds.end1Id) &&
      (oldEndIds.end2Id === newEndIds.end2Id)) return

    if (newEndIds.end1Id && newEndIds.end1Id !== oldEndIds.end1Id) {
      this._data.commit(SET, END_1_ID_KEY, newEndIds.end1Id)
    }

    if (newEndIds.end2Id && newEndIds.end2Id !== oldEndIds.end2Id) {
      this._data.commit(SET, END_2_ID_KEY, newEndIds.end2Id)
    }

    this.triggerModelChanged(EVENT_END_POINT)

    this.getUndo().add({
      undo: () => { this.changeEndPoints(oldEndIds) },
      redo: () => { this.changeEndPoints(newEndIds) }
    }, 'R-changeEndPoints')

  }

  getControlPoint0() {
    return this._data.commit(GET, CONTROL_POINTS_KEY)['0']
  }

  getControlPoint1() {
    return this._data.commit(GET, CONTROL_POINTS_KEY)['1']
  }

  changeControlPoints(points: [ Point, Point ]) {
    if (!points || Object.keys(points).length === 0) {
      return
    }

    // control point type has two patten
    // { x: number, y: number } or { amount: number, angle: number }
    // we only us the first patten now

    const controlPointsData = this._data.commit(GET, CONTROL_POINTS_KEY) || {}

    const oldPoints = { ...controlPointsData }

    const hasPoint0Changed = points['0'] ? !isEqualPoint(points['0'], oldPoints['0']) : false
    const hasPoint1Changed = points['1'] ? !isEqualPoint(points['1'], oldPoints['1']) : false

    if (!hasPoint0Changed && !hasPoint1Changed) return

    const newPoints = { ...oldPoints, ...points }
    this._data.commit(SET, CONTROL_POINTS_KEY, newPoints)

    this.triggerModelChanged(EVENT_CONTROL_POINTS)

    this.getUndo().add({
      undo: () => { this.changeControlPoints(oldPoints) },
      redo: () => { this.changeControlPoints(newPoints) }
    }, 'R-changeControlPoints')

  }

}
