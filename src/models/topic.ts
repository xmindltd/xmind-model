import StyleComponent from './style-component'
import { COMPONENT_TYPE, TOPIC_TYPE, EXTENSION_PROVIDER } from '../common/constants'
import { isEqualPoint, isPointLike, Point, isUndefined, isNull, isEmpty, deepClone } from '../common/utils'
import Boundary, { BoundaryData } from './boundary'
import Summary, { SummaryData } from './summary'
import Marker, { MarkerData } from './marker'
import Notes, { NotesData } from './notes'
import Numbering, { NumberingData } from './numbering'
import Extension, { ExtensionData } from './topic-extension'
import BaseComponent from './base-component'
import { StyleData } from './style'
import { ImageData } from './topic-image'
import Sheet from './sheet'

export interface TopicImage extends BaseComponent<ImageData> {}
export interface TopicData {
  id: string ///"<ID>", // generated UUID
  title: string /// "<STRING>",
  style?: StyleData
  class?: string ///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this topic
  position?: Point
  structureClass?: string ///"<TYPE:STRUCTURE_CLASS>",
  branch?: string ///"folded", // or null
  width?: number ///<INTEGER>,
  labels?: string // keep the order in which items are added
  numbering?: NumberingData

  href?: string, ///"<URL>",
  // "href": "xap:resources/<HASH>.doc" (attachment reference)
  // "href": "xmind:#<ID>"  (object hyperlink)
  // "href": "http://www.google.com"  (web hyperlink)
  // "href": "file:///Users/user/Documents/test.doc"  (file hyperlink)

  notes?: NotesData,
  image?: ImageData,
  children?: {
    [index: string]: Array<TopicData>
  },
  markers?: Array<MarkerData>, // keep the order in which items are added
  boundaries?: Array<BoundaryData>, // keep the order in which items are added
  summaries?: Array<SummaryData>, // keep the order in which items are added
  extensions?: Array<ExtensionData> // keep the order in which items are added
}

interface TopicModelInitOptions {
  type: typeof TOPIC_TYPE.ATTACHED | typeof TOPIC_TYPE.DETACHED | typeof TOPIC_TYPE.CALLOUT | typeof TOPIC_TYPE.SUMMARY
  index?: number
}

const defaultInitOptions: TopicModelInitOptions = Object.freeze({
  type: TOPIC_TYPE.ATTACHED
})

const CHILDREN_DATA_KEY = 'children'
const BOUNDARIES_DATA_KEY = 'boundaries'
const SUMMARIES_DATA_KEY = 'summaries'
const MARKERS_DATA_KEY = 'markers'
const LABELS_DATA_KEY = 'labels'
const NOTES_DATA_KEY = 'notes'
const IMAGE_DATA_KEY = 'image'
const HREF_DATA_KEY = 'href'
const NUMBERING_DATA_KEY = 'numbering'
const FOLDED_DATA_KEY = 'branch'
const TITLE_DATA_KEY = 'title'
const POSITION_DATA_KEY = 'position'
const STRUCTURE_CLASS_DATA_KEY = 'structureClass'
const WIDTH_DATA_KEY = 'width'
const EXTENSIONS_DATA_KEY = 'extensions'

export default class Topic extends StyleComponent<TopicData> {

  componentType = COMPONENT_TYPE.TOPIC

