// @flow
import { COMPONENT_TYPE, EVENTS } from '../common/constants'
import BaseModel from './base-model'
import Sheet from './sheet'
import Workbook from './workbook'
import Undo from '../common/undo'

export default class BaseComponent<T> extends BaseModel<T> {

  componentType: string = COMPONENT_TYPE.BASE_COMPONENT
  private _ownerWorkbook: Workbook
  private _ownerSheet: Sheet
  private _parent?: BaseComponent<any>

  init(sheet: Sheet) {
    this.ownerSheet(sheet)
  }

  triggerModelChanged(...args) {
    this.emit(args[0], ...args.slice(1))
    this.ownerSheet().emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE)
  }

  ownerWorkbook(workbook?: Workbook): Workbook | null {
    if (workbook) this._ownerWorkbook = workbook
    return this._ownerWorkbook
  }

  ownerSheet(sheet?: Sheet): Sheet {
    if (sheet) this._ownerSheet = sheet
    return this._ownerSheet
  }

  parent(parentModel?: BaseComponent<any>): BaseComponent<any> | null {
    if (parentModel !== undefined) {
      this.emit('beforeParentChange')
      this._parent = parentModel
      this.emit('afterParentChange')
    }
    return this._parent
  }

  getUndo(): Undo {
    return this.ownerSheet().getUndo()
  }

  isOrphan(): boolean {
    const parent = this.parent()
    if (parent) {
      return parent.isOrphan()
    }
    return true
  }

}