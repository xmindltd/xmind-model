import { COMPONENT_TYPE } from '../common/constants'
import BaseComponent from "./base-component"
import Boundary from './boundary'
import Legend from './legend'
import Marker from './marker'
import Notes from './notes'
import Numbering from './numbering'
import Relationship from './relationship'
import Extension from './topic-extension'
import Style from './style'
import Summary from './summary'
import Theme from './theme'
import Topic from './topic'
import TopicImage from './topic-image'

import Sheet from './sheet'

const supportedComponents = {
  [COMPONENT_TYPE.LEGEND]: Legend,
  [COMPONENT_TYPE.THEME]: Theme,
  [COMPONENT_TYPE.BOUNDARY]: Boundary,
  [COMPONENT_TYPE.RELATIONSHIP]: Relationship,

  [COMPONENT_TYPE.TOPIC]: Topic,
  [COMPONENT_TYPE.STYLE]: Style,
  [COMPONENT_TYPE.SUMMARY]: Summary,
  [COMPONENT_TYPE.IMAGE]: TopicImage,
  [COMPONENT_TYPE.MARKER]: Marker,
  [COMPONENT_TYPE.NOTE]: Notes,
  [COMPONENT_TYPE.NUMBERING]: Numbering,
  [COMPONENT_TYPE.EXTENSION]: Extension
}

const needIdTypeList = [
  COMPONENT_TYPE.THEME, COMPONENT_TYPE.TOPIC, COMPONENT_TYPE.BOUNDARY,
  COMPONENT_TYPE.SUMMARY, COMPONENT_TYPE.RELATIONSHIP, COMPONENT_TYPE.STYLE
]

const dataChecker = (sheet: Sheet, componentType: string, data: any, options: any = {}) => {

  if (!data.id && needIdTypeList.includes(componentType)) {
    data.id = sheet.generateComponentId()
  }

  if (componentType === COMPONENT_TYPE.SUMMARY) {
    if (!data.topicId) {
      data.topicId = sheet.generateComponentId()
    }
  }

  return true
}

export default function createComponent<T>(sheet: Sheet, componentType: string, data: T, options: any = {}): BaseComponent<T> {

  if (!dataChecker(sheet, componentType, data, options)) {
    throw new Error(`${componentType} data check error!`)
  }

  const SheetComponent = supportedComponents[componentType]
  if (!SheetComponent) {
    throw new Error(`${componentType} is not supported.`)
  }

  const sheetComponent = new SheetComponent(data, options) as any
  sheetComponent.init(sheet)

  return sheetComponent
}