  modelEvents = {
    addTopic: 'addTopic',
    removeTopic: 'removeTopic',
    moveChildTopic: 'moveChildTopic',

    addBoundary: 'addBoundary',
    removeBoundary: 'removeBoundary',

    addSummary: 'addSummary',
    removeSummary: 'removeSummary',

    addImage: 'addImage',
    removeImage: 'removeImage',

    addMarker: 'addMarker',
    removeMarker: 'removeMarker',

    addLabel: 'addLabel',
    removeLabel: 'removeLabel',

    addNotes: 'addNotes',
    removeNotes: 'removeNotes',

    addHref: 'addHref',
    removeHref: 'removeHref',

    addNumbering: 'addNumbering',
    removeNumbering: 'removeNumbering',

    changeTitle: 'changeTitle',

    changePosition: 'changePosition',

    changeStructureClass: 'changeStructureClass',

    changeCustomWidth: 'changeCustomWidth',

    extensionEventMap: {
      add: {
        [EXTENSION_PROVIDER.AUDIO_NOTES]: 'addAudioNotes',
        [EXTENSION_PROVIDER.TASK_INFO]: 'addTaskInfo',
        [EXTENSION_PROVIDER.UNBALANCED_MAP]: 'addUnbalancedMapInfo'
      },
      remove: {
        [EXTENSION_PROVIDER.AUDIO_NOTES]: 'removeAudioNotes',
        [EXTENSION_PROVIDER.TASK_INFO]: 'removeTaskInfo',
        [EXTENSION_PROVIDER.UNBALANCED_MAP]: 'removeUnbalancedMapInfo'
      }
    },

    labelsChanged: 'labelsChanged',
    informationChanged: 'informationChanged',
  }

  _topicType: string

  _childrenTopicMap: { [index: string]: Array<Topic> } = {}

  _boundaries: Array<Boundary> = []

  _summaries: Array<Summary> = []

  _markers: Array<Marker> = []

  _image: TopicImage = null

  _notes: Notes = null

  _numbering: Numbering = null

  _extensionMap: { [index: string]: Extension } = {}

  constructor(data: TopicData, options: TopicModelInitOptions = deepClone(defaultInitOptions)) {
    super(data, options)

    this._topicType = options.type || TOPIC_TYPE.ATTACHED
  }

  init(sheet: Sheet) {
    super.init(sheet)

    // markers
    this._initMarkers()

    // children
    this._initChildren()

    // boundaries
    this._initBoundaries()

    // summaries
    this._initSummaries()

    // image
    this._initImage()

    // label不存在model，所以不需要init

    // notes
    this._initNotes()

    // href不存在model

    // numbering
    this._initNumbering()

    // extensions
    this._initExtensionMap()
  }

  _initChildren() {
    const childrenData = this._data.commit('get', CHILDREN_DATA_KEY)

    if (!childrenData) return

    Object.keys(childrenData).forEach(topicType => {
      const childrenDataList = childrenData[topicType] as TopicData[]
      if (Array.isArray(childrenDataList)) {
        for (let i = 0; i < childrenDataList.length; ++i) {
          const topicData = childrenDataList[i]
          this._addChildTopic(topicData, { type: topicType, index: i })
        }
      }
    })
  }

  _initBoundaries() {
    const boundariesData = this._data.commit('get', BOUNDARIES_DATA_KEY)
    if (Array.isArray(boundariesData)) {
      boundariesData.forEach(boundaryData => {
        this._addBoundary(boundaryData)
      })
    }
  }

  _initSummaries() {
    const summariesData = this._data.commit('get', SUMMARIES_DATA_KEY)
    if (Array.isArray(summariesData)) {
      summariesData.forEach(summaryData => {
        this._addSummary(summaryData, {}, true)
      })
    }
  }

  _initMarkers() {
    const markersData = this._data.commit('get', MARKERS_DATA_KEY)
    if (Array.isArray(markersData)) {
      markersData.forEach(markerData => {
        this._addMarker(markerData)
      })
    }
  }

  _initImage() {
    const imageSavedData = this._data.commit('get', IMAGE_DATA_KEY)
    if (imageSavedData) {
      this._addImage(imageSavedData)
    }
  }

  _initNotes() {
    const notesData = this._data.commit("get", NOTES_DATA_KEY)
    if (notesData) {
      this._addNotes(notesData)
    }
  }

  _initNumbering() {
    const numberingData = this._data.commit("get", NUMBERING_DATA_KEY)
    if (numberingData) {
      this._addNumbering(numberingData)
    }
  }

  _initExtensionMap() {
    const extensionsData = this._data.commit("get", EXTENSIONS_DATA_KEY)
    if (Array.isArray(extensionsData)) {
      extensionsData.forEach(extensionData => {
        this._addExtension(extensionData.provider, extensionData)
      })
    }
  }

  getType(): string {
    return this._topicType
  }

  getChildren(): TopicData {
    return this._initData;
  }

