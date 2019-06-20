import {
  EVENTS,
  MODEL_TYPE,
  COMPONENT_TYPE,
  TOPIC_TYPE,
  LANGS
} from '../common/constants'
import { UUID } from '../common/utils'
import { Config } from '../common/config'
import langs from '../common/utils/langs'

import createSheetComponent from './sheet-component-factory'
import Undo from '../common/undo'
import StyleComponent from './style-component'
import Topic, { TopicData } from './topic'
import { StyleData } from './style'
import Theme, { ThemeData } from './theme'
import Relationship, { RelationshipData } from './relationship'
import Legend, { LegendData } from './legend'
import UndoManager from '../common/undo'

const ROOT_TOPIC_DATA_KEY = 'rootTopic'

const GET = 'get'
const SET = 'set'

const LEGEND = 'legend'
const DATA_KEY_TITLE = 'title'
const RELATIONSHIPS = 'relationships'
const THEME = 'theme'
const TOPIC_POSITIONING = 'topicPositioning'
const TOPIC_OVER_LAPPING = 'topicOverlapping'

const SHEET_EVENT = {
  ADD_RELATIONSHIP: 'addRelationship',
  REMOVE_RELATIONSHIP: 'removeRelationship',
  ADD_THEME: 'addTheme',
  CHANGE_THEME: 'changeTheme',
}

export interface SheetSettingsData {
  "infoItems/infoItem": [
    {
      "type": string, /// "<TYPE:INFO_ITEM_TYPE_ID>",
      "mode": string /// "card" // or "icon"
    }
  ]
  "tab-color": [
    {
      "rgb": string ///"#XXXXXX"
    }
  ]
}

export interface SheetData {
  id: string
  title: string
  rootTopic: TopicData
  style?: StyleData
  topicPositioning?: "free" | "fixed" ///"free", //or "fixed"
  topicOverlapping?: "overlap" | "none" ///"overlap", //or "none"
  theme?: ThemeData
  relationships?: [
    RelationshipData,
    RelationshipData
  ]
  legend?: LegendData
  settings?: SheetSettingsData
}

export default class Sheet extends StyleComponent<SheetData> {

  componentType = MODEL_TYPE.SHEET

  private _legend: Legend
  private _rootTopic: Topic
  private _relationships: Relationship[]
  private _undoManager: UndoManager
  private _theme: Theme
  public _config: Config = new Config()
  private _idMap: { [id: string]: any } = {}

  private _textTranslator: Function = null

  public modelEvents = {
    topicAddMarker: 'topicAddMarker',
    topicChangeMarker: 'topicChangeMarker',
    topicRemoveMarker: 'topicRemoveMarker',
  }

  constructor(data: SheetData, options: any = {}) {
    super(data, options)

    this.init()

    if (options.undo) {
      this._undoManager = options.undo
    } else {
      this._undoManager = new UndoManager()
      this._undoManager.setStackLimitedLength(Infinity)
    }
  }

  init() {
    super.init(this)

    // legend
    this._initLegend()

    // root topic
    this._initRootTopic()

    // relationships
    this._initRelationships()

    // theme
    const themeData = this._data.commit(GET, THEME)
    this._initTheme(themeData)

    // old free position
    this._enableOldFreePosition()
  }

  _initLegend() {
    const legendData: LegendData = this._data.commit(GET, LEGEND) || {}
    this._legend = this.createComponent(MODEL_TYPE.LEGEND, legendData) as Legend
    this._legend.parent(this)
  }

  _initRootTopic() {
    this._rootTopic = this.createComponent(COMPONENT_TYPE.TOPIC, this._data.commit('get', ROOT_TOPIC_DATA_KEY), {
      type: TOPIC_TYPE.ROOT
    }) as Topic
    this._rootTopic.parent(this)
  }

  _initRelationships() {
    this._relationships = []
    const relationshipsData = this._data.commit(GET, RELATIONSHIPS)
    relationshipsData && relationshipsData.forEach(data => {
      const relationship = this.createComponent(COMPONENT_TYPE.RELATIONSHIP, data) as Relationship
      relationship.parent(this)
      this._relationships.push(relationship)
      this.emit(SHEET_EVENT.ADD_RELATIONSHIP, relationship, this)
    })
  }

  getUndo(): Undo {
    return this._undoManager
  }

  ownerSheet() {
    return this
  }

  getLegend() {
    return this._legend
  }

  getRootTopic(): Topic {
    return this._rootTopic
  }

  replaceRootTopic(newRootTopicData: TopicData) {
    this._rootTopic.remove()

    this._data.commit("set", ROOT_TOPIC_DATA_KEY, newRootTopicData)
    this._rootTopic = this.createComponent(COMPONENT_TYPE.TOPIC, newRootTopicData, {
      type: TOPIC_TYPE.ROOT
    }) as Topic
    this._rootTopic.parent(this)
  }

  getRelationships(): Array<Relationship> {
    return [...this._relationships]
  }

  addRelationship(relationshipData: RelationshipData, options: any = {}) {
    const newRelationship = this.createComponent(COMPONENT_TYPE.RELATIONSHIP,
      relationshipData) as Relationship
    newRelationship.parent(this)

    const relationships = this._relationships

    const relationshipsData = this._data.commit(GET, RELATIONSHIPS)
    if (relationshipsData) {
      relationshipsData.push(relationshipData)
    } else {
      this._data.commit(SET, RELATIONSHIPS, [relationshipData])
    }
    this.emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE)

    relationships.push(newRelationship)
    this.emit(SHEET_EVENT.ADD_RELATIONSHIP, newRelationship, this)

