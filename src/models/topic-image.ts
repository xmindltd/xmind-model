import { COMPONENT_TYPE } from '../common/constants'
import BaseComponent from './base-component'
import { Size } from '../common/utils'
import Topic from './topic'

export interface ImageData extends Size {
  src: string ///"xap:resources/<HASH>.png",
  align: string /// "<STRING>"
}

export default class TopicImage extends BaseComponent<ImageData> {
  componentType = COMPONENT_TYPE.IMAGE

  public getSrc(): string {
    return this.get('src')
  }

  public getWidth(): number {
    return this.get('width')
  }

  public getHeight(): number {
    return this.get('height')
  }

  public getAlign(): string {
    return this.get('align')
  }

  public resize(newSize: Size) {
    const oldWidth = this.getWidth()
    const oldHeight = this.getHeight()

    this._resize(newSize)

    this.getUndo().add({
      undo: () => this._resize({ width: oldWidth, height: oldHeight }),
      redo: () => this._resize(newSize)
    })

    return this
  }

  private _resize(newSize: Size) {
    this.set('width', newSize.width)
    this.set('height', newSize.height)
  }

  public align(newAlign: string) {
    const oldAlign = this.getAlign()

    this._align(newAlign)

    this.getUndo().add({
      undo: () => this._align(oldAlign),
      redo: () => this._align(newAlign)
    })

    return this
  }

  private _align(newAlign: string) {
    this.set('align', newAlign)
  }

  public removeSelf() {
    const topic = this.parent() as Topic
    this.parent(null)
    topic.removeImage()
  }
}