  getChildrenByType(typeList: string | Array<string>): Array<Topic> {
    if (typeof typeList === 'string') {
      typeList = [typeList]
    }

    const result = []

    typeList.forEach(type => {
      const childrenList = this._childrenTopicMap[type]
      if (Array.isArray(childrenList)) {
        result.push(...childrenList)
      }
    })

    return result
  }

  addChildTopic(childTopicData: TopicData, options: TopicModelInitOptions = defaultInitOptions): Topic {
    // todo: before add topic 事件：触发与参数设计
    const opts = Object.assign({}, options);
    const newTopicModel = this._addChildTopic(childTopicData, opts)

    // 对data数据做前置校验
    if (!this._data.commit('get', CHILDREN_DATA_KEY)) {
      this._data.commit('set', CHILDREN_DATA_KEY, {})
    }

    const childrenData = this._data.commit('get', CHILDREN_DATA_KEY)

    if (!childrenData[opts.type]) {
      childrenData[opts.type] = []
    }

    if (isUndefined(opts.index) || isNull(opts.index) || opts.index < 0) {
      opts.index = this.getChildrenByType(opts.type).length
    }

    // update data
    childrenData[opts.type].splice(opts.index, 0, childTopicData)

    // todo: add topic 事件：参数设计
    this.emit(this.modelEvents.addTopic)

    // todo undo and redo
    this.getUndo().add({
      undo: () => this.removeChildTopic(newTopicModel),
      redo: () => this.addChildTopic(childTopicData, opts)
    })

    return newTopicModel
  }

  _addChildTopic(childTopicData: TopicData, options: TopicModelInitOptions) {
    const newTopicModel = this.ownerSheet().createComponent(COMPONENT_TYPE.TOPIC, childTopicData, options) as Topic

    // set index value
    if (isUndefined(options.index) || isNull(options.index) || options.index < 0) {
      options.index = this.getChildrenByType(options.type).length
    }

    // put child topic model in _childrenTopicMap
    if (!this._childrenTopicMap[options.type]) this._childrenTopicMap[options.type] = []
    this._childrenTopicMap[options.type].splice(options.index, 0, newTopicModel)

    // set parent
    newTopicModel.parent(this)

    return newTopicModel
  }

  getChildIndexByType(topicType: string, topic: Topic): number {
    const children = this.getChildrenByType(topicType)
    const targetTopicId = topic.getId()
    return children.map(subTopic => subTopic.getId()).indexOf(targetTopicId)
  }

  removeChildTopic(childTopic: Topic) {
    const childTopicType = childTopic.getType()

    const index = this.getChildIndexByType(childTopicType, childTopic)

    if (index === -1) throw new Error('target is not child of this topic')

    // todo 相关boundary与summary的before topic remove方法具体内容

    // todo unbalance info

    // todo BEFORE_REMOVE_TOPIC事件：触发与参数设计

    // remove child topic model from _childrenTopicMap
    this._childrenTopicMap[childTopicType].splice(index, 1)

    // remove child topic data from _data
    const childrenData = this._data.commit('get', CHILDREN_DATA_KEY)

    childrenData[childTopicType].splice(index, 1)
    // 若修改后_data中已不存在对应type的child
    if (!childrenData[childTopicType].length) delete childrenData[childTopicType]
    // 若children中已不存在任何内容
    if (isEmpty(childrenData)) this._data.commit('delete', CHILDREN_DATA_KEY)

    childTopic.remove()

    // todo removeTopic事件：参数设计
    this.emit(this.modelEvents.removeTopic)

    // todo AFTER_REMOVE_TOPIC事件

    // todo undo
    this.getUndo().add({
      undo: () => this.addChildTopic(childTopic.toJSON(), { type: childTopicType, index }),
      redo: () => this.removeChildTopic(this._childrenTopicMap[childTopicType][index])
    })
  }

