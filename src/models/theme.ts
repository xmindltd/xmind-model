import { COMPONENT_TYPE } from '../common/constants/index'
import BaseComponent from './base-component'
import { isDef } from '../common/utils'
import Sheet from './sheet'
import Style, { StyleData } from './style'

const GET = 'get'
const SET = 'set'
const DELETE = 'delete'
const KEYS = 'keys'

const EVENT_THEME_CLASS = 'changeThemeClass'

export interface ThemeData {
  id: string
  title: string
  map?: StyleData
  centralTopic?: StyleData
  mainTopic?: StyleData
  subTopic?: StyleData
  floatingTopic?: StyleData
  centralFloatingTopic?: StyleData
  boundary?: StyleData
  relationship?: StyleData
  summaryTopic?: StyleData
  summary?: StyleData
  ///  other style families, e.g. "important", "major",
}


export default class Theme extends BaseComponent<ThemeData> {

  componentType = COMPONENT_TYPE.THEME

  _properties: any

  init(sheet: Sheet) {
    super.init(sheet)
    const classNames = this.getAllClassNames()
    classNames.forEach(className => {
      const styleData = this._data.commit(GET, className)
      this._properties[className] = this.ownerSheet().createComponent(COMPONENT_TYPE.STYLE, styleData)
      this._properties[className].parent(this)
    })
  }

  hasClass(className: string): boolean {
    return !!this._properties[className]
  }

  getStyle(className: string): Style {
    return this._properties[className]
  }

  getTitle(): string {
    return this._data.commit('get', 'title')
  }

  changeTitle(title: string) {
    return this._data.commit('set', 'title', title)
  }

  getStyleValue (className: string, styleKey: string) {
    const style = this._properties[className]
    return style && style.getValue(styleKey)
  }

  getAllClassNames (): Array<string> {
    return this._data.commit(KEYS).filter(item => {
      item !== 'id' || item !== 'title'
    })
  }

  changeClass (className: string, styleData: StyleData) {
    if (!isDef(styleData)) {
      delete this._properties[className]
      this._data.commit(DELETE, className)
      this.triggerModelChanged(EVENT_THEME_CLASS)
      return
    }

    const data = JSON.parse(JSON.stringify(styleData))
    const newStyle = this.ownerSheet().createComponent(COMPONENT_TYPE.STYLE, data)

    const oldStyleData = this._properties[className] ? this._properties[className].toJSON() : null

    this._properties[className] = newStyle
    this._properties[className].parent(this)
    this._data.commit(SET, className, data)
    this.triggerModelChanged(EVENT_THEME_CLASS)

    this.getUndo().add({
      undo: () => this.changeClass(className, oldStyleData),
      redo: () => this.changeClass(className, styleData)
    })
  }

}