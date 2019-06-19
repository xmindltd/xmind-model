import { COMPONENT_TYPE } from '../common/constants'
import BaseComponent from './base-component'
import { StyleData } from './style'

export type NoteSpanData = TextSpanData | ImageSpanData | HyperlinkSpanData

export interface TextSpanData {
  style: StyleData
  text: string ///"<STRING>",
  class: string///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this span
}

export interface ImageSpanData {
  style: StyleData
  class: string///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this image
  image: string///"xap:resources/<HASH>.jpg"
}

export interface HyperlinkSpanData {
  style: StyleData,
  class: string, ///"<STRING> <STRING> <STRING> ",  // classes (i.e. style families) of this hyperlink
  href: string, ///"<URL>",
  spans: [
    NoteSpanData,
    //
  ]
}

export interface NotesData {
  plain: {
    content: string ///"<STRING>"
  }
  html: {
    content: {
      paragraphs: [
        {
          style: StyleData
          spans: [
            NoteSpanData
          ]
        },
      ]
    }
  }
}

export default class Notes extends BaseComponent<NotesData> {
  componentType = COMPONENT_TYPE.NOTE
}