  moveChildTopic(from: number, to: number) {
    if (isUndefined(from) || isUndefined(to)) return
    if (from === to) return

    const childrenList = this._childrenTopicMap[TOPIC_TYPE.ATTACHED]

    if (!Array.isArray(childrenList)) return

    const canMove = (from >= 0 && from <= childrenList.length - 1) &&
      (to >= 0 && to <= childrenList.length - 1)

    if (!canMove) return

    const topicModelToMove = childrenList[from]

    // move topic model in _childrenTopicMap
    this._childrenTopicMap[TOPIC_TYPE.ATTACHED].splice(from, 1)
    this._childrenTopicMap[TOPIC_TYPE.ATTACHED].splice(to, 0, topicModelToMove)

    // move json
    const childrenData = this._data.commit('get', CHILDREN_DATA_KEY)
    childrenData[TOPIC_TYPE.ATTACHED].splice(from, 1)
    childrenData[TOPIC_TYPE.ATTACHED].splice(to, 0, topicModelToMove.toJSON())

    this.emit(this.modelEvents.moveChildTopic, from, to)

    this.getUndo().add({
      undo: () => this.moveChildTopic(to, from),
      redo: () => this.moveChildTopic(from, to)
    })
  }

  getBoundaries(): Array<Boundary> {
    return [...this._boundaries]
  }

  addBoundary(boundaryData: BoundaryData, options: Object = {}): Boundary {

    const newBoundaryModel = this._addBoundary(boundaryData, options)

    if (!newBoundaryModel) return

    // 对data数据做前置校验
    if (!this._data.commit('get', BOUNDARIES_DATA_KEY)) {
      this._data.commit('set', BOUNDARIES_DATA_KEY, [])
    }

    // update data
    this._data.commit('get', BOUNDARIES_DATA_KEY).push(boundaryData)

    // todo 参数设计
    this.emit(this.modelEvents.addBoundary)

    this.getUndo().add({
      undo: () => this.removeBoundary(newBoundaryModel),
      redo: () => this.addBoundary(boundaryData, options)
    })

    return newBoundaryModel
  }

  _addBoundary(boundaryData: BoundaryData, options: Object = {}): Boundary {
    const newBoundaryModel = this.ownerSheet().createComponent(COMPONENT_TYPE.BOUNDARY, boundaryData, options) as Boundary

    // todo 判断是否已有相同range的boundary

    // todo 是否需要实现boundary的checkRange方法？

    // update boundaries list
    this._boundaries.push(newBoundaryModel)
    newBoundaryModel.parent(this)

    return newBoundaryModel
  }

  removeBoundary(boundary: Boundary) {
    const index = this._boundaries.indexOf(boundary)
    if (index === -1) return

    // todo boundary的remove需要实现相关relationship的remove流程

    // remove boundary model from boundaries list
    this._boundaries.splice(index, 1)

    // remove boundary data from boundariesData list
    const boundariesData = this._data.commit('get', BOUNDARIES_DATA_KEY)
    boundariesData.splice(index, 1)

    // 若boundaries data已为空，则删除boundaries data列表
    if (boundariesData.length === 0) this._data.commit('delete', BOUNDARIES_DATA_KEY)

    // todo 需要实现
    boundary.remove()

    // todo 参数设计
    this.emit(this.modelEvents.removeBoundary)

    this.getUndo().add({
      undo: () => this.addBoundary(boundary.toJSON()),
      redo: () => this.removeBoundary(this._boundaries[index])
    })
  }

  getSummaries(): Array<Summary> {
    return [...this._summaries]
  }

  addSummary(summaryData: SummaryData, summaryTopicData: TopicData, options: { index?: number } = {}) {
    // 在生成summaryModel的时候，summaryData被确保了topicId字段
    const newSummaryModel = this._addSummary(summaryData, options)

    if (!newSummaryModel) return

    summaryTopicData.id = summaryData.topicId

    // add new summary topic
    this.addChildTopic(summaryTopicData, { type: TOPIC_TYPE.SUMMARY })
  }

