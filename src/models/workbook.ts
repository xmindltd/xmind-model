import { EVENTS, COMPONENT_TYPE, CONFIG } from '../common/constants'
import UndoManager from '../common/undo'
import { Config } from '../common/config'
import { UUID } from '../common/utils'

import Sheet, { SheetData } from './sheet'
import BaseComponent from './base-component'

export default class Workbook extends BaseComponent<SheetData[]> {

  componentType = COMPONENT_TYPE.WORKBOOK

  _sheets: Array<Sheet> = []
  private _config: Config

  _undoManager: UndoManager

  constructor (data: SheetData[], options: any = {}) {
    super(data, options)

    this._config = new Config()

    this._initUndo()

    // sheets
    this._initSheets()
  }

  _initUndo() {
    this._undoManager = new UndoManager()
    this._undoManager.setStackLimitedLength(Infinity)

    this._undoManager.on(EVENTS.UNDO_STATE_CHANGE, (...params) => this.emit(EVENTS.UNDO_STATE_CHANGE, ...params))
  }

  _initSheets() {
    const sheetDataList = this._data.getOriginalData()
    sheetDataList.forEach(sheetData => {
      const newSheet = new Sheet(sheetData, { undo: this._undoManager })
      newSheet.parent(this)
      this._sheets.push(newSheet)
      this._listenSheetModel(newSheet, sheetData.id)
    })
  }

  _listenSheetModel(sheet: Sheet, id: string) {
    if (!sheet) { return }
    sheet.on(EVENTS.AFTER_SHEET_CONTENT_CHANGE, () => {
      this.emit(EVENTS.AFTER_WORKBOOK_CONTENT_CHANGE)
    })
  }

  addSheet(sheetData: SheetData, options: any = {}) {
    const sheetIndex = this._sheets.findIndex(sheet => sheet.getId() === sheetData.id)

    const sheetModel = new Sheet(sheetData, { undo: this._undoManager })
    sheetModel.parent(this)
    this._listenSheetModel(sheetModel, sheetData.id)

    if (sheetIndex > 0) {
      this._config.get(CONFIG.LOGGER).info(sheetData.id)
      this._config.get(CONFIG.LOGGER).warn("try to add an existing sheet")

      this._sheets[sheetIndex] = sheetModel

    } else {
      const at = options.at || this._sheets.length
      const info = { sheetModel, at }
      this.emit(EVENTS.BEFORE_ADD_NEW_SHEET, sheetData, info)

      const sheetDataList = this._data.getOriginalData()
      sheetDataList.splice(at, 0, sheetData)
      this._sheets.splice(at, 0, sheetModel)

      this.emit(EVENTS.AFTER_ADD_NEW_SHEET, sheetData, info)
    }

    this.getUndo().add({
      undo: () => this.removeSheet(sheetData.id),
      redo: () => this.addSheet(sheetData)
    })

    return sheetModel
  }

  removeSheet(sheetId: string) {
    const sheet = this.getSheetById(sheetId)

    if (!sheet) { return }

    this.emit(EVENTS.BEFORE_REMOVE_SHEET_MODEL, sheetId)

    const index = this._sheets.indexOf(sheet)
    const oldSheetData = sheet.toJSON()
    const sheetsData = this._data.getOriginalData()

    sheetsData.splice(index, 1)
    this._sheets.splice(index, 1)

    sheet.remove()

    this.emit(EVENTS.AFTER_REMOVE_SHEET_MODEL, sheetId)

    this.getUndo().add({
      undo: () => this.addSheet(oldSheetData),
      redo: () => this.removeSheet(sheetId)
    })

    this.emit(EVENTS.AFTER_WORKBOOK_CONTENT_CHANGE)
  }

  moveSheetTo (sheetId: string, to: number) {
    const sheet = this.getSheetById(sheetId)

    if (!sheet) { return }

    const index = this._sheets.indexOf(sheet)

    const sheetsData = this._data.getOriginalData()
    const sheetDataArr = sheetsData.splice(index, 1)

    if (to < 0) to = 0
    if (to > this._sheets.length - 1) to = this._sheets.length - 1

    sheetsData.splice(to, 0, ...sheetDataArr)

    this._sheets.splice(index, 1)
    this._sheets.splice(to, 0, sheet)

    this.getUndo().add({
      undo: () => this.moveSheetTo(sheetId, index),
      redo: () => this.moveSheetTo(sheetId, to)
    })

    this.emit(EVENTS.AFTER_SHEET_ORDER_CHANGE)
    this.emit(EVENTS.AFTER_WORKBOOK_CONTENT_CHANGE)
  }

  getSheets() {
    return [...this._sheets]
  }

  getSheetByIndex(index: number) {
    return this._sheets[index]
  }

  getSheetById(sheetId: string) {
    return this._sheets.find(sheet => sheet.getId() === sheetId)
  }

  findSheetIndex(sheetId: string) {
    return this._sheets.findIndex(sheet => sheet.getId() === sheetId)
  }

  getUndo() {
    return this._undoManager
  }

  createEmptySheet (sheetTitle: string = '', rootTopicTitle: string = '') {
    const newSheetData: SheetData = {
      id: UUID(),
      title: sheetTitle,
      rootTopic: {
        id: UUID(),
        title: rootTopicTitle
      }
    }

    return this.addSheet(newSheetData)
  }
}
