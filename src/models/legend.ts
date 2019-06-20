import { COMPONENT_TYPE } from '../common/constants'
import BaseComponent from './base-component'
import { Point } from '../common/utils'
import Sheet from './sheet'
import { MarkerData } from './marker'

const DATA_KEY_VISIBILITY = 'visibility'
const DATA_KEY_POSITION = 'position'
const DATA_KEY_USER_MARKERS = 'markers'

export interface LegendData {
  visibility: "hidden" | "visible"
  position: Point
  markers: {
    [id: string]: {
      name: string ///"<STRING>",
      resource?: string ///"xap:resources/<HASH>.png"
    }
  }
  groups: {
    [id: string]: {
      name: string ///"<STRING>",
      markers: Array<string>
    }
  }
}

export default class Legend extends BaseComponent<LegendData> {

  componentType = COMPONENT_TYPE.LEGEND

  modelEvents = {
    legendAddMarker: 'legendAddMarker',
    legendRemoveMarker: 'legendRemoveMarker',
    legendMarkerDescChanged: 'legendMarkerDescChanged'
  }

  private _liveMarkerMap = {}

  init(sheet: Sheet) {
    super.init(sheet)
    this._initEventsListener()
  }

  getLiveMarkerMap () {
    return Object.assign({}, this._liveMarkerMap)
  }

  _initEventsListener() {
    const parentSheetModel = this.ownerSheet()
    const sheetModelEvents = parentSheetModel.modelEvents
    parentSheetModel.on(sheetModelEvents.topicAddMarker, this._onTopicAddMarker.bind(this))
    // todo
    parentSheetModel.on(sheetModelEvents.topicChangeMarker, this._onTopicChangeMarker.bind(this))
    parentSheetModel.on(sheetModelEvents.topicRemoveMarker, this._onTopicRemoveMarker.bind(this))
  }

  _onTopicAddMarker(markerData: MarkerData) {
    const liveMarkerMap = this._liveMarkerMap
    const markerId = markerData.markerId

    // if the added marker is not in the liveMarkerList
    // it's a new marker
    if (!liveMarkerMap[markerId]) {
      liveMarkerMap[markerId] = 1
      this.emit(this.modelEvents.legendAddMarker, markerId)
    } else {
      liveMarkerMap[markerId]++
    }
  }

  _onTopicChangeMarker(markerData: MarkerData) {

  }

  _onTopicRemoveMarker(markerData: MarkerData) {
    const liveMarkerMap = this._liveMarkerMap
    const markerId = markerData.markerId

    // Marker - 1
    if (!(--liveMarkerMap[markerId])) {
      delete liveMarkerMap[markerId];
      this.emit(this.modelEvents.legendRemoveMarker, markerId);
    }
  }

  isVisible(): boolean {
    return this._data.commit("get", DATA_KEY_VISIBILITY) === 'visible'
  }

  setVisible(isVisible: boolean) {
    this._data.commit("set", DATA_KEY_VISIBILITY, isVisible ? 'visible' : 'hidden')

    this.getUndo().add({
      undo: () => this.setLegendDisplay(!isVisible),
      redo: () => this.setLegendDisplay(isVisible)
    })
  }

  setLegendDisplay(isVisible: boolean) {
    return this.setVisible(isVisible)
  }

  getPosition(): Point {
    return this._data.commit("get", DATA_KEY_POSITION)
  }

  setPosition(position: Point) {
    const oldPosition = this._data.commit("get", DATA_KEY_POSITION)

    if (!position) {
      this._data.commit("delete", DATA_KEY_POSITION)
    } else {
      this._data.commit("set", DATA_KEY_POSITION, position)
    }

    this.getUndo().add({
      undo: () => this.setLegendPosition(oldPosition),
      redo: () => this.setLegendPosition(position)
    })
  }

  setLegendPosition(position: Point) {
    return this.setPosition(position)
  }

  getUserMarkerDescription() {
    return JSON.parse(JSON.stringify(this._data.commit("get", DATA_KEY_USER_MARKERS)))
  }

  setUserMarkerDescription(markerId: string, userDescription: string) {
    const userMarkerDescriptionMap = JSON.parse(JSON.stringify(this._data.commit("get", DATA_KEY_USER_MARKERS) || {}))
    const oldUserDescription = (userMarkerDescriptionMap[markerId] || {}).name

    if (!userDescription) {
      delete userMarkerDescriptionMap[markerId]
    } else {
      userMarkerDescriptionMap[markerId] = { name: userDescription }
    }

    this._data.commit("set", DATA_KEY_USER_MARKERS, userMarkerDescriptionMap)
    this.emit(this.modelEvents.legendMarkerDescChanged)

    this.getUndo().add({
      undo: () => this.setUserMarkerDescription(markerId, oldUserDescription),
      redo: () => this.setUserMarkerDescription(markerId, userDescription)
    })
  }
}