  _addSummary(summaryData: SummaryData, options: { index?: number } = {}, isInit: boolean = false): Summary {
    const newSummaryModel = this.ownerSheet().createComponent(COMPONENT_TYPE.SUMMARY, summaryData, options) as Summary

    // todo 判断是否已有相同range的summary

    // todo 是否需要实现summary的checkRange方法？

    // update summaries list
    if (options.index) options.index = this._summaries.length

    this._summaries.splice(options.index, 0, newSummaryModel)
    newSummaryModel.parent(this)

    if (!isInit) {
      // 对data数据做前置校验
      if (!this._data.commit('get', SUMMARIES_DATA_KEY)) {
        this._data.commit('set', SUMMARIES_DATA_KEY, [])
      }

      // update data
      this._data.commit('get', SUMMARIES_DATA_KEY).splice(options.index, 0, summaryData)
      this.emit(this.modelEvents.addSummary, summaryData)

      this.getUndo().add({
        undo: () => this._removeSummary(newSummaryModel),
        redo: () => this._addSummary(summaryData, options)
      })
    }

    return newSummaryModel
  }

  removeSummary(summary: Summary) {
    this._removeSummary(summary)

    // remove summary topic
    const summaryTopic = summary.getSummaryTopic()
    this.removeChildTopic(summaryTopic)
  }

  _removeSummary(summary: Summary) {
    const index = this._summaries.indexOf(summary)
    if (index === -1) return

    // remove from summaries
    this._summaries.splice(index, 1)

    // remove from summariesData
    const summariesData = this._data.commit('get', SUMMARIES_DATA_KEY)
    summariesData.splice(index, 1)

    // remove summaries data while it's empty
    if (summariesData.length === 0) this._data.commit('delete', SUMMARIES_DATA_KEY)

    // todo 需要实现
    summary.remove()

    this.triggerModelChanged(this.modelEvents.removeSummary)

    // todo
    this.getUndo().add({
      undo: () => this._addSummary(summary.toJSON(), { index }),
      redo: () => this._removeSummary(this._summaries[index])
    })
  }

  _canCollapse(): boolean {
    const hasChildren = this.getChildrenByType(TOPIC_TYPE.ATTACHED).length > 0
    return hasChildren && !this.isRootTopic()
  }

  isFolded(): boolean {
    return (this._data.commit('get', FOLDED_DATA_KEY) === 'folded') && this._canCollapse()
  }

  extendTopic() {
    if (this.isFolded()) {
      this._data.commit('delete', FOLDED_DATA_KEY)

      this.getUndo().add({
        undo: () => this.collapseTopic(),
        redo: () => this.extendTopic()
      })
    }
  }

  collapseTopic() {
    if (!this.isFolded() && this._canCollapse()) {
      this._data.commit('set', FOLDED_DATA_KEY, 'folded')

      this.getUndo().add({
        undo: () => this.extendTopic(),
        redo: () => this.collapseTopic()
      })
    }
  }

  getMarkers(): Array<Marker> {
    return [...this._markers]
  }

  addMarker(markerData: MarkerData, options: Object = {}) {
    const newMarkerModel = this._addMarker(markerData, options)

    // check markers data list
    if (!this._data.commit('get', MARKERS_DATA_KEY)) {
      this._data.commit('set', MARKERS_DATA_KEY, [])
    }

    // update markers data
    this._data.commit('get', MARKERS_DATA_KEY).push(markerData)

    this.getUndo().add({
      undo: () => this.removeMarker(newMarkerModel.toJSON()),
      redo: () => this.addMarker(markerData, options)
    })
  }

  _addMarker(markerData: MarkerData, options: Object = {}) {
    const newMarkerModel = this.ownerSheet().createComponent(COMPONENT_TYPE.MARKER, markerData, options) as Marker
    // update markers list
    this._markers.push(newMarkerModel)
    this.emit(this.modelEvents.addMarker)
    const sheetModel = this.ownerSheet()
    sheetModel.emit(sheetModel.modelEvents.topicAddMarker, markerData)
    return newMarkerModel
  }

