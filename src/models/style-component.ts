//@flow

import { COMPONENT_TYPE, STYLE_KEYS } from '../common/constants'
import BaseComponent from './base-component'
import { UUID, isDef } from '../common/utils'
import Style, { StyleData } from './style'
import Sheet from './sheet'

const CLASS_SEPARATOR = ' '

const GET = 'get'
const SET = 'set'
const DELETE = 'delete'

const STYLE = 'style'
const CLASS = 'class'

/**
 * @description summary样式名转换
 * */
const summaryStyleDict = {
  [STYLE_KEYS.SHAPE_CLASS]: 'summaryLineClass',
  [STYLE_KEYS.LINE_WIDTH]: 'summaryLineWidth',
  [STYLE_KEYS.LINE_COLOR]: 'summaryLineColor'
}

const EVENT_CLASS = 'changeClass'
const EVENT_STYLE = 'changeStyle'

export default class StyleComponent<T> extends BaseComponent<T> {

  componentType = COMPONENT_TYPE.STYLE_COMPONENT

  public _style: Style
  private _classList: string[] = []

  constructor (data: T, options: Object = {}) {
    super(data, options)
  }

  init(sheet: Sheet) {
    super.init(sheet)
    const styleData = this._data.commit(GET, STYLE)
    this._initStyle(styleData)
  }

  _initStyle(styleData: StyleData) {
    const hasStyleData = styleData && styleData.properties
    if (!hasStyleData) {
      styleData = this._createEmptyStyleData()
      this._data.commit(SET, STYLE, styleData)
    }
    this._style = this.ownerSheet().createComponent(COMPONENT_TYPE.STYLE, styleData) as Style
    this._style.parent(this)
    return this._style
  }

  _createEmptyStyleData(): StyleData {
    return {
      'id': UUID(),
      'properties': {}
    }
  }

  getClassList() {
    if (this._classList) {
      return this._classList
    }
    this._classList = []
    const classString = this._data.commit(GET, CLASS)
    if (typeof classString === 'string') {
      this._classList = classString.split(CLASS_SEPARATOR).filter(className => className !== '')
    }
    return this._classList
  }

  addClass(className: string, index: number) {
    if (!className || className.includes(CLASS_SEPARATOR)) {
      return
    }
    let classList = this.getClassList()
    if (isDef(className) && !classList.includes(className)) {
      classList.splice(index, 0, className)

      this._data.commit(SET, CLASS, classList.join(CLASS_SEPARATOR))
      this.triggerModelChanged(EVENT_CLASS, className)

      this.getUndo().add({
        undo: () => { this.removeClass(className) },
        redo: () => { this.addClass(className, index) }
      })

    }
  }

  removeClass(className: string) {
    let classList = this.getClassList()
    if (isDef(className) && classList.includes(className)) {
      let index = classList.indexOf(className)
      classList.splice(index, 1)

      // Modify model
      if (classList.length > 0) {
        this._data.commit(SET, CLASS, classList.join(CLASS_SEPARATOR))
      } else {
        this._data.commit(DELETE, CLASS)
      }
      this.triggerModelChanged(EVENT_CLASS, className)

      this.getUndo().add({
        undo: () => { this.addClass(className, index) },
        redo: () => { this.removeClass(className) }
      })

    }
  }

  getClassValue(key: string) {
    const classList = this.getClassList()
    const theme = this.ownerSheet().getTheme()
    let value
    if (theme) {
      for (let className of classList) {
        let sv = theme.getStyleValue(className, key)
        if (sv) {
          value = sv
        }
      }
    }
    return value
  }

  getStyle () {
    return this._style
  }

  getStyleValue (key: string) {
    return this._style.getValue(key)
  }

  changeStyle (key: string, value: any) {
    const primitiveKey = key
    let oldStyle = this.getStyleValue(key)
    // if oldStyle is same as value, just return
    if (oldStyle === value) return

    // special treat for textDecoration
    if (value && key === STYLE_KEYS.TEXT_DECORATION) {
      let [preFix, decoValue] = value.split(':')
      value = decoValue

      // line-through redo的问题
      if (!decoValue) {
        value = preFix.trim()
      }

      else if (preFix === 'add') {
        if (oldStyle === 'none' || !oldStyle) oldStyle = ''
        value = oldStyle.includes(value) ? oldStyle : oldStyle + ` ${value}`
      }

      else if (preFix === 'rm') {
        if (!oldStyle) oldStyle = ''
        value = oldStyle.includes(value) && oldStyle.replace(value, '').trim()
        if (value === '') value = 'none'
      }
    }

    value ? this._style.setValue(key, value) : this._style.removeKey(key)

    if (this.componentType === COMPONENT_TYPE.SUMMARY && summaryStyleDict[key]) {
      key = summaryStyleDict[key]
    }

    this.triggerModelChanged(EVENT_STYLE, key, value)

    this.getUndo().add({
      undo: () => { this.changeStyle(primitiveKey, oldStyle) },
      redo: () => { this.changeStyle(primitiveKey, value) }
    })
  }

}