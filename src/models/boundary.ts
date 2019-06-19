import { COMPONENT_TYPE } from '../common/constants'
import { StyleData } from './style'
import RangeComponent from './range-component'

const GET = 'get'
const SET = 'set'

const TITLE = 'title'

export interface BoundaryData {
  id: string ///"<ID>", // generated UUID
  title: string ///"<STRING>",
  style: StyleData
  class: string ///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this boundary
  range: string ///"(<INTEGER>,<INTEGER>)" // or "master"
}

export default class Boundary extends RangeComponent<BoundaryData> {

  componentType = COMPONENT_TYPE.BOUNDARY

  getTitle(): string {
    return this._data.commit(GET, TITLE)
  }

  changeTitle(title: string) {
    const oldTitle = this.getTitle()

    if (oldTitle === title) {
      return
    }

    this._data.commit(SET, TITLE, title)

    this.getUndo().add({
      undo: () => { this.changeTitle(oldTitle) },
      redo: () => { this.changeTitle(title) }
    })
  }

}