  removeMarker(markerData: MarkerData) {
    const index = this._markers.map(marker => marker.get('markerId')).indexOf(markerData.markerId)
    if (index === -1) return

    const marker = this._markers[index]

    // remove from model
    this._markers.splice(index, 1)

    // remove from data
    const markersData = this._data.commit('get', MARKERS_DATA_KEY)
    markersData.splice(index, 1)

    if (markersData.length === 0) this._data.commit('delete', MARKERS_DATA_KEY)

    marker.remove()

    const trueMarkerData = marker._data.getOriginalData()
    this.emit(this.modelEvents.removeMarker, trueMarkerData)
    const sheetModel = this.ownerSheet()
    sheetModel.emit(sheetModel.modelEvents.topicRemoveMarker, trueMarkerData)

    this.getUndo().add({
      undo: () => this.addMarker(marker.toJSON()),
      redo: () => this.removeMarker(trueMarkerData)
    })
  }

  getImage(): TopicImage {
    return this._image
  }

  addImage(imageData: ImageData, options: Object = {}) {
    if (this._image) this.removeImage()

    this._addImage(imageData, options)

    // update data
    this._data.commit("set", IMAGE_DATA_KEY, imageData)

    this.emit(this.modelEvents.addImage)

    this.getUndo().add({
      undo: () => this.removeImage(),
      redo: () => this.addImage(imageData, options)
    })
  }

  _addImage(imageData: ImageData, options: Object = {}) {
    const newImageModel = this.ownerSheet().createComponent(COMPONENT_TYPE.IMAGE, imageData, options) as TopicImage
    newImageModel.parent(this)

    // update _image
    this._image = newImageModel

    return newImageModel
  }

  removeImage() {
    if (!this._image) return

    const imageModel = this._image

    // remove model
    this._image = null

    // remove data
    this._data.commit("delete", IMAGE_DATA_KEY)

    // todo 实现remove方法
    imageModel.remove()

    this.emit(this.modelEvents.removeImage)

    this.getUndo().add({
      undo: () => this.addImage(imageModel.toJSON()),
      redo: () => this.removeImage()
    })
  }

  /** @important 没有Label Model */
  getLabels(): Array<string> {
    const labels = this._data.commit('get', LABELS_DATA_KEY) || []
    return [...labels]
  }

  // todo 第一个参数是否需要支持数组？
  addLabel(newLabel: string, options: { index?: number } = {}) {
    const labels = this.getLabels()

    if (labels.includes(newLabel)) return

    // update data
    const index = options.index || labels.length
    labels.splice(index, 0, newLabel)
    this._data.commit('set', LABELS_DATA_KEY, [...labels])

    this.emit(this.modelEvents.addLabel)

    this.getUndo().add({
      undo: () => this.removeLabel(newLabel),
      redo: () => this.addLabel(newLabel, options)
    })
  }

  removeLabels() {
    const labels = this.getLabels()
    for (const label of labels) {
      this.removeLabel(label)
    }
  }

  removeLabel(label?: string) {
    if (!label) return this.removeLabels()

    const labels = this.getLabels()

    const index = labels.indexOf(label)

    if (index === -1) return

    // update data
    labels.splice(index, 1)
    if (labels.length) {
      this._data.commit("set", LABELS_DATA_KEY, [...labels])
    } else {
      this._data.commit("delete", LABELS_DATA_KEY)
    }

    this.emit(this.modelEvents.removeLabel)

    this.getUndo().add({
      undo: () => this.addLabel(label, { index }),
      redo: () => this.removeLabel(label)
    })
  }

  getNotes(): Notes {
    return this._notes
  }

  addNotes(notesData: NotesData, options: Object = {}): Notes {
    const notes = this._addNotes(notesData, options)

    // update data
    this._data.commit("set", NOTES_DATA_KEY, notesData)

    this.emit(this.modelEvents.addNotes)

    this.getUndo().add({
      undo: () => this.removeNotes(),
      redo: () => this.addNotes(notesData, options)
    })

    return notes
  }

  _addNotes(notesData: NotesData, options: any = {}): Notes {
    const newNotesModel = this.ownerSheet().createComponent(COMPONENT_TYPE.NOTE, notesData, options) as Notes

    // update _notes
    this._notes = newNotesModel

    return newNotesModel
  }

  removeNotes() {
    const notesModel = this._notes

    if (!notesModel) return

    // remove _notes
    this._notes = null

    // remove data
    this._data.commit("delete", NOTES_DATA_KEY)

    notesModel.remove()

    this.emit(this.modelEvents.removeNotes)

    this.getUndo().add({
      undo: () => this.addNotes(notesModel.toJSON()),
      redo: () => this.removeNotes()
    })
  }

