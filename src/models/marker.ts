import { MODEL_TYPE } from '../common/constants'
import BaseComponent from './base-component'

export interface MarkerData {
  markerId: string
}

export default class Marker extends BaseComponent<MarkerData> {
  componentType = MODEL_TYPE.MARKER
}