    this.getUndo().add({
      undo: () => this.removeRelationship(newRelationship),
      redo: () => this.addRelationship(relationshipData)
    }, 'R-add')

  }

  removeRelationship(relationship: Relationship) {
    const relationships = this._relationships
    const relationshipIndex = relationships.indexOf(relationship)
    if (relationshipIndex < 0) {
      return
    }

    const relationshipsData = this._data.commit(GET, RELATIONSHIPS)
    relationshipsData.splice(relationshipIndex, 1)
    this.emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE)

    relationships.splice(relationshipIndex, 1)
    relationship.parent(null)
    relationship.remove()
    this.emit(SHEET_EVENT.REMOVE_RELATIONSHIP, relationship)

    this.getUndo().add({
      undo: () => this.addRelationship(relationship.toJSON()),
      redo: () => this.removeRelationship(relationship)
    }, 'R-remove')

  }

  getTheme() {
    return this._theme
  }

  _initTheme(themeData) {
    if (themeData) {
      const theme = this.createComponent(COMPONENT_TYPE.THEME, themeData) as Theme
      theme.parent(this)
      this._theme = theme
    }
  }

  changeTheme(themeData: ThemeData, options: any = {}) {
    const oldTheme = this.getTheme()
    const oldThemeData = this._data.commit(GET, THEME)

    this._data.commit(SET, THEME, themeData)
    this._initTheme(themeData)

    if (!oldTheme) {
      this.emit(SHEET_EVENT.ADD_THEME, this._theme)
    } else {
      if (options.fixUserStyleWhenChangeTheme) {
        options.fixUserStyleWhenChangeTheme()
      }
      this.emit(SHEET_EVENT.CHANGE_THEME, this._theme)
    }

    this.getUndo().add({
      undo: () => {
        this.changeTheme(oldThemeData)
      },
      redo: () => {
        this.changeTheme(themeData)
      }
    }, 'changeTheme')

    this.emit(EVENTS.AFTER_THEME_CHANGED)
    this.emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE)
  }

  changeFreePosition(isFree: boolean) {
    const original = this._data.commit(GET, TOPIC_POSITIONING)
    const topicPositioning = isFree ? 'free' : 'fixed'

    if (topicPositioning === original || (!original && topicPositioning === 'fixed')) {
      return
    }

    if (original === 'free' && !isFree) {
      // status change from free to fixed
      // TODO
      // clearPositionOfAllAttachedTopic(this)
    }

    this._data.commit(SET, TOPIC_POSITIONING, topicPositioning)
    this.emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE)

    this.getUndo().add({
      undo: () => {
        this._changePositioning(original)
      },
      redo: () => {
        this._changePositioning(topicPositioning)
      }
    })
  }

  isFreePosition(): boolean {
    return this._data.commit(GET, TOPIC_POSITIONING) === 'free'
  }


  _changePositioning(nextStatus: "fixed" | "free") {
    const preStatus = this.get("topicPositioning");

    if (nextStatus === preStatus || (!preStatus && (nextStatus === "fixed"))) {
      return
    }

    this.set("topicPositioning", nextStatus);
    this.emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE);

    this.getUndo().add({
      undo: () => {
        this._changePositioning(preStatus)
      },
      redo: () => {
        this._changePositioning(nextStatus)
      }
    });
  }

  /**
   * 如果以前在 free position 下编辑的，应该开启 topicPositioning
   */
  _enableOldFreePosition() {
    if (this._data.commit(GET, TOPIC_POSITIONING) !== undefined) return
    const mainTopics = this.getRootTopic().getChildrenByType(TOPIC_TYPE.ATTACHED)
    const isFree = mainTopics.some(topic => !!topic._data['position'])
    if (isFree) {
      this._data.commit(SET, TOPIC_POSITIONING, 'free')
    } else {
      this._data.commit(SET, TOPIC_POSITIONING, 'fixed')
    }
  }

  changeOverlap(topicOverlapping: string) {
    const original = this._data.commit(GET, TOPIC_OVER_LAPPING)

    const isOverlapEqual = (val1, val2) => {
      return val1 === val2 || (!val1 && val2 === 'none') || (val1 === 'none' && !val2)
    }

    if (isOverlapEqual(topicOverlapping, original)) {
      return
    }
    this._data.commit(SET, TOPIC_OVER_LAPPING, topicOverlapping)

    this.emit(EVENTS.AFTER_SHEET_CONTENT_CHANGE)
    this.getUndo().add({
      undo: () => this.changeOverlap(original),
      redo: () => this.changeOverlap(topicOverlapping)
    })
  }

  isTopicOverlapping(): boolean {
    return this._data.commit(GET, TOPIC_OVER_LAPPING) === 'overlap'
  }

  createComponent(componentType: string, data: Object, options: Object = {}) {
    let model = createSheetComponent(this, componentType, data, options)
    this._idMap[model.getId()] = model
    return model
  }

  generateComponentId() {
    let id = UUID()
    while (!!this._idMap[id]) {
      id = UUID()
    }
    return id
  }

  getTitle() {
    return this.get(DATA_KEY_TITLE)
  }

  changeTitle(title: string) {
    return this.set(DATA_KEY_TITLE, title)
  }

  findComponentById(id: string) {
    return this._idMap[id]
  }

  remove() {
    super.remove()
    this.parent(null)
  }

  setTextTranslator(fn: Function) {
    this._textTranslator = fn
  }

  getTranslatedText(key) {
    if (!this._textTranslator) {
      return langs.translate(LANGS.ZH_CN, key);
    }
    else {
      return this._textTranslator(key);
    }
  }

  relationships () {
    console.error('need to remove')
    return this.getRelationships()
  }

  getLegendModel () {
    console.error('need to remove')
    return this.getLegend()
  }

  isFreePositionEnabled () {
    console.error('need to remove')
    return this.isFreePosition()
  }
}