  getHref(): string {
    return this._data.commit('get', HREF_DATA_KEY)
  }

  addHref(href: string) {
    // update data
    this._data.commit("set", HREF_DATA_KEY, href)

    this.emit(this.modelEvents.addHref)

    this.getUndo().add({
      undo: () => this.removeHref(),
      redo: () => this.addHref(href)
    })
  }

  removeHref() {
    const oldHref = this.getHref()

    if (!oldHref) return

    // update data
    this._data.commit("delete", HREF_DATA_KEY)

    this.emit(this.modelEvents.removeHref)

    this.getUndo().add({
      undo: () => this.addHref(oldHref),
      redo: () => this.removeHref()
    })
  }

  getNumbering(): Numbering {
    return this._numbering
  }

  addNumbering(numberingData: NumberingData, options: any = {}) {
    // update data
    if (!numberingData) {
      this._data.commit("delete", NUMBERING_DATA_KEY)
    } else {
      this._data.commit("set", NUMBERING_DATA_KEY, numberingData)
      this._addNumbering(numberingData, options)
    }

    this.emit(this.modelEvents.addNumbering)

    this.getUndo().add({
      undo: () => this.removeNumbering(),
      redo: () => this.addNumbering(numberingData, options)
    })
  }

  _addNumbering(numberingData: NumberingData, options: any = {}) {
    const newNumberingModel = this.ownerSheet().createComponent(COMPONENT_TYPE.NUMBERING, numberingData, options) as Numbering

    // update _numbering
    this._numbering = newNumberingModel

    return newNumberingModel
  }

  changeNumbering(key: string, value: string) {
    this._numbering.changeNumbering(key, value)
  }

  removeNumbering() {
    const oldNumberingModel = this._numbering

    if (!oldNumberingModel) return

    // remove _numbering
    this._numbering = null

    // remove data
    this._data.commit("delete", NUMBERING_DATA_KEY)

    this._numbering.remove()

    this.emit(this.modelEvents.removeNumbering)

    this.getUndo().add({
      undo: () => this.addNumbering(oldNumberingModel.toJSON()),
      redo: () => this.removeNumbering()
    })
  }

  isRootTopic(): boolean {
    return this.getType() === TOPIC_TYPE.ROOT
  }

  getTitle(): string {
    return this._data.commit('get', TITLE_DATA_KEY)
  }

  changeTitle(title: string) {
    const oldTitle = this.getTitle()

    if (oldTitle === title) return

    this._data.commit("set", TITLE_DATA_KEY, title)

    this.emit(this.modelEvents.changeTitle)

    this.getUndo().add({
      undo: () => this.changeTitle(oldTitle),
      redo: () => this.changeTitle(title)
    })
  }

  /**
   * For floating topic
   */
  getPosition(): Point {
    return Object.assign({}, this._data.commit("get", POSITION_DATA_KEY))
  }

  changePosition(position: Point) {
    const oldPosition = this.getPosition()

    if (!position || !isPointLike(position)) {
      this._data.commit("delete", POSITION_DATA_KEY)
    } else {
      if (isEqualPoint(position, oldPosition)) return

      this._data.commit("set", POSITION_DATA_KEY, position)
    }

    this.emit(this.modelEvents.changePosition)

    this.getUndo().add({
      undo: () => this.changePosition(oldPosition),
      redo: () => this.changePosition(position)
    })
  }

  getStructureClass(): string {
    return this._data.commit("get", STRUCTURE_CLASS_DATA_KEY)
  }

  changeStructureClass(structureClass: string) {
    const oldStructureClass = this.getStructureClass()

    if (oldStructureClass === structureClass) return

    if (structureClass) {
      this._data.commit("set", STRUCTURE_CLASS_DATA_KEY, structureClass)
    } else {
      this._data.commit("delete", STRUCTURE_CLASS_DATA_KEY)
    }

    this.emit(this.modelEvents.changeStructureClass)

    this.getUndo().add({
      undo: () => this.changeStructureClass(oldStructureClass),
      redo: () => this.changeStructureClass(structureClass)
    })
  }

  getCustomWidth(): number {
    return this._data.commit("get", WIDTH_DATA_KEY)
  }

  changeCustomWidth(customWidth: number) {
    const oldWidth = this.getCustomWidth()

    if (oldWidth === customWidth) return

    if (customWidth) {
      this._data.commit("set", WIDTH_DATA_KEY, customWidth)
    } else {
      // custom width won't be zero.
      this._data.commit("delete", WIDTH_DATA_KEY)
    }

    this.emit(this.modelEvents.changeCustomWidth)

    this.getUndo().add({
      undo: () => this.changeCustomWidth(oldWidth),
      redo: () => this.changeCustomWidth(customWidth)
    })
  }

  addExtension(provider: string, extensionData: ExtensionData, options: Object = {}) {
    this._addExtension(provider, extensionData, options)

    // update data 直接根据extensionMap的结果全部覆盖
    const extensionsData = Object.keys(this._extensionMap).map(provider => this._extensionMap[provider])
    this._data.commit("set", EXTENSIONS_DATA_KEY, extensionsData)

    this.emit(this.modelEvents.extensionEventMap.add[provider])

    this.getUndo().add({
      undo: () => this.removeExtension(provider),
      redo: () => this.addExtension(provider, extensionData, options)
    })
  }

  _addExtension(provider: string, extensionData: ExtensionData, options: Object = {}) {
    const newExtensionModel = this.ownerSheet().createComponent(COMPONENT_TYPE.EXTENSION, extensionData, options) as Extension

    // update _extensionMap
    this._extensionMap[provider] = newExtensionModel

    return newExtensionModel
  }

  removeExtension(provider: string) {
    const targetExtension = this._extensionMap[provider]

    if (!targetExtension) return

    // update _extensionMap
    delete this._extensionMap[provider]

    // update _data
    const extensionsData = Object.keys(this._extensionMap).map(provider => this._extensionMap[provider])
    if (extensionsData.length) {
      this._data.commit("set", EXTENSIONS_DATA_KEY, extensionsData)
    } else {
      this._data.commit("delete", EXTENSIONS_DATA_KEY)
    }

    // model remove invoke
    targetExtension.remove()

    this.emit(this.modelEvents.extensionEventMap.remove[provider])

    this.getUndo().add({
      undo: () => this.addExtension(provider, targetExtension.toJSON()),
      redo: () => this.removeExtension(provider)
    })
  }

  getExtensions(): Array<Extension> {
    return Object.values(this._extensionMap)
  }

  getExtension(provider: string): Extension {
    return this._extensionMap[provider]
  }

  getAudioNotes(): Extension {
    return this._extensionMap[EXTENSION_PROVIDER.AUDIO_NOTES]
  }

  addAudioNotes(audioNotesData: ExtensionData, options: Object = {}) {
    this.addExtension(EXTENSION_PROVIDER.AUDIO_NOTES, audioNotesData, options)
  }

  removeAudioNotes() {
    this.removeExtension(EXTENSION_PROVIDER.AUDIO_NOTES)
  }

  getTaskInfo() {
    return this._extensionMap[EXTENSION_PROVIDER.TASK_INFO]
  }

  addTaskInfo(taskInfoData: ExtensionData, options: any = {}) {
    this.addExtension(EXTENSION_PROVIDER.TASK_INFO, taskInfoData, options)
  }

  removeTaskInfo() {
    this.removeExtension(EXTENSION_PROVIDER.TASK_INFO)
  }

  getUnbalancedMapInfo() {
    return this._extensionMap[EXTENSION_PROVIDER.UNBALANCED_MAP]
  }

  addUnbalancedMapInfo(unbalancedMapData: ExtensionData, options: any = {}) {
    this.addExtension(EXTENSION_PROVIDER.UNBALANCED_MAP, unbalancedMapData, options)
  }

  removeUnbalancedMapInfo() {
    this.removeExtension(EXTENSION_PROVIDER.UNBALANCED_MAP)
  }

  remove() {
    super.remove()
    this.parent(null)
  }
}
